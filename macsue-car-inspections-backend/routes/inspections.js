const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateInspection } = require('../middleware/validation');

const router = express.Router();

// Get all inspections for current user
router.get('/my-inspections', authenticateToken, async (req, res) => {
  try {
    const [inspections] = await pool.execute(
      `SELECT id, car_make, car_model, car_year, car_type, inspection_type, 
       appointment_date, appointment_time, notes, status, created_at, updated_at
       FROM inspections 
       WHERE user_id = ? 
       ORDER BY appointment_date DESC, appointment_time DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      inspections
    });

  } catch (error) {
    console.error('Fetch inspections error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get all inspections (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [inspections] = await pool.execute(
      `SELECT i.id, i.car_make, i.car_model, i.car_year, i.car_type, 
       i.inspection_type, i.appointment_date, i.appointment_time, 
       i.notes, i.status, i.created_at, i.updated_at,
       u.username, u.full_name, u.email, u.phone
       FROM inspections i
       JOIN users u ON i.user_id = u.id
       ORDER BY i.appointment_date DESC, i.appointment_time DESC`
    );

    res.json({
      success: true,
      inspections
    });

  } catch (error) {
    console.error('Fetch all inspections error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Book new inspection
router.post('/book', authenticateToken, validateInspection, async (req, res) => {
  try {
    const {
      carMake,
      carModel,
      carYear,
      carType,
      inspectionType,
      appointmentDate,
      appointmentTime,
      notes
    } = req.body;

    // Check for scheduling conflicts
    const [conflicts] = await pool.execute(
      'SELECT id FROM inspections WHERE appointment_date = ? AND appointment_time = ? AND status NOT IN ("cancelled", "completed")',
      [appointmentDate, appointmentTime]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({
        error: 'This time slot is already booked. Please choose a different time.'
      });
    }

    // Insert new inspection
    const [result] = await pool.execute(
      `INSERT INTO inspections 
       (user_id, car_make, car_model, car_year, car_type, inspection_type, 
        appointment_date, appointment_time, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, carMake, carModel, carYear, carType, inspectionType, 
       appointmentDate, appointmentTime, notes || null]
    );

    // Get the created inspection
    const [newInspection] = await pool.execute(
      'SELECT * FROM inspections WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Inspection booked successfully',
      inspection: newInspection[0]
    });

  } catch (error) {
    console.error('Book inspection error:', error);
    res.status(500).json({
      error: 'Internal server error during booking'
    });
  }
});

// Update inspection status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'scheduled', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const [result] = await pool.execute(
      'UPDATE inspections SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Inspection not found'
      });
    }

    res.json({
      success: true,
      message: 'Inspection status updated successfully'
    });

  } catch (error) {
    console.error('Update inspection status error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Cancel inspection (user can cancel their own)
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if inspection belongs to user or user is admin
    const [inspections] = await pool.execute(
      'SELECT user_id, status FROM inspections WHERE id = ?',
      [id]
    );

    if (inspections.length === 0) {
      return res.status(404).json({
        error: 'Inspection not found'
      });
    }

    const inspection = inspections[0];
    
    if (inspection.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({
        error: 'You can only cancel your own inspections'
      });
    }

    if (inspection.status === 'completed') {
      return res.status(400).json({
        error: 'Cannot cancel completed inspections'
      });
    }

    const [result] = await pool.execute(
      'UPDATE inspections SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Inspection cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel inspection error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get inspection details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [inspections] = await pool.execute(
      `SELECT i.*, u.username, u.full_name, u.email, u.phone
       FROM inspections i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = ?`,
      [id]
    );

    if (inspections.length === 0) {
      return res.status(404).json({
        error: 'Inspection not found'
      });
    }

    const inspection = inspections[0];

    // Check if user can access this inspection
    if (inspection.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      inspection
    });

  } catch (error) {
    console.error('Get inspection error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;