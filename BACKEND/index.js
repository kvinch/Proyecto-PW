import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { PrismaClient } from "./generated/prisma/index.js"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import 'dotenv/config'
import bcrypt from "bcryptjs"


const app = express()
const PORT = process.env["PORT"] || 5000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

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

        const cantidadEntrada = Number(cantidad)

        if (Number.isNaN(cantidadEntrada) || cantidadEntrada <= 0) {
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

        const nuevaEntrada = await prisma.$transaction(async (tx) => {
            const entrada = await tx.entradas.create({
                data: {
                    cantidad: cantidadEntrada,
                    proveedor,
                    responsable,
                    fecha: new Date(fecha),
                    observacion,
                    productoId: Number(productoId)
                }
            })

            await tx.producto.update({
                where: {
                    id: Number(productoId)
                },
                data: {
                    stock: {
                        increment: cantidadEntrada
                    }
                }
            })

            return entrada
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

        const nuevaSalida = await prisma.$transaction(async (tx) => {
            const salida = await tx.salidas.create({
                data: {
                    cantidad: cantidadSalida,
                    motivo,
                    responsable,
                    fecha: new Date(fecha),
                    observacion,
                    productoId: Number(productoId)
                }
            })

            const stockActualizado = await tx.producto.updateMany({
                where: {
                    id: Number(productoId),
                    stock: {
                        gte: cantidadSalida
                    }
                },
                data: {
                    stock: {
                        decrement: cantidadSalida
                    }
                }
            })

            if (stockActualizado.count === 0) {
                throw new Error("STOCK_INSUFICIENTE")
            }

            return salida
        })

        res.status(201).json(nuevaSalida)
    } catch (error) {
        if (error.message === "STOCK_INSUFICIENTE") {
            return res.status(400).json({
                error: "Stock insuficiente para realizar la salida"
            })
        }

        res.status(500).json({
            error: "Error al registrar la salida"
        })
    }
})

function normalizarMovimiento(movimiento, tipo) {
    return {
        id: movimiento.id,
        tipo,
        cantidad: movimiento.cantidad,
        responsable: movimiento.responsable,
        fecha: movimiento.fecha,
        observacion: movimiento.observacion,
        productoId: movimiento.productoId,
        producto: movimiento.producto,
        detalle: tipo === "Entrada" ? movimiento.proveedor : movimiento.motivo
    }
}

function ordenarMovimientos(movimientos) {
    return movimientos.sort((a, b) => {
        const diferenciaFecha = new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        if (diferenciaFecha !== 0) return diferenciaFecha
        return Number(b.id) - Number(a.id)
    })
}

function leerFecha(valor, finDelDia = false) {
    if (!valor) return null
    if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return undefined

    const fecha = new Date(`${valor}T${finDelDia ? "23:59:59.999" : "00:00:00.000"}Z`)
    return Number.isNaN(fecha.getTime()) ? undefined : fecha
}

function construirFiltrosReporte(query) {
    const desde = leerFecha(query.desde)
    const hasta = leerFecha(query.hasta, true)

    if (desde === undefined || hasta === undefined) {
        return { error: "Las fechas deben tener el formato YYYY-MM-DD" }
    }
    if (desde && hasta && desde > hasta) {
        return { error: "La fecha inicial no puede ser posterior a la fecha final" }
    }

    let productoId
    if (query.productoId) {
        productoId = Number(query.productoId)
        if (!Number.isInteger(productoId) || productoId <= 0) {
            return { error: "El producto indicado no es valido" }
        }
    }

    const tipo = String(query.tipo || "todos").toLowerCase()
    if (!["todos", "entrada", "salida"].includes(tipo)) {
        return { error: "El tipo debe ser entrada, salida o todos" }
    }

    return {
        tipo,
        where: {
            ...(productoId ? { productoId } : {}),
            ...((desde || hasta) ? {
                fecha: {
                    ...(desde ? { gte: desde } : {}),
                    ...(hasta ? { lte: hasta } : {})
                }
            } : {})
        }
    }
}

