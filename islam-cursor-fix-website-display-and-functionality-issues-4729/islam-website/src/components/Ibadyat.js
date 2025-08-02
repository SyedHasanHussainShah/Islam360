import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Alert, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPray, FaKaaba, FaStar, FaMoon, FaClock, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { getPrayerTimes, getCurrentPrayer, getCurrentCity } from '../utils/prayerTimes';

const Ibadyat = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentCity, setCurrentCity] = useState(getCurrentCity());

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const times = await getPrayerTimes(new Date(), currentCity);
        setPrayerTimes(times);
        setCurrentPrayerInfo(getCurrentPrayer(times));
      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError('Failed to load prayer times. Please try again later.');
        // Set fallback prayer times for major cities
        const fallbackTimes = {
          Fajr: '05:30',
          Dhuhr: '12:15',
          Asr: '15:45',
          Maghrib: '18:30',
          Isha: '20:00',
          city: currentCity === 'lahore' ? 'Lahore' : 'Islamabad'
        };
        setPrayerTimes(fallbackTimes);
        setCurrentPrayerInfo(getCurrentPrayer(fallbackTimes));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrayerTimes();

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

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [currentCity]); // Remove prayerTimes dependency to prevent infinite loop

  // Use useMemo or create ibadyatData inside useEffect to ensure it updates when prayerTimes changes
  const getIbadyatData = () => {
    return {
      prayer: {
        title: "Prayer (Salah)",
        icon: FaPray,
        color: "#4a7c59",
        content: {
          description: "Prayer is the second pillar of Islam and the direct link between the worshipper and Allah. It is performed five times a day at specific times.",
          importance: [
            "Five daily prayers are obligatory for every Muslim",
            "Prayer purifies the soul and brings peace to the heart",
            "It is the key to success in this world and the hereafter",
            "Prayer strengthens our connection with Allah",
            "It serves as a reminder of our purpose in life"
          ],
          prayers: prayerTimes ? Object.entries(prayerTimes).filter(([key]) => key !== 'date') : [],
          tips: [
            "Perform Wudu (ablution) before prayer",
            "Face the Qibla (direction of Mecca)",
            "Pray with concentration and humility",
            "Read Quran and make Dua after prayer",
            "Try to pray in congregation when possible"
          ]
        }
      },
      hajj: {
        title: "Hajj",
        icon: FaKaaba,
        color: "#8b4513",
        content: {
          description: "Hajj is the fifth pillar of Islam and a once-in-a-lifetime obligation for those who are physically and financially able.",
          importance: [
            "Pilgrimage to the holy city of Mecca",
            "Performed during the month of Dhul-Hijjah",
            "Purifies the soul and forgives sins",
            "Brings together Muslims from all over the world",
            "Strengthens the bond of Islamic brotherhood"
          ],
          rituals: [
            "Ihram - Sacred state of purity",
            "Tawaf - Circumambulation of Kaaba",
            "Sa'i - Walking between Safa and Marwah",
            "Standing at Arafat",
            "Symbolic stoning of the devil",
            "Sacrifice of an animal",
            "Tawaf al-Ifadah"
          ],
          tips: [
            "Prepare spiritually and physically",
            "Learn about the rituals beforehand",
            "Pack appropriate clothing",
            "Stay hydrated and take care of health",
            "Make sincere supplications"
          ]
        }
      },
      umrah: {
        title: "Umrah",
        icon: FaStar,
        color: "#ff6b35",
        content: {
          description: "Umrah is a voluntary pilgrimage that can be performed at any time of the year, unlike Hajj which has specific dates.",
          importance: [
            "Voluntary pilgrimage to Mecca",
            "Can be performed throughout the year",
            "Purifies the soul and forgives sins",
            "Strengthens faith and devotion",
            "Provides spiritual rejuvenation"
          ],
          rituals: [
            "Ihram - Sacred state of purity",
            "Tawaf - Circumambulation of Kaaba",
            "Sa'i - Walking between Safa and Marwah",
            "Halq or Taqsir - Shaving or trimming hair"
          ],
          tips: [
            "Plan your trip during off-peak seasons",
            "Learn the rituals and duas",
            "Book accommodations in advance",
            "Stay hydrated and take care of health",
            "Make sincere supplications"
          ]
        }
      },
      fasting: {
        title: "Fasting (Sawm)",
        icon: FaMoon,
        color: "#2c3e50",
        content: {
          description: "Fasting during Ramadan is the fourth pillar of Islam. It teaches self-discipline, empathy, and gratitude.",
          importance: [
            "Obligatory during the month of Ramadan",
            "Teaches self-discipline and patience",
            "Develops empathy for the less fortunate",
            "Purifies the soul and body",
            "Strengthens willpower and faith"
          ],
          types: [
            "Ramadan fasting (obligatory)",
            "Voluntary fasting (recommended)",
            "Fasting on Mondays and Thursdays",
            "Fasting on the 13th, 14th, and 15th of each month",
            "Fasting on the Day of Arafat"
          ],
          tips: [
            "Eat a healthy Suhoor (pre-dawn meal)",
            "Break fast with dates and water",
            "Avoid overeating during Iftar",
            "Stay hydrated between fasts",
            "Increase in worship and good deeds"
          ]
        }
      }
    };
  };

  const openModal = (topic) => {
    setSelectedTopic(topic);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTopic(null);
  };

  const formatTime = (time) => {
    return time;
  };

  const getPrayerStatus = (prayerName, prayerTime) => {
    if (!currentPrayerInfo) return 'upcoming';
    
    if (currentPrayerInfo.current?.name === prayerName) {
      return 'current';
    } else if (currentPrayerInfo.next?.name === prayerName) {
      return 'next';
    }
    return 'upcoming';
  };

  const ibadyatData = getIbadyatData();

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading prayer times and Islamic content...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-3">
                <FaPray className="me-3" />
                العبادات
              </h1>
              <p className="text-center text-muted mb-4">
                Islamic Worship & Practices - Learn about the pillars of Islam and spiritual practices
              </p>
            </motion.div>
          </Col>
        </Row>

        {/* Prayer Times Section */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="prayer-times-card">
                <Card.Header className="text-center">
                  <h3>
                    <FaClock className="me-2" />
                    Prayer Times
                  </h3>
                  <p className="mb-0">
                    <FaMapMarkerAlt className="me-2" />
                    {currentCity === 'lahore' ? 'Lahore' : 'Islamabad'} Region
                  </p>
                </Card.Header>
                <Card.Body>
                  {error ? (
                    <Alert variant="warning">
                      <FaExclamationTriangle className="me-2" />
                      {error}
                    </Alert>
                  ) : (
                    <Row>
                      {prayerTimes && Object.entries(prayerTimes)
                        .filter(([key]) => key !== 'date')
                        .map(([prayerName, prayerTime], index) => {
                          const status = getPrayerStatus(prayerName, prayerTime);
                          return (
                            <Col md={4} lg={2} key={prayerName} className="mb-3">
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card className={`prayer-time-item ${status}`}>
                                  <Card.Body className="text-center">
                                    <div className="prayer-icon mb-2">
                                      {status === 'current' && (
                                        <motion.div
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                        >
                                          <FaClock className="text-primary" />
                                        </motion.div>
                                      )}
                                    </div>
                                    <h5 className="prayer-name">{prayerName}</h5>
                                    <h4 className="prayer-time">{formatTime(prayerTime)}</h4>
                                    <Badge 
                                      bg={status === 'current' ? 'primary' : status === 'next' ? 'success' : 'secondary'}
                                      className="mt-2"
                                    >
                                      {status === 'current' ? 'Current' : status === 'next' ? 'Next' : 'Upcoming'}
                                    </Badge>
                                  </Card.Body>
                                </Card>
                              </motion.div>
                            </Col>
                          );
                        })}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Ibadyat Grid */}
        <Row className="ibadyat-grid">
          {Object.entries(ibadyatData).map(([key, topic], index) => (
            <Col lg={6} key={key} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card 
                  className="ibadyat-card h-100"
                  onClick={() => openModal(topic)}
                >
                  <Card.Body className="text-center">
                    <div className="ibadyat-icon mb-3">
                      <topic.icon style={{ color: topic.color, fontSize: '3rem' }} />
                    </div>
                    <h4 className="ibadyat-title">{topic.title}</h4>
                    <p className="ibadyat-description">
                      {topic.content.description.substring(0, 100)}...
                    </p>
                    <Button variant="outline-primary" size="sm">
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Modal for Detailed Information */}
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedTopic?.icon && <selectedTopic.icon className="me-2" style={{ color: selectedTopic?.color }} />}
              {selectedTopic?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTopic && (
              <div className="ibadyat-content">
                <p className="mb-4">{selectedTopic.content.description}</p>
                
                {selectedTopic.content.prayers && (
                  <>
                    <h5>Today's Prayer Times:</h5>
                    <div className="prayer-times-list">
                      {selectedTopic.content.prayers.map(([prayerName, prayerTime], index) => (
                        <div key={index} className="prayer-time-item">
                          <div className="prayer-name">{prayerName}</div>
                          <div className="prayer-time">{prayerTime}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <h5>Importance:</h5>
                <ul className="importance-list mb-4">
                  {selectedTopic.content.importance.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                {selectedTopic.content.rituals && (
                  <>
                    <h5>Rituals:</h5>
                    <ul className="importance-list mb-4">
                      {selectedTopic.content.rituals.map((ritual, index) => (
                        <li key={index}>{ritual}</li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedTopic.content.types && (
                  <>
                    <h5>Types:</h5>
                    <ul className="importance-list mb-4">
                      {selectedTopic.content.types.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                  </>
                )}

                <h5>Tips:</h5>
                <ul className="tips-list">
                  {selectedTopic.content.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Ibadyat;