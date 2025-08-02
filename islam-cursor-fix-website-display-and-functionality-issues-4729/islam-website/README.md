# Islam360 - Islamic Companion Website

A comprehensive Islamic website built with React that provides prayer times, Quran recitation, Islamic worship guidance, and spiritual content. Designed to be fully responsive and work seamlessly on both desktop and mobile devices.

## 🌟 Features

### 🏠 Home Section
- **Animated Hero Section** with Islamic-themed background
- **Live Prayer Times** for Gujranwala, Pakistan with current/next prayer highlighting
- **Global Search Bar** for finding Surahs, Duas, and Islamic content
- **Daily Quran Verse** with Arabic text and English translation
- **Islamic Video Content** with YouTube integration
- **Support Section** with Islamic charity quotes

### 📖 Quran Section
- **Complete Surah List** with Arabic names and English translations
- **Audio Player** with play, pause, stop, and progress controls
- **Search Functionality** to find Surahs by name, English, or Arabic
- **Interactive Surah Cards** with hover effects and selection states
- **Real-time Audio Controls** with time display and progress bar

### 🕌 Ibadyat (Worship) Section
- **Four Main Categories**: Prayer, Hajj, Umrah, and Fasting
- **Interactive Cards** with detailed modal information
- **Comprehensive Guides** for each worship type
- **Prayer Times Integration** showing daily prayer schedule
- **Educational Content** about Islamic rituals and practices

### ⚙️ Settings Section
- **Theme Toggle** - Switch between light and dark modes
- **Profile Picture Upload** with validation and local storage
- **Data Management** - Clear app data functionality
- **App Information** and privacy details
- **Responsive Profile Management**

### 🔔 Prayer Notifications
- **Automatic Notifications** 5 minutes before each prayer
- **Sound Alerts** using Web Audio API
- **Browser Notifications** with permission handling
- **Real-time Prayer Tracking** with countdown timers

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Bootstrap 5 + Custom CSS with CSS Variables
- **Animations**: Framer Motion for smooth transitions
- **Icons**: React Icons (Font Awesome)
- **API**: Aladhan API for accurate prayer times
- **Audio**: HTML5 Audio with custom controls
- **State Management**: React useState and useEffect
- **Routing**: React Router DOM
- **Responsive Design**: Bootstrap Grid + Custom Media Queries

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd islam-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Mobile Features
- Collapsible navigation menu
- Touch-friendly interface
- Optimized prayer time cards
- Responsive video grid
- Mobile-optimized search

## 🌍 Location Configuration

Currently configured for **Gujranwala, Pakistan** with coordinates:
- **Latitude**: 32.1877
- **Longitude**: 74.1945
- **Calculation Method**: University of Islamic Sciences, Karachi
- **Juristic Method**: Hanafi

## 🔧 Customization

### Change Location
Edit `src/utils/prayerTimes.js`:
```javascript
const GUJRANWALA_LAT = your_latitude;
const GUJRANWALA_LNG = your_longitude;
```

### Modify Theme Colors
Edit CSS variables in `src/App.css`:
```css
:root {
  --primary-color: #4a7c59;
  --secondary-color: #f8f9fa;
  --accent-color: #ffc107;
}
```

### Add More Surahs
Update `src/data/quranData.js` with additional Surah information.

## 📂 Project Structure

```
islam-website/
├── public/
│   ├── index.html
│   └── logo192.png
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Home.js
│   │   ├── Quran.js
│   │   ├── Ibadyat.js
│   │   ├── Settings.js
│   │   └── PrayerNotification.js
│   ├── data/
│   │   └── quranData.js
│   ├── utils/
│   │   └── prayerTimes.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## 🎨 Design Features

### Visual Elements
- **Islamic Green Color Scheme** with gold accents
- **Arabic Typography** support for Quranic text
- **Gradient Backgrounds** with Islamic patterns
- **Smooth Animations** using Framer Motion
- **Card-based Layout** for better content organization

### User Experience
- **Intuitive Navigation** with clear section indicators
- **Loading States** for better perceived performance
- **Error Handling** with fallback content
- **Accessibility** features for screen readers
- **Touch Gestures** for mobile interactions

## 🔊 Audio Features

### Quran Recitation
- **High-quality MP3 streams** from reliable sources
- **Custom Audio Controls** with Islamic styling
- **Progress Tracking** with time display
- **Auto-loading** of audio files
- **Error Handling** for network issues

### Prayer Notifications
- **Custom Sound Generation** using Web Audio API
- **Volume Control** and sound preferences
- **Browser Integration** with native notifications
- **Silent Mode** option for different environments

## 🔒 Privacy & Data

### Local Storage
- **Profile pictures** stored locally as base64
- **Theme preferences** saved in localStorage
- **No server-side data collection**
- **Complete user privacy**

### External APIs
- **Aladhan API** for prayer times (read-only)
- **YouTube** for Islamic video content
- **No user data sent** to external services

## 🌐 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aladhan API** for accurate prayer times
- **Islamic Community** for inspiration and guidance
- **Open Source Contributors** for amazing libraries
- **Muslim Developers** building tools for the Ummah

## 📞 Support

If you encounter any issues or have questions:
- Check the browser console for error messages
- Ensure JavaScript is enabled
- Verify internet connection for prayer times and audio
- Contact support for technical assistance

---

**"وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"**  
*"And whoever fears Allah - He will make for him a way out"* - Quran 65:2

Built with ❤️ for the Muslim community
