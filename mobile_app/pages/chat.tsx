import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Здравствуйте, Name, давайте заполним ваше расписание.', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [days, setDays] = useState([
    { name: 'Понедельник', date: '13.01.2024', tasks: [] },
    { name: 'Вторник', date: '14.01.2024', tasks: [] },
    { name: 'Среда', date: '15.01.2024', tasks: [] },
    { name: 'Четверг', date: '16.01.2024', tasks: [] },
    { name: 'Пятница', date: '17.01.2024', tasks: [] },
    { name: 'Суббота', date: '18.01.2024', tasks: [] },
    { name: 'Воскресенье', date: '19.01.2024', tasks: [] },
  ]);

  useEffect(() => {
    const checkDays = async () => {
      const savedDays = await AsyncStorage.getItem('days');
      if (savedDays) {
        setDays(JSON.parse(savedDays));
      }
    };
    checkDays();
  }, []);

  useEffect(() => {
    const handleSetDays = async () => {
      if (days) {
        await AsyncStorage.setItem('days', JSON.stringify(days));
      }
    };
    handleSetDays();
  }, [days]);

  useEffect(() => {
    const checkMessages = async () => {
      const savedMessages = await AsyncStorage.getItem('messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    };
    checkMessages();
  }, []);

  useEffect(() => {
    const handleSetMessages = async () => {
      if (messages) {
        await AsyncStorage.setItem('messages', JSON.stringify(messages));
      }
    };
    handleSetMessages();
  }, [messages]);

  useEffect(() => {
    const checkUserName = async () => {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.text.includes('Name') ? { ...msg, text: msg.text.replace('Name', savedUserName) } : msg
          )
        );
      }
    };
    checkUserName();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const inText = inputText;
    setInputText('');

    try {
      const response = await fetch('http://192.168.0.101:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: inText,
          schedule: days,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data) {
        if (data.answer && data.days) {
          const botMessage = { id: (Date.now() + 1).toString(), text: data.answer, sender: 'bot' };
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }, 500);
          setDays(data.days);
        }
        else {
          const botMessage = { id: (Date.now() + 1).toString(), text: 'Ошибка на стороне сервера, попробуйте ещё раз', sender: 'bot' };
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }, 500);
        }
      }
    } catch (error) {
      console.log(error);
      const botMessage = { id: (Date.now() + 1).toString(), text: 'Не могу подключиться к серверу =(', sender: 'bot' };
          setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }, 500);
    }
  };

  const renderMessage = ({ item }) => {
    const messageStyle =
      item.sender === 'bot' ? [styles.message, styles.botMessage] : [styles.message, styles.userMessage];

    return (
      <View style={messageStyle}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY < 100) {
      setIsScrolledUp(true);
    } else {
      setIsScrolledUp(false);
    }
  };

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setIsScrolledUp(false);
  };

  const handleRightButtonPress = () => {
    console.log('Кнопка нажата');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.header}>
        <Image source={require('../assets/images/image.png')} style={styles.logo} />
        <Text style={styles.headerText}>AI секретарь</Text>
        <Link replace href="/schedule" style={styles.rightButton}>
          <Image source={require('../assets/images/image1.png')} style={styles.rightButtonIcon} />
        </Link>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {isScrolledUp && (
        <TouchableOpacity style={styles.scrollToEndButton} onPress={scrollToEnd}>
          <Text style={styles.scrollToEndButtonText}>↓</Text>
        </TouchableOpacity>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите сообщение..."
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#BCEEFC',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  rightButton: {
    padding: 5,
  },
  rightButtonIcon: {
    width: 30,
    height: 30,
  },
  chatContainer: {
    padding: 15,
    flexGrow: 1,
  },
  message: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '70%',
  },
  botMessage: {
    backgroundColor: '#F6ECE6',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#D1E7DD',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#BCEEFC',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
    paddingHorizontal: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  scrollToEndButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToEndButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
