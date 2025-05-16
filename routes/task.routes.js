const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.Controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/tk", authMiddleware, taskController.createTask);
router.get("/tk", authMiddleware, taskController.getTasks);
router.get("/tk/:id", authMiddleware, taskController.getTaskById);
router.put("/tk/:id", authMiddleware, taskController.updateTask);
router.delete("/tk/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
