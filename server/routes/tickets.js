import express from 'express';
import { getConnection } from '../../src/lib/database.js';

const router = express.Router();

// Create a new ticket
router.post('/', async (req, res) => {
  try {
    const { userId, subject, message, category } = req.body;

    if (!userId || !subject || !message || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['technical', 'account', 'billing', 'gameplay'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const pool = await getConnection();
    
    await pool.request()
      .input('userId', userId)
      .input('subject', subject)
      .input('message', message)
      .input('category', category)
      .query(`
        INSERT INTO SupportTickets (UserId, Subject, Message, Category, Status)
        VALUES (@userId, @subject, @message, @category, 'open')
      `);

    res.status(201).json({ message: 'Ticket created successfully' });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tickets (admin only)
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          t.Id,
          t.Subject,
          t.Message,
          t.Category,
          t.Status,
          t.AdminResponse,
          t.CreatedAt,
          t.UpdatedAt,
          u.Email as UserEmail
        FROM SupportTickets t
        INNER JOIN Users u ON t.UserId = u.Id
        ORDER BY 
          CASE t.Status 
            WHEN 'open' THEN 1 
            WHEN 'in_progress' THEN 2 
            WHEN 'closed' THEN 3 
          END,
          t.CreatedAt DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's tickets
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId !== req.user.Id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const pool = await getConnection();
    
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT 
          Id, 
          Subject, 
          Message, 
          Category, 
          Status, 
          AdminResponse,
          CreatedAt,
          UpdatedAt
        FROM SupportTickets
        WHERE UserId = @userId
        ORDER BY 
          CASE Status 
            WHEN 'open' THEN 1 
            WHEN 'in_progress' THEN 2 
            WHEN 'closed' THEN 3 
          END,
          CreatedAt DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update ticket status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!['in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!adminResponse?.trim()) {
      return res.status(400).json({ error: 'Admin response is required' });
    }

    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .input('status', status)
      .input('adminResponse', adminResponse)
      .query(`
        UPDATE SupportTickets 
        SET Status = @status, 
            AdminResponse = @adminResponse,
            UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ 
      message: 'Ticket updated successfully',
      ticket: result.recordset[0]
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;