import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Image, Animated, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icons
import home from "../assets/icon/home.png";
import colorpalette from "../assets/icon/colorpalette.png";
import robot from "../assets/icon/robotassistant.png";
import parents from "../assets/icon/parents.png";

// Screens
import Dashboard from "../screens/Home/Dashboard";
import ChatbotScreen from "../screens/chatbot/ChatBot";
import DrawingScreen from "../screens/Drawing/DrawingScreen";
import ParentDashboard from "../screens/Parent/ParentDashBoard";

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: "#F6BD60",
  text: "#333",
  light: "#aaa",
};

const AnimatedIcon = ({ focused, source }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [focused]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { rotate: spin }],
        alignItems: "center",
      }}
    >
      <Image
        source={source}
        style={{
          width: 30,
          height: 30,
          tintColor: focused ? COLORS.primary : COLORS.light,
        }}
      />
      {focused && <View style={styles.indicator} />}
    </Animated.View>
  );
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
            height: 55 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          },
        ],
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === "Home") {
            iconSource = home;
          } else if (route.name === "Drawing") {
            iconSource = colorpalette;
          } else if (route.name === "Chat") {
            iconSource = robot;
          } else if (route.name === "Parents") {
            iconSource = parents;
          }

          return <AnimatedIcon focused={focused} source={iconSource} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen
        name="Drawing"
        component={DrawingScreen}
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatbotScreen}
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Tab.Screen
        name="Parents"
        component={ParentDashboard}
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 15,
    borderRadius: 30,
    backgroundColor: "#fff",
    elevation: 5,
    borderTopWidth: 0,
  },
  indicator: {
    marginTop: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default BottomNavigator;

 // Lets begin this journey again launch on november 11