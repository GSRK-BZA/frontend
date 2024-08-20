import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';
import { getAlarms } from './AlarmService';

let watchId = null;
const LOCATION_UPDATE_INTERVAL = 60000; // 1 minute

export const startLocationTracking = (onLocationUpdate) => {
  if (watchId === null) {
    watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationUpdate({ latitude, longitude });
        checkAlarms({ latitude, longitude });
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: LOCATION_UPDATE_INTERVAL }
    );

    BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationUpdate({ latitude, longitude });
          checkAlarms({ latitude, longitude });
        },
        (error) => console.error('Error getting location in background:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, LOCATION_UPDATE_INTERVAL);
  }
};

export const stopLocationTracking = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
  BackgroundTimer.stopBackgroundTimer();
};

const checkAlarms = async (currentLocation) => {
  const alarms = await getAlarms();
  alarms.forEach((alarm) => {
    if (alarm.active) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        alarm.latitude,
        alarm.longitude
      );
      if (distance <= alarm.radius) {
        triggerAlarm(alarm);
      }
    }
  });
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const triggerAlarm = (alarm) => {
  // Implement your alarm triggering logic here
  console.log(`Alarm triggered: ${alarm.name}`);
  // You can use react-native-push-notification or any other method to alert the user
};