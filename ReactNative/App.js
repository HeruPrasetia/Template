import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './NavigationService';
import Toast from 'react-native-toast-message';
import Svg, { Path, Defs, G, Rect, ClipPath } from 'react-native-svg';
// import {
//   getMessaging,
//   requestPermission,
//   getToken,
//   onMessage,
//   onNotificationOpenedApp,
//   getInitialNotification,
//   AuthorizationStatus
// } from '@react-native-firebase/messaging';

// implementation platform('com.google.firebase:firebase-bom:32.7.1')
//     implementation 'com.google.firebase:firebase-messaging'

import Login from './src/page/Login';
import Home from './src/page/Home';
import Produk from './src/page/Produk';
import Voucher from './src/page/Voucher';
import Profile from './src/page/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        let Token = await AsyncStorage.getItem('token');
        navigation.replace('Main');
        // if (Token) {
        //   navigation.replace('MainHome');
        // } else {
        //   navigation.replace('Login');
        // }
      } catch (e) {
        console.log("Error baca token:", e);
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('./src/assets/splash.png')} style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }} resizeMode="contain" />
    </View>
  );
};

function MainApp() {
  // useEffect(() => {
  //   const messagingInstance = getMessaging();

  //   const requestFCMPermission = async () => {
  //     const authStatus = await requestPermission(messagingInstance);
  //     const enabled =
  //       authStatus === AuthorizationStatus.AUTHORIZED ||
  //       authStatus === AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       const token = await AsyncStorage.getItem("FirebaseToken");
  //       if (!token) getFcmToken();
  //     }
  //   };

  //   const getFcmToken = async () => {
  //     try {
  //       const fcmToken = await getToken(messagingInstance);
  //       if (fcmToken) {
  //         console.log('FCM Token:', fcmToken);
  //         let sql = await api("updatefirebasetoken", { FirebaseToken: fcmToken });
  //         if (sql.status === "sukses") {
  //           Pesan2(sql.pesan, "Berhasil");
  //           await AsyncStorage.setItem("FirebaseToken", fcmToken);
  //         }
  //       } else {
  //         console.log('Failed to get FCM token');
  //       }
  //     } catch (error) {
  //       console.log('Error getting FCM token:', error);
  //     }
  //   };

  //   const unsubscribeOnMessage = onMessage(messagingInstance, async remoteMessage => {
  //     console.log('Pesan baru di foreground:', remoteMessage);
  //     Pesan2(remoteMessage.notification?.body, remoteMessage.notification?.title);
  //   });

  //   const unsubscribeOnNotificationOpened = onNotificationOpenedApp(messagingInstance, remoteMessage => {
  //     console.log('Notification opened from background:', remoteMessage?.notification);
  //   });

  //   getInitialNotification(messagingInstance).then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log('Notification opened from quit state:', remoteMessage.notification);
  //     }
  //   });

  //   requestFCMPermission();

  //   return () => {
  //     unsubscribeOnMessage();
  //     unsubscribeOnNotificationOpened();
  //   };
  // }, []);


  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        left: 20,
        right: 20,
        elevation: 5,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 70,
        shadowColor: '#000',
        shadowOpacity: 0.2,   // tambah opacity biar lebih gelap
        shadowOffset: { width: 0, height: 5 }, // naikkan height biar jatuh ke bawah
        shadowRadius: 10,    // blur lebih gede
        elevation: 10,
      }
    }} >
      <Tab.Screen name="MainHome" component={HomeStack} options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{
            color: focused ? '#CE181B' : '#999999',
            fontWeight: 'bold'
          }}>
            Home
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16.393 8.35C16.5386 8.49261 16.6451 8.67021 16.7024 8.8658C16.7596 9.06138 16.7657 9.2684 16.72 9.467L14.072 16.51C14.021 16.6529 13.9272 16.7766 13.8034 16.8643C13.6796 16.952 13.5317 16.9994 13.38 17C13.2437 17.0046 13.1087 16.9718 12.9898 16.9052C12.8708 16.8386 12.7723 16.7406 12.705 16.622L11.797 13.646C11.7468 13.4809 11.6548 13.3317 11.5299 13.2127C11.4049 13.0937 11.2513 13.0091 11.084 12.967L8.26601 12.267C8.11769 12.2165 7.98853 12.1216 7.89613 11.9951C7.80372 11.8685 7.75256 11.7166 7.74961 11.56C7.74666 11.4033 7.79206 11.2496 7.87964 11.1197C7.96721 10.9898 8.09269 10.89 8.23901 10.834L15.299 8.034C15.4931 7.98777 15.6959 7.99258 15.8876 8.04795C16.0793 8.10333 16.2534 8.20739 16.393 8.35ZM24.75 12C24.75 14.3734 24.0462 16.6935 22.7276 18.6668C21.4091 20.6402 19.5349 22.1783 17.3422 23.0866C15.1495 23.9948 12.7367 24.2324 10.4089 23.7694C8.08115 23.3064 5.94295 22.1635 4.26472 20.4853C2.58649 18.8071 1.4436 16.6689 0.980582 14.3411C0.517559 12.0133 0.755199 9.60051 1.66345 7.4078C2.5717 5.21509 4.10977 3.34094 6.08316 2.02236C8.05655 0.703788 10.3766 0 12.75 0C15.9315 0.00344108 18.9818 1.26883 21.2315 3.51852C23.4812 5.76821 24.7466 8.81846 24.75 12ZM17.803 6.932C17.4099 6.53662 16.9193 6.25217 16.3809 6.10746C15.8424 5.96276 15.2753 5.96294 14.737 6.108C14.698 6.119 7.50901 8.972 7.50901 8.972C6.97449 9.18047 6.51822 9.55033 6.20367 10.0301C5.88911 10.51 5.7319 11.0759 5.7539 11.6492C5.7759 12.2225 5.97602 12.7747 6.32642 13.229C6.67682 13.6833 7.16008 14.0171 7.70901 14.184L10.055 14.771L10.828 17.295C11.0337 17.7995 11.3851 18.2312 11.8374 18.5349C12.2896 18.8386 12.8222 19.0005 13.367 19H13.411C13.9641 18.9929 14.502 18.8184 14.954 18.4996C15.4059 18.1808 15.7507 17.7326 15.943 17.214C15.943 17.214 18.636 10.049 18.643 10.014C18.7873 9.47184 18.7856 8.90116 18.6381 8.35987C18.4906 7.81858 18.2024 7.32596 17.803 6.932Z" fill={focused ? "#CE181B" : "#999999"} />
          </Svg>
        ),
      }}
      />
      <Tab.Screen name="MainProduk" component={ProdukStack} options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{
            color: focused ? '#CE181B' : '#999999',
            fontWeight: 'bold'
          }}>
            All Produk
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clip-path="url(#clip0_173_2897)">
              <Path d="M23.5472 9.034C22.9772 8.377 22.1512 8 21.2802 8H21.1942C20.6952 3.506 16.8752 0 12.2502 0C7.62522 0 3.80522 3.506 3.30622 8H3.25022C2.38022 8 1.55522 8.377 0.984218 9.034C0.413218 9.691 0.157218 10.562 0.280218 11.425L1.34122 18.849C1.76122 21.786 4.31522 24 7.28122 24H17.2502C20.2162 24 22.7702 21.785 23.1902 18.849L24.2512 11.425C24.3742 10.563 24.1172 9.692 23.5472 9.034ZM12.2502 2C15.7702 2 18.6912 4.613 19.1782 8H5.32222C5.80922 4.613 8.73022 2 12.2502 2ZM8.25022 19C8.25022 19.553 7.80322 20 7.25022 20C6.69722 20 6.25022 19.553 6.25022 19V13C6.25022 12.447 6.69722 12 7.25022 12C7.80322 12 8.25022 12.447 8.25022 13V19ZM13.2502 19C13.2502 19.553 12.8032 20 12.2502 20C11.6972 20 11.2502 19.553 11.2502 19V13C11.2502 12.447 11.6972 12 12.2502 12C12.8032 12 13.2502 12.447 13.2502 13V19ZM18.2502 19C18.2502 19.553 17.8032 20 17.2502 20C16.6972 20 16.2502 19.553 16.2502 19V13C16.2502 12.447 16.6972 12 17.2502 12C17.8032 12 18.2502 12.447 18.2502 13V19Z" fill={focused ? "#CE181B" : "#999999"} />
            </G>
            <Defs>
              <ClipPath id="clip0_173_2897">
                <Rect width="24" height="24" fill="white" transform="translate(0.25)" />
              </ClipPath>
            </Defs>
          </Svg>
        )
      }}
      />
      <Tab.Screen name="MainVoucher" component={VoucherStack} options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{
            color: focused ? '#CE181B' : '#999999',
            fontWeight: 'bold'
          }}>
            Voucher
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M18.75 0H6.75C5.95435 0 5.19129 0.31607 4.62868 0.87868C4.06607 1.44129 3.75 2.20435 3.75 3V23.9L7.42 21.39L10.091 23.216L12.757 21.39L15.423 23.216L18.087 21.391L21.75 23.9V3C21.75 2.20435 21.4339 1.44129 20.8713 0.87868C20.3087 0.31607 19.5456 0 18.75 0ZM15.75 14H7.75V12H15.75V14ZM17.75 9H7.75V7H17.75V9Z" fill={focused ? "#CE181B" : "#999999"} />
          </Svg>
        )
      }}
      />
      <Tab.Screen name="MainProfile" component={ProfileStack} options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{
            color: focused ? '#CE181B' : '#999999',
            fontWeight: 'bold'
          }}>
            Profile
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.25 12C15.5637 12 18.25 9.31371 18.25 6C18.25 2.68629 15.5637 0 12.25 0C8.93629 0 6.25 2.68629 6.25 6C6.25 9.31371 8.93629 12 12.25 12Z" fill={focused ? '#CE181B' : '#999999'} />
            <Path d="M12.25 14C7.28172 14.0055 3.25553 18.0317 3.25 23C3.25 23.5523 3.6977 24 4.24998 24H20.25C20.8022 24 21.25 23.5523 21.25 23C21.2445 18.0317 17.2183 14.0055 12.25 14Z" fill={focused ? '#CE181B' : '#999999'} />
          </Svg>
        )
      }}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

function ProdukStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }}>
      <Stack.Screen name="Produk" component={Produk} />
    </Stack.Navigator>
  );
}

function VoucherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade', }}>
      <Stack.Screen name="Voucher" component={Voucher} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }}>
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainApp} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CE181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
