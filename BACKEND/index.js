import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { PrismaClient } from "./generated/prisma/index.js"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import 'dotenv/config'
import bcrypt from "bcryptjs"
import crypto from "crypto"


const app = express()
const PORT = process.env["PORT"] || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

console.log("DB_URL", process.env["DATABASE_URL"])


const pool = new Pool({
    connectionString: process.env["DATABASE_URL"],
    ssl: {
        rejectUnauthorized: false  // Necesario para Render (certificado autofirmado)
    }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

app.listen(PORT, () => {
    console.log("Servidor iniciado")
})

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const safeUsers = users.map(u => {
            const { contrasena, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

app.post("/users", async (req, res) => {
    try {
        const { nombre, usuario, contrasena, rol, estado } = req.body;
        
        if (!nombre || !usuario || !contrasena) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const exists = await prisma.user.findUnique({
            where: { usuario: usuario.trim().toLowerCase() }
        });

        if (exists) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const newUser = await prisma.user.create({
            data: {
                nombre: nombre.trim(),
                usuario: usuario.trim().toLowerCase(),
                rol: rol || "Operario",
                estado: estado || "Activo",
                contrasena: bcrypt.hashSync(contrasena.trim(), 10)
            }
        });
        
        const { contrasena: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, usuario, contrasena, rol, estado } = req.body;

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID de usuario inválido. Asegúrese de que sea un número (la base de datos usa autoincremental)." });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (usuario) {
            const userWithSameName = await prisma.user.findUnique({
                where: { usuario: usuario.trim().toLowerCase() }
            });

            if (userWithSameName && userWithSameName.id !== userId) {
                return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
            }
        }

        const dataToUpdate = {
            nombre: nombre ? nombre.trim() : existingUser.nombre,
            usuario: usuario ? usuario.trim().toLowerCase() : existingUser.usuario,
            rol: rol || existingUser.rol,
            estado: estado || existingUser.estado,
        };

        if (contrasena && contrasena.trim() !== "") {
            dataToUpdate.contrasena = bcrypt.hashSync(contrasena.trim(), 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        const { contrasena: _, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        
        if (!usuario || !contrasena) {
            return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
        }

        const user = await prisma.user.findUnique({
            where: { usuario: usuario.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (user.estado !== "Activo") {
            return res.status(401).json({ error: "Usuario inactivo" });
        }

        const isValid = bcrypt.compareSync(contrasena, user.contrasena);
        if (!isValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const { contrasena: _, ...safeUser } = user;
        res.json({ success: true, user: safeUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error durante el inicio de sesión" });
    }
});


// ---------- RF-12: Consulta de Inventario con Filtros ----------
app.get("/productos", async (req, res) => {
    try {
        const { nombre, categoria } = req.query
        const productos = await prisma.producto.findMany({
            where: {
                ...(nombre ? { nombre: { contains: nombre, mode: "insensitive" } } : {}),
                ...(categoria ? { categoria } : {})
            },
            orderBy: { nombre: "asc" }
        })
        res.json(productos)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" })
    }
})

app.get("/productos/:id", async (req, res) => {
    try {
        const producto = await prisma.producto.findUnique({
            where: { id: Number(req.params.id) }
        })
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" })
        res.json(producto)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
})

// ---------- RF-10: Registro de Equipos y Materiales ----------
app.post("/productos", async (req, res) => {
    try {
        const { nombre, categoria, stock, stockMinimo, unidad } = req.body

        if (!nombre || !categoria || stock == null || stockMinimo == null || !unidad) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" })
        }
        if (Number(stock) < 0 || Number(stockMinimo) < 0) {
            return res.status(400).json({ error: "El stock y el stock mínimo deben ser positivos" })
        }

        const nuevoProducto = await prisma.producto.create({
            data: {
                nombre: nombre.trim(),
                categoria,
                stock: Number(stock),
                stockMinimo: Number(stockMinimo),
                unidad
            }
        })
        res.status(201).json(nuevoProducto)
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ error: `Ya existe un producto con el nombre "${req.body.nombre}"` })
        }
        res.status(500).json({ error: "Error al crear el producto" })
    }
})

// ---------- RF-11: Edición de Productos ----------
app.put("/productos/:id", async (req, res) => {
    try {
        const { nombre, categoria, stock, stockMinimo, unidad } = req.body

        const productoActualizado = await prisma.producto.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(nombre ? { nombre: nombre.trim() } : {}),
                ...(categoria ? { categoria } : {}),
                ...(stock != null ? { stock: Number(stock) } : {}),
                ...(stockMinimo != null ? { stockMinimo: Number(stockMinimo) } : {}),
                ...(unidad ? { unidad } : {})
            }
        })
        res.json(productoActualizado)
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        if (error.code === "P2002") {
            return res.status(409).json({ error: `Ya existe un producto con el nombre "${req.body.nombre}"` })
        }
        res.status(500).json({ error: "Error al actualizar el producto" })
    }
})

app.delete("/productos/:id", async (req, res) => {
    try {
        await prisma.producto.delete({ where: { id: Number(req.params.id) } })
        res.status(204).send()
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        res.status(500).json({ error: "Error al eliminar el producto" })
    }
})

// ---------- RF-14: Historial de Entradas ----------
app.get("/entradas", async (req, res) => {
    try {

        const entradas = await prisma.entradas.findMany({
            include: {
                producto: true
            },
            orderBy: {
                id: "desc"
            }
        })

        res.json(entradas)

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener las entradas"
        })

    }
})

// ---------- RF-15: Registrar Entrada ----------
app.post("/entradas", async (req, res) => {
    try {

        const {
            cantidad,
            proveedor,
            responsable,
            fecha,
            observacion,
            productoId
        } = req.body

        if (
            cantidad == null ||
            !proveedor ||
            !responsable ||
            !fecha ||
            productoId == null
        ) {
            return res.status(400).json({
                error: "Todos los campos obligatorios deben ser completados"
            })
        }

        const producto = await prisma.producto.findUnique({
            where: {
                id: Number(productoId)
            }
        })

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            })
        }

        const nuevaEntrada = await prisma.entradas.create({
            data: {
                cantidad: Number(cantidad),
                proveedor,
                responsable,
                fecha: new Date(fecha),
                observacion,
                productoId: Number(productoId)
            }
        })

        await prisma.producto.update({
            where: {
                id: Number(productoId)
            },
            data: {
                stock: producto.stock + Number(cantidad)
            }
        })

        res.status(201).json(nuevaEntrada)

    } catch (error) {

        res.status(500).json({
            error: "Error al registrar la entrada"
        })

    }
})

// ---------- RF-15: Historial de Salidas ----------
app.get("/salidas", async (req, res) => {
    try {
        const salidas = await prisma.salidas.findMany({
            include: {
                producto: true
            },
            orderBy: {
                id: "desc"
            }
        })

        res.json(salidas)
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener las salidas"
        })
    }
})

