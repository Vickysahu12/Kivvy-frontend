import React, { useMemo, useCallback } from 'react';
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
} from 'react-native';
import mascooti from "../../assets/image/mascootii1.png"
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

const profileData = {
  name: 'Misty',
  profilePic: mascooti,
};

const weeklySchedule = [
  { day: 'Mon', subject: 'Math', video: 'Addition' },
  { day: 'Tue', subject: 'Science', video: 'Water Cycle' },
  { day: 'Wed', subject: 'English', video: 'Vowels' },
  { day: 'Thu', subject: 'Art', video: 'Coloring' },
  { day: 'Fri', subject: 'Music', video: 'Rhymes' },
  { day: 'Sat', subject: 'Fun', video: 'Puzzles' },
];

const todoItems = [
  { id: '1', title: 'Story', description: 'Sunheri Kahaniyan', image: reading, backgroundColor: '#84A59D' },
  { id: '2', title: 'Drawing', description: 'Rangoli Rango Se', image: drawing, backgroundColor: '#F28482' },
  { id: '3', title: 'Write letters', description: 'Aksharon ka Jaadu', image: learn, backgroundColor: '#F6BD60' },
];

const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

export default function Dashboard({ navigation }) {
  const renderScheduleItem = useCallback(({ item }) => {
    const isToday = item.day.toLowerCase() === today.toLowerCase();
    return (
      <View style={[styles.scheduleCard, isToday ? styles.todayCard : styles.lockedCard]}>
        <Text style={styles.scheduleDay}>{item.day}</Text>
        {isToday ? (
          <View style={styles.scheduleContent}>
            <Text style={styles.scheduleSubject}>{item.subject}</Text>
            <Text style={styles.scheduleVideoTitle}>{item.video}</Text>
          </View>
        ) : (
          <View style={styles.scheduleLockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
    );
  }, []);

  const renderTodoItem = useCallback(({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.todoCard, { backgroundColor: item.backgroundColor }]}
      onPress={() => {
        if (item.id === '1') {
          navigation.navigate('StoryScreen', { title: item.title });
        } else if(item.id === "2") {
          navigation.navigate('Drawing',{title:item.title});
        }
      }}
    >
      <View style={styles.todoCardContent}>
        <Text style={styles.todoCardTitle}>{item.title}</Text>
        <Text style={styles.todoCardDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.watchMoreButton}>
          <Text style={styles.watchMoreButtonText}>Watch more</Text>
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.todoCardImage} />
    </TouchableOpacity>
  ), [navigation]);

  const Header = () => (
    <View style={styles.headerWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image source={profileData.profilePic} style={styles.profilePic} />
          <View>
            <Text style={styles.greetingText}>Hello, {profileData.name}!</Text>
            <Text style={styles.welcomeBackText}>Welcome Back!</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.6}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Schedule */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        <FlatList
          data={weeklySchedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.day}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scheduleList}
        />
      </View>

      {/* To-Do Section Title */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Aaj ka To-Do</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <FlatList
        data={todoItems}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}   // 👈 Sticky bana diya header
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  headerWrapper: { backgroundColor: COLORS.secondary }, // sticky ke liye background fix
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, marginTop: 50 },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.white, marginRight: 15 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  welcomeBackText: { fontSize: 16, color: COLORS.lightText },
  notificationIcon: { fontSize: 28, color: COLORS.highlight },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  scheduleList: { paddingVertical: 10 },
  scheduleCard: {
    width: width * 0.2, height: width * 0.25, backgroundColor: COLORS.white, borderRadius: 15, marginRight: 10,
    elevation: 5, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    justifyContent: 'space-between', alignItems: 'center', padding: 10,
  },
  todayCard: { backgroundColor: COLORS.accent },
  lockedCard: { opacity: 0.6 },
  scheduleDay: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  scheduleContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  scheduleSubject: { fontSize: 12, fontWeight: 'bold', color: COLORS.text },
  scheduleVideoTitle: { fontSize: 10, color: COLORS.lightText, textAlign: 'center', marginTop: 5 },
  scheduleLockOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 15 },
  lockIcon: { fontSize: 24, color: COLORS.lightText },
  todoCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
    borderRadius: 15, marginBottom: 15, elevation: 5, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  todoCardContent: { flex: 1, marginRight: 10 },
  todoCardTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 5 },
  todoCardDescription: { fontSize: 16, color: COLORS.white, marginBottom: 10 },
  watchMoreButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  watchMoreButtonText: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
  todoCardImage: { width: 100, height: 100, borderRadius: 10 },
});
