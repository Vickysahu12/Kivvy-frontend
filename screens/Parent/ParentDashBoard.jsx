import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { LineChart } from "react-native-chart-kit";

const W = Dimensions.get("window").width;

const COLORS = {
  primary: "#F6BD60",
  secondary: "#F7EDE2",
  accent: "#84A59D",
  highlight: "#F28482",
  ink: "#333333",
  ink50: "#777",
  card: "#FFFFFF",
  bg: "#FAFAFA",
  success: "#2BAE66",
  danger: "#E45656",
  chipBg: "rgba(255,255,255,0.2)",
  shadow: "rgba(0,0,0,0.12)",
};

const CARD_RADIUS = 20;

// Default fallback data
const DEFAULT_DATA = {
  child: { 
    name: "Rihan", 
    grade: "Class 2", 
    attendance: 95, 
    streak: 7, 
    minutes: 42,
    avatar: "https://i.pravatar.cc/120?img=12",
    id: null,
  },
  progressData: {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [{ data: [60, 72, 80, 91] }],
  },
  subjects: [
    { key: "Math", pct: 85, delta: 5, emoji: "📘" },
    { key: "Science", pct: 78, delta: -2, emoji: "🔬" },
    { key: "English", pct: 92, delta: 8, emoji: "✍️" },
  ],
  activities: [
    { id: '1', text: "Completed Drawing (30 mins)", when: "Today • 10:05", timestamp: new Date().toISOString() },
    { id: '2', text: "Read 5 pages of story", when: "Yesterday • 7:40", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', text: "Solved 10 Math problems", when: "Yesterday • 6:20", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ],
};

const ParentDashboard = ({ navigation, route }) => {
  // State management - Production ready
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [childData, setChildData] = useState(DEFAULT_DATA.child);
  const [progressData, setProgressData] = useState(DEFAULT_DATA.progressData);
  const [subjects, setSubjects] = useState(DEFAULT_DATA.subjects);
  const [activities, setActivities] = useState(DEFAULT_DATA.activities);
  const [parentName, setParentName] = useState("Kavya");
  const [imageError, setImageError] = useState(false);

  // Get greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // TODO: Replace with actual API calls
      // const response = await fetch('API_ENDPOINT/parent/dashboard', {
      //   headers: {
      //     'Authorization': `Bearer ${parentToken}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // if (!response.ok) throw new Error('Failed to fetch dashboard data');
      // const data = await response.json();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data (replace with actual API response)
      const mockData = {
        parent: { name: "Kavya", id: "parent_123" },
        child: DEFAULT_DATA.child,
        progress: DEFAULT_DATA.progressData,
        subjects: DEFAULT_DATA.subjects,
        activities: DEFAULT_DATA.activities,
      };

      setParentName(mockData.parent.name);
      setChildData(mockData.child);
      setProgressData(mockData.progress);
      setSubjects(mockData.subjects);
      setActivities(mockData.activities);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      
      Alert.alert(
        'Error',
        'Unable to load dashboard. Using cached data.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Handle profile view
  const handleViewProfile = useCallback(() => {
    if (!childData.id) {
      Alert.alert('Info', 'Child profile is not available');
      return;
    }
    
    // Navigate to child profile
    // navigation.navigate('ChildProfile', { childId: childData.id });
    console.log('View profile:', childData.id);
  }, [childData.id]);

  // Handle assign task
  const handleAssignTask = useCallback(() => {
    // navigation.navigate('AssignTask', { childId: childData.id });
    Alert.alert('Assign Task', 'Task assignment feature coming soon!');
  }, [childData.id]);

  // Handle download report
  const handleDownloadReport = useCallback(async () => {
    try {
      Alert.alert(
        'Download Report',
        'Download progress report?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              // TODO: Implement report download
              // const reportUrl = await generateReport(childData.id);
              // await downloadFile(reportUrl);
              console.log('Downloading report for:', childData.id);
              Alert.alert('Success', 'Report downloaded successfully!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download report');
    }
  }, [childData.id]);

  // Chart configuration
  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: COLORS.secondary,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForDots: { 
      r: "5", 
      strokeWidth: "2", 
      stroke: COLORS.primary 
    },
    propsForBackgroundLines: { 
      stroke: "#EAEAEA" 
    },
  }), []);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.primary}
          translucent={Platform.OS === "android"}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={Platform.OS === "android"}
      />

      {/* Sticky Header */}
      <LinearGradient
        colors={[COLORS.primary, "#FFCF85"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityHint="Double tap to return to previous screen"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text 
              style={styles.welcome}
              accessibilityLabel={`${greeting}, ${parentName}`}
            >
              {greeting}, {parentName} 👋
            </Text>
            <Text 
              style={styles.title}
              accessibilityRole="header"
            >
              Your Child's Progress
            </Text>
          </View>
        </View>

        {/* KPI chips */}
        <View 
          style={styles.kpis}
          accessibilityLabel="Key performance indicators"
        >
          <View style={styles.chip}>
            <Text style={styles.chipText}>Attendance</Text>
            <Text 
              style={styles.chipValue}
              accessibilityLabel={`Attendance ${childData.attendance} percent`}
            >
              {childData.attendance}%
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Streak</Text>
            <Text 
              style={styles.chipValue}
              accessibilityLabel={`${childData.streak} day streak`}
            >
              🔥 {childData.streak}d
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Time Today</Text>
            <Text 
              style={styles.chipValue}
              accessibilityLabel={`${childData.minutes} minutes today`}
            >
              {childData.minutes}m
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Floating child card */}
        <View style={styles.childCard}>
          {imageError ? (
            <View style={styles.childImageFallback}>
              <Text style={styles.childImageFallbackText}>
                {childData.name.charAt(0)}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: childData.avatar }}
              style={styles.childImage}
              onError={() => setImageError(true)}
              accessibilityLabel={`${childData.name}'s profile picture`}
            />
          )}
          <View style={styles.childInfo}>
            <Text 
              style={styles.childName}
              numberOfLines={1}
            >
              {childData.name} <Text style={styles.rocketEmoji}>🚀</Text>
            </Text>
            <Text style={styles.childMeta}>{childData.grade}</Text>
            <Text style={styles.childMeta} numberOfLines={2}>
              Attendance <Text style={styles.bold}>{childData.attendance}%</Text> • Streak{" "}
              <Text style={styles.bold}>🔥 {childData.streak} days</Text>
            </Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.viewBtn}
            onPress={handleViewProfile}
            accessibilityLabel="View child profile"
            accessibilityHint="Double tap to open profile details"
            accessibilityRole="button"
          >
            <Text style={styles.viewBtnText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Progress chart */}
        <View style={styles.card}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Progress Overview
          </Text>
          <LineChart
            data={progressData}
            width={W - 72}
            height={220}
            bezier
            withInnerLines
            withOuterLines={false}
            chartConfig={chartConfig}
            style={styles.chart}
            accessible={true}
            accessibilityLabel="Progress chart showing weekly performance"
          />
        </View>

        {/* Subjects + progress bars */}
        <View style={styles.card}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Marks & Subjects
          </Text>
          {subjects.map((s) => (
            <View 
              key={s.key} 
              style={styles.subjectItem}
              accessibilityLabel={`${s.key}: ${s.pct} percent, ${s.delta >= 0 ? 'up' : 'down'} ${Math.abs(s.delta)} percent`}
            >
              <Text style={styles.subjectEmoji}>{s.emoji}</Text>
              <View style={styles.subjectContent}>
                <View style={styles.subjectRow}>
                  <Text style={styles.subjectName}>{s.key}</Text>
                  <Text style={styles.subjectPct}>
                    {s.pct}%{" "}
                    <Text style={{ color: s.delta >= 0 ? COLORS.success : COLORS.danger }}>
                      {s.delta >= 0 ? "↑" : "↓"}
                      {Math.abs(s.delta)}%
                    </Text>
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${s.pct}%` }]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Achievements
          </Text>
          <View style={styles.badgeRow}>
            <View 
              style={styles.badge}
              accessibilityLabel="Achievement: Star Reader"
            >
              <Text style={styles.badgeIcon}>🏆</Text>
              <Text style={styles.badgeText}>Star Reader</Text>
            </View>
            <View 
              style={styles.badge}
              accessibilityLabel="Achievement: Super Artist"
            >
              <Text style={styles.badgeIcon}>🎨</Text>
              <Text style={styles.badgeText}>Super Artist</Text>
            </View>
            <View 
              style={styles.badge}
              accessibilityLabel="Achievement: Math Wizard"
            >
              <Text style={styles.badgeIcon}>🧮</Text>
              <Text style={styles.badgeText}>Math Wizard</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            Recent Activity
          </Text>
          {activities.map((a) => (
            <View 
              key={a.id} 
              style={styles.activityItem}
              accessibilityLabel={`${a.text}, ${a.when}`}
            >
              <View style={styles.dot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText} numberOfLines={2}>
                  {a.text}
                </Text>
                <Text style={styles.activityMeta}>{a.when}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.cta, styles.ctaOutline]}
            onPress={handleAssignTask}
            accessibilityLabel="Assign task"
            accessibilityHint="Double tap to assign a new task"
            accessibilityRole="button"
          >
            <Text style={[styles.ctaText, styles.ctaTextPrimary]}>
              Assign Task
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.cta, styles.ctaSolid]}
            onPress={handleDownloadReport}
            accessibilityLabel="Download report"
            accessibilityHint="Double tap to download progress report"
            accessibilityRole="button"
          >
            <Text style={[styles.ctaText, styles.ctaTextWhite]}>
              Download Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.ink50,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 28,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 45,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  welcome: { 
    color: "#000", 
    fontSize: 14, 
    marginBottom: 4 
  },
  title: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "800" 
  },

  // KPI chips
  kpis: { 
    flexDirection: "row", 
    gap: 10 
  },
  chip: {
    flex: 1,
    backgroundColor: COLORS.chipBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  chipText: { 
    color: "rgba(255,255,255,0.9)", 
    fontSize: 12 
  },
  chipValue: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "800", 
    marginTop: 4 
  },

  // Child card
  childCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: CARD_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 6,
  },
  childImage: { 
    width: 64, 
    height: 64, 
    borderRadius: 16 
  },
  childImageFallback: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  childImageFallbackText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  childInfo: {
    flex: 1,
  },
  childName: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: COLORS.ink 
  },
  rocketEmoji: {
    fontSize: 18,
  },
  childMeta: { 
    fontSize: 13, 
    color: COLORS.ink50, 
    marginTop: 2 
  },
  bold: { 
    fontWeight: "700", 
    color: COLORS.ink 
  },
  viewBtn: {
    backgroundColor: "rgba(246,189,96,0.12)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  viewBtnText: { 
    color: COLORS.primary, 
    fontWeight: "700" 
  },

  // Card
  card: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.card,
    borderRadius: CARD_RADIUS,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: COLORS.ink 
  },
  chart: {
    borderRadius: 16,
    marginTop: 6,
  },

  // Subjects
  subjectItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 14, 
    gap: 12 
  },
  subjectEmoji: { 
    fontSize: 24 
  },
  subjectContent: {
    flex: 1,
  },
  subjectRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 6 
  },
  subjectName: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: COLORS.ink 
  },
  subjectPct: { 
    fontSize: 14, 
    color: COLORS.ink50, 
    fontWeight: "600" 
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#EEE",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },

  // Badges
  badgeRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#FFF8EC",
    borderWidth: 1,
    borderColor: "#FFE2B8",
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  badgeIcon: { 
    fontSize: 24, 
    marginBottom: 6 
  },
  badgeText: { 
    fontSize: 12, 
    color: COLORS.ink, 
    fontWeight: "700" 
  },

  // Timeline
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: COLORS.accent,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityText: { 
    fontSize: 14, 
    color: COLORS.ink, 
    fontWeight: "600" 
  },
  activityMeta: { 
    fontSize: 12, 
    color: COLORS.ink50, 
    marginTop: 2 
  },

  // CTAs
  ctaRow: { 
    flexDirection: "row", 
    gap: 12, 
    marginTop: 12, 
    paddingHorizontal: 20 
  },
  cta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  ctaOutline: { 
    backgroundColor: "#FFF", 
    borderWidth: 1, 
    borderColor: COLORS.primary 
  },
  ctaSolid: { 
    backgroundColor: COLORS.primary 
  },
  ctaText: { 
    fontWeight: "800", 
    fontSize: 15 
  },
  ctaTextPrimary: {
    color: COLORS.primary,
  },
  ctaTextWhite: {
    color: "#fff",
  },
});

export default ParentDashboard;


// Make sure the flow of my app and ensure that it should make child comfortable
// and start the backend making and delete the authentication part
// common yarr vicky do your fucking work humko do app launch karna hai iss saaal 5saal mein 50crore ki company banana hai na dost to karna to pdega darling lets do it man karlenge yarr