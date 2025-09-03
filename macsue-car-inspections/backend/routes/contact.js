const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

// Submit contact message
router.post('/', validateContact, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      messageId: result.insertId
    });

  } catch (error) {
    console.error('Contact message error:', error);
    res.status(500).json({
      error: 'Internal server error while sending message'
    });
  }
});

// Get all contact messages (admin only)
router.get('/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM contact_messages';
    let params = [];

    if (status && ['new', 'read', 'replied'].includes(status)) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [messages] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
    let countParams = [];

    if (status && ['new', 'read', 'replied'].includes(status)) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      messages,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Fetch contact messages error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get specific contact message (admin only)
router.get('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Mark as read if it was new
    if (messages[0].status === 'new') {
      await pool.execute(
        'UPDATE contact_messages SET status = "read" WHERE id = ?',
        [id]
      );
      messages[0].status = 'read';
    }

    res.json({
      success: true,
      message: messages[0]
    });

  } catch (error) {
    console.error('Fetch contact message error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update contact message status (admin only)
router.patch('/messages/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const [result] = await pool.execute(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message status updated successfully'
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Delete contact message (admin only)
router.delete('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;