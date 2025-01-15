import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const [userName, setUserName] = useState('');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserName = async () => {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    };
    checkUserName();
  }, []);

  const toggleSwitch = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleQuit = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.header}>
        <Image source={require('../assets/images/image2.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>{userName}</Text>
      </View>
      <View style={styles.profileSection}>
        <Link replace href="/profile" style={styles.option}>
            <Image source={require('../assets/images/image4.png')} style={styles.bottomLeftButtonImage} />
        </Link>
        <View style={styles.purpleLine} />
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Сменить имя</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Поменять пароль</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Поменять почту</Text>
        </TouchableOpacity>
        <View style={styles.flexibleSpace} />
        <View style={styles.purpleLine} />
        <TouchableOpacity style={styles.option} onPress={handleQuit}>
          <Text style={styles.optionText}>Удалить профиль</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <Link replace href="/schedule" style={styles.bottomLeftButton}>
          <View style={styles.bottomLeftButtonBackground}>
            <Image source={require('../assets/images/image3.png')} style={styles.bottomLeftButtonImage} />
          </View>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#D8F3F4',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flex: 1,
    backgroundColor: '#F5EBE7',
    marginHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 20,
    padding: 15,
    justifyContent: 'space-between',
  },
  smallSpace: {
    height: 5,
  },
  purpleLine: {
    height: 2,
    backgroundColor: '#7A4DD8',
    marginVertical: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
  flexibleSpace: {
    flex: 1,
  },
  bottomSection: {
    backgroundColor: '#D8F3F4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  bottomLeftButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLeftButtonBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLeftButtonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
