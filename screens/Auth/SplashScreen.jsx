import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import mascootii from '../../assets/image/mascootii1.png';
import kivvyLogo from '../../assets/icon/Kivvy.png';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Animation refs
  const mascotAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate app initialization
    initializeApp();
    startAnimations();
  }, []);

  const initializeApp = async () => {
    try {
      // Simulate loading different app components
      const steps = [
        { name: 'Loading assets...', delay: 300 },
        { name: 'Initializing features...', delay: 400 },
        { name: 'Preparing fun activities...', delay: 500 },
        { name: 'Almost ready!', delay: 300 },
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        setLoadingProgress(((i + 1) / steps.length) * 100);
      }

      // Final delay before navigation
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace('OnBoarding');
      }, 7000);

    } catch (error) {
      console.log('App initialization failed:', error);
      // Fallback navigation after 3 seconds
      setTimeout(() => {
        navigation.replace('OnBoarding');
      }, 3000);
    }
  };

  const startAnimations = () => {
    // Background gradient animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Mascot entrance animation
    Animated.sequence([
      Animated.timing(mascotAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Logo slide in from bottom
    setTimeout(() => {
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }, 600);

    // Text fade in
    setTimeout(() => {
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Sparkle effect
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 1200);
  };

  // Dynamic background color based on animation
  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#F6BD60', '#FFD93D', '#F6BD60'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />
      
      {/* Animated Background */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor }
        ]}
      />

      {/* Decorative Circles */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Mascot Animation */}
        <Animated.View
          style={[
            styles.mascotContainer,
            {
              opacity: mascotAnim,
              transform: [
                {
                  translateY: mascotAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <Image source={mascootii} style={styles.mascots} resizeMode="contain" />
          
          {/* Sparkle Effect */}
          <Animated.View
            style={[
              styles.sparkleContainer,
              {
                opacity: sparkleAnim,
                transform: [{ rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }) }],
              },
            ]}
          >
            <Text style={styles.sparkle}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkle2]}>🌟</Text>
            <Text style={[styles.sparkle, styles.sparkle3]}>⭐</Text>
          </Animated.View>
        </Animated.View>

        {/* Logo Animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={kivvyLogo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* Subtitle Animation */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textAnim,
              transform: [
                {
                  translateY: textAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.subtitle}>Learning made fun! 🎉</Text>
          <Text style={styles.tagline}>Where curiosity meets creativity</Text>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${loadingProgress}%` },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Getting everything ready...</Text>
          <ActivityIndicator size="small" color="#FF6B6B" style={styles.spinner} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6BD60',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Decorative Elements
  decorativeCircle1: {
    position: 'absolute',
    top: height * 0.1,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: height * 0.2,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },

  // Mascot Section
  mascotContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  mascots: {
    width: 220,
    height: 220,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  sparkle2: {
    top: -10,
    right: -10,
    fontSize: 18,
  },
  sparkle3: {
    bottom: -5,
    left: -15,
    fontSize: 20,
  },

  // Logo Section
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 240,
    height: 80,
  },

  // Text Section
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    color: '#2D3436',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    // Fallback fonts for production
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  tagline: {
    fontSize: 16,
    color: '#636E72',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },

  // Loading Section
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '600',
    marginBottom: 8,
  },
  spinner: {
    marginTop: 5,
  },
});