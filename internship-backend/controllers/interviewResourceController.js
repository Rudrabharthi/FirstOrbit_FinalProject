import { query } from '../config/db.js';

// Get all interview resources (any authenticated user)
export const getAllResources = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM interview_resources ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get interview resources error:', error);
    res.status(500).json({ message: 'Failed to get interview resources', error: error.message });
  }
};

// Add a new interview resource (admin only)
export const addResource = async (req, res) => {
  try {
    const { youtube_url, title, description } = req.body;

    if (!youtube_url || !title) {
      return res.status(400).json({ message: 'YouTube URL and title are required' });
    }

    const result = await query(
      'INSERT INTO interview_resources (youtube_url, title, description, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [youtube_url, title, description || '', req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add interview resource error:', error);
    res.status(500).json({ message: 'Failed to add interview resource', error: error.message });
  }
};

// Delete an interview resource (admin only)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM interview_resources WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Interview resource not found' });
    }

    res.json({ message: 'Interview resource deleted successfully' });
  } catch (error) {
    console.error('Delete interview resource error:', error);
    res.status(500).json({ message: 'Failed to delete interview resource', error: error.message });
  }
};
