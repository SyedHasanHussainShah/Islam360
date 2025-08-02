import React, { useState, useEffect, useRef } from 'react';
import { Toast, ToastContainer, Button, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaVolumeUp, FaVolumeMute, FaClock, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer, getNextPrayerNotification, getCurrentCity } from '../utils/prayerTimes';

const PrayerNotification = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [currentCity, setCurrentCity] = useState(getCurrentCity());
  const [lastNotificationTime, setLastNotificationTime] = useState({});
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const times = await getPrayerTimes(new Date(), currentCity);
        setPrayerTimes(times);
        setCurrentPrayerInfo(getCurrentPrayer(times));
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();

    // Check for prayer notifications every minute
    intervalRef.current = setInterval(() => {
      if (prayerTimes) {
        const prayerInfo = getCurrentPrayer(prayerTimes);
        setCurrentPrayerInfo(prayerInfo);
        
        // Check for next prayer notification
        const notification = getNextPrayerNotification(prayerTimes);
        if (notification.shouldNotify && notificationEnabled) {
          const prayerName = notification.prayerName;
          const currentTime = Date.now();
          
          // Prevent duplicate notifications for the same prayer
          if (!lastNotificationTime[prayerName] || 
              currentTime - lastNotificationTime[prayerName] > 300000) { // 5 minutes
            showPrayerNotification(prayerName);
            setLastNotificationTime(prev => ({
              ...prev,
              [prayerName]: currentTime
            }));
          }
        }
      }
    }, 60000); // Check every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prayerTimes, notificationEnabled, lastNotificationTime, currentCity]);

  const showPrayerNotification = (prayerName) => {
    const id = Date.now();
    const notification = {
      id,
      type: 'prayer',
      title: `${prayerName} Prayer Time`,
      message: `It's time for ${prayerName} prayer. May Allah accept your worship.`,
      prayerName,
      timestamp: new Date(),
      show: true
    };

    setNotifications(prev => [...prev, notification]);

    // Play alarm sound if not muted
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    }

    // Auto-hide notification after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const toggleNotifications = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      {/* Audio element for prayer alarm */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>

      {/* Prayer Notification Settings Button */}
      <div className="prayer-notification-settings">
        <Button
          variant="outline-primary"
          size="sm"
          className="notification-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <FaBell className="me-2" />
          Prayer Alerts
        </Button>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="notification-settings-panel"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0">
                  <FaClock className="me-2" />
                  Prayer Notification Settings
                </h6>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <FaTimes />
                </Button>
              </div>

              <div className="setting-item mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span>Enable Notifications</span>
                  <div
                    className={`toggle-switch ${notificationEnabled ? 'active' : ''}`}
                    onClick={toggleNotifications}
                  >
                    <div className={`toggle-slider ${notificationEnabled ? 'active' : ''}`}></div>
                  </div>
                </div>
              </div>

              <div className="setting-item mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <span>Sound Alerts</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </Button>
                </div>
              </div>

              {currentPrayerInfo && (
                <div className="current-prayer-info mt-3 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <FaClock className="me-2" />
                    Current Prayer Status
                  </h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Current:</strong> {currentPrayerInfo.current?.name || 'None'}
                    </div>
                    <div>
                      <strong>Next:</strong> {currentPrayerInfo.next?.name}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge bg="info">
                      {Math.floor(currentPrayerInfo.timeRemaining / 60)}h {currentPrayerInfo.timeRemaining % 60}m until {currentPrayerInfo.next?.name}
                    </Badge>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prayer Notifications */}
      <ToastContainer position="top-end" className="prayer-toast-container">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
            >
              <Toast
                show={notification.show}
                onClose={() => dismissNotification(notification.id)}
                className="prayer-notification-toast"
                delay={10000}
                autohide
              >
                <Toast.Header className="prayer-toast-header">
                  <div className="prayer-icon me-2">
                    {notification.type === 'prayer' ? <FaBell /> : <FaExclamationTriangle />}
                  </div>
                  <strong className="me-auto prayer-title">
                    {notification.title}
                  </strong>
                  <Badge bg="primary" className="prayer-time-badge">
                    {formatTime(notification.timestamp)}
                  </Badge>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <FaTimes />
                  </Button>
                </Toast.Header>
                <Toast.Body className="prayer-toast-body">
                  <div className="prayer-message">
                    {notification.message}
                  </div>
                  <div className="prayer-blessing mt-2">
                    <small className="text-muted">
                      "اللَّهُمَّ بَارِكْ لَنَا فِيهِ"
                      <br />
                      "O Allah, bless us in it"
                    </small>
                  </div>
                </Toast.Body>
              </Toast>
            </motion.div>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </>
  );
};

export default PrayerNotification;