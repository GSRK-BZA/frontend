import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const AlarmList = ({ alarms, onEditAlarm, onToggleAlarm, onDeleteAlarm }) => {
  const renderAlarmItem = ({ item }) => (
    <View style={styles.alarmItem}>
      <Text style={styles.alarmName}>{item.name}</Text>
      <Text>Radius: {item.radius} km</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => onEditAlarm(item)} style={styles.button}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onToggleAlarm(item.id)} style={styles.button}>
          <Text>{item.active ? 'Deactivate' : 'Activate'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteAlarm(item.id)} style={styles.button}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={alarms}
      renderItem={renderAlarmItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  alarmItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  alarmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});

export default AlarmList;