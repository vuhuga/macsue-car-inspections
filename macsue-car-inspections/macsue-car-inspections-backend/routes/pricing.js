const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all pricing information
router.get('/', async (req, res) => {
  try {
    const [prices] = await pool.execute(
      'SELECT car_type, inspection_type, price FROM pricing ORDER BY car_type, inspection_type'
    );

    res.json({
      success: true,
      prices
    });

  } catch (error) {
    console.error('Fetch pricing error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get price for specific car type and inspection type
router.get('/:carType/:inspectionType', async (req, res) => {
  try {
    const { carType, inspectionType } = req.params;

    const validCarTypes = ['sedan', 'suv', 'truck', 'other'];
    const validInspectionTypes = ['body', 'mechanical', 'full'];

    if (!validCarTypes.includes(carType) || !validInspectionTypes.includes(inspectionType)) {
      return res.status(400).json({
        error: 'Invalid car type or inspection type'
      });
    }

    const [prices] = await pool.execute(
      'SELECT price FROM pricing WHERE car_type = ? AND inspection_type = ?',
      [carType, inspectionType]
    );

    if (prices.length === 0) {
      return res.status(404).json({
        error: 'Price not found for the specified combination'
      });
    }

    res.json({
      success: true,
      carType,
      inspectionType,
      price: prices[0].price
    });

  } catch (error) {
    console.error('Fetch specific price error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update pricing (admin only)
router.put('/:carType/:inspectionType', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { carType, inspectionType } = req.params;
    const { price } = req.body;

    if (!price || isNaN(price) || price < 0) {
      return res.status(400).json({
        error: 'Valid price is required'
      });
    }

    const validCarTypes = ['sedan', 'suv', 'truck', 'other'];
    const validInspectionTypes = ['body', 'mechanical', 'full'];

    if (!validCarTypes.includes(carType) || !validInspectionTypes.includes(inspectionType)) {
      return res.status(400).json({
        error: 'Invalid car type or inspection type'
      });
    }

    const [result] = await pool.execute(
      'UPDATE pricing SET price = ?, updated_at = CURRENT_TIMESTAMP WHERE car_type = ? AND inspection_type = ?',
      [price, carType, inspectionType]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Price entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      carType,
      inspectionType,
      price: parseFloat(price)
    });

  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;