const express = require("express");

const db = require("../database/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();


// GET ALL TASKS
router.get("/", authenticateToken, (req, res) => {

    const tasks = db.prepare(`
        SELECT *
        FROM tasks
        WHERE user_id = ?
        ORDER BY id DESC
    `).all(req.user.id);

    res.json(tasks);
});


// CREATE TASK
router.post("/", authenticateToken, (req, res) => {

    const {
        title,
        description,
        status,
        due_date
    } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const result = db.prepare(`
        INSERT INTO tasks
        (user_id, title, description, status, due_date)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        req.user.id,
        title,
        description || "",
        status || "Pending",
        due_date || ""
    );

    res.status(201).json({
        message: "Task created successfully",
        id: result.lastInsertRowid
    });
});


// UPDATE TASK
router.put("/:id", authenticateToken, (req, res) => {

    const {
        title,
        description,
        status,
        due_date
    } = req.body;

    const result = db.prepare(`
        UPDATE tasks
        SET title = ?,
            description = ?,
            status = ?,
            due_date = ?
        WHERE id = ?
        AND user_id = ?
    `).run(
        title,
        description,
        status,
        due_date,
        req.params.id,
        req.user.id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json({
        message: "Task updated successfully"
    });
});


// DELETE TASK
router.delete("/:id", authenticateToken, (req, res) => {

    const result = db.prepare(`
        DELETE FROM tasks
        WHERE id = ?
        AND user_id = ?
    `).run(
        req.params.id,
        req.user.id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json({
        message: "Task deleted successfully"
    });
});


module.exports = router;
