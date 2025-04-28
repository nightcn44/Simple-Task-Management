const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  const { title, description, assignedTo, status } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      status,
      createdBy: req.user.userId,
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถสร้างงานได้', error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.userId },
        { assignedTo: req.user.userId },
      ],
    }).populate('assignedTo', 'username email');

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถโหลดงานได้', error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'username email');
    if (!task) return res.status(404).json({ message: 'ไม่พบงาน' });

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'ไม่พบงาน' });

    if (task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขงานนี้' });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'แก้ไขงานไม่สำเร็จ', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'ไม่พบงาน' });

    if (task.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบงานนี้' });
    }

    await task.remove();

    res.json({ message: 'ลบงานสำเร็จ' });

  } catch (err) {
    res.status(500).json({ message: 'ลบงานไม่สำเร็จ', error: err.message });
  }
};