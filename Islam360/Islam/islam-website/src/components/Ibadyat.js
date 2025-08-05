import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Alert,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaPray,
  FaKaaba,
  FaStar,
  FaMoon,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  getPrayerTimes,
  getCurrentPrayer,
  getCurrentCity,
} from "../utils/prayerTimes";

const Ibadyat = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentCity, setCurrentCity] = useState("lahore"); // Default to Lahore

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);
        const times = await getPrayerTimes(new Date(), currentCity);
        setPrayerTimes(times);
        setCurrentPrayerInfo(getCurrentPrayer(times));
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Failed to load prayer times. Using default times.");

        // Default prayer times for major cities
        const defaultTimes = {
          lahore: {
            Fajr: "03:49",
            Dhuhr: "12:09",
            Asr: "15:49",
            Maghrib: "18:58",
            Isha: "20:29",
          },
          islamabad: {
            Fajr: "03:48",
            Dhuhr: "12:10",
            Asr: "15:51",
            Maghrib: "19:00",
            Isha: "20:32",
          },
          gujranwala: {
            Fajr: "03:46",
            Dhuhr: "12:10",
            Asr: "17:00",
            Maghrib: "19:02",
            Isha: "20:34",
          },
        };

        setPrayerTimes(defaultTimes[currentCity]);
        setCurrentPrayerInfo(getCurrentPrayer(defaultTimes[currentCity]));
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
  }, [currentCity]);

  const getIbadyatData = () => {
    return {
      prayer: {
        title: "Prayer (Salah)",
        icon: FaPray,
        color: "#4a7c59",
        content: {
          description:
            "Prayer is the second pillar of Islam and the direct link between the worshipper and Allah. It is performed five times a day at specific times.",
          importance: [
            "Five daily prayers are obligatory for every Muslim",
            "Prayer purifies the soul and brings peace to the heart",
            "It is the key to success in this world and the hereafter",
            "Prayer strengthens our connection with Allah",
            "It serves as a reminder of our purpose in life",
          ],
          prayers: prayerTimes
            ? Object.entries(prayerTimes).filter(([key]) => key !== "date")
            : [],
          tips: [
            "Perform Wudu (ablution) before prayer",
            "Face the Qibla (direction of Mecca)",
            "Pray with concentration and humility",
            "Read Quran and make Dua after prayer",
            "Try to pray in congregation when possible",
          ],
        },
      },
      hajj: {
        title: "Hajj",
        icon: FaKaaba,
        color: "#8b4513",
        content: {
          description:
            "Hajj is the fifth pillar of Islam and a once-in-a-lifetime obligation for those who are physically and financially able.",
          importance: [
            "Pilgrimage to the holy city of Mecca",
            "Performed during the month of Dhul-Hijjah",
            "Purifies the soul and forgives sins",
            "Brings together Muslims from all over the world",
            "Strengthens the bond of Islamic brotherhood",
          ],
          rituals: [
            "Ihram - Sacred state of purity",
            "Tawaf - Circumambulation of Kaaba",
            "Sa'i - Walking between Safa and Marwah",
            "Standing at Arafat",
            "Symbolic stoning of the devil",
            "Sacrifice of an animal",
            "Tawaf al-Ifadah",
          ],
          tips: [
            "Prepare spiritually and physically",
            "Learn about the rituals beforehand",
            "Pack appropriate clothing",
            "Stay hydrated and take care of health",
            "Make sincere supplications",
          ],
        },
      },
      umrah: {
        title: "Umrah",
        icon: FaStar,
        color: "#ff6b35",
        content: {
          description:
            "Umrah is a voluntary pilgrimage that can be performed at any time of the year, unlike Hajj which has specific dates.",
          importance: [
            "Voluntary pilgrimage to Mecca",
            "Can be performed throughout the year",
            "Purifies the soul and forgives sins",
            "Strengthens faith and devotion",
            "Provides spiritual rejuvenation",
          ],
          rituals: [
            "Ihram - Sacred state of purity",
            "Tawaf - Circumambulation of Kaaba",
            "Sa'i - Walking between Safa and Marwah",
            "Halq or Taqsir - Shaving or trimming hair",
          ],
          tips: [
            "Plan your trip during off-peak seasons",
            "Learn the rituals and duas",
            "Book accommodations in advance",
            "Stay hydrated and take care of health",
            "Make sincere supplications",
          ],
        },
      },
      fasting: {
        title: "Fasting (Sawm)",
        icon: FaMoon,
        color: "#2c3e50",
        content: {
          description:
            "Fasting during Ramadan is the fourth pillar of Islam. It teaches self-discipline, empathy, and gratitude.",
          importance: [
            "Obligatory during the month of Ramadan",
            "Teaches self-discipline and patience",
            "Develops empathy for the less fortunate",
            "Purifies the soul and body",
            "Strengthens willpower and faith",
          ],
          types: [
            "Ramadan fasting (obligatory)",
            "Voluntary fasting (recommended)",
            "Fasting on Mondays and Thursdays",
            "Fasting on the 13th, 14th, and 15th of each month",
            "Fasting on the Day of Arafat",
          ],
          tips: [
            "Eat a healthy Suhoor (pre-dawn meal)",
            "Break fast with dates and water",
            "Avoid overeating during Iftar",
            "Stay hydrated between fasts",
            "Increase in worship and good deeds",
          ],
        },
      },
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
    if (!currentPrayerInfo || !currentTime || !prayerTime) return "upcoming";

    const now = new Date(currentTime);
    const prayerDate = new Date(now); // clone current date

    // Assuming prayerTime is a string like "05:30"
    const [hours, minutes] = prayerTime.split(":").map(Number);
    prayerDate.setHours(hours, minutes, 0, 0); // Set prayer time on current day

    if (
      now > prayerDate &&
      currentPrayerInfo.current?.name !== prayerName &&
      currentPrayerInfo.next?.name !== prayerName
    ) {
      return "passed"; // Prayer already occurred and is not current or next
    }

    if (currentPrayerInfo.current?.name === prayerName) {
      return "current";
    } else if (currentPrayerInfo.next?.name === prayerName) {
      return "next";
    }

    return "upcoming"; // For future prayers that are not immediate next
  };

  const handleCityChange = (city) => {
    setCurrentCity(city);
  };

  const ibadyatData = getIbadyatData();

  if (loading) {
    return (
      <div style={{ paddingTop: "100px", minHeight: "100vh" }}>
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
    <div
      style={{
        paddingTop: "100px",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-3" style={{ color: "#2c3e50" }}>
                <FaPray className="me-3 font-bold" />
                Islamic Worship Practices
              </h1>
              <p className="text-center text-muted mb-4">
                Learn about the pillars of Islam and spiritual practices
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
              <Card className="shadow-sm border-0">
                <Card.Header
                  className="text-center py-3 rounded-full"
                  style={{ backgroundColor: "#009900", color: "white" }}
                >
                  <h3>
                    <FaClock className="me-2" />
                    Prayer Times
                  </h3>
                  <div className="d-flex justify-content-center mt-3">
                    <ButtonGroup>
                      <Button
                        className="text-white"
                        variant={
                          currentCity === "lahore"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleCityChange("lahore")}
                      >
                        Lahore
                      </Button>
                      <Button
                        className="text-white"
                        variant={
                          currentCity === "islamabad"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleCityChange("islamabad")}
                      >
                        Islamabad
                      </Button>
                      <Button
                        className="text-white"
                        variant={
                          currentCity === "gujranwala"
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleCityChange("gujranwala")}
                      >
                        Gujranwala
                      </Button>
                    </ButtonGroup>
                  </div>
                  <p className="mb-0 mt-2">
                    <FaCalendarAlt className="me-2" />
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Card.Header>
                <Card.Body style={{ backgroundColor: "#f8f9fa" }}>
                  {error && (
                    <Alert variant="warning" className="text-center">
                      <FaExclamationTriangle className="me-2" />
                      {error}
                    </Alert>
                  )}
                  <Row className="g-3">
                    {prayerTimes &&
                      Object.entries(prayerTimes)
                        .filter(([key]) => key !== "date")
                        .map(([prayerName, prayerTime], index) => {
                          const status = getPrayerStatus(
                            prayerName,
                            prayerTime
                          );
                          return (
                            <Col xs={6} sm={4} md={3} lg={2} key={prayerName}>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card
                                  className={`border-0 shadow-sm h-100 ${
                                    status === "current"
                                      ? "border-primary border-2"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor:
                                      status === "current"
                                        ? "#e3f2fd"
                                        : "white",
                                    transform:
                                      status === "current"
                                        ? "scale(1.05)"
                                        : "scale(1)",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  <Card.Body className="text-center d-flex flex-column">
                                    <div className="prayer-icon mb-2">
                                      {status === "current" && (
                                        <motion.div
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                          }}
                                        >
                                          <FaClock
                                            className="text-primary"
                                            size={24}
                                          />
                                        </motion.div>
                                      )}
                                    </div>
                                    <h5
                                      className="prayer-name mb-2"
                                      style={{ color: "#2c3e50" }}
                                    >
                                      {prayerName}
                                    </h5>
                                    <h4
                                      className="prayer-time mb-3"
                                      style={{
                                        color: "#4a7c59",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {formatTime(prayerTime)}
                                    </h4>
                                    <div className="mt-auto">
                                      <Badge
                                        pill
                                        bg={
                                          status === "current"
                                            ? "primary"
                                            : status === "next"
                                            ? "success"
                                            : "secondary"
                                        }
                                        className="px-3 py-2"
                                      >
                                        {status === "current"
                                          ? "Current"
                                          : status === "next"
                                          ? "Next"
                                          : ""}
                                      </Badge>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </motion.div>
                            </Col>
                          );
                        })}
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Ibadyat Grid */}
        <Row className="g-4 mb-5">
          {Object.entries(ibadyatData).map(([key, topic], index) => (
            <Col lg={6} key={key}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="border-0 shadow-sm h-100"
                  onClick={() => openModal(topic)}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="me-3 p-3 rounded-circle"
                        style={{
                          backgroundColor: `${topic.color}20`,
                          color: topic.color,
                        }}
                      >
                        <topic.icon size={28} />
                      </div>
                      <h4 className="mb-0" style={{ color: "#2c3e50" }}>
                        {topic.title}
                      </h4>
                    </div>
                    <p className="text-muted mb-4">
                      {topic.content.description.substring(0, 120)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button variant="outline-primary" size="sm">
                        Learn More
                      </Button>
                      <small className="text-muted">
                        {index === 0
                          ? "Pillar of Islam"
                          : index === 3
                          ? "Pillar of Islam"
                          : "Recommended"}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Modal for Detailed Information */}
        <Modal show={showModal} onHide={closeModal} size="lg" centered>
          <Modal.Header
            closeButton
            style={{
              borderBottom: `3px solid ${selectedTopic?.color || "#2c3e50"}`,
            }}
          >
            <Modal.Title className="d-flex align-items-center">
              {selectedTopic?.icon && (
                <div
                  className="me-3 p-2 rounded-circle"
                  style={{
                    backgroundColor: `${selectedTopic?.color}20`,
                    color: selectedTopic?.color,
                  }}
                >
                  <selectedTopic.icon size={24} />
                </div>
              )}
              <span style={{ color: "#2c3e50" }}>{selectedTopic?.title}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {selectedTopic && (
              <div>
                <p className="mb-4 lead" style={{ color: "#4a7c59" }}>
                  {selectedTopic.content.description}
                </p>

                <h5
                  className="mb-3"
                  style={{
                    color: "#2c3e50",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "8px",
                  }}
                >
                  Importance
                </h5>
                <ul className="mb-4 ps-4">
                  {selectedTopic.content.importance.map((item, index) => (
                    <li key={index} className="mb-2" style={{ color: "#555" }}>
                      {item}
                    </li>
                  ))}
                </ul>

                {selectedTopic.content.rituals && (
                  <>
                    <h5
                      className="mb-3"
                      style={{
                        color: "#2c3e50",
                        borderBottom: "2px solid #eee",
                        paddingBottom: "8px",
                      }}
                    >
                      Rituals
                    </h5>
                    <ul className="mb-4 ps-4">
                      {selectedTopic.content.rituals.map((ritual, index) => (
                        <li
                          key={index}
                          className="mb-2"
                          style={{ color: "#555" }}
                        >
                          {ritual}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedTopic.content.types && (
                  <>
                    <h5
                      className="mb-3"
                      style={{
                        color: "#2c3e50",
                        borderBottom: "2px solid #eee",
                        paddingBottom: "8px",
                      }}
                    >
                      Types
                    </h5>
                    <ul className="mb-4 ps-4">
                      {selectedTopic.content.types.map((type, index) => (
                        <li
                          key={index}
                          className="mb-2"
                          style={{ color: "#555" }}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h5
                  className="mb-3"
                  style={{
                    color: "#2c3e50",
                    borderBottom: "2px solid #eee",
                    paddingBottom: "8px",
                  }}
                >
                  Practical Tips
                </h5>
                <ul className="ps-4">
                  {selectedTopic.content.tips.map((tip, index) => (
                    <li key={index} className="mb-2" style={{ color: "#555" }}>
                      {tip}
                    </li>
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