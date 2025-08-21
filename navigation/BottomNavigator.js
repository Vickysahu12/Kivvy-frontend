import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import home from "../assets/icon/home.png"
import colorpalette from "../assets/icon/colorpalette.png"
import robot from "../assets/icon/robotassistant.png"
import parents from "../assets/icon/parents.png"

// Import your screens
import Dashboard from '../screens/Home/Dashboard';

// Placeholder screens for now
const DrawingScreen = () => <View style={styles.container}><Text style={styles.text}>Drawing Screen</Text></View>;
const ChatScreen = () => <View style={styles.container}><Text style={styles.text}>Chatbot Screen</Text></View>;
const ParentsScreen = () => <View style={styles.container}><Text style={styles.text}>Parent Dashboard</Text></View>;

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#F6BD60',
  text: '#333333',
  lightText: '#666666',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.1)',
};

const BottomNavigator = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let tintColor = focused ? COLORS.primary : COLORS.lightText;

          // Set icon source for each tab
          if (route.name === 'Home') {
            iconSource = home;
          } else if (route.name === 'Drawing') {
            iconSource = colorpalette;
          } else if (route.name === 'Chat') {
            iconSource = robot;
          } else if (route.name === 'Parents') {
            iconSource = parents;
          }

          // Ab Image component use hoga
          return (
            <View style={styles.tabButton}>
              <Image 
                source={iconSource}
                style={[styles.tabIcon, { tintColor }]}
                resizeMode="contain"
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Drawing" component={DrawingScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Parents" component={ParentsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 60,
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 28, // Icon ki width set ki
    height: 28, // Icon ki height set ki
  },
});

export default BottomNavigator;
