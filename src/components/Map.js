import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to set alarms.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Denied',
          'Location permission was denied permanently. Please enable it in the app settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  return true;
};

const Map = ({ onSaveAlarm, editingAlarm, alarms }) => {
  const [selectedPosition, setSelectedPosition] = useState(editingAlarm ? { latitude: editingAlarm.latitude, longitude: editingAlarm.longitude } : null);
  const [radius, setRadius] = useState(editingAlarm ? editingAlarm.radius : 1);
  const [alarmName, setAlarmName] = useState(editingAlarm ? editingAlarm.name : '');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          position => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.log('Geolocation error:', error);
            Alert.alert('Error', 'Unable to retrieve location. Please check your location settings.');
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    };

    getLocation();
  }, []);

  const handleMapPress = (event) => {
    setSelectedPosition(event.nativeEvent.coordinate);
  };

  const handleSaveAlarm = () => {
    if (selectedPosition && alarmName) {
      onSaveAlarm({
        name: alarmName,
        latitude: selectedPosition.latitude,
        longitude: selectedPosition.longitude,
        radius: radius,
        active: true,
      });
    } else {
      Alert.alert('Error', 'Please select a location and enter an alarm name.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 37.78825,
          longitude: currentLocation ? currentLocation.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="You are here" />
        )}
        {selectedPosition && (
          <>
            <Marker coordinate={selectedPosition} />
            <Circle
              center={selectedPosition}
              radius={radius * 1000}
              fillColor="rgba(0, 0, 255, 0.2)"
              strokeColor="rgba(0, 0, 255, 0.5)"
            />
          </>
        )}
        {alarms.map(alarm => (
          <Circle
            key={alarm.id}
            center={{ latitude: alarm.latitude, longitude: alarm.longitude }}
            radius={alarm.radius * 1000}
            fillColor={alarm.active ? "rgba(255, 0, 0, 0.2)" : "rgba(128, 128, 128, 0.2)"}
            strokeColor={alarm.active ? "rgba(255, 0, 0, 0.5)" : "rgba(128, 128, 128, 0.5)"}
          />
        ))}
      </MapView>
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, { color: '#b10ce8' }]}
          value={alarmName}
          onChangeText={setAlarmName}
          placeholder="Alarm Name"
          placeholderTextColor="black"
        />
        <TextInput
          style={[styles.input, { color: '#b10ce8' }]}
          value={radius.toString()}
          onChangeText={(text) => setRadius(Number(text))}
          keyboardType="numeric"
          placeholder="Radius (km)"
          placeholderTextColor="black"
        />
        <Button
          title={editingAlarm ? 'Update Alarm' : 'Save Alarm'}
          onPress={handleSaveAlarm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  formContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default Map;
