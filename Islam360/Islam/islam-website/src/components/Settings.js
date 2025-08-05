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
      {/* Draggable Settings Toggle Button */}
      <motion.div
        className="draggable-settings-btn"
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: 10,
          left: 10,
          right: window.innerWidth - 70,
          bottom: window.innerHeight - 70,
        }}
        whileDrag={{ scale: 1.1, zIndex: 1000 }}
        initial={{ x: window.innerWidth - 80, y: 100 }}
        style={{
          position: 'fixed',
          zIndex: 999,
          cursor: 'grab'
        }}
      >
        <motion.button
          className="settings-toggle-btn"
          onClick={handleSidebarToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Settings - Drag to move"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: theme === 'dark' ? 
              'linear-gradient(135deg, #ffc14dff 0%, #764ba2 100%)' : 
              'linear-gradient(135deg, #199d4aff 0%, #67f557ff 100%)',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <FaCog />
        </motion.button>
      </motion.div>

      {/* Settings Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)}
        placement="end"
        className="settings-sidebar"
        style={{
          background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }}
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

         

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="setting-group mb-4">
              <h5 className="mb-3">
                <FaBell className="me-2" />
                Notifications
              </h5>
              <div className="p-3 rounded" 
                   style={{ 
                     background: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
                     border: `1px solid ${theme === 'dark' ? '#404040' : '#dee2e6'}`
                   }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Prayer Notifications</span>
                  <div 
                    className="toggle-switch" 
                    onClick={toggleNotifications}
                    style={{
                      width: '60px',
                      height: '30px',
                      backgroundColor: notificationEnabled ? '#4CAF50' : '#ccc',
                      borderRadius: '15px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      className="toggle-slider"
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: notificationEnabled ? '33px' : '3px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: notificationEnabled ? '#4CAF50' : '#999'
                      }}
                    >
                      {notificationEnabled ? <FaBell /> : <FaTimes />}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Prayer Sounds</span>
                  <div 
                    className="toggle-switch" 
                    onClick={toggleSound}
                    style={{
                      width: '60px',
                      height: '30px',
                      backgroundColor: soundEnabled ? '#4CAF50' : '#ccc',
                      borderRadius: '15px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div 
                      className="toggle-slider"
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: soundEnabled ? '33px' : '3px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: soundEnabled ? '#4CAF50' : '#999'
                      }}
                    >
                      {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                    </div>
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
            <div className="setting-group mb-4">
              <h5 className="mb-3">
                <FaUser className="me-2" />
                Profile Settings
              </h5>
              
              <div className="text-center mb-3">
                {userProfile.profilePicture ? (
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${theme === 'dark' ? '#404040' : '#dee2e6'}`
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: theme === 'dark' ? '#404040' : '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      color: theme === 'dark' ? '#888' : '#6c757d',
                      margin: '0 auto'
                    }}
                  >
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
            <div className="setting-group mb-4">
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
                <p><strong>Version:</strong> 20.8.0</p>
                <p><strong>Developer:</strong>Syed Hassan</p>
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