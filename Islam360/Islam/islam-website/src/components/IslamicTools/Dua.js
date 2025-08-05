import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaHands, FaHeart, FaStar, FaBook, FaSearch } from 'react-icons/fa';

const Dua = () => {
  const [selectedDua, setSelectedDua] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const duas = [
    {
      id: 1,
      title: "Dua for Starting the Day",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
      translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner",
      category: "Morning",
      reference: "Muslim"
    },
    {
      id: 2,
      title: "Dua for Entering Home",
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      translation: "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust",
      category: "Home",
      reference: "Abu Dawud"
    },
    {
      id: 3,
      title: "Dua for Eating",
      arabic: "بِسْمِ اللَّهِ",
      translation: "In the name of Allah",
      category: "Food",
      reference: "Bukhari"
    },
    {
      id: 4,
      title: "Dua for Travel",
      arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى",
      translation: "O Allah, we ask You on this journey of ours for righteousness, piety, and such deeds as are pleasing to You",
      category: "Travel",
      reference: "Muslim"
    },
    {
      id: 5,
      title: "Dua for Knowledge",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      translation: "My Lord, increase me in knowledge",
      category: "Knowledge",
      reference: "Quran 20:114"
    },
    {
      id: 6,
      title: "Dua for Forgiveness",
      arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
      translation: "My Lord, forgive me and accept my repentance, for You are the Ever-Accepting of repentance, the Most Merciful",
      category: "Forgiveness",
      reference: "Abu Dawud"
    }
  ];

  const filteredDuas = duas.filter(dua =>
    dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dua.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dua.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (dua) => {
    setSelectedDua(dua);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDua(null);
  };

  return (
    <div style={{ paddingTop: '30px', minHeight: '100vh' }}>
      <Container>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center mb-4">
                <FaHands className="me-3" />
                Duas & Supplications
              </h1>
              <p className="text-center mb-5">Beautiful supplications from the Quran and Sunnah</p>
            </motion.div>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="justify-content-center mb-10 py-6">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search duas by title, translation, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Duas Grid */}
        <Row>
          {filteredDuas.map((dua, index) => (
            <Col lg={6} md={6} key={dua.id} className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="dua-card h-80"
                  onClick={() => openModal(dua)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-15">
                      <div className="dua-category">
                        <span className="badge bg-primary">{dua.category}</span>
                      </div>
                      <FaHeart className="text-danger" />
                    </div>
                    <h5 className="dua-title">{dua.title}</h5>
                    <p className="dua-arabic text-end mb-3">{dua.arabic}</p>
                    <p className="dua-translation text-muted">{dua.translation}</p>
                    <div className="dua-reference">
                      <small className="text-muted">
                        <FaBook className="me-1" />
                        {dua.reference}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Dua Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaHands className="me-2" />
            {selectedDua?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDua && (
            <div>
              <div className="text-center mb-4">
                <span className="badge bg-primary fs-6">{selectedDua.category}</span>
              </div>
              <div className="dua-modal-arabic text-center mb-4">
                <h4>{selectedDua.arabic}</h4>
              </div>
              <div className="dua-modal-translation mb-4">
                <h6>Translation:</h6>
                <p>{selectedDua.translation}</p>
              </div>
              <div className="dua-modal-reference">
                <small className="text-muted">
                  <FaBook className="me-1" />
                  Reference: {selectedDua.reference}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary">
            <FaHeart className="me-2" />
            Add to Favorites
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dua;