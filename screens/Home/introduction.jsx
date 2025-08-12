import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// TTS library import
import Tts from 'react-native-tts';

// ===== COLORS from previous code for consistency =====
const COLORS = {
  primary: '#F6BD60',
  secondary: '#F7EDE2',
  text: '#333333',
  white: '#FFFFFF',
};

// Yahan aap apne mascot ki image import karein
// File path ko apne project ke hisaab se adjust karein
import mascooti from "../../assets/image/mascootii1.png";

const IntroductionScreen = ({ navigation }) => {
  useEffect(() => {
    // Initialize TTS safely and start speaking
    Tts.getInitStatus()
      .then(() => {
        // Set language to Hindi for the new message
        Tts.setDefaultLanguage('hi-IN');
        // Set rate and pitch for a friendly, child-like voice
        Tts.setDefaultRate(0.5); 
        Tts.setDefaultPitch(1.9);
        // The message to be spoken
        Tts.speak("Hello dosto! Aapka swagat hai Kivvy ki anokhi duniya mein. Yahan padhai hogi fun andaz mein!");
      })
      .catch(err => {
        console.log("TTS initialization failed:", err);
      });
  }, []); // Empty dependency array means this runs only once on component mount

  return (
    <SafeAreaView style={styles.container}>
      {/* Background color aur status bar ka style */}
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      
      <View style={styles.contentContainer}>
        {/* Mascot ki image */}
        <Image source={mascooti} style={styles.mascotImage} />
        
        {/* Greeting message */}
        <Text style={styles.greetingText}>
          Hello dosto! Aapka swagat hai {'\n'}
          Kivvy ki anokhi duniya mein.
        </Text>
        
        <Text style={styles.subText}>
          Yahan padhai hogi mazedar andaz mein!
        </Text>

        {/* Dashoard par jaane ke liye button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => {
            console.log('Chalo, shuru karte hain!');
            // TTS ko band karein, agar woh abhi bhi chal raha ho
            Tts.stop();
            // Yahan se aapko Dashboard screen par navigate karna hai
            navigation.navigate('Dashboard');
          }}
        >
          <Text style={styles.startButtonText}>Chalo, shuru karte hain!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mascotImage: {
    width: 250, // Mascot ki size ko adjust karein
    height: 250,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#DE3734',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IntroductionScreen;
