const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/', verifyToken, sendMessage);             // Send message
router.get('/:room', verifyToken, getMessages);         // Get all messages in a room

module.exports = router;