// ---------- RF-15: Registrar Salida ----------
app.post("/salidas", async (req, res) => {
    try {
        const {
            cantidad,
            motivo,
            responsable,
            fecha,
            observacion,
            productoId
        } = req.body

        if (
            cantidad == null ||
            !motivo ||
            !responsable ||
            !fecha ||
            productoId == null
        ) {
            return res.status(400).json({
                error: "Todos los campos obligatorios deben ser completados"
            })
        }

        const cantidadSalida = Number(cantidad)

        if (Number.isNaN(cantidadSalida) || cantidadSalida <= 0) {
            return res.status(400).json({
                error: "La cantidad debe ser mayor a 0"
            })
        }

        const producto = await prisma.producto.findUnique({
            where: {
                id: Number(productoId)
            }
        })

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            })
        }

        if (cantidadSalida > producto.stock) {
            return res.status(400).json({
                error: "Stock insuficiente para realizar la salida"
            })
        }

        const nuevaSalida = await prisma.salidas.create({
            data: {
                cantidad: cantidadSalida,
                motivo,
                responsable,
                fecha: new Date(fecha),
                observacion,
                productoId: Number(productoId)
            }
        })

        await prisma.producto.update({
            where: {
                id: Number(productoId)
            },
            data: {
                stock: producto.stock - cantidadSalida
            }
        })

        res.status(201).json(nuevaSalida)
    } catch (error) {
        res.status(500).json({
            error: "Error al registrar la salida"
        })
    }
})
