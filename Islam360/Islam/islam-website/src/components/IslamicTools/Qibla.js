import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCompass, FaLocationArrow, FaMapMarkerAlt, FaGlobe, FaInfoCircle } from 'react-icons/fa';

const Qibla = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [deviceOrientationAvailable, setDeviceOrientationAvailable] = useState(false);
  const compassRef = useRef(null);

  // Check if device orientation is available
  useEffect(() => {
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      setDeviceOrientationAvailable(true);
    }
  }, []);

  // Handle compass orientation
  useEffect(() => {
    if (!deviceOrientationAvailable) return;

    const handleOrientation = (event) => {
      if (event.webkitCompassHeading) {
        // iOS
        setCompassHeading(360 - event.webkitCompassHeading);
      } else if (event.absolute && event.alpha !== null) {
        // Android/other browsers
        setCompassHeading(360 - event.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [deviceOrientationAvailable]);

  // Calculate Qibla direction (works offline)
  const calculateQiblaDirection = (latitude, longitude) => {
    // Kaaba coordinates: 21.4225° N, 39.8262° E
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const phiK = kaabaLat * Math.PI / 180.0;
    const lambdaK = kaabaLng * Math.PI / 180.0;
    const phi = latitude * Math.PI / 180.0;
    const lambda = longitude * Math.PI / 180.0;
    
    const psi = 180.0 / Math.PI * Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
    
    return (psi + 360.0) % 360.0;
  };

  const getQiblaDirection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get cached position first
      const cachedPosition = localStorage.getItem('lastKnownPosition');
      if (cachedPosition) {
        const { latitude, longitude } = JSON.parse(cachedPosition);
        setUserLocation({ latitude, longitude });
        const qiblaAngle = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qiblaAngle);
        setLoading(false);
        return;
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      
      // Cache the position for offline use
      localStorage.setItem('lastKnownPosition', JSON.stringify({ latitude, longitude }));
      
      const qiblaAngle = calculateQiblaDirection(latitude, longitude);
      setQiblaDirection(qiblaAngle);
      setLoading(false);
    } catch (err) {
      // Try to use last known position if available
      const cachedPosition = localStorage.getItem('lastKnownPosition');
      if (cachedPosition) {
        const { latitude, longitude } = JSON.parse(cachedPosition);
        setUserLocation({ latitude, longitude });
        const qiblaAngle = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qiblaAngle);
        setLoading(false);
        setError('Using cached location. For better accuracy, enable location services.');
      } else {
        setError('Unable to get your location. Please enable location services and try again.');
        setLoading(false);
      }
    }
  };

  const getDirectionName = (angle) => {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
  };

  // Calculate compass rotation for the needle
  const getCompassRotation = () => {
    if (!qiblaDirection) return 0;
    if (!deviceOrientationAvailable) return qiblaDirection;
    return (qiblaDirection - compassHeading + 360) % 360;
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
              <Card className="qibla-card shadow-sm">
                <Card.Body className="text-center">
                  <div className="compass-container mb-4" ref={compassRef}>
                    <div className="compass" style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto' }}>
                      <div 
                        className="compass-needle"
                        style={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${getCompassRotation()}deg)`,
                          transformOrigin: 'center bottom',
                          transition: 'transform 0.1s ease-out',
                          zIndex: 10
                        }}
                      >
                        <FaLocationArrow 
                          className="compass-arrow" 
                          style={{ 
                            color: '#d62d20',
                            fontSize: '3rem',
                            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
                          }} 
                        />
                      </div>
                      <div className="compass-markings" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px solid #333',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div className="marking n" style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>N</div>
                        <div className="marking e" style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>E</div>
                        <div className="marking s" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>S</div>
                        <div className="marking w" style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }}>W</div>
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
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt className="me-2" />
                            Find Qibla Direction
                          </>
                        )}
                      </Button>
                      {!deviceOrientationAvailable && (
                        <Alert variant="info" className="mt-3">
                          <FaInfoCircle className="me-2" />
                          For best results, use this on a mobile device with compass support.
                        </Alert>
                      )}
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
                      {!deviceOrientationAvailable && (
                        <p className="text-muted mt-3">
                          Point the top of your device towards {Math.round(qiblaDirection)}° ({getDirectionName(qiblaDirection)})
                        </p>
                      )}
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
                <Card className="info-card h-100 shadow-sm">
                  <Card.Body>
                    <h5><FaCompass className="me-2" />What is Qibla?</h5>
                    <p>The Qibla is the direction that Muslims face when performing their prayers. It points towards the Kaaba in Mecca, Saudi Arabia.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="info-card h-100 shadow-sm">
                  <Card.Body>
                    <h5><FaMapMarkerAlt className="me-2" />Offline Functionality</h5>
                    <p>This app caches your last known location so you can find the Qibla direction even without an internet connection.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Mobile-specific styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .compass-container {
            width: 200px;
            height: 200px;
            margin: 0 auto 30px;
          }
          
          .compass-arrow {
            font-size: 2.5rem !important;
          }
          
          .qibla-card {
            padding: 15px;
          }
        }
        
        .compass-needle {
          transition: transform 0.1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Qibla;