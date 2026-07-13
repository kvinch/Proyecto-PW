import express from "express"
import bodyParser from "body-parser"
import { PrismaClient } from "./generated/prisma/index.js"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import 'dotenv/config'

const app = express()
const PORT = process.env["PORT"] | 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

console.log("DB_URL", process.env["DATABASE_URL"])


const pool = new Pool({
    connectionString: process.env["DATABASE_URL"]
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

app.listen(PORT, () => {
    console.log("Servidor iniciado")
})
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