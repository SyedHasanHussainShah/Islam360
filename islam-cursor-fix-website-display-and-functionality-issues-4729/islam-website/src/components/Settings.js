import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Offcanvas } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaUser, FaUpload, FaPalette, FaCog, FaBars, FaTimes, FaBell, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const Settings = ({ theme, toggleTheme, userProfile, updateProfile }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('prayerSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    return localStorage.getItem('notificationEnabled') !== 'false';
  });
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setAlertMessage('File size should be less than 5MB');
        setShowAlert(true);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setAlertMessage('Please select a valid image file');
        setShowAlert(true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile({
          ...userProfile,
          profilePicture: e.target.result
        });
        setAlertMessage('Profile picture updated successfully!');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    updateProfile({
      ...userProfile,
      profilePicture: null
    });
    localStorage.removeItem('profilePicture');
    setAlertMessage('Profile picture removed successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
      localStorage.clear();
      updateProfile({ profilePicture: null });
      setAlertMessage('All app data cleared successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('prayerSoundEnabled', JSON.stringify(newSoundEnabled));
    setAlertMessage(`Prayer sounds ${newSoundEnabled ? 'enabled' : 'disabled'}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const toggleNotifications = () => {
    const newNotificationEnabled = !notificationEnabled;
    setNotificationEnabled(newNotificationEnabled);
    localStorage.setItem('notificationEnabled', newNotificationEnabled.toString());
    setAlertMessage(`Notifications ${newNotificationEnabled ? 'enabled' : 'disabled'}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Settings Toggle Button */}
      <motion.button
        className="settings-toggle-btn"
        onClick={handleSidebarToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Settings"
      >
        <FaCog />
      </motion.button>

      {/* Settings Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)}
        placement="end"
        className="settings-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaCog className="me-2" />
            Settings
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AnimatePresence>
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>
                  {alertMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="setting-group">
              <h5 className="mb-3">
                <FaPalette className="me-2" />
                Theme Settings
              </h5>
              <div className="d-flex align-items-center justify-content-between">
                <span>Dark Mode</span>
                <div className="toggle-switch" onClick={toggleTheme}>
                  <div className={`toggle-slider ${theme === 'dark' ? 'active' : ''}`}>
                    {theme === 'dark' ? <FaMoon /> : <FaSun />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="setting-group">
              <h5 className="mb-3">
                <FaBell className="me-2" />
                Notifications
              </h5>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span>Prayer Notifications</span>
                <div className="toggle-switch" onClick={toggleNotifications}>
                  <div className={`toggle-slider ${notificationEnabled ? 'active' : ''}`}>
                    {notificationEnabled ? <FaBell /> : <FaTimes />}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Prayer Sounds</span>
                <div className="toggle-switch" onClick={toggleSound}>
                  <div className={`toggle-slider ${soundEnabled ? 'active' : ''}`}>
                    {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="setting-group">
              <h5 className="mb-3">
                <FaUser className="me-2" />
                Profile Settings
              </h5>
              
              <div className="profile-preview mb-3">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="profile-pic"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <FaUser />
                  </div>
                )}
              </div>

              <div className="d-flex flex-column gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaUpload className="me-2" />
                  Upload Picture
                </Button>
                
                {userProfile.profilePicture && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={removeProfilePicture}
                  >
                    Remove Picture
                  </Button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="setting-group">
              <h5 className="mb-3">Data Management</h5>
              <Button 
                variant="outline-warning" 
                size="sm"
                onClick={clearAllData}
              >
                Clear All Data
              </Button>
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="setting-group">
              <h5 className="mb-3">App Information</h5>
              <div className="app-info">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Developer:</strong> Islamic App Team</p>
                <p><strong>Features:</strong></p>
                <ul className="feature-list">
                  <li>Prayer Times & Notifications</li>
                  <li>Quran Reading & Audio</li>
                  <li>Islamic Tools & Resources</li>
                  <li>Worship Guidelines</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Settings;