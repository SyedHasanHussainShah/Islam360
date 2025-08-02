import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaSearch } from 'react-icons/fa';

const NamesOfAllah = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const namesOfAllah = [
    { number: 1, arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", description: "The One who has mercy on the believers and the unbelievers in this world and only on the believers in the hereafter." },
    { number: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", description: "The One who has mercy on the believers." },
    { number: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", description: "The One with the complete dominion, the One Whose dominion is clear from imperfection." },
    { number: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy", description: "The One who is pure from any imperfection and clear from children and adversaries." },
    { number: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace", description: "The One who is free from every imperfection." },
    { number: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", description: "The One who witnessed for Himself that no one is God but Him." },
    { number: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector", description: "The One who witnesses the saying and deeds of His creatures." },
    { number: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty", description: "The Defeater who is not defeated." },
    { number: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller", description: "The One that nothing happens in His dominion except that which He willed." },
    { number: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Majestic", description: "The One who is clear from the attributes of the creatures and from resembling them." },
    { number: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator", description: "The One who brings everything from non-existence to existence." },
    { number: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Originator", description: "The One who creates all creatures in different forms." },
    { number: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner", description: "The One who forms His creatures in different pictures." },
    { number: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Ever Forgiving", description: "The One who forgives the sins of His slaves time and time again." },
    { number: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer", description: "The One who is the only Dominant and the only One who can compel others to do whatever He wants." },
    { number: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower", description: "The One who is Generous in giving plenty without any return." },
    { number: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider", description: "The One who gives everything that benefits whether Halal or Haram." },
    { number: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener", description: "The One who opens for His slaves the closed worldy and religious matters." },
    { number: 19, arabic: "الْعَلِيمُ", transliteration: "Al-Alim", meaning: "The All-Knowing", description: "The One who knows the open and the hidden." },
    { number: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Restrainer", description: "The One who constricts the sustenance by His wisdom and expands and widens it." },
    { number: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander", description: "The One who expands and widens the sustenance." },
    { number: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser", description: "The One who lowers whoever He willed by His Destruction and raises whoever He willed by His Endowment." },
    { number: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter", description: "The One who raises whoever He willed by His Endowment." },
    { number: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Honorer", description: "The One who gives esteem to whoever He willed." },
    { number: 25, arabic: "الْمُذِلُّ", transliteration: "Al-Mudhill", meaning: "The Dishonorer", description: "The One who gives esteem to whoever He willed." },
    { number: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing", description: "The One who Hears all things that are heard by His Eternal Hearing without an ear, instrument or organ." },
    { number: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing", description: "The One who Sees all things that are seen by His Eternal Seeing without a pupil or any other instrument." },
    { number: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge", description: "The One who is the Ruler and His judgment is His Word." },
    { number: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just", description: "The One who is entitled to do what He does." },
    { number: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle", description: "The One who is kind to His slaves and endows upon them." },
    { number: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The Aware", description: "The One who knows the truth of things." },
    { number: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing", description: "The One who delays the punishment for those who deserve it." },
    { number: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Most Great", description: "The One deserving the attributes of Exaltment, Glory, Extolement, and Purity from all imperfection." },
    { number: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The Ever Forgiving", description: "The One who forgives a lot." },
    { number: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative", description: "The One who gives a lot of reward for a little obedience." },
    { number: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Most High", description: "The One who is clear from the attributes of the creatures." },
    { number: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Most Great", description: "The One who is greater than everything in status." },
    { number: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver", description: "The One who protects whatever and whoever He willed to protect." },
    { number: 39, arabic: "الْمُقِيتُ", transliteration: "Al-Muqit", meaning: "The Maintainer", description: "The One who has the Power." },
    { number: 40, arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner", description: "The One who gives the satisfaction." },
    { number: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Sublime", description: "The One who is attributed with greatness of Power and Glory of status." },
    { number: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous", description: "The One who is clear from abjectness." },
    { number: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful", description: "The One who nothing is absent from Him." },
    { number: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive", description: "The One who answers the one in need if he asks Him and rescues the yearned if he calls upon Him." },
    { number: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The Vast", description: "The One who is Knowledgeable." },
    { number: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise", description: "The One who is correct in His doings." },
    { number: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving", description: "The One who loves His believing slaves and His believing slaves love Him." },
    { number: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Most Glorious", description: "The One who is with perfect Power, High Status, Compassion, Generosity and Kindness." },
    { number: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector", description: "The One who resurrects His slaves after death for reward and/or punishment." },
    { number: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness", description: "The One who nothing is absent from Him." },
    { number: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth", description: "The One who truly exists." },
    { number: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee", description: "The One who gives the satisfaction and is relied upon." },
    { number: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawi", meaning: "The Most Strong", description: "The One with the complete Power." },
    { number: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm", description: "The One with extreme Power which is un-interrupted and He does not get tired." },
    { number: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Wali", meaning: "The Protecting Friend", description: "The One who is the only Supporter and Helper." },
    { number: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy", description: "The One who deserves to be praised." },
    { number: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Counter", description: "The One who the count of things are known to him." },
    { number: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator", description: "The One who started the human being." },
    { number: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer", description: "The One who brings back the creatures after death." },
    { number: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life", description: "The One who took out a living human from semen that does not have a soul." },
    { number: 61, arabic: "الْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Taker of Life", description: "The One who renders the living dead." },
    { number: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Living", description: "The One attributed with a life that is unlike our life and is not that of a combination of soul, flesh or blood." },
    { number: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Subsisting", description: "The One who remains and does not end." },
    { number: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder", description: "The One who is Rich and is never poor." },
    { number: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble", description: "The One who is Majid." },
    { number: 66, arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", meaning: "The Unique", description: "The One, the Everlasting Refuge." },
    { number: 67, arabic: "الْأَحَدُ", transliteration: "Al-Ahad", meaning: "The One", description: "The One who is the only God." },
    { number: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal", description: "The Master who is relied upon in matters and reverted to in ones needs." },
    { number: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Able", description: "The One attributed with Power." },
    { number: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful", description: "The One with the perfect Power that nothing is withheld from Him." },
    { number: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter", description: "The One who puts things in their right places." },
    { number: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer", description: "The One who puts things in their right places." },
    { number: 73, arabic: "الْأَوَّلُ", transliteration: "Al-Awwal", meaning: "The First", description: "The One whose Existence is without a beginning." },
    { number: 74, arabic: "الْآخِرُ", transliteration: "Al-Akhir", meaning: "The Last", description: "The One whose Existence is without an end." },
    { number: 75, arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest", description: "The One that nothing is above Him and nothing is underneath Him." },
    { number: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden", description: "The One that nothing is above Him and nothing is underneath Him." },
    { number: 77, arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor", description: "The One who owns things and manages them." },
    { number: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted", description: "The One who is clear from the attributes of the creation." },
    { number: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness", description: "The One who is kind to His creatures." },
    { number: 80, arabic: "التَّوَّابُ", transliteration: "At-Tawwab", meaning: "The Ever Accepting of Repentance", description: "The One who grants repentance to whoever He willed among His creatures." },
    { number: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger", description: "The One who victoriously prevails over His enemies and punishes them for their sins." },
    { number: 82, arabic: "الْعَفُوُّ", transliteration: "Al-Afu", meaning: "The Pardoner", description: "The One with wide forgiveness." },
    { number: 83, arabic: "الرَّءُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Most Kind", description: "The One with extreme Mercy." },
    { number: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "The Owner of All Sovereignty", description: "The One who controls the Dominion and gives dominion to whoever He willed." },
    { number: 85, arabic: "ذُو الْجَلَالِ وَالْإِكْرَامِ", transliteration: "Dhu-al-Jalali wa-al-Ikram", meaning: "The Lord of Majesty and Generosity", description: "The One who deserves to be Exalted and not denied." },
    { number: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable", description: "The One who is Just in His judgment." },
    { number: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer", description: "The One who gathers the creatures on a day that there is no doubt about." },
    { number: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient", description: "The One who does not need the creation." },
    { number: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher", description: "The One who satisfies the necessities of the creatures." },
    { number: 90, arabic: "الْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer", description: "The One who prevents harm." },
    { number: 91, arabic: "الضَّارُّ", transliteration: "Ad-Darr", meaning: "The Distresser", description: "The One who makes harm reach to whoever He willed." },
    { number: 92, arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Propitious", description: "The One who makes benefits reach to whoever He willed." },
    { number: 93, arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light", description: "The One who guides." },
    { number: 94, arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide", description: "The One whom with His Guidance His believers were guided." },
    { number: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Incomparable", description: "The One who created the creation and formed it without any preceding example." },
    { number: 96, arabic: "الْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting", description: "The One that the state of non-existence is impossible for Him." },
    { number: 97, arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor", description: "The One whose Existence remains." },
    { number: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to the Right Path", description: "The One who guides." },
    { number: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient", description: "The One who does not quickly punish the sinners." }
  ];

  const filteredNames = namesOfAllah.filter(name =>
    name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.arabic.includes(searchQuery)
  );

  const openModal = (name) => {
    setSelectedName(name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedName(null);
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
                <FaStar className="me-3" />
                99 Names of Allah
              </h1>
              <p className="text-center mb-5">The beautiful names and attributes of Allah (SWT)</p>
            </motion.div>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="justify-content-center mb-4">
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
                  placeholder="Search names by transliteration, meaning, or Arabic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Names Grid */}
        <Row>
          {filteredNames.map((name, index) => (
            <Col lg={6} md={6} key={name.number} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className="name-card h-100"
                  onClick={() => openModal(name)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="name-number">
                        <span className="badge bg-primary fs-6">{name.number}</span>
                      </div>
                      <FaHeart className="text-danger" />
                    </div>
                    <h5 className="name-transliteration">{name.transliteration}</h5>
                    <p className="name-arabic text-end mb-3">{name.arabic}</p>
                    <p className="name-meaning text-muted">{name.meaning}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Name Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaStar className="me-2" />
            {selectedName?.transliteration}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedName && (
            <div>
              <div className="text-center mb-4">
                <span className="badge bg-primary fs-6">#{selectedName.number}</span>
              </div>
              <div className="name-modal-arabic text-center mb-4">
                <h3>{selectedName.arabic}</h3>
              </div>
              <div className="name-modal-details">
                <h6>Transliteration:</h6>
                <p className="mb-3">{selectedName.transliteration}</p>
                <h6>Meaning:</h6>
                <p className="mb-3">{selectedName.meaning}</p>
                <h6>Description:</h6>
                <p>{selectedName.description}</p>
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

export default NamesOfAllah;