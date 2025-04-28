const express = require('express');
const router = express.Router();
const { createGroup, getGroups, updateGroup, deleteGroup } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/gr', authMiddleware, createGroup);
router.get('/gr', authMiddleware, getGroups);
router.put('/gr:id', authMiddleware, updateGroup);
router.delete('/gr:id', authMiddleware, deleteGroup);

module.exports = router;