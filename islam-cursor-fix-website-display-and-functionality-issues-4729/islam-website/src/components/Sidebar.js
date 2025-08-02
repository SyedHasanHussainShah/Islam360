import React, { useState, useEffect } from 'react';
import { Offcanvas, Card, Button, Form, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCog, FaSun, FaMoon, FaBell, FaVolumeUp, FaVolumeMute, 
  FaMapMarkerAlt, FaLanguage, FaClock, FaMosque, FaPalette,
  FaUserCog, FaDownload, FaSync
} from 'react-icons/fa';
import { setCurrentCity, getCurrentCity, getAvailableCities } from '../utils/prayerTimes';

const Sidebar = ({ show, onHide, theme, toggleTheme }) => {
  const [settings, setSettings] = useState({
    city: getCurrentCity(),
    soundEnabled: JSON.parse(localStorage.getItem('prayerSoundEnabled') || 'true'),
    notificationEnabled: localStorage.getItem('notificationEnabled') !== 'false',
    language: localStorage.getItem('language') || 'en',
    prayerReminder: JSON.parse(localStorage.getItem('prayerReminder') || 'true'),
    reminderMinutes: parseInt(localStorage.getItem('reminderMinutes') || '5'),
    autoRefresh: JSON.parse(localStorage.getItem('autoRefresh') || 'true')
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const cities = getAvailableCities();

  const showNotification = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(value));
    
    // Apply changes immediately
    switch (key) {
      case 'city':
        setCurrentCity(value);
        showNotification(`City changed to ${cities[value]?.name || value}`);
        // Refresh page to update prayer times
        setTimeout(() => window.location.reload(), 1000);
        break;
      case 'soundEnabled':
        showNotification(`Prayer sounds ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'notificationEnabled':
        localStorage.setItem('notificationEnabled', value.toString());
        showNotification(`Notifications ${value ? 'enabled' : 'disabled'}`);
        break;
      case 'reminderMinutes':
        localStorage.setItem('reminderMinutes', value.toString());
        showNotification(`Prayer reminder set to ${value} minutes before`);
        break;
      default:
        showNotification('Setting updated successfully');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
      localStorage.clear();
      showNotification('All app data cleared successfully!', 'warning');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const exportSettings = () => {
    const settingsData = {
      ...settings,
      theme,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'islam-app-settings.json';
    link.click();
    
    showNotification('Settings exported successfully!');
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide}
      placement="start"
      className="settings-sidebar"
      style={{ width: '350px' }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="d-flex align-items-center">
          <FaCog className="me-2 text-primary" />
          Settings & Preferences
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="p-0">
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3"
            >
              <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="settings-sections">
          {/* Theme Settings */}
          <div className="setting-section p-3 border-bottom">
            <h6 className="mb-3 d-flex align-items-center">
              <FaPalette className="me-2 text-primary" />
              Appearance
            </h6>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span>Dark Mode</span>
              <div className="toggle-switch" onClick={toggleTheme}>
                <div className={`toggle-slider ${theme === 'dark' ? 'active' : ''}`}>
                  {theme === 'dark' ? <FaMoon /> : <FaSun />}
                </div>
              </div>
            </div>
          </div>

          {/* Location Settings */}
          <div className="setting-section p-3 border-bottom">
            <h6 className="mb-3 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2 text-primary" />
              Location
            </h6>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Select
                value={settings.city}
                onChange={(e) => handleSettingChange('city', e.target.value)}
              >
                {Object.entries(cities).map(([key, city]) => (
                  <option key={key} value={key}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {/* Prayer Notifications */}
          <div className="setting-section p-3 border-bottom">
            <h6 className="mb-3 d-flex align-items-center">
              <FaBell className="me-2 text-primary" />
              Prayer Notifications
            </h6>
            
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span>Enable Notifications</span>
              <Form.Check
                type="switch"
                checked={settings.notificationEnabled}
                onChange={(e) => handleSettingChange('notificationEnabled', e.target.checked)}
              />
            </div>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <span>Prayer Sounds</span>
              <div className="d-flex align-items-center">
                {settings.soundEnabled ? <FaVolumeUp className="me-2" /> : <FaVolumeMute className="me-2" />}
                <Form.Check
                  type="switch"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Reminder (minutes before prayer)</Form.Label>
              <Form.Select
                value={settings.reminderMinutes}
                onChange={(e) => handleSettingChange('reminderMinutes', parseInt(e.target.value))}
              >
                <option value={0}>At prayer time</option>
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* App Settings */}
          <div className="setting-section p-3 border-bottom">
            <h6 className="mb-3 d-flex align-items-center">
              <FaUserCog className="me-2 text-primary" />
              App Settings
            </h6>
            
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span>Auto Refresh Prayer Times</span>
              <Form.Check
                type="switch"
                checked={settings.autoRefresh}
                onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
              />
            </div>

            <div className="d-grid gap-2">
              <Button variant="outline-primary" size="sm" onClick={exportSettings}>
                <FaDownload className="me-2" />
                Export Settings
              </Button>
              
              <Button variant="outline-warning" size="sm" onClick={clearAllData}>
                <FaSync className="me-2" />
                Reset All Data
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="setting-section p-3">
            <h6 className="mb-3 d-flex align-items-center">
              <FaMosque className="me-2 text-primary" />
              Quick Actions
            </h6>
            
            <div className="d-grid gap-2">
              <Button variant="outline-success" size="sm" onClick={() => window.location.href = '#/quran'}>
                📖 Open Quran
              </Button>
              
              <Button variant="outline-info" size="sm" onClick={() => window.location.href = '#/ibadyat'}>
                🕌 Prayer Guide
              </Button>
              
              <Button variant="outline-secondary" size="sm" onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(() => {
                    showNotification('Location access granted for accurate prayer times');
                  });
                }
              }}>
                📍 Update Location
              </Button>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;