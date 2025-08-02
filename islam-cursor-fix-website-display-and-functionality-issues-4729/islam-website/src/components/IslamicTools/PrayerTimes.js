import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaBell, FaSun, FaMoon, FaGlobe } from 'react-icons/fa';
import { getPrayerTimes, getAvailableCities, getCurrentCity, setCurrentCity } from '../../utils/prayerTimes';

const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState(getCurrentCity());
  const [cities] = useState(getAvailableCities());

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const times = await getPrayerTimes(new Date(), selectedCity);
        setPrayerTimes(times);
        setError(null);
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        // Set fallback prayer times
        setPrayerTimes({
          Fajr: '05:30',
          Dhuhr: '12:15',
          Asr: '15:45',
          Maghrib: '18:30',
          Isha: '20:00',
          city: cities[selectedCity]?.name || 'Lahore'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedCity, cities]);

  useEffect(() => {
    if (prayerTimes) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const prayerTimesInMinutes = {
        Fajr: convertTimeToMinutes(prayerTimes.Fajr),
        Dhuhr: convertTimeToMinutes(prayerTimes.Dhuhr),
        Asr: convertTimeToMinutes(prayerTimes.Asr),
        Maghrib: convertTimeToMinutes(prayerTimes.Maghrib),
        Isha: convertTimeToMinutes(prayerTimes.Isha)
      };

      let nextPrayer = null;
      let minDiff = Infinity;

      Object.entries(prayerTimesInMinutes).forEach(([prayer, time]) => {
        const diff = time - currentTimeInMinutes;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          nextPrayer = prayer;
        }
      });

      setCurrentPrayer(nextPrayer);
    }
  }, [prayerTimes, currentTime]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentCity(city);
  };

  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeRemaining = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTimeRemaining = (prayerTime) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diffMs = prayerDate - now;
    return Math.floor(diffMs / (1000 * 60));
  };

  const getPrayerStatus = (prayerName, prayerTime) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (prayerDate < now) {
      return 'passed';
    } else if (prayerName === currentPrayer) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const formatTime = (time) => {
    return time;
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Container>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading prayer times...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-4">
                <FaClock className="me-3" />
                Prayer Times
              </h1>
              <p className="text-center mb-5">Accurate prayer times for your location</p>
            </motion.div>
          </Col>
        </Row>

        {/* City Selection */}
        <Row className="justify-content-center mb-4">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="city-selection-card">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaGlobe className="me-2 text-primary" />
                    <h6 className="mb-0">Select City</h6>
                  </div>
                  <Form.Select 
                    value={selectedCity} 
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="city-select"
                  >
                    {Object.entries(cities).map(([key, city]) => (
                      <option key={key} value={key}>
                        {city.name}
                      </option>
                    ))}
                  </Form.Select>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning">
                <FaBell className="me-2" />
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Prayer Times Grid */}
        <Row>
          {prayerTimes && Object.entries(prayerTimes).filter(([key]) => key !== 'date' && key !== 'city').map(([prayer, time], index) => (
            <Col lg={4} md={6} key={prayer} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className={`prayer-time-card h-100 ${
                    getPrayerStatus(prayer, time) === 'current' ? 'current-prayer' : 
                    getPrayerStatus(prayer, time) === 'passed' ? 'passed-prayer' : 'upcoming-prayer'
                  }`}
                >
                  <Card.Body className="text-center">
                    <div className="prayer-icon mb-3">
                      {prayer === 'Fajr' || prayer === 'Isha' ? <FaMoon /> : <FaSun />}
                    </div>
                    <h5 className="prayer-name">{prayer}</h5>
                    <div className="prayer-time">{formatTime(time)}</div>
                    {getPrayerStatus(prayer, time) === 'current' && (
                      <div className="current-indicator">
                        <span className="badge bg-success">Current</span>
                      </div>
                    )}
                    {getPrayerStatus(prayer, time) === 'upcoming' && (
                      <div className="time-remaining">
                        in {formatTimeRemaining(getTimeRemaining(time))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Current Prayer Info */}
        {currentPrayer && (
          <Row className="mt-4">
            <Col>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="current-prayer-info-card">
                  <Card.Body className="text-center">
                    <h4>Next Prayer: {currentPrayer}</h4>
                    <p className="mb-0">
                      <FaClock className="me-2" />
                      Time remaining: {formatTimeRemaining(getTimeRemaining(prayerTimes[currentPrayer]))}
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        )}

        {/* Location Info */}
        <Row className="mt-4">
          <Col>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Card className="location-info-card">
                <Card.Body className="text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <span>Prayer times for {prayerTimes?.city || 'Lahore'}</span>
                  </div>
                  <small className="text-muted">Times are calculated based on your selected city</small>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrayerTimes;