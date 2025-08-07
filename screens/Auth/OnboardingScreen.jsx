import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';
import mascootii from "../../assets/image/mascootii1.png";

const OnboardingScreen = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const kivvySparkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize TTS safely
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.1);
        Tts.speak("Hi! I’m Kiwi and this is Chiku. My friend, what is your age?");
      })
      .catch(err => {
        console.log("TTS initialization failed:", err);
      });

    // Loop sparkle animation for Kivvy text
    Animated.loop(
      Animated.sequence([
        Animated.timing(kivvySparkle, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(kivvySparkle, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSelectAge = (age) => {
    setSelectedAge(age);

    // Bounce effect
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    // Sparkle animation
    sparkleAnim.setValue(0);
    Animated.timing(sparkleAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      {/* Top Section */}
      <View style={styles.topSection}>
        <Image source={mascootii} style={styles.mascots} resizeMode="contain" />
        <Text style={styles.title}>
          Welcome to 
          <Animated.Text
            style={[styles.kivvyHighlight, { opacity: kivvySparkle }]}
          >
            {" "}Kivvy 🎉
          </Animated.Text>
        </Text>
        <Text style={styles.subtitle}>
          Hi 👋 I’m <Text style={styles.kiwi}>Kiwi</Text> & this is <Text style={styles.chiku}>Chiku</Text>!
          Let’s make learning fun together.
        </Text>
      </View>

      {/* Thought Bubble */}
      <View style={styles.thoughtBubbleWrapper}>
  <View style={styles.thoughtBubble}>
    <Text style={styles.bubbleText}>My friend, what is your age?</Text>
  </View>
  <View style={styles.bubbleTail} />
</View>

      {/* Age Selection Section */}
      <View style={styles.bottomSection}>
        <View style={styles.bubbleWrapper}>
          {[4,5,6,7,8,9,10,11].map((age) => (
            <Animated.View
              key={age}
              style={[
                styles.bubble,
                selectedAge === age && styles.selectedBubble,
                selectedAge === age && { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity onPress={() => handleSelectAge(age)}>
                <Text style={styles.bubbleTextNumber}>{age}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Sparkle Effect */}
        {selectedAge && (
          <Animated.View
            style={[
              styles.sparkleWrapper,
              {
                opacity: sparkleAnim,
                transform: [{ scale: sparkleAnim }],
              },
            ]}
          >
            <Ionicons name="sparkles" size={50} color="#FFD700" />
          </Animated.View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.ctaButton, !selectedAge && { backgroundColor: '#ccc' }]}
          disabled={!selectedAge}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6BD60' },
  topSection: { flex: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  mascots: { width: 200, height: 200, marginBottom: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  kivvyHighlight: { color: '#F28482', fontWeight: '900' },
  subtitle: { fontSize: 18, color: '#444', textAlign: 'center', lineHeight: 26 },
  kiwi: { color: '#2A9D8F', fontWeight: '800' },
  chiku: { color: '#E76F51', fontWeight: '800' },

  // Bubble wrapper
  thoughtBubbleWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  thoughtBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    alignSelf: 'center',
    marginTop: -3,
  },
  bubbleText: { fontSize: 16, color: '#333', fontWeight: '600', textAlign: 'center' },

  bottomSection: { flex: 1.5, padding: 25, alignItems: 'center', justifyContent: 'center' },
  bubbleWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 25 },
  bubble: { backgroundColor: '#F28482', width: 60, height: 60, borderRadius: 30, margin: 10, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  selectedBubble: { backgroundColor: '#84A59D', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  bubbleTextNumber: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sparkleWrapper: { position: 'absolute', top: '45%' },
  ctaButton: { backgroundColor: '#DE3734', paddingVertical: 14, paddingHorizontal: 60, borderRadius: 20 },
  ctaText: { fontSize: 20, color: '#fff', fontWeight: '700' },
});

