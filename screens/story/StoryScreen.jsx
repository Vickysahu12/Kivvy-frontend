import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Alert,
  Share,
  Platform,
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
  error: '#FF3B30',
};

const { width, height } = Dimensions.get('window');

const StoryScreen = ({ navigation }) => {
  // State management - Production ready
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const [selectedTab, setSelectedTab] = useState('episodes'); // 'episodes' or 'morelike'

  // Route params with validation
  const route = useRoute();
  const { title, thumbnail, storyId } = route.params || {
    title: 'Sunheri Kahaniyan',
    thumbnail: null,
    storyId: null,
  };

  // Video URL - In production, fetch from API
  const storyVideo = { 
    uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4' 
  };

  // Animation refs - Single ref for reusable animations
  const buttonScale = useRef(new Animated.Value(1)).current;
  const videoPlayerRef = useRef(null);

  // Dummy episodes - Replace with API data
  const episodes = [
    { id: '1', title: '1. Nayi Kahani', duration: '5 min', thumbnail: 'https://placehold.co/100x60/F5CAC3/FFFFFF?text=Ep+1', videoUrl: '' },
    { id: '2', title: '2. Dost ki Madad', duration: '6 min', thumbnail: 'https://placehold.co/100x60/B5EAD7/FFFFFF?text=Ep+2', videoUrl: '' },
    { id: '3', title: '3. Hoshiyar Bandar', duration: '4 min', thumbnail: 'https://placehold.co/100x60/C7CEEA/FFFFFF?text=Ep+3', videoUrl: '' },
    { id: '4', title: '4. Sher aur Chuha', duration: '5 min', thumbnail: 'https://placehold.co/100x60/FFD8BE/FFFFFF?text=Ep+4', videoUrl: '' },
    { id: '5', title: '5. Do Billi aur Roti', duration: '7 min', thumbnail: 'https://placehold.co/100x60/D4A5A5/FFFFFF?text=Ep+5', videoUrl: '' },
    { id: '6', title: '6. Jadu ka Patthar', duration: '8 min', thumbnail: 'https://placehold.co/100x60/99C1B9/FFFFFF?text=Ep+6', videoUrl: '' },
    { id: '7', title: '7. Gubbara aur Ladka', duration: '6 min', thumbnail: 'https://placehold.co/100x60/A2D2FF/FFFFFF?text=Ep+7', videoUrl: '' },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop all animations
      buttonScale.stopAnimation();
      // Cleanup video player
      if (videoPlayerRef.current) {
        videoPlayerRef.current = null;
      }
    };
  }, []);

  // Video event handlers
  const onVideoLoad = useCallback(() => {
    setIsLoading(false);
    setIsVideoError(false);
    console.log('Video loaded successfully');
  }, []);

  const onVideoError = useCallback((error) => {
    console.error('Video Playback Error:', error);
    setIsLoading(false);
    setIsVideoError(true);
    Alert.alert(
      'Video Error',
      'Unable to play video. Please check your internet connection.',
      [{ text: 'OK' }]
    );
  }, []);

  const onVideoEnd = useCallback(() => {
    setIsPlaying(false);
    console.log('Video ended');
    // Auto-play next episode logic can be added here
  }, []);

  // Button animation handlers
  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  // Action handlers
  const handlePlayStory = useCallback(() => {
    setIsPlaying(true);
    console.log('Playing story:', title);
    // In production, track analytics here
  }, [title]);

  const handleLike = useCallback(async () => {
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // TODO: API call to save like status
      // await fetch('API_ENDPOINT/like', {
      //   method: 'POST',
      //   body: JSON.stringify({ storyId, liked: newLikedState })
      // });
      
      console.log(`Story ${newLikedState ? 'liked' : 'unliked'}`);
    } catch (error) {
      console.error('Like action failed:', error);
      setIsLiked(!isLiked); // Revert on error
    }
  }, [isLiked, storyId]);

  const handleAddToList = useCallback(async () => {
    try {
      const newListState = !isInMyList;
      setIsInMyList(newListState);
      
      // TODO: API call to save to user's list
      // await fetch('API_ENDPOINT/mylist', {
      //   method: 'POST',
      //   body: JSON.stringify({ storyId, inList: newListState })
      // });
      
      Alert.alert(
        newListState ? 'Added to My List' : 'Removed from My List',
        newListState ? 'You can find this in your list' : 'Story removed from your list',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Add to list failed:', error);
      setIsInMyList(!isInMyList); // Revert on error
    }
  }, [isInMyList, storyId]);

  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `Check out this story: ${title}`,
        title: title,
        // url: 'YOUR_APP_DEEP_LINK', // Add deep link in production
      });

      if (result.action === Share.sharedAction) {
        console.log('Story shared successfully');
        // Track analytics
      }
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Share Error', 'Unable to share at this moment');
    }
  }, [title]);

  const handleEpisodeSelect = useCallback((episode) => {
    console.log('Selected episode:', episode.title);
    setCurrentEpisode(episode);
    setIsLoading(true);
    
    // TODO: Load new episode video
    // In production, update video source and reload
    Alert.alert('Episode Selected', `Playing: ${episode.title}`);
  }, []);

  const handleDownload = useCallback((episode) => {
    console.log('Download episode:', episode.title);
    
    // TODO: Implement download functionality
    Alert.alert(
      'Download',
      `Download ${episode.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            // Start download logic
            console.log('Starting download...');
          }
        }
      ]
    );
  }, []);

  const handleBack = useCallback(() => {
    if (videoPlayerRef.current) {
      // Pause video before going back
      setIsPlaying(false);
    }
    navigation.goBack();
  }, [navigation]);

  // Render episode item with proper error handling
  const renderEpisodeItem = useCallback((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.episodeItem}
      onPress={() => handleEpisodeSelect(item)}
      activeOpacity={0.8}
      accessibilityLabel={`Episode ${item.title}, Duration ${item.duration}`}
      accessibilityHint="Double tap to play this episode"
      accessibilityRole="button"
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.episodeThumbnail}
        onError={(error) => {
          console.log('Episode thumbnail error:', error);
        }}
        defaultSource={require('../../assets/image/thumbnail.jpg')} // Add placeholder
      />
      <View style={styles.episodeDetails}>
        <Text style={styles.episodeTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.episodeDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => handleDownload(item)}
        accessibilityLabel="Download episode"
        accessibilityHint="Double tap to download this episode"
        accessibilityRole="button"
      >
        <Text style={styles.downloadIcon}>⬇️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), [handleEpisodeSelect, handleDownload]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="light-content" 
        translucent 
      />
      
      {/* Video Player Section */}
      <View style={styles.videoPlayerContainer}>
        <ImageBackground
          source={thumbnail ? { uri: thumbnail } : null}
          style={styles.videoPlayer}
          imageStyle={styles.videoPlayerImage}
        >
          {isLoading && !isVideoError && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.white} />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          
          {isVideoError && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>Video unavailable</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setIsVideoError(false);
                  setIsLoading(true);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isVideoError && (
            <Video
              ref={videoPlayerRef}
              source={storyVideo}
              style={[styles.videoPlayer, { opacity: isLoading ? 0 : 1 }]}
              resizeMode="contain"
              controls={true}
              paused={!isPlaying}
              onLoad={onVideoLoad}
              onError={onVideoError}
              onEnd={onVideoEnd}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
            />
          )}
        </ImageBackground>

        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.closeButton}
            accessibilityLabel="Go back"
            accessibilityHint="Double tap to return to previous screen"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content Details Section */}
      <ScrollView 
        contentContainerStyle={styles.detailsScrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailsContainer}>
          {/* Story Info */}
          <Text 
            style={styles.storyTitle}
            accessibilityRole="header"
          >
            {title}
          </Text>
          <Text style={styles.storyDetails}>
            2025 | {episodes.length} Episodes
          </Text>

          {/* Play Button */}
          <TouchableOpacity 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePlayStory}
            activeOpacity={0.9}
            accessibilityLabel="Play story"
            accessibilityHint="Double tap to start playing the story"
            accessibilityRole="button"
          >
            <Animated.View 
              style={[
                styles.playButton, 
                { transform: [{ scale: buttonScale }] }
              ]}
            >
              <Text style={styles.playButtonText}>▶ Play Story</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Story Description */}
          <Text style={styles.storyDescription}>
            Ek Sundar kahani jo baccho ko ek naya path sikhati hai. Yeh kahani ek chote se gaon ke baare mein hai jahan sabhi bacche milkar khelte aur padhte hain.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPress={handleLike}
              activeOpacity={0.7}
              accessibilityLabel={isLiked ? "Unlike story" : "Like story"}
              accessibilityHint="Double tap to toggle like"
              accessibilityRole="button"
            >
              <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>
                  {isLiked ? '❤️' : '👍'}
                </Text>
                <Text style={styles.actionText}>
                  {isLiked ? 'Liked' : 'Like'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPress={handleAddToList}
              activeOpacity={0.7}
              accessibilityLabel={isInMyList ? "Remove from my list" : "Add to my list"}
              accessibilityHint="Double tap to toggle in your list"
              accessibilityRole="button"
            >
              <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>
                  {isInMyList ? '✓' : '➕'}
                </Text>
                <Text style={styles.actionText}>My List</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonWrapper}
              onPress={handleShare}
              activeOpacity={0.7}
              accessibilityLabel="Share story"
              accessibilityHint="Double tap to share this story"
              accessibilityRole="button"
            >
              <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>🔗</Text>
                <Text style={styles.actionText}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setSelectedTab('episodes')}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === 'episodes' }}
            >
              <Text 
                style={[
                  styles.tab, 
                  selectedTab === 'episodes' && styles.activeTab
                ]}
              >
                Episodes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('morelike')}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === 'morelike' }}
            >
              <Text 
                style={[
                  styles.tab,
                  selectedTab === 'morelike' && styles.activeTab
                ]}
              >
                More Like This
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Episode List */}
          <View 
            style={styles.episodeList}
            accessibilityLabel="Episode list"
          >
            {selectedTab === 'episodes' ? (
              episodes.map(renderEpisodeItem)
            ) : (
              <View style={styles.comingSoonContainer}>
                <Text style={styles.comingSoonText}>
                  More stories coming soon! 🎉
                </Text>
              </View>
            )}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsScrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
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
    minHeight: 54,
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
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButtonWrapper: {
    alignItems: 'center',
    minWidth: 70,
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
    fontWeight: '600',
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
    marginTop: 10,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    minHeight: 80,
  },
  episodeThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: COLORS.lightText,
  },
  episodeDetails: {
    flex: 1,
    paddingRight: 10,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  downloadIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  comingSoonContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    color: COLORS.lightText,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StoryScreen