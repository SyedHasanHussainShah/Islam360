import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaStar, FaUndo, FaPlay, FaPause, FaStop, FaHeart } from 'react-icons/fa';

const Tasbih = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [isAutoCounting, setIsAutoCounting] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(1000);
  const [autoInterval, setAutoInterval] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('tasbihTotal');
    const savedSession = localStorage.getItem('tasbihSession');
    if (savedTotal) setTotalCount(parseInt(savedTotal));
    if (savedSession) setSessionCount(parseInt(savedSession));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasbihTotal', totalCount.toString());
    localStorage.setItem('tasbihSession', sessionCount.toString());
  }, [totalCount, sessionCount]);

  const incrementCount = () => {
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    setSessionCount(prev => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const resetSession = () => {
    setSessionCount(0);
  };

  const startAutoCount = () => {
    setIsAutoCounting(true);
    const interval = setInterval(() => {
      incrementCount();
    }, autoSpeed);
    setAutoInterval(interval);
  };

  const stopAutoCount = () => {
    setIsAutoCounting(false);
    if (autoInterval) {
      clearInterval(autoInterval);
      setAutoInterval(null);
    }
  };

  const handleTargetChange = (newTarget) => {
    setTarget(newTarget);
    setCount(0);
  };

  const progressPercentage = (count / target) * 100;

  const dhikrTargets = [
    { name: "Subhanallah", count: 33, arabic: "سُبْحَانَ اللَّهِ" },
    { name: "Alhamdulillah", count: 33, arabic: "الْحَمْدُ لِلَّهِ" },
    { name: "Allahu Akbar", count: 33, arabic: "اللَّهُ أَكْبَرُ" },
    { name: "La ilaha illallah", count: 100, arabic: "لَا إِلَهَ إِلَّا اللَّهُ" },
    { name: "Astaghfirullah", count: 100, arabic: "أَسْتَغْفِرُ اللَّهَ" }
  ];

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
                <FaStar className="me-3" />
                Digital Tasbih
              </h1>
              <p className="text-center mb-5">Count your dhikr with ease and track your spiritual journey</p>
            </motion.div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="tasbih-card">
                <Card.Body className="text-center">
                  <div className="tasbih-display mb-4">
                    <h2 className="tasbih-count">{count}</h2>
                    <p className="tasbih-target">of {target}</p>
                    <ProgressBar 
                      now={progressPercentage} 
                      className="tasbih-progress"
                      variant={progressPercentage >= 100 ? "success" : "primary"}
                    />
                  </div>

                  <div className="tasbih-controls mb-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="tasbih-btn me-3"
                      onClick={incrementCount}
                      disabled={isAutoCounting}
                    >
                      <FaHeart className="me-2" />
                      Count
                    </Button>
                    
                    <Button
                      variant="outline-secondary"
                      className="tasbih-btn me-3"
                      onClick={resetCount}
                    >
                      <FaUndo className="me-2" />
                      Reset
                    </Button>

                    {!isAutoCounting ? (
                      <Button
                        variant="outline-success"
                        className="tasbih-btn"
                        onClick={startAutoCount}
                      >
                        <FaPlay className="me-2" />
                        Auto
                      </Button>
                    ) : (
                      <Button
                        variant="outline-danger"
                        className="tasbih-btn"
                        onClick={stopAutoCount}
                      >
                        <FaStop className="me-2" />
                        Stop
                      </Button>
                    )}
                  </div>

                  <div className="tasbih-stats">
                    <Row>
                      <Col md={4}>
                        <div className="stat-item">
                          <h5>Session</h5>
                          <p className="stat-number">{sessionCount}</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-item">
                          <h5>Total</h5>
                          <p className="stat-number">{totalCount}</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-item">
                          <h5>Speed</h5>
                          <select 
                            value={autoSpeed} 
                            onChange={(e) => setAutoSpeed(parseInt(e.target.value))}
                            className="form-select"
                          >
                            <option value={500}>Fast</option>
                            <option value={1000}>Normal</option>
                            <option value={2000}>Slow</option>
                          </select>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Dhikr Targets */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4">Common Dhikr Targets</h3>
            <Row>
              {dhikrTargets.map((dhikr, index) => (
                <Col lg={4} md={6} key={index} className="mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="dhikr-target-card h-100"
                      onClick={() => handleTargetChange(dhikr.count)}
                    >
                      <Card.Body className="text-center">
                        <h5 className="dhikr-name">{dhikr.name}</h5>
                        <p className="dhikr-arabic">{dhikr.arabic}</p>
                        <div className="dhikr-count-badge">
                          <span className="badge bg-primary fs-6">{dhikr.count}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Session Reset */}
        <Row className="mt-4">
          <Col className="text-center">
            <Button
              variant="outline-warning"
              onClick={resetSession}
              className="me-3"
            >
              Reset Session Count
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => {
                setTotalCount(0);
                setSessionCount(0);
                setCount(0);
              }}
            >
              Reset All Counts
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Tasbih;