import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
  const [password, setPassword] = useState('');
  const inputRefs = useRef([]);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const handleSaveUserName = async () => {
    if (userName.trim() !== '') {
      await AsyncStorage.setItem('userName', userName);
      router.replace('/schedule');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
    <StatusBar barStyle={"dark-content"} />
    <LinearGradient colors={['#BCEEFC', '#3937AD']} style={styles.gradient} >
        <View style={styles.content}>
        <Image source={require('../assets/images/image.png')} style={styles.image} />
        <Text style={styles.text}>AI секретарь</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Логин</Text>
            <TextInput
            ref={el => inputRefs.current[0] = el}
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            onSubmitEditing={dismissKeyboard}  
            />
            <Text style={styles.label}>Пароль</Text>
            <TextInput
            ref={el => inputRefs.current[1] = el}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={dismissKeyboard} 
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSaveUserName}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
            <Link replace href="/" style={styles.button}>
              <Text style={styles.buttonText}>Назад</Text>
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
    marginTop: -100, 
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    color: '#3937AD',
    fontSize: 40,
    marginTop: -10,
    fontFamily: 'RubikGlitch-Regular', 
    marginBottom: 20,
  },
  inputContainer: {
    width: '320',
    height: '50',
  },
  label: {
    fontSize: 20,
  },
  input: {
    width: '320',
    height: '50',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 150,
    width: '260',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: '260',
    height: '60',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
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
