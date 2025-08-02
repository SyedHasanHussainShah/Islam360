import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quran from './components/Quran';
import Ibadyat from './components/Ibadyat';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import PrayerNotification from './components/PrayerNotification';
import Footer from './components/Footer';

// Import Islamic Tools components
import Dua from './components/IslamicTools/Dua';
import Tasbih from './components/IslamicTools/Tasbih';
import Qibla from './components/IslamicTools/Qibla';
import IslamicCalendar from './components/IslamicTools/IslamicCalendar';
import NamesOfAllah from './components/IslamicTools/NamesOfAllah';
import PrayerTimes from './components/IslamicTools/PrayerTimes';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: '',
      profilePicture: ''
    };
  });

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  return (
    <Router>
      <div className="App" data-theme={theme}>
        {/* Sidebar Toggle Button */}
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setShowSidebar(true)}
          title="Settings"
        >
          ⚙️
        </button>
        
        {/* Sidebar */}
        <Sidebar 
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <Navbar theme={theme} userProfile={userProfile} />
        <PrayerNotification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/ibadyat" element={<Ibadyat />} />
          <Route 
            path="/settings" 
            element={
              <Settings 
                theme={theme} 
                toggleTheme={toggleTheme}
                userProfile={userProfile}
                updateProfile={updateProfile}
              />
            } 
          />
          {/* Islamic Tools Routes */}
          <Route path="/dua" element={<Dua />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/calendar" element={<IslamicCalendar />} />
          <Route path="/names" element={<NamesOfAllah />} />
          <Route path="/times" element={<PrayerTimes />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
