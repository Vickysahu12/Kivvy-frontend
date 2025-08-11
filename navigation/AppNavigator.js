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
import Dashboard from '../screens/Home/Dashboard'
import OtpScreen from '../screens/Auth/OtpScreen'

const Stack = createStackNavigator()


export default function AppNavigator() {
  return (
    <NavigationContainer>
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
            <Stack.Screen
            name='Dashboard'
            component={Dashboard}
            options={{headerShown:false}}
            />
        </Stack.Navigator>
    </NavigationContainer> 
  )
}