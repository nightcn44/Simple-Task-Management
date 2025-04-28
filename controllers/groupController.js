const Group = require('../models/group');
const User = require('../models/user');

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
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.userId,
    }).populate('members', 'username email');

    res.json(groups);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this group' });
    }

    if (name) group.name = name;
    if (members) group.members = members;

    await group.save();
    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this group' });
    }

    await group.remove();
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};