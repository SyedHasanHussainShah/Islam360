import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaMosque, 
  FaHeart, 
  FaGithub, 
  FaTwitter, 
  FaInstagram, 
  FaEnvelope, 
  FaQuran,
  FaPray,
  FaCalendarAlt,
  FaCompass,
  FaHandsHelping,
  FaStar
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/', icon: FaMosque },
    { name: 'Quran', path: '/quran', icon: FaQuran },
    { name: 'Prayer Times', path: '/times', icon: FaPray },
    { name: 'Islamic Calendar', path: '/calendar', icon: FaCalendarAlt },
    { name: 'Qibla Direction', path: '/qibla', icon: FaCompass },
    { name: 'Duas', path: '/dua', icon: FaHandsHelping }
  ];

  const islamicQuotes = [
    "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ",
    "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ"
  ];

  return (
    <footer className="islamic-footer">
      <div className="footer-bg-pattern"></div>
      
      <Container>
        {/* Main Footer Content */}
        <Row className="footer-main">
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="footer-brand">
                <div className="brand-logo">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <FaMosque className="brand-icon" />
                  </motion.div>
                  <h3>Islam360</h3>
                </div>
                <p className="brand-description">
                  Your comprehensive Islamic companion for prayer times, Quran recitation, 
                  and spiritual guidance. Built with love for the Muslim community worldwide.
                </p>
                
                {/* Islamic Quote Rotation */}
                <motion.div 
                  className="islamic-quote"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="quote-text">
                    {islamicQuotes[Math.floor(Date.now() / 5000) % islamicQuotes.length]}
                  </div>
                  <div className="quote-translation">
                    "And whoever fears Allah - He will make for him a way out"
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Col>

          {/* Quick Links */}
          <Col lg={3} md={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="footer-title">
                <FaStar className="me-2" />
                Quick Links
              </h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a href={link.path} className="footer-link">
                      <link.icon className="me-2" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </Col>

          {/* Islamic Features */}
          <Col lg={3} md={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="footer-title">
                <FaQuran className="me-2" />
                Islamic Features
              </h4>
              <ul className="footer-features">
                <li>✓ Accurate Prayer Times</li>
                <li>✓ Complete Quran with Audio</li>
                <li>✓ Islamic Calendar</li>
                <li>✓ Qibla Direction</li>
                <li>✓ Duas & Supplications</li>
                <li>✓ 99 Names of Allah</li>
                <li>✓ Prayer Notifications</li>
                <li>✓ Islamic Content Library</li>
              </ul>
            </motion.div>
          </Col>

          {/* Contact & Social */}
          <Col lg={2} md={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="footer-title">
                <FaHeart className="me-2" />
                Connect
              </h4>
              
              <div className="social-links">
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEnvelope />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub />
                </motion.a>
              </div>

              <div className="contact-info">
                <p>
                  <FaEnvelope className="me-2" />
                  support@islam360.com
                </p>
                <p>Location: Gujranwala, Pakistan</p>
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom">
          <Col md={6}>
            <motion.p 
              className="copyright"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              © {currentYear} Islam360. Built with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="heart-icon"
              >
                <FaHeart />
              </motion.span>
              {' '}for the Muslim Ummah
            </motion.p>
          </Col>
          <Col md={6} className="text-md-end">
            <motion.div 
              className="footer-badges"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <span className="badge-item">Free & Open Source</span>
              <span className="badge-item">Privacy Focused</span>
              <span className="badge-item">Ad-Free</span>
            </motion.div>
          </Col>
        </Row>

        {/* Floating Islamic Symbols */}
        <div className="floating-symbols">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-symbol"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`
              }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              ☪
            </motion.div>
          ))}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;