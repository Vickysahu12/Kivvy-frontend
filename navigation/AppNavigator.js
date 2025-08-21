import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


{/* {All Import Screens} */}
import SplashScreen from '../screens/Auth/SplashScreen'
import OnboardingScreen from '../screens/Auth/OnboardingScreen'
import SignupScreen from '../screens/Auth/SignUpScreen'
import Signup from '../screens/Auth/Signup'
import Login from '../screens/Auth/Login'
// <-- Dashboard ko abhi bhi import rakha hai
import OtpScreen from '../screens/Auth/OtpScreen'
import Dashboard from '../screens/Home/Dashboard' 
import StoryScreen from '../screens/story/StoryScreen'
import BottomNavigator from './BottomNavigator' // <-- Bottom Navigator import kiya

const Stack = createStackNavigator()


export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Humne Stack Navigator isliye use kiya hai taaki Splash, Login,
        aur Onboarding screens poori screen le sakein aur bottom bar na dikhe.
        Jab user login kar lega, tab hum use BottomNavigator screen par bhej denge.
      */}
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen
          name='Splash'
          component={SplashScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name='OnBoarding'
          component={OnboardingScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name='SignUpScreen'
          component={SignupScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name='Signup'
          component={Signup}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name='OtpScreen'
          component={OtpScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown:false}}
        />
        {/* Yeh naya screen hai jo bottom navigator ko show karega.
          Iske andar hi Dashboard, Drawing, etc. tabs hain.
        */}
        <Stack.Screen
          name='BottomNavigator'
          component={BottomNavigator}
          options={{headerShown:false}}
        />
        {/* StoryScreen ko alag se rakha hai taaki jab video chale,
          toh bottom bar chala jaye.
        */}
        <Stack.Screen
          name='StoryScreen'
          component={StoryScreen}
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer> 
  )
}
