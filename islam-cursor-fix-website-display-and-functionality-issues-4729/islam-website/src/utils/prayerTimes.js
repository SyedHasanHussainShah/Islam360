import axios from 'axios';

// City coordinates
const CITIES = {
  gujranwala: {
    name: 'Gujranwala',
    lat: 32.1877,
    lng: 74.1945
  },
  lahore: {
    name: 'Lahore',
    lat: 31.5204,
    lng: 74.3587
  },
  islamabad: {
    name: 'Islamabad',
    lat: 33.6844,
    lng: 73.0479
  }
};

// Default city
let currentCity = 'gujranwala';

export const setCurrentCity = (city) => {
  if (CITIES[city]) {
    currentCity = city;
    localStorage.setItem('selectedCity', city);
  }
};

export const getCurrentCity = () => {
  return currentCity;
};

export const getAvailableCities = () => {
  return CITIES;
};

export const getPrayerTimes = async (date = new Date(), city = currentCity) => {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const cityData = CITIES[city] || CITIES.gujranwala;
    
    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}`,
      {
        params: {
          latitude: cityData.lat,
          longitude: cityData.lng,
          method: 1, // University of Islamic Sciences, Karachi
          school: 1, // Hanafi
        }
      }
    );

    const timings = response.data.data.timings;
    
    return {
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
      date: response.data.data.date.readable,
      city: cityData.name
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Fallback prayer times for the selected city with corrected 12-hour format times
    const fallbackTimes = {
      gujranwala: {
        Fajr: '03:46',
        Dhuhr: '12:10',
        Asr: '17:00',
        Maghrib: '19:02',
        Isha: '20:34'
      },
      lahore: {
        Fajr: '03:48',
        Dhuhr: '12:10',
        Asr: '15:51',
        Maghrib: '19:00',
        Isha: '20:32'
      },
      islamabad: {
        Fajr: '03:47',
        Dhuhr: '12:14',
        Asr: '15:58',
        Maghrib: '19:07',
        Isha: '20:42'
      }
    };
    
    const cityData = CITIES[city] || CITIES.gujranwala;
    const times = fallbackTimes[city] || fallbackTimes.gujranwala;
    
    return {
      ...times,
      date: date.toLocaleDateString(),
      city: cityData.name
    };
  }
};

export const getCurrentPrayer = (prayerTimes) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: convertToMinutes(prayerTimes.Fajr) },
    { name: 'Dhuhr', time: convertToMinutes(prayerTimes.Dhuhr) },
    { name: 'Asr', time: convertToMinutes(prayerTimes.Asr) },
    { name: 'Maghrib', time: convertToMinutes(prayerTimes.Maghrib) },
    { name: 'Isha', time: convertToMinutes(prayerTimes.Isha) }
  ];
  
  // Find current prayer period
  let currentPrayerIndex = -1;
  let nextPrayerIndex = 0;
  
  for (let i = 0; i < prayers.length; i++) {
    if (currentTime >= prayers[i].time) {
      currentPrayerIndex = i;
    } else {
      nextPrayerIndex = i;
      break;
    }
  }
  
  // If we're past all prayers today, next is Fajr tomorrow
  if (currentPrayerIndex === prayers.length - 1 && currentTime >= prayers[prayers.length - 1].time) {
    return {
      current: prayers[prayers.length - 1],
      next: prayers[0],
      timeRemaining: (24 * 60) + prayers[0].time - currentTime
    };
  }
  
  // If before Fajr, we're in Isha period from previous day
  if (currentPrayerIndex === -1) {
    return {
      current: prayers[prayers.length - 1], // Isha from yesterday
      next: prayers[0], // Fajr today
      timeRemaining: prayers[0].time - currentTime
    };
  }
  
  return {
    current: prayers[currentPrayerIndex],
    next: prayers[nextPrayerIndex],
    timeRemaining: prayers[nextPrayerIndex].time - currentTime
  };
};

export const getNextPrayerNotification = (prayerTimes) => {
  const prayerInfo = getCurrentPrayer(prayerTimes);
  const timeRemaining = prayerInfo.timeRemaining;
  
  if (timeRemaining <= 5) { // 5 minutes before prayer
    return {
      shouldNotify: true,
      message: `${prayerInfo.next.name} prayer time is in ${timeRemaining} minutes`,
      prayerName: prayerInfo.next.name
    };
  }
  
  return { shouldNotify: false };
};

const convertToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTimeRemaining = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};