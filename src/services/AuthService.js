import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.51.2.105:3000';

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    console.log('Registration response:', response.data);
    return response.status === 201;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { token } = response.data;
    await AsyncStorage.setItem('userToken', token);
    return true;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return false;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};


export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};