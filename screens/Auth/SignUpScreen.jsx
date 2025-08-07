import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// Assets
import mascootii from '../../assets/image/mascootii1.png';
import google from '../../assets/icon/google.png';
import apple from '../../assets/icon/apple.png';
import mail from '../../assets/icon/gmail.png';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      {/* Top Section */}
      <View style={styles.topSection}>
        <Image source={mascootii} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.title}>Let’s Get Started 🚀</Text>
        <Text style={styles.subtitle}>
          Join <Text style={styles.brand}>Kivvy</Text> to make learning fun with{' '}
          <Text style={styles.kiwi}>Kiwi</Text> & <Text style={styles.chiku}>Chiku</Text>!
        </Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.prompt}>
          Parent, please create an account to start the fun!
        </Text>

        {/* Google */}
        <TouchableOpacity style={styles.unifiedButton}>
          <Image source={google} style={styles.icon} />
          <Text style={styles.unifiedBtnText}>Sign up with Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={styles.unifiedButton}>
          <Image source={apple} style={[styles.icon, { tintColor: '#fff' }]} />
          <Text style={styles.unifiedBtnText}>Sign up with Apple</Text>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          style={styles.unifiedButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Image source={mail} style={[styles.icon, { tintColor: '#fff' }]} />
          <Text style={styles.unifiedBtnText}>Sign up with Email</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerText}>
          <Text style={styles.footerNormal}>Already a user? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6BD60',
  },
  topSection: {
    flex: 1.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mascot: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  brand: {
    color: '#F28482',
    fontWeight: 'bold',
  },
  kiwi: {
    color: '#84A59D',
    fontWeight: 'bold',
  },
  chiku: {
    color: '#F28482',
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 1.2,
    backgroundColor: '#F7EDE2',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  prompt: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  unifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.7,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: '#84A59D',
    borderWidth: 1,
    borderColor: '#84A59D',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 15,
  },
  unifiedBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  footerText: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footerNormal: {
    color: '#555',
    fontSize: 14,
  },
  footerLink: {
    color: '#F28482',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
