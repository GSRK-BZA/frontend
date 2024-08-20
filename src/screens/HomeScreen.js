import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import AlarmList from '../components/AlarmList';
import AddAlarmButton from '../components/AddAlarmButton';
import { getAlarms, toggleAlarm, deleteAlarm } from '../services/AlarmService';
import { logout } from '../services/AuthService';

const HomeScreen = ({ navigation }) => {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    const loadedAlarms = await getAlarms();
    setAlarms(loadedAlarms);
  };

  const handleAddAlarm = () => {
    navigation.navigate('Map');
  };

  const handleEditAlarm = (alarm) => {
    navigation.navigate('Map', { editingAlarm: alarm });
  };

  const handleToggleAlarm = async (alarmId) => {
    await toggleAlarm(alarmId);
    loadAlarms();
  };

  const handleDeleteAlarm = async (alarmId) => {
    await deleteAlarm(alarmId);
    loadAlarms();
  };

 const handleLogout = async () => {
  console.log('Logout button pressed');
  const success = await logout();
  if (success) {
    console.log('Logout successful');
    navigation.replace('Login');
  } else {
    console.log('Logout failed');
  }
};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleLogout} title="Logout" color="#b10ce8" />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AlarmList
        alarms={alarms}
        onEditAlarm={handleEditAlarm}
        onToggleAlarm={handleToggleAlarm}
        onDeleteAlarm={handleDeleteAlarm}
      />
      <AddAlarmButton onPress={handleAddAlarm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});

export default HomeScreen;
