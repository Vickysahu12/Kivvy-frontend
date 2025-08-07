import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar } from 'react-native';
import mascootii from '../../assets/image/mascootii1.png';
import kivvyLogo from '../../assets/icon/Kivvy.png'; // 👈 apna kivvy logo import

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnBoarding'); // replace so back press se Splash na aaye
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F6BD60" barStyle="dark-content" />

      <View style={styles.content}>
        <Image source={mascootii} style={styles.mascots} resizeMode="contain" />

        {/* Yahan pe kivvy ka image */}
        <Image source={kivvyLogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.subtitle}>Learning made fun 🎉</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6BD60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  mascots: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  logo: {
    width: 280, // 👈 size adjust kar
    height: 100,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    color: '#444',
    marginTop: 12,
    fontFamily: 'Baloo2-Regular',
  },
});
