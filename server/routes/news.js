import express from 'express';
import { getConnection } from '../../src/lib/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute(`
      SELECT 
        n.id,
        n.title,
        n.content,
        n.publish_date as publishDate,
        u.email as authorEmail,
        n.category,
        n.image_url as image
      FROM news_articles n
      INNER JOIN users u ON n.author_id = u.id
      ORDER BY n.publish_date DESC
    `);
    
    const articles = rows.map(article => ({
      ...article,
      publishDate: new Date(article.publishDate).toISOString(),
    }));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `INSERT INTO news_articles (
        title,
        content,
        category,
        image_url,
        author_id,
        publish_date
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
      [title, content, category, imageUrl, req.user.id]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      content,
      category,
      imageUrl,
      publishDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ error: 'Failed to create news article' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, imageUrl } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await getConnection();
    
    const [result] = await pool.execute(
      `UPDATE news_articles 
       SET title = ?, content = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [title, content, category, imageUrl, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({
      id,
      title,
      content,
      category,
      imageUrl,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    
    const [result] = await pool.execute(
      'DELETE FROM news_articles WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

export default router;