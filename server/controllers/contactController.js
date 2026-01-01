const ContactMessage = require('../models/ContactMessage');

// Public: create new message
const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      company,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: contactMessage
    });
  } catch (error) {
    console.error('Contact message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// Admin: list messages
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch contact messages' });
  }
};

// Admin: update status/notes
const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (status) message.status = status;
    if (typeof notes === 'string') message.notes = notes;

    await message.save();

    return res.json({ success: true, data: message, message: 'Message updated successfully' });
  } catch (error) {
    console.error('Update contact message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update message' });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactMessage
};

