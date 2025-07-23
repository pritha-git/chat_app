const Message = require('../models/message');

exports.sendMessage = async (req, res) => {
  try {
    const { content, room } = req.body;
    const sender = req.user.id; // from JWT middleware

    const message = await Message.create({ sender, content, room });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Message sending failed' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const room = req.params.room;
    const messages = await Message.find({ room }).populate('sender', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch messages' });
  }
};
