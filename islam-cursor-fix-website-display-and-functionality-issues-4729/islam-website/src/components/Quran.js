import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Toast, ToastContainer, Spinner, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaStop, FaVolumeUp, FaExclamationTriangle, FaCheckCircle, FaBook, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { quranSurahs } from '../data/quranData';

const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [showReading, setShowReading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [currentVerse, setCurrentVerse] = useState(0);

  const audioRef = useRef(null);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSurahClick = (surah) => {
    // Check if another audio is playing
    if (currentAudio && isPlaying && currentAudio !== surah.audio) {
      showError('Another recitation is currently playing. Please stop it first before starting a new one.');
      return;
    }

    setSelectedSurah(surah);
    setShowReading(true);
    setLoading(true);
    setCurrentVerse(0);
    showNotification(`Opening ${surah.name} for reading and listening`, 'success');
  };

  const closeReading = () => {
    if (isPlaying) {
      stopAudio();
    }
    setShowReading(false);
    setSelectedSurah(null);
    setCurrentVerse(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        showNotification('Recitation paused', 'info');
      } else {
        setLoading(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setLoading(false);
          showNotification('Playing beautiful recitation...', 'success');
        }).catch((error) => {
          setLoading(false);
          handleAudioError(error);
        });
      }
    } catch (error) {
      setLoading(false);
      handleAudioError(error);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentVerse(0);
      showNotification('Recitation stopped', 'info');
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Update current verse based on audio progress
      if (selectedSurah && selectedSurah.text) {
        const progress = audioRef.current.currentTime / audioRef.current.duration;
        const verseIndex = Math.floor(progress * selectedSurah.text.length);
        setCurrentVerse(Math.min(verseIndex, selectedSurah.text.length - 1));
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setLoading(false);
    }
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleAudioError = (error) => {
    console.error('Audio error:', error);
    setLoading(false);
    setIsPlaying(false);
    showError('Failed to load audio. Please check your internet connection and try again.');
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const filteredSurahs = quranSurahs.filter(surah =>
    surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.arabic.includes(searchQuery) ||
    surah.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToVerse = (verseNumber) => {
    const verseElement = document.getElementById(`verse-${verseNumber}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (currentVerse > 0 && selectedSurah) {
      scrollToVerse(currentVerse + 1);
    }
  }, [currentVerse, selectedSurah]);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-3">
                <FaBook className="me-3" />
                القرآن الكريم
              </h1>
              <p className="text-center text-muted mb-4">
                The Holy Quran - Complete with Arabic text, translations, and audio recitations
              </p>
            </motion.div>
          </Col>
        </Row>

        {!showReading ? (
          <>
            {/* Search Bar */}
            <Row className="mb-4">
              <Col lg={6} className="mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search Surahs by name, Arabic, or English..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                  </div>
                </motion.div>
              </Col>
            </Row>

            {/* Surahs List */}
            <AnimatePresence mode="wait">
              {filteredSurahs.length > 0 ? (
                <Row>
                  {filteredSurahs.map((surah, index) => (
                    <Col lg={4} md={6} key={surah.number} className="mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card 
                          className={`surah-card ${selectedSurah?.number === surah.number ? 'selected' : ''} h-100`}
                          onClick={() => handleSurahClick(surah)}
                        >
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="surah-number">
                                {surah.number}
                              </div>
                              {selectedSurah?.number === surah.number && (
                                <FaCheckCircle className="text-success" />
                              )}
                            </div>
                            <h5 className="surah-name">{surah.name}</h5>
                            <p className="surah-arabic">{surah.arabic}</p>
                            <p className="surah-english text-muted">{surah.english}</p>
                            <div className="surah-info">
                              <Badge bg="primary" className="me-2">
                                {surah.verses} verses
                              </Badge>
                              <Badge bg="secondary">
                                {surah.type}
                              </Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-5"
                >
                  <FaExclamationTriangle size={50} className="text-muted mb-3" />
                  <h4>No Surahs Found</h4>
                  <p className="text-muted">Try adjusting your search query</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            {/* Surah Reading View */}
            <Row>
              <Col>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4"
                >
                  <Button 
                    variant="outline-primary" 
                    onClick={closeReading}
                    className="mb-3"
                  >
                    <FaArrowLeft className="me-2" />
                    Back to Surahs List
                  </Button>
                  
                  <div className="surah-header">
                    <h1 className="surah-title">
                      {selectedSurah?.name} - {selectedSurah?.arabic}
                    </h1>
                    <p className="surah-subtitle">
                      {selectedSurah?.english} • {selectedSurah?.verses} verses • {selectedSurah?.type}
                    </p>
                  </div>

                  {/* Display Controls */}
                  <div className="display-controls mb-3">
                    <Button
                      variant={showArabic ? "primary" : "outline-primary"}
                      size="sm"
                      className="me-2"
                      onClick={() => setShowArabic(!showArabic)}
                    >
                      {showArabic ? <FaEye /> : <FaEyeSlash />} Arabic
                    </Button>
                    <Button
                      variant={showTranslation ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setShowTranslation(!showTranslation)}
                    >
                      {showTranslation ? <FaEye /> : <FaEyeSlash />} Translation
                    </Button>
                  </div>
                </motion.div>
              </Col>
            </Row>

            {/* Surah Text */}
            <Row className="mb-5">
              <Col>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="surah-text-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h4>
                        <FaBook className="me-2" />
                        Surah Text
                      </h4>
                      {selectedSurah?.text && (
                        <small className="text-muted">
                          {selectedSurah.text.length} verses
                        </small>
                      )}
                    </Card.Header>
                    <Card.Body className="surah-reading-content">
                      {selectedSurah?.text ? (
                        selectedSurah.text.map((verse, index) => (
                          <motion.div
                            key={verse.verse}
                            id={`verse-${verse.verse}`}
                            className={`verse-container ${currentVerse === index ? 'current-verse' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="verse-number">{verse.verse}</div>
                            {showArabic && (
                              <div className="verse-arabic">{verse.arabic}</div>
                            )}
                            {showTranslation && (
                              <div className="verse-translation">{verse.translation}</div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted">
                            Full text for this Surah is being prepared. 
                            You can still listen to the beautiful recitation below.
                          </p>
                        </div>
                      )}
                      
                      {/* Note about verse count */}
                      {selectedSurah?.text && selectedSurah.text.length < selectedSurah.verses && (
                        <div className="text-center mt-4 p-3 bg-light rounded">
                          <small className="text-muted">
                            <strong>Note:</strong> Currently showing {selectedSurah.text.length} out of {selectedSurah.verses} verses. 
                            More verses are being added to provide complete surah text.
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </>
        )}

        {/* Audio Player - Only show when a Surah is selected for reading */}
        <AnimatePresence>
          {selectedSurah && showReading && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="audio-player-container"
            >
              <Card className="audio-player">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      <FaVolumeUp className="me-2" />
                      Audio Recitation
                    </h5>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="playing-indicator"
                      >
                        <small className="text-success">
                          Now playing beautiful recitation...
                        </small>
                      </motion.div>
                    )}
                  </div>

                  <div className="audio-controls">
                    <div className="control-buttons">
                      <Button
                        variant="primary"
                        size="lg"
                        className="control-btn me-3"
                        onClick={togglePlayPause}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : isPlaying ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline-danger"
                        className="control-btn"
                        onClick={stopAudio}
                      >
                        <FaStop />
                      </Button>
                    </div>

                    <div className="progress-container flex-grow-1 mx-3">
                      <div 
                        className="progress-bar" 
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: duration ? `${(currentTime / duration) * 100}%` : '0%' 
                          }}
                        />
                      </div>
                      <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={selectedSurah?.audio}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={handleAudioError}
                    preload="metadata"
                  />
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Modal */}
        <Modal show={showErrorModal} onHide={closeErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="danger">
              <FaExclamationTriangle className="me-2" />
              {errorMessage}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notifications */}
        <ToastContainer position="top-end" className="p-3">
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
      </Container>
    </div>
  );
};

export default Quran;