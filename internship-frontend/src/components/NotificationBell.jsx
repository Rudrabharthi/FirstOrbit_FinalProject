import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import notificationService from '../services/notificationService';

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  // Auto-close dropdown after 3 seconds ONLY if not hovering
  useEffect(() => {
    if (isOpen && !isHovering) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [isOpen, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Start auto-close timer when mouse leaves
    autoCloseTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
