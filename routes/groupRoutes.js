const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/gr', authMiddleware, groupController.createGroup);
router.get('/gr', authMiddleware, groupController.getGroups);
router.put('/gr:id', authMiddleware, groupController.updateGroup);
router.delete('/gr:id', authMiddleware, groupController.deleteGroup);

module.exports = router;