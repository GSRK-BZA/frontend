import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '../components/Map';
import { saveAlarm, updateAlarm } from '../services/AlarmService';

const MapScreen = ({ route, navigation }) => {
  const { editingAlarm } = route.params || {};

  const handleSaveAlarm = async (alarmData) => {
    if (editingAlarm) {
      await updateAlarm(editingAlarm.id, alarmData);
    } else {
      await saveAlarm(alarmData);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Map
        onSaveAlarm={handleSaveAlarm}
        editingAlarm={editingAlarm}
        alarms={[]} // You might want to pass all alarms here
        onToggleAlarm={() => {}} // Implement if needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;