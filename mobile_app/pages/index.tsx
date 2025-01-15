import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const checkUserName = async () => {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName) {
        router.replace('/schedule');
      }
    };
    checkUserName();
  }, []);
  return (
    <View style={styles.container}>
    <StatusBar barStyle={"dark-content"} />
      <LinearGradient colors={['#BCEEFC', '#3937AD']} style={styles.gradient} >
        <View style={styles.content}>
          <Image source={require('../assets/images/image.png')} style={styles.image} />
          <Text style={styles.text}>AI секретарь</Text>
          <View style={styles.buttonContainer}>
            <Link replace href="/login" style={styles.button} >
              <Text style={styles.buttonText}>Вход</Text>
            </Link>
            <Link replace href="/registration" style={styles.button} >
              <Text style={styles.buttonText}>Регистрация</Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: -200, // Поднимите контент выше
    alignItems: 'center',
  },
  image: {
    width: 132,
    height: 123,
    marginBottom: 20,
  },
  text: {
    color: '#3937AD',
    fontSize: 40,
    marginTop: -10,
    fontFamily: 'RubikGlitch-Regular', 
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 50, // Опустите кнопки ниже
    width: '260', // Ширина контейнера для кнопок
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 10, // Отступ между кнопками
    width: '260', // Ширина кнопок
    height: '60',
    padding: 10, // Внутренний отступ кнопок
    borderRadius: 10, // Скругленные углы кнопок
    backgroundColor: 'white', // Цвет кнопок
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
    },
  buttonText: {
    color: '#3937AD',
    fontSize: 32,
    textAlign: 'center'
  },
});