// ---------- Dashboard ----------
app.get("/dashboard/resumen", async (req, res) => {
    try {
        const [productos, entradasResumen, salidasResumen, entradasRecientes, salidasRecientes] = await Promise.all([
            prisma.producto.findMany({ orderBy: { nombre: "asc" } }),
            prisma.entradas.aggregate({ _count: { id: true }, _sum: { cantidad: true } }),
            prisma.salidas.aggregate({ _count: { id: true }, _sum: { cantidad: true } }),
            prisma.entradas.findMany({
                include: { producto: true },
                orderBy: [{ fecha: "desc" }, { id: "desc" }],
                take: 8
            }),
            prisma.salidas.findMany({
                include: { producto: true },
                orderBy: [{ fecha: "desc" }, { id: "desc" }],
                take: 8
            })
        ])

        const productosCriticos = productos.filter((producto) => producto.stock <= producto.stockMinimo)
        const movimientosRecientes = ordenarMovimientos([
            ...entradasRecientes.map((entrada) => normalizarMovimiento(entrada, "Entrada")),
            ...salidasRecientes.map((salida) => normalizarMovimiento(salida, "Salida"))
        ]).slice(0, 8)

        res.json({
            totales: {
                productos: productos.length,
                stock: productos.reduce((total, producto) => total + producto.stock, 0),
                entradas: entradasResumen._count.id,
                salidas: salidasResumen._count.id,
                unidadesEntrada: entradasResumen._sum.cantidad || 0,
                unidadesSalida: salidasResumen._sum.cantidad || 0,
                criticos: productosCriticos.length
            },
            productos,
            productosCriticos,
            movimientosRecientes
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener el resumen del dashboard" })
    }
})

// ---------- Reportes ----------
app.get("/reportes/movimientos", async (req, res) => {
    const filtros = construirFiltrosReporte(req.query)
    if (filtros.error) return res.status(400).json({ error: filtros.error })

    try {
        const consultas = []

        if (filtros.tipo !== "salida") {
            consultas.push(
                prisma.entradas.findMany({
                    where: filtros.where,
                    include: { producto: true },
                    orderBy: [{ fecha: "desc" }, { id: "desc" }]
                }).then((entradas) => entradas.map((entrada) => normalizarMovimiento(entrada, "Entrada")))
            )
        }

        if (filtros.tipo !== "entrada") {
            consultas.push(
                prisma.salidas.findMany({
                    where: filtros.where,
                    include: { producto: true },
                    orderBy: [{ fecha: "desc" }, { id: "desc" }]
                }).then((salidas) => salidas.map((salida) => normalizarMovimiento(salida, "Salida")))
            )
        }

        const resultados = await Promise.all(consultas)
        const movimientos = ordenarMovimientos(resultados.flat())
        const totalEntradas = movimientos
            .filter((movimiento) => movimiento.tipo === "Entrada")
            .reduce((total, movimiento) => total + movimiento.cantidad, 0)
        const totalSalidas = movimientos
            .filter((movimiento) => movimiento.tipo === "Salida")
            .reduce((total, movimiento) => total + movimiento.cantidad, 0)

        res.json({
            movimientos,
            resumen: {
                movimientos: movimientos.length,
                unidadesEntrada: totalEntradas,
                unidadesSalida: totalSalidas,
                balance: totalEntradas - totalSalidas
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al generar el reporte de movimientos" })
    }
})

app.get("/reportes/stock-critico", async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({ orderBy: { stock: "asc" } })
        res.json(productos.filter((producto) => producto.stock <= producto.stockMinimo))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener el reporte de stock critico" })
    }
})

app.get("/reportes/categorias", async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({ orderBy: { categoria: "asc" } })
        const categorias = new Map()

        productos.forEach((producto) => {
            const actual = categorias.get(producto.categoria) || {
                categoria: producto.categoria,
                productos: 0,
                stock: 0,
                criticos: 0
            }
            actual.productos += 1
            actual.stock += producto.stock
            if (producto.stock <= producto.stockMinimo) actual.criticos += 1
            categorias.set(producto.categoria, actual)
        })

        res.json(Array.from(categorias.values()))
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener el reporte por categorias" })
    }
})

app.get("/reportes/producto/:id", async (req, res) => {
    const productoId = Number(req.params.id)
    if (!Number.isInteger(productoId) || productoId <= 0) {
        return res.status(400).json({ error: "El producto indicado no es valido" })
    }

    try {
        const producto = await prisma.producto.findUnique({
            where: { id: productoId },
            include: {
                entradas: { orderBy: [{ fecha: "desc" }, { id: "desc" }] },
                salidas: { orderBy: [{ fecha: "desc" }, { id: "desc" }] }
            }
        })

        if (!producto) return res.status(404).json({ error: "Producto no encontrado" })

        const movimientos = ordenarMovimientos([
            ...producto.entradas.map((entrada) => normalizarMovimiento({ ...entrada, producto: null }, "Entrada")),
            ...producto.salidas.map((salida) => normalizarMovimiento({ ...salida, producto: null }, "Salida"))
        ])

        const { entradas, salidas, ...datosProducto } = producto
        res.json({ producto: datosProducto, movimientos })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener el reporte del producto" })
    }
})
