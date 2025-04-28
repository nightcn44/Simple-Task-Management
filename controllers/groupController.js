const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = await Group.create({
      name,
      members,
      createdBy: req.user.userId,
    });

    res.status(201).json(group);

  } catch (err) {
    res.status(500).json({ message: 'สร้างกลุ่มไม่สำเร็จ', error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.userId,
    }).populate('members', 'username email');

    res.json(groups);

  } catch (err) {
    res.status(500).json({ message: 'โหลดกลุ่มไม่สำเร็จ', error: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'ไม่พบกลุ่ม' });

    if (group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขกลุ่มนี้' });
    }

    if (name) group.name = name;
    if (members) group.members = members;

    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'อัปเดตกลุ่มไม่สำเร็จ', error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'ไม่พบกลุ่ม' });

    if (group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบกลุ่มนี้' });
    }

    await group.remove();
    res.json({ message: 'ลบกลุ่มสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'ลบกลุ่มไม่สำเร็จ', error: err.message });
  }
};