import React from "react";
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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { LineChart } from "react-native-chart-kit";

const W = Dimensions.get("window").width;

const COLORS = {
  primary: "#F6BD60", // brand yellow
  secondary: "#F7EDE2", // warm cream
  accent: "#84A59D", // sage
  highlight: "#F28482", // coral
  ink: "#333333",
  ink50: "#777",
  card: "#FFFFFF",
  bg: "#FAFAFA",
  success: "#2BAE66",
  danger: "#E45656",
  chipBg: "rgba(255,255,255,0.2)",
  shadow: "rgba(0,0,0,0.12)",
};

const ParentDashboard = () => {
  // demo data
  const child = { name: "Rihan", grade: "Class 2", attendance: 95, streak: 7, minutes: 42 };

  const progressData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [{ data: [60, 72, 80, 91] }],
  };

  const subjects = [
    { key: "Math", pct: 85, delta: +5, emoji: "📘" },
    { key: "Science", pct: 78, delta: -2, emoji: "🔬" },
    { key: "English", pct: 92, delta: +8, emoji: "✍️" },
  ];

  const activities = [
    { text: "Completed Drawing (30 mins)", when: "Today • 10:05" },
    { text: "Read 5 pages of story", when: "Yesterday • 7:40" },
    { text: "Solved 10 Math problems", when: "Yesterday • 6:20" },
  ];

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
        <View>
          <Text style={styles.welcome}>Good Morning, Kavya 👋</Text>
          <Text style={styles.title}>Your Child’s Progress</Text>
        </View>

        {/* KPI chips */}
        <View style={styles.kpis}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Attendance</Text>
            <Text style={styles.chipValue}>{child.attendance}%</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Streak</Text>
            <Text style={styles.chipValue}>🔥 {child.streak}d</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Time Today</Text>
            <Text style={styles.chipValue}>{child.minutes}m</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Floating child card */}
        <View style={styles.childCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/120?img=12" }}
            style={styles.childImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.childName}>
              {child.name} <Text style={{ fontSize: 18 }}>🚀</Text>
            </Text>
            <Text style={styles.childMeta}>{child.grade}</Text>
            <Text style={styles.childMeta}>
              Attendance <Text style={styles.bold}>{child.attendance}%</Text> • Streak{" "}
              <Text style={styles.bold}>🔥 {child.streak} days</Text>
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Progress chart */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <LineChart
            data={progressData}
            width={W - 40}
            height={220}
            bezier
            withInnerLines
            withOuterLines={false}
            chartConfig={{
              backgroundGradientFrom: COLORS.secondary,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 0,
              color: (o = 1) => `rgba(0,0,0,${o})`,
              labelColor: (o = 1) => `rgba(0,0,0,${o})`,
              propsForDots: { r: "5", strokeWidth: "2", stroke: COLORS.primary },
              propsForBackgroundLines: { stroke: "#EAEAEA" },
            }}
            style={{ borderRadius: 16, marginTop: 6 }}
          />
        </View>

        {/* Subjects + progress bars */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Marks & Subjects</Text>
          {subjects.map((s) => (
            <View key={s.key} style={styles.subjectItem}>
              <Text style={styles.subjectEmoji}>{s.emoji}</Text>
              <View style={{ flex: 1 }}>
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
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🏆</Text>
              <Text style={styles.badgeText}>Star Reader</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🎨</Text>
              <Text style={styles.badgeText}>Super Artist</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🧮</Text>
              <Text style={styles.badgeText}>Math Wizard</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.map((a, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>{a.text}</Text>
                <Text style={styles.activityMeta}>{a.when}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity activeOpacity={0.9} style={[styles.cta, styles.ctaOutline]}>
            <Text style={[styles.ctaText, { color: COLORS.primary }]}>Assign Task</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} style={[styles.cta, styles.ctaSolid]}>
            <Text style={[styles.ctaText, { color: "#fff" }]}>Download Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Header (Sticky)
  header: {
    paddingHorizontal: 20,
    paddingTop: 45,
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
  welcome: { color: "#000", fontSize: 14, marginBottom: 4 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },

  // KPI chips
  kpis: { flexDirection: "row", gap: 10, marginTop: 14 },
  chip: {
    backgroundColor: COLORS.chipBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  chipText: { color: "rgba(255,255,255,0.9)", fontSize: 12 },
  chipValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 4 },

  // Floating child card
  childCard: {
    marginHorizontal: 20,
    marginTop: -26,
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
    marginTop:10
  },
  childImage: { width: 64, height: 64, borderRadius: 16 },
  childName: { fontSize: 20, fontWeight: "800", color: COLORS.ink },
  childMeta: { fontSize: 13, color: COLORS.ink50, marginTop: 2 },
  bold: { fontWeight: "700", color: COLORS.ink },

  viewBtn: {
    backgroundColor: "rgba(246,189,96,0.12)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  viewBtnText: { color: COLORS.primary, fontWeight: "700" },

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
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.ink },

  // Subjects
  subjectItem: { flexDirection: "row", alignItems: "center", marginTop: 14, gap: 12 },
  subjectEmoji: { fontSize: 24 },
  subjectRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  subjectName: { fontSize: 15, fontWeight: "700", color: COLORS.ink },
  subjectPct: { fontSize: 14, color: COLORS.ink50, fontWeight: "600" },
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
  badgeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
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
  badgeIcon: { fontSize: 24, marginBottom: 6 },
  badgeText: { fontSize: 12, color: COLORS.ink, fontWeight: "700" },

  // Timeline
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  activityText: { fontSize: 14, color: COLORS.ink, fontWeight: "600" },
  activityMeta: { fontSize: 12, color: COLORS.ink50, marginTop: 2 },

  // CTAs
  ctaRow: { flexDirection: "row", gap: 12, marginTop: 12, paddingHorizontal: 20 },
  cta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaOutline: { backgroundColor: "#FFF", borderWidth: 1, borderColor: COLORS.primary },
  ctaSolid: { backgroundColor: COLORS.primary },
  ctaText: { fontWeight: "800", fontSize: 15 },
});

export default ParentDashboard;
