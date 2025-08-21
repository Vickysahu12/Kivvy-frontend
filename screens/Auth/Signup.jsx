import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, StatusBar,
  Image, TextInput, TouchableOpacity, Dimensions, Alert
} from 'react-native';
import API from '../../api/api'; // apne api.js ka path
import mascootii from '../../assets/image/mascootii1.png';
import personIcon from '../../assets/icon/user.png';
import mailIcon from '../../assets/icon/mail.png';
import lockIcon from '../../assets/icon/padlock.png';
import cameraIcon from '../../assets/icon/camera.png';

const { width } = Dimensions.get('window');

const SignupFormScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSignup = async () => {
  //   if (!username || !email || !password || !confirmPassword) {
  //     Alert.alert('Error', 'Please fill all fields');
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     Alert.alert('Error', 'Passwords do not match');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await API.post('/api/auth/signup', {
  //       username,
  //       email,
  //       password
  //     });

  //     Alert.alert('Success', res.data.message || 'Signup successful!');
      navigation.navigate('OtpScreen', { email });
  //   } catch (err) {
  //     console.error('Signup error:', err.message);
  //     Alert.alert(
  //       'Signup Failed',
  //       err.response?.data?.detail || err.message || 'Something went wrong'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      <View style={styles.topSection}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Enter the following details</Text>

        <View style={styles.imageContainer}>
          <Image source={mascootii} style={styles.mascotImage} resizeMode="contain" />
          <TouchableOpacity style={styles.cameraIcon}>
            <Image source={cameraIcon} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputContainer}>
          <Image source={personIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={mailIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#555"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={lockIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={lockIcon} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#555"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          //onPress={handleSignup}
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'REGISTERING...' : 'REGISTER'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupFormScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6BD60' },
  topSection: { flex: 1, alignItems: 'center', paddingTop: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#444', marginBottom: 20 },
  imageContainer: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#F28482',
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
    marginTop: 20, backgroundColor: '#F7EDE2', position: 'relative'
  },
  mascotImage: { width: '120%', height: '120%', top: 10 },
  cameraIcon: {
    position: 'absolute', bottom: 5, right: 5, width: 30, height: 30,
    borderRadius: 15, backgroundColor: '#84A59D', justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: '#F7EDE2'
  },
  iconStyle: { width: 16, height: 16, tintColor: '#fff' },
  formSection: {
    flex: 1.5, backgroundColor: '#F6BD60',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    padding: 25, alignItems: 'center', paddingTop: 40
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    width: width * 0.85, height: 50,
    backgroundColor: '#F7EDE2', borderRadius: 25,
    paddingHorizontal: 20, marginBottom: 15, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
  },
  inputIcon: { width: 20, height: 20, marginRight: 10, tintColor: '#84A59D' },
  input: { flex: 1, fontSize: 16, color: '#333' },
  registerButton: {
    width: width * 0.85, paddingVertical: 15, borderRadius: 25,
    backgroundColor: '#84A59D', marginTop: 20, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4
  },
  registerButtonText: {
    fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center'
  }
});
