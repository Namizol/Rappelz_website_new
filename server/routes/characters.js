import express from 'express';
import { getConnection } from '../../src/lib/database.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('UserId', userId)
      .execute('sp_GetUserCharacters');
      
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, name, characterClass } = req.body;
    const pool = await getConnection();
    
    await pool.request()
      .input('UserId', userId)
      .input('Name', name)
      .input('Class', characterClass)
      .execute('sp_CreateCharacter');

    res.status(201).json({ message: 'Character created successfully' });
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;