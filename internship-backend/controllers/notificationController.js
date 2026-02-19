import { query } from '../config/db.js';

// Get notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to get notifications', error: error.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );
    
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count', error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read', error: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};
