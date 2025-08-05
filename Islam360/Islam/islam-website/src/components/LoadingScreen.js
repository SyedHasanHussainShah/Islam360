// LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { FaMosque, FaQuran } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // 100 * 40ms = 4 seconds

    const timeout = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="loading-container">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="mosque-icon">
        <FaMosque className="mosque-icon-inner" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }} className="app-title">
        Islam<span className="highlight">360</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.8, duration: 0.6 }} className="quran-verse">
        "And We have certainly made the Quran easy for remembrance, so is there any who will remember?"
        <br /><span className="verse-ref">(Surah Al-Qamar 54:17)</span>
      </motion.p>
      <div className="progress-bar-container">
        <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "linear" }} />
      </div>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="quran-icon">
        <FaQuran />
      </motion.div>
      <p className="loading-text">Loading your spiritual journey...</p>
    </div>
  );
};

export default LoadingScreen;
