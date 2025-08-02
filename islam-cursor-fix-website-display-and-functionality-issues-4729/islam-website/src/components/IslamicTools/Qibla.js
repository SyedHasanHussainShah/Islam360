import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCompass, FaLocationArrow, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Qibla = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compassRotation, setCompassRotation] = useState(0);

  useEffect(() => {
    // Simulate compass rotation for demo
    const interval = setInterval(() => {
      setCompassRotation(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getQiblaDirection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user's current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });

      // Calculate Qibla direction (simplified calculation)
      // Kaaba coordinates: 21.4225° N, 39.8262° E
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;
      
      const deltaLng = kaabaLng - longitude;
      const y = Math.sin(deltaLng * Math.PI / 180) * Math.cos(kaabaLat * Math.PI / 180);
      const x = Math.cos(latitude * Math.PI / 180) * Math.sin(kaabaLat * Math.PI / 180) - 
                Math.sin(latitude * Math.PI / 180) * Math.cos(kaabaLat * Math.PI / 180) * Math.cos(deltaLng * Math.PI / 180);
      
      let qiblaAngle = Math.atan2(y, x) * 180 / Math.PI;
      qiblaAngle = (qiblaAngle + 360) % 360;
      
      setQiblaDirection(qiblaAngle);
      setLoading(false);
    } catch (err) {
      setError('Unable to get your location. Please enable location services and try again.');
      setLoading(false);
    }
  };

  const getDirectionName = (angle) => {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
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
                <FaCompass className="me-3" />
                Qibla Direction
              </h1>
              <p className="text-center mb-5">Find the direction of the Kaaba for your prayers</p>
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
              <Card className="qibla-card">
                <Card.Body className="text-center">
                  <div className="compass-container mb-4">
                    <div className="compass">
                      <div 
                        className="compass-needle"
                        style={{ transform: `rotate(${qiblaDirection || 0}deg)` }}
                      >
                        <FaLocationArrow className="compass-arrow" />
                      </div>
                      <div className="compass-markings">
                        <div className="marking n">N</div>
                        <div className="marking e">E</div>
                        <div className="marking s">S</div>
                        <div className="marking w">W</div>
                      </div>
                    </div>
                  </div>

                  {!userLocation ? (
                    <div className="location-prompt">
                      <p className="mb-3">To find the Qibla direction, we need your location.</p>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={getQiblaDirection}
                        disabled={loading}
                      >
                        <FaMapMarkerAlt className="me-2" />
                        {loading ? 'Getting Location...' : 'Find Qibla Direction'}
                      </Button>
                    </div>
                  ) : (
                    <div className="qibla-info">
                      <h4 className="mb-3">Qibla Direction Found!</h4>
                      <div className="direction-details">
                        <p><strong>Direction:</strong> {getDirectionName(qiblaDirection)}</p>
                        <p><strong>Angle:</strong> {Math.round(qiblaDirection)}°</p>
                        <p><strong>Your Location:</strong> {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°</p>
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={getQiblaDirection}
                        className="mt-3"
                      >
                        <FaMapMarkerAlt className="me-2" />
                        Update Location
                      </Button>
                    </div>
                  )}

                  {error && (
                    <Alert variant="warning" className="mt-3">
                      <FaGlobe className="me-2" />
                      {error}
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Qibla Information */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4">About Qibla</h3>
            <Row>
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaCompass className="me-2" />What is Qibla?</h5>
                    <p>The Qibla is the direction that Muslims face when performing their prayers. It points towards the Kaaba in Mecca, Saudi Arabia.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="info-card h-100">
                  <Card.Body>
                    <h5><FaMapMarkerAlt className="me-2" />Finding Qibla</h5>
                    <p>Use this tool to find the correct direction for your prayers. The compass will show you the exact angle to face.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Qibla;