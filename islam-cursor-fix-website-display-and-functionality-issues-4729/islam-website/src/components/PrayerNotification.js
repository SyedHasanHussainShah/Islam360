import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMosque, FaBell, FaVolumeUp, FaClock, FaStar, FaVolumeMute } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer } from '../utils/prayerTimes';

const PrayerNotification = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNotifiedPrayer, setLastNotifiedPrayer] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  useEffect(() => {
    // Initialize Audio Context for better sound support
    if (!audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
    }

    // Register service worker for better mobile notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
          
          // For mobile devices, also request persistent notification permission
          if (permission === 'granted' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              if ('showNotification' in registration) {
                console.log('Service Worker notifications supported');
              }
            });
          }
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }

    // Get sound preference from localStorage
    const savedSoundSetting = localStorage.getItem('prayerSoundEnabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting));
    }

    // Fetch prayer times
    const fetchPrayerTimes = async () => {
      try {
        const times = await getPrayerTimes();
        setPrayerTimes(times);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, [audioContext]);

  useEffect(() => {
    if (!prayerTimes) return;

    // Check for prayer times every 30 seconds for more accurate timing
    const interval = setInterval(() => {
      checkPrayerTime();
    }, 30000); // Check every 30 seconds

    // Initial check
    checkPrayerTime();

    return () => clearInterval(interval);
  }, [prayerTimes, lastNotifiedPrayer]);

  const checkPrayerTime = () => {
    if (!prayerTimes) return;

    const now = new Date();
    const reminderMinutes = parseInt(localStorage.getItem('reminderMinutes') || '0');
    
    Object.entries(prayerTimes).forEach(([prayerName, prayerTime]) => {
      if (prayerName === 'date') return;

      const prayerDateTime = parseTimeToDate(prayerTime);
      const timeDiff = prayerDateTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      const today = now.toDateString();

      // Check for exact prayer time (within 1 minute window for accuracy)
      if (Math.abs(minutesDiff) <= 0) {
        const notificationKey = `${prayerName}-${today}`;
        
        if (lastNotifiedPrayer !== notificationKey) {
          triggerPrayerNotification(prayerName, prayerTime);
          setLastNotifiedPrayer(notificationKey);
          localStorage.setItem('lastNotifiedPrayer', notificationKey);
        }
      }
      
      // Check for reminder notification (only if reminderMinutes > 0)
      else if (reminderMinutes > 0 && minutesDiff === reminderMinutes) {
        const reminderKey = `reminder-${prayerName}-${today}`;
        
        if (lastNotifiedPrayer !== reminderKey) {
          triggerUpcomingPrayerNotification(prayerName, prayerTime, reminderMinutes);
          // Don't update lastNotifiedPrayer for reminders, only for actual prayer times
        }
      }
    });
  };

  // This function is now integrated into checkPrayerTime

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const parseTimeToDate = (timeString) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(hours, minutes, 0, 0);
    return prayerTime;
  };

  const triggerPrayerNotification = (prayerName, prayerTime) => {
    // Play alarm sound
    if (soundEnabled && !isAlarmPlaying) {
      playPrayerAlarm();
    }

    // Show browser notification with enhanced mobile support
    if (notificationPermission === 'granted') {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const notificationOptions = {
        body: `It's time for ${prayerName} prayer. May Allah accept your prayers.`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `prayer-${prayerName}`,
        requireInteraction: true,
        silent: false,
        vibrate: [200, 100, 200, 100, 200], // Vibration pattern for mobile
        data: {
          prayerName: prayerName,
          prayerTime: prayerTime,
          timestamp: new Date().toISOString()
        }
      };

      // Add actions for supported browsers
      if ('serviceWorker' in navigator && 'actions' in Notification.prototype) {
        notificationOptions.actions = [
          {
            action: 'mark-prayed',
            title: '✅ Mark as Prayed',
            icon: '/favicon.ico'
          },
          {
            action: 'remind-later',
            title: '⏰ Remind in 5 min',
            icon: '/favicon.ico'
          },
          {
            action: 'dismiss',
            title: '❌ Dismiss'
          }
        ];
      }

      // For mobile devices, add additional properties
      if (isMobile) {
        notificationOptions.persistent = true;
        notificationOptions.sticky = true;
        notificationOptions.renotify = true;
      }

      const notification = new Notification(`🕌 Prayer Time: ${prayerName}`, notificationOptions);
      
      // Handle notification clicks
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // You can add navigation to prayer page here
        if (window.location.hash !== '#/ibadyat') {
          window.location.hash = '#/ibadyat';
        }
      };

      // Auto-close notification after 30 seconds if not interacted
      setTimeout(() => {
        if (notification) {
          notification.close();
        }
      }, 30000);
    }

    // Show in-app notification
    const notification = {
      id: Date.now(),
      type: 'prayer',
      title: `${prayerName} Prayer Time`,
      message: `It's time for ${prayerName} prayer. May Allah accept your prayers.`,
      prayerName: prayerName,
      prayerTime: prayerTime,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);
  };

  const triggerUpcomingPrayerNotification = (prayerName, prayerTime, minutes = 5) => {
    // Play reminder sound
    if (soundEnabled && !isAlarmPlaying) {
      playReminderSound();
    }

    // Show browser notification with mobile enhancements
    if (notificationPermission === 'granted') {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const notificationOptions = {
        body: `${prayerName} prayer will begin in ${minutes} minutes. Please prepare for prayer.`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `reminder-${prayerName}`,
        requireInteraction: false,
        silent: true, // Gentle reminder, not intrusive
        vibrate: [100, 50, 100], // Gentle vibration pattern
        data: {
          prayerName: prayerName,
          prayerTime: prayerTime,
          reminderMinutes: minutes,
          timestamp: new Date().toISOString()
        }
      };

      // For mobile devices, make it slightly more persistent
      if (isMobile) {
        notificationOptions.requireInteraction = true;
      }

      const notification = new Notification(`⏰ Upcoming: ${prayerName}`, notificationOptions);
      
      // Handle notification clicks
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notification.close();
      };

      // Auto-close reminder notification after 15 seconds
      setTimeout(() => {
        if (notification) {
          notification.close();
        }
      }, 15000);
    }

    // Show in-app notification
    const notification = {
      id: Date.now(),
      type: 'reminder',
      title: `Upcoming: ${prayerName} Prayer`,
      message: `${prayerName} prayer will begin in ${minutes} minutes. Please prepare for prayer.`,
      prayerName: prayerName,
      prayerTime: prayerTime,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);
  };

  const playPrayerAlarm = () => {
    if (!audioContext) return;

    setIsAlarmPlaying(true);
    
    // Create a more sophisticated alarm sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a prayer-like melody
    const frequencies = [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25]; // C major scale
    let currentNote = 0;
    
    oscillator.frequency.setValueAtTime(frequencies[0], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    
    oscillator.start();
    
    const playNote = () => {
      if (currentNote < frequencies.length) {
        oscillator.frequency.setValueAtTime(frequencies[currentNote], audioContext.currentTime);
        currentNote++;
        
        setTimeout(playNote, 800);
      } else {
        oscillator.stop();
        setIsAlarmPlaying(false);
      }
    };
    
    setTimeout(playNote, 800);
    
    // Stop alarm after 10 seconds
    setTimeout(() => {
      if (oscillator) {
        oscillator.stop();
        setIsAlarmPlaying(false);
      }
    }, 10000);
  };

  const playReminderSound = () => {
    if (!audioContext) return;

    setIsAlarmPlaying(true);
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
    
    setTimeout(() => setIsAlarmPlaying(false), 2000);
  };

  const playSimpleBeep = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const showNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('prayerSoundEnabled', JSON.stringify(newSoundEnabled));
    
    if (newSoundEnabled) {
      playSimpleBeep();
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          showNotification({
            id: Date.now(),
            type: 'success',
            title: 'Notifications Enabled',
            message: 'Prayer notifications are now enabled!'
          });
        }
      });
    }
  };

  return (
    <>
      {/* Prayer Notification Settings Button */}
      <div className="prayer-notification-settings">
        <motion.button
          className="notification-settings-btn"
          onClick={toggleSound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </motion.button>
        
        {notificationPermission !== 'granted' && (
          <motion.button
            className="notification-settings-btn"
            onClick={requestNotificationPermission}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Enable Browser Notifications"
          >
            <FaBell />
          </motion.button>
        )}
      </div>

      {/* Prayer Notifications Toast Container */}
      <div className="prayer-toast-container">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Toast 
                className={`prayer-notification-toast ${notification.type === 'prayer' ? 'prayer-toast' : 'reminder-toast'}`}
                onClose={() => removeNotification(notification.id)}
                show={true}
                delay={10000}
                autohide
              >
                <Toast.Header className="prayer-toast-header">
                  <div className="prayer-icon">
                    {notification.type === 'prayer' ? <FaMosque /> : <FaClock />}
                  </div>
                  <strong className="me-auto prayer-title">
                    {notification.title}
                  </strong>
                  <small className="prayer-time-badge">
                    {notification.prayerTime}
                  </small>
                </Toast.Header>
                <Toast.Body className="prayer-toast-body">
                  <div className="prayer-message">
                    {notification.message}
                  </div>
                  <div className="prayer-blessing">
                    {notification.type === 'prayer' 
                      ? "May Allah accept your prayers and grant you peace." 
                      : "Prepare your heart and mind for worship."}
                  </div>
                  <div className="prayer-animation">
                    <FaStar />
                  </div>
                </Toast.Body>
              </Toast>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PrayerNotification;