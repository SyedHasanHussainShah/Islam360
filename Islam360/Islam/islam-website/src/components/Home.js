import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Toast, ToastContainer } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaSearch, FaClock, FaPlay, FaHeart, FaDonate, FaMosque, FaDove, FaStar, FaExclamationTriangle, FaCalendarAlt, FaCompass, FaHands } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer, formatTimeRemaining, getCurrentCity } from '../utils/prayerTimes';
import { quranVerse, islamicVideos, searchableContent } from '../data/quranData';
import './verseMarquee.css';
import { Modal } from 'react-bootstrap';

const Home = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [islamicDate, setIslamicDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentCity, setCurrentCity] = useState(getCurrentCity());
  const [showAiModal, setShowAiModal] = useState(false);
  const todayIndex = new Date().getDate() % quranVerse.length;
  const verse = quranVerse[todayIndex];

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        const times = await getPrayerTimes(new Date(), currentCity);
        setPrayerTimes(times);
        setCurrentPrayerInfo(getCurrentPrayer(times));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setLoading(false);
        showNotification('Failed to fetch prayer times. Using fallback times.', 'warning');
      }
    };

    fetchPrayerData();

    // Update current prayer info and time every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        setCurrentPrayerInfo(getCurrentPrayer(prayerTimes));
      }
      setCurrentTime(new Date());
    }, 60000);

    // Update time every second for clock
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set Islamic date (simplified - you might want to use a proper Islamic calendar library)
    const islamicMonths = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    const currentDate = new Date();
    const islamicYear = 1445; // This should be calculated properly
    const islamicMonth = islamicMonths[currentDate.getMonth()];
    const islamicDay = currentDate.getDate();
    setIslamicDate(`${islamicDay} ${islamicMonth} ${islamicYear} AH`);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [currentCity]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchableContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.arabic?.includes(searchQuery) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setShowSearchResults(true);
      
      if (results.length === 0) {
        showNotification(`No results found for "${searchQuery}". Try searching for Surahs, Duas, or Islamic topics.`, 'warning');
      } else {
        showNotification(`Found ${results.length} results for "${searchQuery}"`, 'success');
      }
    }
  };

  const openVideo = (url) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      showNotification('Unable to open video. Please try again.', 'error');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleIconClick = (type) => {
    showNotification(`Opening ${type} feature...`, 'info');
    // Add navigation logic here
  };

  const createParticles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`
        }}
        animate={{
          y: [0, -1000],
          opacity: [0, 0.6, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ paddingTop: '1px' }}>
      {/* Animated Background Particles */}
      <div className="bg-particles">
        {createParticles()}
      </div>
     <section className="enhanced-moving-section relative w-full overflow-hidden bg-gradient-to-b from-[#eef2ff] to-[#c7d2fe] min-h-screen flex flex-col md:flex-row justify-between items-center p-4 md:p-8">

  {/* Mosque Background */}
  <div className="mosque-background absolute inset-0 z-0">
    <div className="mosque-image w-full h-full bg-no-repeat bg-center bg-cover"></div>
    <div className="floating-water absolute bottom-0 left-0 w-full h-[10vh] bg-blue-100 opacity-30"></div>
    <div className="water-reflection absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-blue-200 to-transparent opacity-50"></div>
  </div>

  {/* Left Side - Current and Next Prayer */}
  <div className="prayer-side z-10 w-full md:w-1/4 mb-8 md:mb-0 text-center md:text-left">
    {currentPrayerInfo && (
      <motion.div
        className="prayer-display bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h4 className="text-lg font-semibold flex justify-center md:justify-start items-center gap-2">
          <FaClock />
          Current Prayer
        </h4>
        <div className="prayer-name text-xl font-bold mt-2">
          {currentPrayerInfo.current?.name || 'None'}
        </div>

        <h5 className="mt-4 font-semibold">Next Prayer</h5>
        <div className="next-prayer text-sm">
          <span className="font-bold">{currentPrayerInfo.next.name}</span>
          <span className="ml-2 text-gray-600">
            in {formatTimeRemaining(currentPrayerInfo.timeRemaining)}
          </span>
        </div>
      </motion.div>
    )}
  </div>

  {/* Center - Welcome and Icons */}
  <div className="welcome-center z-10 w-full md:w-2/4 flex flex-col items-center justify-center text-center space-y-4">
    <motion.div
      className="moving-mosque text-5xl md:text-6xl text-indigo-700"
      animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaMosque />
    </motion.div>

 

    {/* Flying Birds */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="flying-bird absolute text-blue-500 text-lg md:text-xl"
        style={{
          left: `${15 + i * 20}%`,
          top: `${10 + (i % 3) * 15}%`
        }}
        animate={{
          x: [0, 100, 200, 100, 0],
          y: [0, -40, 20, -30, 0],
          rotate: [0, 15, -15, 10, 0]
        }}
        transition={{
          duration: 15 + i * 3,
          repeat: Infinity,
          delay: i * 2,
          ease: "easeInOut"
        }}
      >
        <FaDove />
      </motion.div>
    ))}

    {/* Floating Stars */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="floating-star absolute text-yellow-400"
        style={{
          left: `${10 + i * 10}%`,
          top: `${20 + (i % 4) * 10}%`
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.6,
          ease: "easeInOut"
        }}
      >
        <FaStar />
      </motion.div>
    ))}
  </div>

  {/* Right Side - Date & Time */}
  <div className="date-time-side z-10 w-full md:w-1/4 mt-8 md:mt-0 text-center md:text-right">
    <motion.div
      className="islamic-datetime bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="current-time flex items-center justify-center md:justify-end text-lg font-bold gap-2">
        <FaClock />
        <span>{formatTime(currentTime)}</span>
      </div>
      <div className="current-date mt-2 text-sm">
        <div className="gregorian-date text-white">{formatDate(currentTime)}</div>
        <div className="islamic-date flex items-center justify-center md:justify-end gap-1 text-white font-medium mt-1">
          <FaCalendarAlt />
          {islamicDate}
        </div>
      </div>
    </motion.div>
  </div>
</section>
      <Container className="-py-100 -mt-100">
        {/* Enhanced Search Bar */}
        <Row className="justify-content-center  mb-1">
          <Col lg={100}>
            <motion.div 
              className="search-container mt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for Islamic content"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
              </form>
              
              {/* Search Results */}
              {showSearchResults && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Search Results ({searchResults.length})</h5>
                    <Button variant="outline-secondary" size="sm" onClick={clearSearch}>
                      Clear
                    </Button>
                  </div>
                  {searchResults.length > 0 ? (
                    <Row>
                      {searchResults.slice(0, 6).map((result, index) => (
                        <Col md={6} lg={4} key={index} className="mb-3">
                          <Card className="search-result-card h-100">
                            <Card.Body>
                              <Card.Title className="h6">{result.title}</Card.Title>
                              <Card.Text className="small text-muted">
                                {result.content.substring(0, 100)}...
                              </Card.Text>
                              {result.arabic && (
                                <div className="arabic-text small">{result.arabic}</div>
                              )}
                              <div className="mt-2">
                                {result.tags?.map((tag, i) => (
                                  <span key={i} className="badge bg-primary me-1 mb-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-4">
                      <FaExclamationTriangle className="mb-2" size={30} />
                      <p>No results found. Try different keywords.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Quran Verse */}
        
        <Row className="mb-3">
  <Col>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
    >
      <div className="verse-card text-white">
        {/* Marquee animation */}
        <div className="verse-marquee">
          <span className="verse-arabic">
            {verse.arabic}
          </span>
        </div>
        <div className="verse-translation text-orange-600">"{verse.translation}"</div>
        <div className="verse-reference">- {verse.reference}</div>
      </div>
    </motion.div>
  </Col>
</Row>


        {/* Enhanced Islamic Videos */}
       <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <h2 className="text-center mb-4">Islamic Content</h2>
              <Row>
                {islamicVideos.map((video, index) => (
                  <Col md={4} key={video.id} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.2 }}
                      whileHover={{ y: -10 }}
                    >
                      <Card className="video-card h-100">
                        <div className="position-relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="video-thumbnail"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EVideo%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <motion.button
                            className="play-button"
                            onClick={() => openVideo(video.url)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaPlay />
                          </motion.button>
                        </div>
                        <Card.Body>
                          <Card.Title>{video.title}</Card.Title>
                          <Card.Text>{video.description}</Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{video.duration || '5:30'}</small>
                            <small className="text-muted">{video.views || '1.2K views'}</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Col>
        </Row>

        {/* Enhanced Support Section */}
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="support-section">
                <Container>
                  <Row className="justify-content-center">
                    <Col lg={8} className="text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <FaHeart className="mb-3" style={{ fontSize: '3rem' }} />
                      </motion.div>
                      <h2>Support Our Mission</h2>
                      <p className="mb-4">
                        <strong>"الصدقة تطفئ الخطيئة كما يطفئ الماء النار"</strong>
                        <br />
                        <em>"Charity extinguishes sin as water extinguishes fire"</em>
                        <br />
                        Help us spread Islamic knowledge and build a stronger Muslim community.
                        Your support enables us to provide free Islamic resources to Muslims worldwide.
                      </p>
                      <motion.button 
                        className="donation-btn" 
                        onClick={() => showNotification('Thank you for your interest! Donation feature coming soon.', 'info')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaDonate className="me-2" />
                        Support Us
                      </motion.button>
                    </Col>
                  </Row>
                </Container>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, top: '100px' }}>
        {notifications.map((notification) => (
          <Toast 
            key={notification.id} 
            show={true} 
            delay={5000} 
            autohide
            bg={notification.type === 'error' ? 'danger' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}
          >
            <Toast.Header closeButton={false}>
              <strong className="me-auto">
                {notification.type === 'error' ? 'Error' : 
                 notification.type === 'success' ? 'Success' : 
                 notification.type === 'warning' ? 'Warning' : 'Info'}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              {notification.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default Home;

