import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_STORAGE_KEY = '@alarms';

export const getAlarms = async () => {
  try {
    const alarmsJson = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
    return alarmsJson ? JSON.parse(alarmsJson) : [];
  } catch (error) {
    console.error('Error getting alarms:', error);
    return [];
  }
};

export const saveAlarm = async (alarm) => {
  try {
    const alarms = await getAlarms();
    const newAlarm = { ...alarm, id: Date.now().toString() };
    alarms.push(newAlarm);
    await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
    return newAlarm;
  } catch (error) {
    console.error('Error saving alarm:', error);
    return null;
  }
};

export const updateAlarm = async (alarmId, updatedAlarm) => {
  try {
    const alarms = await getAlarms();
    const index = alarms.findIndex((alarm) => alarm.id === alarmId);
    if (index !== -1) {
      alarms[index] = { ...alarms[index], ...updatedAlarm };
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
      return alarms[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating alarm:', error);
    return null;
  }
};

export const deleteAlarm = async (alarmId) => {
  try {
    const alarms = await getAlarms();
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== alarmId);
    await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(updatedAlarms));
    return true;
  } catch (error) {
    console.error('Error deleting alarm:', error);
    return false;
  }
};

export const toggleAlarm = async (alarmId) => {
  try {
    const alarms = await getAlarms();
    const index = alarms.findIndex((alarm) => alarm.id === alarmId);
    if (index !== -1) {
      alarms[index].active = !alarms[index].active;
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
      return alarms[index];
    }
    return null;
  } catch (error) {
    console.error('Error toggling alarm:', error);
    return null;
  }
};