import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

const BASE_URL = 'http://192.168.29.225:5000'; // Replace with your PC IP

export default function WorkerPage({ navigation }) {
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between login & signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Check required fields
    if (!formData.email || !formData.password || (!isSignIn && (!formData.name || !formData.department))) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const url = isSignIn
      ? `${BASE_URL}/worker/login`
      : `${BASE_URL}/worker/signup`;

    const payload = isSignIn
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isSignIn) {
          Alert.alert('Login Success', `Welcome ${data.worker.name}!`);
          // Navigate to ServicePage and pass department
          navigation.navigate('ServicePage', { department: data.worker.department });
        } else {
          Alert.alert('Signup Success', data.message || 'Worker registered!');
          setIsSignIn(true); // Switch to login after signup
          setFormData({ name: '', email: '', password: '', department: '' });
        }
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server not reachable');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isSignIn ? 'Worker Login' : 'Worker Sign Up'}</Text>

      {!isSignIn && (
        <>
          <TextInput
            placeholder="Name"
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Department"
            value={formData.department}
            onChangeText={text => handleChange('department', text)}
            style={styles.input}
          />
        </>
      )}

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={text => handleChange('email', text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={isSignIn ? 'Login' : 'Register'}
        onPress={handleSubmit}
      />

      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
        <Text style={styles.toggleText}>
          {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  toggleText: { color: 'blue', marginTop: 15, textAlign: 'center' },
});
