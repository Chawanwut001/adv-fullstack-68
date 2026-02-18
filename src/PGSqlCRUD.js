require('dotenv').config();

const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const dbUrl = 'postgres://webadmin:TMMmoh76535@node84727-advcompro-2-68-web.proen.app.ruk-com.cloud:11741/Books'; // เปลี่ยนเป็น URL ของฐานข้อมูล PostgreSQL ของคุณ

const sequelize = new Sequelize(dbUrl);

const Book = sequelize.define('Book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// ✅ Sync DB
sequelize.sync()
    .then(() => console.log("Database synced"))
    .catch(err => console.error(err));

app.get("/", (req, res) => {
    res.send("Hello Books World!");
});

// GET ALL
app.get("/books", async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET BY ID
app.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).send("Book not found");
        res.json(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

// CREATE
app.post("/books", async (req, res) => {
    try {
        const { title, author } = req.body;

        if (!title || !author) {
            return res.status(400).json({
                message: "Title and Author are required"
            });
        }

        const book = await Book.create({ title, author });
        res.json(book);

    } catch (err) {
        res.status(500).json(err);
    }
});
// UPDATE
app.put("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).send("Book not found");

        await book.update(req.body);
        res.json(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).send("Book not found");

        await book.destroy();
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));