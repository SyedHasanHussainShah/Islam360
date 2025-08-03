import axios from 'axios';

// City coordinates
const CITIES = {
  lahore: {
    name: 'Lahore',
    lat: 31.5204,
    lng: 74.3587
  },
  islamabad: {
    name: 'Islamabad',
    lat: 33.6844,
    lng: 73.0479
  },
  gujranwala: {
    name: 'Gujranwala',
    lat: 32.1877,
    lng: 74.1945
  }
};

// Default city
let currentCity = 'lahore';

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
    
    const cityData = CITIES[city] || CITIES.lahore;
    
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
    // Fallback prayer times for the selected city
    const fallbackTimes = {
      lahore: {
        Fajr: '03:49',
        Dhuhr: '12:09',
        Asr: '16:58',
        Maghrib: '18:57',
        Isha: '20:28'
      },
      islamabad: {
        Fajr: '03:48',
        Dhuhr: '12:10',
        Asr: '15:51',
        Maghrib: '19:00',
        Isha: '20:32'
      },
      gujranwala: {
        Fajr: '03:46',
        Dhuhr: '12:10',
        Asr: '17:00',
        Maghrib: '19:02',
        Isha: '20:34'
      }
    };
    
    const cityData = CITIES[city] || CITIES.lahore;
    const times = fallbackTimes[city] || fallbackTimes.lahore;
    
    return {
      ...times,
      date: date.toLocaleDateString(),
      city: cityData.name
    };
  }
};

export const getCurrentPrayer = (prayerTimes) => {
  // Get current time in Pakistan Standard Time (UTC+5)
  const now = new Date();
  const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000)); // Add 5 hours for PST
  const currentTime = pakistanTime.getHours() * 60 + pakistanTime.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: convertToMinutes(prayerTimes.Fajr) },
    { name: 'Dhuhr', time: convertToMinutes(prayerTimes.Dhuhr) },
    { name: 'Asr', time: convertToMinutes(prayerTimes.Asr) },
    { name: 'Maghrib', time: convertToMinutes(prayerTimes.Maghrib) },
    { name: 'Isha', time: convertToMinutes(prayerTimes.Isha) }
  ];
  
  // Find which prayer period we're currently in
  let currentPrayerIndex = -1;
  let nextPrayerIndex = 0;
  
  // Check if we're between prayers
  for (let i = 0; i < prayers.length; i++) {
    const nextIndex = (i + 1) % prayers.length;
    const currentPrayerTime = prayers[i].time;
    let nextPrayerTime = prayers[nextIndex].time;
    
    // Handle overnight period (Isha to Fajr)
    if (nextIndex === 0) {
      nextPrayerTime += 24 * 60; // Add 24 hours for next day Fajr
    }
    
    // Check if current time is between this prayer and the next
    if (currentTime >= currentPrayerTime && 
        (nextIndex !== 0 ? currentTime < nextPrayerTime : currentTime < prayers[nextIndex].time || currentTime >= currentPrayerTime)) {
      currentPrayerIndex = i;
      nextPrayerIndex = nextIndex;
      break;
    }
  }
  
  // If we're before Fajr (early morning), we're in Isha period from previous day
  if (currentPrayerIndex === -1 && currentTime < prayers[0].time) {
    currentPrayerIndex = 4; // Isha
    nextPrayerIndex = 0; // Fajr
  }
  
  // Calculate time remaining to next prayer
  let timeRemaining;
  if (nextPrayerIndex === 0 && currentPrayerIndex === 4) {
    // From Isha to Fajr next day
    timeRemaining = (24 * 60) + prayers[0].time - currentTime;
  } else {
    timeRemaining = prayers[nextPrayerIndex].time - currentTime;
  }
  
  return {
    current: prayers[currentPrayerIndex] || null,
    next: prayers[nextPrayerIndex],
    timeRemaining: Math.max(0, timeRemaining),
    currentTimeInPST: `${String(pakistanTime.getHours()).padStart(2, '0')}:${String(pakistanTime.getMinutes()).padStart(2, '0')}`
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

// Helper function to check if we're currently in a specific prayer time
export const isCurrentPrayerTime = (prayerName, prayerTimes) => {
  // Get current time in Pakistan Standard Time (UTC+5)
  const now = new Date();
  const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
  const currentTime = pakistanTime.getHours() * 60 + pakistanTime.getMinutes();
  
  const prayerTime = convertToMinutes(prayerTimes[prayerName]);
  
  // Consider it "current" if we're within 5 minutes of the prayer time
  // OR if we're in the prayer period and it's the exact prayer time
  const timeDifference = Math.abs(currentTime - prayerTime);
  
  if (timeDifference <= 5) {
    return true;
  }
  
  // Also check if this is the active prayer period
  const currentPrayerInfo = getCurrentPrayer(prayerTimes);
  return currentPrayerInfo.current && currentPrayerInfo.current.name === prayerName;
};

// Helper function to check if a prayer is the next upcoming prayer
export const isNextPrayerTime = (prayerName, prayerTimes) => {
  const currentPrayerInfo = getCurrentPrayer(prayerTimes);
  return currentPrayerInfo.next && currentPrayerInfo.next.name === prayerName;
};

// Helper function to check if it's exactly prayer time (within 1 minute)
export const isExactPrayerTime = (prayerName, prayerTimes) => {
  // Get current time in Pakistan Standard Time (UTC+5)
  const now = new Date();
  const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
  const currentTime = pakistanTime.getHours() * 60 + pakistanTime.getMinutes();
  
  const prayerTime = convertToMinutes(prayerTimes[prayerName]);
  
  // Consider it exact prayer time if we're within 1 minute
  return Math.abs(currentTime - prayerTime) <= 1;
};