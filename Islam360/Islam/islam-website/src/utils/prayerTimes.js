import axios from "axios";

// City coordinates
const CITIES = {
  gujranwala: {
    name: "Gujranwala",
    lat: 32.1877,
    lng: 74.1945,
  },
  lahore: {
    name: "Lahore",
    lat: 31.5204,
    lng: 74.3587,
  },
  islamabad: {
    name: "Islamabad",
    lat: 33.6844,
    lng: 73.0479,
  },
};

// Default city
let currentCity = localStorage.getItem("selectedCity") || "gujranwala";

// Set current city
export const setCurrentCity = (city) => {
  if (CITIES[city]) {
    currentCity = city;
    localStorage.setItem("selectedCity", city);
  }
};

// Get current city
export const getCurrentCity = () => currentCity;

// Get available cities
export const getAvailableCities = () => CITIES;

// Fetch prayer times from Aladhan API
export const getPrayerTimes = async (date = new Date(), city = currentCity) => {
  try {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const cityData = CITIES[city] || CITIES.gujranwala;

    const response = await axios.get(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}`,
      {
        params: {
          latitude: cityData.lat,
          longitude: cityData.lng,
          method: 1, // University of Islamic Sciences, Karachi
          school: 1, // Hanafi
        },
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
      city: cityData.name,
    };
  } catch (error) {
    console.error("Error fetching prayer times:", error);

    // Fallback prayer times
    const fallbackTimes = {
      gujranwala: {
        Fajr: "03:46",
        Dhuhr: "12:10",
        Asr: "15:00",
        Maghrib: "19:02",
        Isha: "20:34",
      },
      lahore: {
        Fajr: "03:49",
        Dhuhr: "12:09",
        Asr: "15:49",
        Maghrib: "18:58",
        Isha: "20:29",
      },
      islamabad: {
        Fajr: "03:48",
        Dhuhr: "12:10",
        Asr: "15:51",
        Maghrib: "19:00",
        Isha: "20:32",
      },
    };

    const cityData = CITIES[city] || CITIES.gujranwala;
    const times = fallbackTimes[city] || fallbackTimes.gujranwala;

    return {
      ...times,
      date: date.toLocaleDateString(),
      city: cityData.name,
    };
  }
};

// Determine current and next prayer
export const getCurrentPrayer = (prayerTimes) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: "Fajr", time: convertToMinutes(prayerTimes.Fajr) },
    { name: "Dhuhr", time: convertToMinutes(prayerTimes.Dhuhr) },
    { name: "Asr", time: convertToMinutes(prayerTimes.Asr) },
    { name: "Maghrib", time: convertToMinutes(prayerTimes.Maghrib) },
    { name: "Isha", time: convertToMinutes(prayerTimes.Isha) },
  ];

  for (let i = 0; i < prayers.length; i++) {
    if (currentTime < prayers[i].time) {
      return {
        current: i > 0 ? prayers[i - 1] : prayers[prayers.length - 1],
        next: prayers[i],
        timeRemaining: prayers[i].time - currentTime,
      };
    }
  }

  // After Isha → Next is Fajr of next day
  return {
    current: prayers[prayers.length - 1],
    next: prayers[0],
    timeRemaining: 1440 - currentTime + prayers[0].time, // 1440 = minutes in a day
  };
};

// Prayer notification (if next prayer is within 5 mins)
export const getNextPrayerNotification = (prayerTimes) => {
  const prayerInfo = getCurrentPrayer(prayerTimes);
  const timeRemaining = prayerInfo.timeRemaining;

  if (timeRemaining <= 5) {
    return {
      shouldNotify: true,
      message: `${prayerInfo.next.name} prayer time is in ${timeRemaining} minutes`,
      prayerName: prayerInfo.next.name,
    };
  }

  return { shouldNotify: false };
};

// Helper: convert HH:mm to total minutes
const convertToMinutes = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper: format minutes into readable time
export const formatTimeRemaining = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};