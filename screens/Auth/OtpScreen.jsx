import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');
const otpLength = 4;

const keypadLayout = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['delete', '0', 'send'],
];

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

 const handleKeypadInput = (key) => {
  if (key === 'delete') {
    setOtp((prevOtp) => prevOtp.slice(0, -1));
  } else if (key === 'send') {
    console.log('Verifying OTP:', otp);
    if (otp.length === otpLength) {
      // TODO: yaha real OTP verify API call kare
      navigation.navigate('introduction'); // ✅ Dashboard pe redirect
    } else {
      alert('Please enter complete OTP');
    }
  } else if (otp.length < otpLength && key.match(/[0-9]/)) {
    setOtp((prevOtp) => prevOtp + key);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a code to verify your email id on
          <Text style={styles.emailText}> john.honai@apple.com</Text>
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpContainer}>
          {Array(otpLength).fill('').map((_, index) => (
            <View key={index} style={styles.otpInputBox}>
              <Text style={styles.otpInputText}>{otp[index] || ''}</Text>
            </View>
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.resendLink}>Tap to Resend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypadContainer}>
        {keypadLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, colIndex) => {
              const isNumber = key.match(/[0-9]/);
              const isDelete = key === 'delete';
              const isSend = key === 'send';

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.keypadButton,
                    isDelete && styles.deleteButton,
                    isSend && styles.sendButton,
                  ]}
                  onPress={() => handleKeypadInput(key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.keypadButtonText,
                      isDelete && styles.deleteButtonText,
                      isSend && styles.sendButtonText,
                    ]}
                  >
                    {isDelete ? '⌫' : isSend ? '→' : key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EDE2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 45,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.7,
    marginBottom: 15,
  },
  otpInputBox: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  otpInputText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  resendText: {
    fontSize: 14,
    color: '#555',
  },
  resendLink: {
    fontSize: 14,
    color: '#F28482',
    fontWeight: 'bold',
  },
  keypadContainer: {
    width: width * 0.8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  keypadButton: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  keypadButtonText: {
    fontSize: 26,
    color: '#333',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F7EDE2',
  },
  deleteButtonText: {
    fontSize: 22,
    color: '#F28482',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#84A59D',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sendButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});
