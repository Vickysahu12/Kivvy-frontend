import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Image,
  Animated,
  ScrollView,
} from 'react-native';

import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native';


const COLORS = {
  primary: '#F6BD60',
  secondary: '#FFFAF0',
  text: '#333333',
  lightText: '#666666',
  accent: '#F28482',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.2)',
};

const { width, height } = Dimensions.get('window');

const StoryScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { title, thumbnail } = route.params || {
    title: 'Sunheri Kahaniyan',
    thumbnail: thumbnail,
  };

  const storyVideo = { uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' };

  // Animation values ke liye useRef ka use
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const actionButtonScale = useRef(new Animated.Value(1)).current;

  const onVideoLoad = () => {
    setIsLoading(false);
  };

  // Button press par animation start karein
  const handlePressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Dummy episodes list, aap ise dynamic data se replace kar sakte hain
  const episodes = [
    { id: '1', title: '1. Nayi Kahani', duration: '5 min', thumbnail: 'https://placehold.co/100x60/F5CAC3/FFFFFF?text=Ep+1' },
    { id: '2', title: '2. Dost ki Madad', duration: '6 min', thumbnail: 'https://placehold.co/100x60/B5EAD7/FFFFFF?text=Ep+2' },
    { id: '3', title: '3. Hoshiyar Bandar', duration: '4 min', thumbnail: 'https://placehold.co/100x60/C7CEEA/FFFFFF?text=Ep+3' },
    { id: '4', title: '4. Sher aur Chuha', duration: '5 min', thumbnail: 'https://placehold.co/100x60/FFD8BE/FFFFFF?text=Ep+4' },
    { id: '5', title: '5. Do Billi aur Roti', duration: '7 min', thumbnail: 'https://placehold.co/100x60/D4A5A5/FFFFFF?text=Ep+5' },
    { id: '6', title: '6. Jadu ka Patthar', duration: '8 min', thumbnail: 'https://placehold.co/100x60/99C1B9/FFFFFF?text=Ep+6' },
    { id: '7', title: '7. Gubbara aur Ladka', duration: '6 min', thumbnail: 'https://placehold.co/100x60/A2D2FF/FFFFFF?text=Ep+7' },
  ];

  const renderEpisodeItem = (item) => (
    <View key={item.id} style={styles.episodeItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.episodeThumbnail} />
      <View style={styles.episodeDetails}>
        <Text style={styles.episodeTitle}>{item.title}</Text>
        <Text style={styles.episodeDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadIcon}>⬇️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      {/* Video Player Section */}
      <View style={styles.videoPlayerContainer}>
        <ImageBackground
          source={{ uri: thumbnail }}
          style={styles.videoPlayer}
          imageStyle={styles.videoPlayerImage}
        >
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.white} />
            </View>
          )}
          <Video
            source={storyVideo}
            style={[styles.videoPlayer, { opacity: isLoading ? 0 : 1 }]}
            resizeMode="contain"
            controls={true}
            paused={isLoading}
            onLoad={onVideoLoad}
            onError={(e) => {
              console.log('Video Playback Error: ', e);
              setIsLoading(false);
            }}
            repeat={false}
          />
        </ImageBackground>
        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content Details Section */}
      <ScrollView contentContainerStyle={styles.detailsScrollViewContent}>
        <View style={styles.detailsContainer}>
          <Text style={styles.storyTitle}>{title}</Text>
          <Text style={styles.storyDetails}>2025 | {episodes.length} Episodes</Text>

          <TouchableOpacity 
            onPressIn={() => handlePressIn(playButtonScale)}
            onPressOut={() => handlePressOut(playButtonScale)}
          >
            <Animated.View style={[styles.playButton, { transform: [{ scale: playButtonScale }] }]}>
              <Text style={styles.playButtonText}>▶ Play Story</Text>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.storyDescription}>
            Ek Sundar kahani jo baccho ko ek naya path sikhati hai. Yeh kahani ek chote se gaon ke baare mein hai jahan sabhi bacche milkar khelte aur padhte hain.
          </Text>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPressIn={() => handlePressIn(actionButtonScale)}
              onPressOut={() => handlePressOut(actionButtonScale)}
            >
              <Animated.View style={[styles.actionButton, { transform: [{ scale: actionButtonScale }] }]}>
                <Text style={styles.actionIcon}>👍</Text>
                <Text style={styles.actionText}>Like</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPressIn={() => handlePressIn(actionButtonScale)}
              onPressOut={() => handlePressOut(actionButtonScale)}
            >
              <Animated.View style={[styles.actionButton, { transform: [{ scale: actionButtonScale }] }]}>
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionText}>My List</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPressIn={() => handlePressIn(actionButtonScale)}
              onPressOut={() => handlePressOut(actionButtonScale)}
            >
              <Animated.View style={[styles.actionButton, { transform: [{ scale: actionButtonScale }] }]}>
                <Text style={styles.actionIcon}>🔗</Text>
                <Text style={styles.actionText}>Share</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Dummy Episodes/More Info Section */}
          <View style={styles.tabsContainer}>
            <Text style={[styles.tab, styles.activeTab]}>Episodes</Text>
            <Text style={styles.tab}>More Like This</Text>
          </View>
          
          <View style={styles.episodeList}>
            {episodes.map(renderEpisodeItem)}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  videoPlayerContainer: {
    width: '100%',
    height: height * 0.35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoPlayerImage: {
    resizeMode: 'cover',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topControls: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsScrollViewContent: {
    flexGrow: 1,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 20,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  storyDetails: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  storyDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButtonWrapper: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 30,
    color: COLORS.accent,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightText,
    marginBottom: 20,
  },
  tab: {
    fontSize: 18,
    color: COLORS.lightText,
    paddingBottom: 10,
    marginRight: 20,
  },
  activeTab: {
    color: COLORS.text,
    fontWeight: 'bold',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  episodeList: {
    // Ab flex direction row nahi hai, items automatically vertical stack honge
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15, // Vertical spacing
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  episodeThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  episodeDetails: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  episodeDuration: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
});

export default StoryScreen;
