const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  getUserNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.route('/:id')
  .delete(deleteNotification);

router.put('/:id/read', markAsRead);
router.get('/user/:userId', getUserNotifications);

module.exports = router;
