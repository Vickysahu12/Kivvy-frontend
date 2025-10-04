import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import mascooti from "../../assets/image/mascootii1.png";
import reading from "../../assets/image/reading1.png";
import drawing from "../../assets/image/drawing.png";
import learn from "../../assets/image/learning.png";

const COLORS = {
  primary: '#F6BD60',
  secondary: '#F7EDE2',
  accent: '#84A59D',
  text: '#333333',
  lightText: '#555555',
  highlight: '#F28482',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.1)',
};

const { width } = Dimensions.get('window');

// Default fallback data - will be replaced by API data
const DEFAULT_PROFILE = {
  name: 'Sweet💓',
  profilePic: mascooti,
};

const DEFAULT_SCHEDULE = [
  { day: 'Mon', subject: 'Math', video: 'Addition' },
  { day: 'Tue', subject: 'Science', video: 'Water Cycle' },
  { day: 'Wed', subject: 'English', video: 'Vowels' },
  { day: 'Thu', subject: 'Art', video: 'Coloring' },
  { day: 'Fri', subject: 'Music', video: 'Rhymes' },
  { day: 'Sat', subject: 'Fun', video: 'Puzzles' },
];

const DEFAULT_TODO = [
  { id: '1', title: 'Story', description: 'Sunheri Kahaniyan', image: reading, backgroundColor: '#84A59D', route: 'StoryScreen' },
  { id: '2', title: 'Drawing', description: 'Rangoli Rango Se', image: drawing, backgroundColor: '#F28482', route: 'Drawing' },
  { id: '3', title: 'Write letters', description: 'Aksharon ka Jaadu', image: learn, backgroundColor: '#F6BD60', route: null },
];

