import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMoon, FaSun } from 'react-icons/fa';

const IslamicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const islamicMonths = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getIslamicDate = () => {
    // Simplified Islamic date calculation
    const islamicYear = 1445; // This should be calculated properly
    const islamicMonth = islamicMonths[currentDate.getMonth()];
    const islamicDay = currentDate.getDate();
    return `${islamicDay} ${islamicMonth} ${islamicYear} AH`;
  };

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
                <FaCalendarAlt className="me-3" />
                Islamic Calendar
              </h1>
              <p className="text-center mb-5">Islamic Hijri calendar and important dates</p>
            </motion.div>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="calendar-card">
                <Card.Body className="text-center">
                  <h4><FaSun className="me-2" />Gregorian Date</h4>
                  <h2 className="current-date">{currentDate.toDateString()}</h2>
                  <p className="text-muted">{gregorianMonths[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="calendar-card">
                <Card.Body className="text-center">
                  <h4><FaMoon className="me-2" />Islamic Date</h4>
                  <h2 className="islamic-date">{getIslamicDate()}</h2>
                  <p className="text-muted">Hijri Calendar</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4">Important Islamic Dates</h3>
            <Row>
              {[
                { name: "Ramadan", month: "Ramadan", description: "Month of fasting" },
                { name: "Eid al-Fitr", month: "Shawwal", description: "Festival of breaking the fast" },
                { name: "Eid al-Adha", month: "Dhu al-Hijjah", description: "Festival of sacrifice" },
                { name: "Mawlid al-Nabi", month: "Rabi al-Awwal", description: "Birth of Prophet Muhammad" }
              ].map((event, index) => (
                <Col lg={6} md={6} key={index} className="mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="event-card h-100">
                      <Card.Body>
                        <h5>{event.name}</h5>
                        <p className="text-muted">{event.month}</p>
                        <p>{event.description}</p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default IslamicCalendar;