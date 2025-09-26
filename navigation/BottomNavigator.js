import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
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
  light: "#aaa",
};

const TabIcon = ({ focused, source }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Image
        source={source}
        style={{
          width: 26,
          height: 26,
          resizeMode: "contain",
        }}
      />
    </Animated.View>
  );
};

export default function BottomNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.light,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ],
        // 👇 remove default black ripple
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={1} // no opacity/ripple change
            style={[props.style, { backgroundColor: "transparent" }]}
          />
        ),
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === "Home") iconSource = home;
          else if (route.name === "Drawing") iconSource = colorpalette;
          else if (route.name === "Chat") iconSource = robot;
          else if (route.name === "Parents") iconSource = parents;

          return <TabIcon focused={focused} source={iconSource} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Drawing" component={DrawingScreen} options={{tabBarStyle:{display:"none"}}}/>
      <Tab.Screen name="Chat" component={ChatbotScreen} options={{tabBarStyle:{display:"none"}}}/>
      <Tab.Screen name="Parents" component={ParentDashboard} options={{tabBarStyle:{display:"none"}}}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    elevation: 10,
  },
});
