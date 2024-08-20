import { Alert, Vibration } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { checkLocationPermission, requestLocationPermission } from '../utils/Permissions';

export const startLocationTracking = async (alarms) => {
  const hasPermission = await checkLocationPermission() || await requestLocationPermission();
  
  if (!hasPermission) {
    Alert.alert('Permission denied', 'Location permission is required to track alarms.');
    return;
  }

  setInterval(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        alarms.forEach(alarm => {
          const distance = getDistanceFromLatLonInKm(latitude, longitude, alarm.latitude, alarm.longitude);
          if (distance <= alarm.radius) {
            triggerAlarm(alarm);
          }
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, 15000);
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const triggerAlarm = (alarm) => {
  Vibration.vibrate([500, 500, 500]);
  Alert.alert('Alarm Triggered!', `You are within the radius of ${alarm.name}.`);
  // Here you can also play an alarm sound
};
