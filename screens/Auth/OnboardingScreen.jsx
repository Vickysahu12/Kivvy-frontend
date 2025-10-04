import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  BackHandler,
  Alert,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';
import mascootii from "../../assets/image/mascootii1.png";

const OnboardingScreen = ({ navigation }) => {
  // State management
  const [selectedAge, setSelectedAge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Animation refs - same as original
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const kivvySparkle = useRef(new Animated.Value(0)).current;

  // Cleanup animations to prevent memory leaks
  const cleanupAnimations = useCallback(() => {
    scaleAnim.stopAnimation();
    sparkleAnim.stopAnimation();
    kivvySparkle.stopAnimation();
  }, [scaleAnim, sparkleAnim, kivvySparkle]);

  // Initialize TTS with error handling - NO AUTO-SPEAK
  const initializeTTS = useCallback(async () => {
    try {
      const status = await Tts.getInitStatus();
      console.log('TTS Status:', status);
      
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.4); // Slightly slower for kids
      Tts.setDefaultPitch(1.2);
      
      // Add event listeners
      Tts.addEventListener('tts-start', () => {
        console.log('TTS Started');
        setIsTtsPlaying(true);
      });
      
      Tts.addEventListener('tts-finish', () => {
        console.log('TTS Finished');
        setIsTtsPlaying(false);
      });
      
      Tts.addEventListener('tts-cancel', () => {
        console.log('TTS Cancelled');
        setIsTtsPlaying(false);
      });

      setTtsEnabled(true);
      
      // Check if screen reader is enabled
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setScreenReaderEnabled(isScreenReaderEnabled);
      
      // NO AUTO-SPEAK - Let user control when they want voice
      // User can tap the voice button to hear the question
      
    } catch (err) {
      console.log("TTS initialization failed:", err);
      setTtsEnabled(false);
    }
  }, []);

  // Stop TTS safely
  const stopTTS = useCallback(() => {
    if (ttsEnabled && isTtsPlaying) {
      try {
        Tts.stop();
        setIsTtsPlaying(false);
      } catch (error) {
        console.log('Error stopping TTS:', error);
      }
    }
  }, [ttsEnabled, isTtsPlaying]);

  useEffect(() => {
    let mounted = true;

    // Initialize TTS
    initializeTTS();

    // Start sparkle animation for Kivvy text - same as original
    Animated.loop(
      Animated.sequence([
        Animated.timing(kivvySparkle, { 
          toValue: 1, 
          duration: 1000, 
          useNativeDriver: true 
        }),
        Animated.timing(kivvySparkle, { 
          toValue: 0, 
          duration: 1000, 
          useNativeDriver: true 
        }),
      ])
    ).start();

    // Handle hardware back button (Android)
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   Alert.alert(
    //     'Exit Onboarding?',
    //     'Are you sure you want to go back?',
    //     [
    //       { text: 'Cancel', style: 'cancel' },
    //       { text: 'Yes', onPress: () => navigation.goBack() }
    //     ]
    //   );
    //   return true;
    // });

    return () => {
      mounted = false;
      cleanupAnimations();
      stopTTS();
      
      // Clean up TTS listeners
      try {
        Tts.removeAllListeners('tts-start');
        Tts.removeAllListeners('tts-finish');
        Tts.removeAllListeners('tts-cancel');
      } catch (error) {
        console.log('Error removing TTS listeners:', error);
      }
      
      //backHandler.remove();
    };
  }, [cleanupAnimations, stopTTS, initializeTTS, navigation]);

  // Handle age selection - same animation, better error handling
  const handleSelectAge = useCallback((age) => {
    if (isLoading) return;
    
    // Validate age range
    if (age < 4 || age > 11) {
      console.warn('Invalid age selected:', age);
      return;
    }

    setSelectedAge(age);

    // Stop current TTS
    stopTTS();

    // Same bounce effect as original
    Animated.sequence([
      Animated.timing(scaleAnim, { 
        toValue: 0.9, 
        duration: 120, 
        useNativeDriver: true 
      }),
      Animated.timing(scaleAnim, { 
        toValue: 1.1, 
        duration: 120, 
        useNativeDriver: true 
      }),
      Animated.timing(scaleAnim, { 
        toValue: 1, 
        duration: 120, 
        useNativeDriver: true 
      }),
    ]).start(() => {
      // Speak confirmation
      if (ttsEnabled && !screenReaderEnabled) {
        setTimeout(() => {
          Tts.speak(`Great! You are ${age} years old. Now let's continue!`);
        }, 300);
      }
    });

    // Same sparkle animation as original
    sparkleAnim.setValue(0);
    Animated.timing(sparkleAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
  }, [isLoading, scaleAnim, sparkleAnim, stopTTS, ttsEnabled, screenReaderEnabled]);

  // Manual TTS toggle function
  const handleTTSToggle = useCallback(() => {
    if (isTtsPlaying) {
      stopTTS();
    } else if (ttsEnabled && !screenReaderEnabled) {
      Tts.speak("Hi! I'm Kiwi and this is Chiku. My friend, what is your age?");
    }
  }, [isTtsPlaying, stopTTS, ttsEnabled, screenReaderEnabled]);
  const handleContinue = useCallback(async () => {
    if (!selectedAge || isLoading) return;

    setIsLoading(true);
    stopTTS();

    try {
      // Simulate API call - in production, save age to backend
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          // Simulate random failure for testing
          if (Math.random() > 0.9) {
            reject(new Error('Network error'));
          } else {
            resolve();
          }
        }, 1000);
      });

      // Navigate to next screen with age data
      navigation.navigate('SignUpScreen', {
        selectedAge: selectedAge,
        timestamp: new Date().toISOString(),
        fromOnboarding: true
      });

    } catch (error) {
      console.log('Error during continue:', error);
      setIsLoading(false);
      
      Alert.alert(
        'Oops! 😅',
        'Something went wrong. Let\'s try again!',
        [
          { 
            text: 'Try Again', 
            onPress: () => setIsLoading(false) 
          }
        ]
      );
      
      // Speak error message if TTS is enabled
      if (ttsEnabled && !screenReaderEnabled) {
        setTimeout(() => {
          Tts.speak("Oops! Something went wrong. Please try again.");
        }, 500);
      }
    }
  }, [selectedAge, isLoading, navigation, stopTTS, ttsEnabled, screenReaderEnabled]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      {/* Voice Control Button - Optional for user control */}
      {ttsEnabled && !screenReaderEnabled && (
        <TouchableOpacity 
          style={styles.voiceButton}
          onPress={handleTTSToggle}
          accessibilityLabel="Toggle voice guidance"
          accessibilityHint="Tap to play or stop voice guidance"
        >
          <Ionicons 
            name={isTtsPlaying ? "volume-high" : "volume-medium"} 
            size={24} 
            color="#2D3436" 
          />
        </TouchableOpacity>
      )}

      {/* Top Section - Same as original */}
      <View style={styles.topSection}>
        <Image 
          source={mascootii} 
          style={styles.mascots} 
          resizeMode="contain"
          onError={(error) => console.log('Mascot image load error:', error)}
          accessibilityLabel="Kiwi and Chiku, your learning companions"
        />
        <Text style={styles.title}>
          Welcome to 
          <Animated.Text
            style={[styles.kivvyHighlight, { opacity: kivvySparkle }]}
          >
            {" "}Kivvy 🎉
          </Animated.Text>
        </Text>
        <Text style={styles.subtitle}>
          Hi 👋 I'm <Text style={styles.kiwi}>Kiwi</Text> & this is <Text style={styles.chiku}>Chiku</Text>!
          Let's make learning fun together.
        </Text>
      </View>

      {/* Thought Bubble - Same as original */}
      <View style={styles.thoughtBubbleWrapper}>
        <View style={styles.thoughtBubble}>
          <Text 
            style={styles.bubbleText}
            accessibilityLabel="Question from Kiwi and Chiku: What is your age?"
          >
            My friend, what is your age?
          </Text>
        </View>
        <View style={styles.bubbleTail} />
      </View>

      {/* Age Selection Section - Same design, better accessibility */}
      <View style={styles.bottomSection}>
        <View 
          style={styles.bubbleWrapper}
          accessibilityLabel="Age selection buttons"
        >
          {[4,5,6,7,8,9,10,11].map((age) => (
            <Animated.View
              key={age}
              style={[
                styles.bubble,
                selectedAge === age && styles.selectedBubble,
                selectedAge === age && { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity 
                onPress={() => handleSelectAge(age)}
                disabled={isLoading}
                style={styles.bubbleTouchArea}
                accessibilityLabel={`Age ${age} years old`}
                accessibilityHint="Double tap to select this age"
                accessibilityRole="button"
                accessible={true}
              >
                <Text style={styles.bubbleTextNumber}>{age}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Sparkle Effect - Same as original */}
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

        {/* Continue Button - Enhanced with loading state */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.ctaButton, 
            !selectedAge && styles.ctaButtonDisabled,
            isLoading && styles.ctaButtonLoading
          ]}
          disabled={!selectedAge || isLoading}
          onPress={handleContinue}
          accessibilityLabel={isLoading ? "Loading, please wait" : "Continue to next step"}
          accessibilityHint={selectedAge ? "Double tap to proceed" : "Please select your age first"}
          accessibilityRole="button"
        >
          <Text style={[styles.ctaText, isLoading && styles.ctaTextLoading]}>
            {isLoading ? 'Please wait...' : 'Continue'}
          </Text>
          {isLoading && (
            <Ionicons 
              name="hourglass-outline" 
              size={20} 
              color="#fff" 
              style={styles.loadingIcon} 
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

// Styles - Same as original with minor enhancements
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F6BD60' 
  },
  topSection: { 
    flex: 1.5, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  mascots: { 
    width: 200, 
    height: 200, 
    marginBottom: 15 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8,
    textAlign: 'center', // Added for better alignment
  },
  kivvyHighlight: { 
    color: '#F28482', 
    fontWeight: '900' 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#444', 
    textAlign: 'center', 
    lineHeight: 26,
    paddingHorizontal: 10, // Added for better text wrapping
  },
  kiwi: { 
    color: '#2A9D8F', 
    fontWeight: '800' 
  },
  chiku: { 
    color: '#E76F51', 
    fontWeight: '800' 
  },

  // Bubble wrapper - Same as original
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
  bubbleText: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '600', 
    textAlign: 'center' 
  },

  bottomSection: { 
    flex: 1.5, 
    padding: 25, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bubbleWrapper: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    marginBottom: 25 
  },
  bubble: { 
    backgroundColor: '#F28482', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    margin: 10, 
    elevation: 4,
    // Enhanced shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedBubble: { 
    backgroundColor: '#84A59D', 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 6,
    elevation: 6, // Enhanced elevation for selected state
  },
  bubbleTouchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  bubbleTextNumber: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff' 
  },
  sparkleWrapper: { 
    position: 'absolute', 
    top: '45%' 
  },

  // Enhanced button styles
  ctaButton: { 
    backgroundColor: '#DE3734', 
    paddingVertical: 14, 
    paddingHorizontal: 60, 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50, // Minimum touch target
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ctaButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 1,
  },
  ctaButtonLoading: {
    backgroundColor: '#E67E22', // Orange for loading state
  },
  ctaText: { 
    fontSize: 20, 
    color: '#fff', 
    fontWeight: '700' 
  },
  ctaTextLoading: {
    marginRight: 8,
  },
  loadingIcon: {
    marginLeft: 5,
  },

  // Voice control button style
  voiceButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});