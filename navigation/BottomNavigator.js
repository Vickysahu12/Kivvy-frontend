import React from "react";
import { StyleSheet, Text, View, Image, Animated, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

// Icons
import home from "../assets/icon/home.png";
import colorpalette from "../assets/icon/colorpalette.png";
import robot from "../assets/icon/robotassistant.png";
import parents from "../assets/icon/parents.png";

// Screens
import Dashboard from "../screens/Home/Dashboard";
import ChatbotScreen from "../screens/chatbot/ChatBot";
import DrawingScreen from "../screens/Drawing/DrawingScreen";

// Placeholder Screens

const ParentsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Parent Dashboard</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: "#F6BD60",
  text: "#333333",
  lightText: "#999",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.25)",
};

const BottomNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 35 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          },
        ],
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let tintColor = focused ? COLORS.primary : COLORS.lightText;

          if (route.name === "Home") {
            iconSource = home;
          } else if (route.name === "Drawing") {
            iconSource = colorpalette;
          } else if (route.name === "Chat") {
            iconSource = robot;
          } else if (route.name === "Parents") {
            iconSource = parents;
          }

          return (
            <Animated.View style={styles.tabButton}>
              <Image
                source={iconSource}
                style={[styles.tabIcon, { tintColor }]}
                resizeMode="contain"
              />
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen
       name="Drawing" 
       component={DrawingScreen}
       options={{
        tabBarStyle:{display:"none"}
       }}
       />

      {/* 👇 Ye hai trick: ChatbotScreen pe Tabbar hide ho jayega */}
      <Tab.Screen
        name="Chat"
        component={ChatbotScreen}
        options={{
          tabBarStyle: { display: "none" }, // Tab bar gayab 🚀
        }}
      />

      <Tab.Screen name="Parents" component={ParentsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 15,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    top: Platform.OS === "ios" ? 0 : 5,
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
});

export default BottomNavigator;