export default function Dashboard({ navigation }) {
  // State management - Production ready with loading and error states
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE);
  const [weeklySchedule, setWeeklySchedule] = useState(DEFAULT_SCHEDULE);
  const [todoItems, setTodoItems] = useState(DEFAULT_TODO);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Memoized today calculation - Better performance
  const today = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'short' });
  }, []); // Empty dependency - calculated once

  // Fetch data from backend - Production ready API integration
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // TODO: Replace with actual API calls
      // const response = await fetch('YOUR_API_ENDPOINT/dashboard', {
      //   headers: {
      //     'Authorization': `Bearer ${userToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful data fetch
      // In production, use: const data = await response.json();
      const mockData = {
        profile: DEFAULT_PROFILE,
        schedule: DEFAULT_SCHEDULE,
        todos: DEFAULT_TODO,
      };

      setProfileData(mockData.profile);
      setWeeklySchedule(mockData.schedule);
      setTodoItems(mockData.todos);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      // Show user-friendly error
      Alert.alert(
        'Oops!',
        'Unable to load dashboard. Using cached data.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetchDashboardData();
    }

    // Cleanup
    return () => {
      mounted = false;
    };
  }, [fetchDashboardData]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Memoized render functions - Better performance
  const renderScheduleItem = useCallback(({ item }) => {
    const isToday = item.day.toLowerCase() === today.toLowerCase();
    
    return (
      <TouchableOpacity
        activeOpacity={isToday ? 0.8 : 1}
        disabled={!isToday}
        style={[
          styles.scheduleCard, 
          isToday ? styles.todayCard : styles.lockedCard
        ]}
        onPress={() => {
          if (isToday) {
            // Navigate to today's lesson
            console.log(`Opening ${item.subject} - ${item.video}`);
            // navigation.navigate('LessonScreen', { lesson: item });
          }
        }}
        accessibilityLabel={`${item.day}, ${isToday ? `Today's lesson: ${item.subject}` : 'Locked'}`}
        accessibilityHint={isToday ? 'Double tap to open lesson' : 'This lesson will unlock on its scheduled day'}
        accessibilityRole="button"
      >
        <Text style={styles.scheduleDay}>{item.day}</Text>
        {isToday ? (
          <View style={styles.scheduleContent}>
            <Text style={styles.scheduleSubject} numberOfLines={1}>
              {item.subject}
            </Text>
            <Text style={styles.scheduleVideoTitle} numberOfLines={2}>
              {item.video}
            </Text>
          </View>
        ) : (
          <View style={styles.scheduleLockOverlay}>
            <Text style={styles.lockIcon} accessibilityLabel="Locked">🔒</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [today, navigation]);

  const renderTodoItem = useCallback(({ item }) => {
    const handleTodoPress = () => {
      try {
        if (!item.route) {
          Alert.alert('Coming Soon!', `${item.title} feature is under development.`);
          return;
        }

        // Navigate with proper error handling
        navigation.navigate(item.route, { 
          title: item.title,
          description: item.description,
        });
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Error', 'Unable to open this activity. Please try again.');
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.todoCard, { backgroundColor: item.backgroundColor }]}
        onPress={handleTodoPress}
        accessibilityLabel={`${item.title}: ${item.description}`}
        accessibilityHint="Double tap to start this activity"
        accessibilityRole="button"
      >
        <View style={styles.todoCardContent}>
          <Text style={styles.todoCardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.todoCardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.watchMoreButton}>
            <Text style={styles.watchMoreButtonText}>Watch more</Text>
          </View>
        </View>
        <Image 
          source={item.image} 
          style={styles.todoCardImage}
          resizeMode="contain"
          onError={(error) => {
            console.log('Todo image load error:', error);
          }}
        />
      </TouchableOpacity>
    );
  }, [navigation]);

  // Memoized header component
  const Header = useMemo(() => (
    <View style={styles.headerWrapper}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={profileData.profilePic} 
            style={styles.profilePic}
            onError={(error) => {
              console.log('Profile pic load error:', error);
            }}
            accessibilityLabel={`${profileData.name}'s profile picture`}
          />
          <View>
            <Text 
              style={styles.greetingText}
              numberOfLines={1}
              accessibilityLabel={`Hello, ${profileData.name}`}
            >
              Hello, {profileData.name}!
            </Text>
            <Text 
              style={styles.welcomeBackText}
              accessibilityLabel="Welcome Back"
            >
              Welcome Back!
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => {
            // Navigate to notifications
            console.log('Open notifications');
            // navigation.navigate('Notifications');
          }}
          accessibilityLabel="Notifications"
          accessibilityHint="Double tap to view notifications"
          accessibilityRole="button"
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Schedule Section */}
      <View style={styles.sectionContainer}>
        <Text 
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Weekly Schedule
        </Text>
        <FlatList
          data={weeklySchedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.day}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scheduleList}
          initialNumToRender={7}
          maxToRenderPerBatch={7}
          windowSize={7}
          removeClippedSubviews={true}
          accessibilityLabel="Weekly schedule list"
        />
      </View>

      {/* To-Do Section Title */}
      <View style={styles.sectionContainer}>
        <Text 
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          Aaj ka To-Do
        </Text>
      </View>
    </View>
  ), [profileData, weeklySchedule, renderScheduleItem]);

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <FlatList
        data={todoItems}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activities for today!</Text>
            <Text style={styles.emptySubText}>Check back tomorrow for new tasks</Text>
          </View>
        )}
        accessibilityLabel="Dashboard content"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.secondary 
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.lightText,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.lightText,
  },

  // Content
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  headerWrapper: { 
    backgroundColor: COLORS.secondary,
    paddingBottom: 10,
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 20, 
    marginTop: 50 
  },
  
  profileInfo: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
  },
  
  profilePic: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: COLORS.white, 
    marginRight: 15 
  },
  
  greetingText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.text,
    flexShrink: 1,
  },
  
  welcomeBackText: { 
    fontSize: 16, 
    color: COLORS.lightText 
  },
  
  notificationIcon: { 
    fontSize: 28, 
    color: COLORS.highlight,
    marginLeft: 10,
  },
  
  sectionContainer: { 
    marginBottom: 20 
  },
  
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    marginBottom: 15 
  },
  
  scheduleList: { 
    paddingVertical: 10 
  },
  
  scheduleCard: {
    width: width * 0.2,
    minWidth: 75, // Minimum width for better touch target
    height: width * 0.25,
    minHeight: 95, // Minimum height for better touch target
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginRight: 10,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  
  todayCard: { 
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.highlight,
  },
  
  lockedCard: { 
    opacity: 0.5 
  },
  
  scheduleDay: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: COLORS.text 
  },
  
  scheduleContent: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1,
    paddingHorizontal: 5,
  },
  
  scheduleSubject: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: COLORS.text,
    textAlign: 'center',
  },
  
  scheduleVideoTitle: { 
    fontSize: 10, 
    color: COLORS.lightText, 
    textAlign: 'center', 
    marginTop: 5 
  },
  
  scheduleLockOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    borderRadius: 15 
  },
  
  lockIcon: { 
    fontSize: 24, 
    color: COLORS.lightText 
  },
  
  todoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minHeight: 140, // Better touch target
  },
  
  todoCardContent: { 
    flex: 1, 
    marginRight: 10 
  },
  
  todoCardTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.white, 
    marginBottom: 5 
  },
  
  todoCardDescription: { 
    fontSize: 16, 
    color: COLORS.white, 
    marginBottom: 10 
  },
  
  watchMoreButton: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    alignSelf: 'flex-start' 
  },
  
  watchMoreButtonText: { 
    color: COLORS.white, 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  
  todoCardImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 10 
  },
});