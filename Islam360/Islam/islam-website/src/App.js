import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Quran from './components/Quran';
import Ibadyat from './components/Ibadyat';
import Settings from './components/Settings';
import PrayerNotification from './components/PrayerNotification';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';

// Islamic Tools
import Dua from './components/IslamicTools/Dua';
import Tasbih from './components/IslamicTools/Tasbih';
import Qibla from './components/IslamicTools/Qibla';
import IslamicCalendar from './components/IslamicTools/IslamicCalendar';
import NamesOfAllah from './components/IslamicTools/NamesOfAllah';

function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: '',
      profilePicture: ''
    };
  });

  const [isLoading, setIsLoading] = useState(true);

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  return (
    <Router>
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Settings userProfile={userProfile} updateProfile={updateProfile} />
          <div className="App">
            <Navbar userProfile={userProfile} />
            <PrayerNotification />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<Quran />} />
              <Route path="/ibadyat" element={<Ibadyat />} />
              <Route path="/dua" element={<Dua />} />
              <Route path="/tasbih" element={<Tasbih />} />
              <Route path="/qibla" element={<Qibla />} />
              <Route path="/calendar" element={<IslamicCalendar />} />
              <Route path="/names" element={<NamesOfAllah />} />
            </Routes>
            <Footer />
          </div>
        </motion.div>
      )}
    </Router>
  );
}

export default App;
