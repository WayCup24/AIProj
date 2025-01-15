import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getRandomTasks = () => {
  const tasks = [
    { task: 'Покушать', startTime: '08:00', endTime: '09:00', duration: 60 },
    { task: 'Помыться', startTime: '10:00', endTime: '10:30', duration: 30 },
    { task: 'Поспать', startTime: '22:00', endTime: '06:00', duration: 480 },
    { task: 'Сделать домашнюю работу', startTime: '14:00', endTime: '16:00', duration: 120 },
    { task: 'Сходить в лес за малиной для вкусного варенья', startTime: '08:30', endTime: '11:00', duration: 150 },
    { task: 'Прочитать книгу, которая давно лежит на полке', startTime: '11:00', endTime: '12:30', duration: 90 },
    { task: 'Позаниматься спортом и подтянуть физическую форму', startTime: '16:00', endTime: '17:00', duration: 60 },
    { task: 'Убраться в комнате и навести порядок', startTime: '09:00', endTime: '10:30', duration: 90 },
    { task: 'Сделать покупки в супермаркете для недели', startTime: '13:00', endTime: '14:30', duration: 90 },
    { task: 'Посмотреть новый фильм, который все рекомендуют', startTime: '20:00', endTime: '22:00', duration: 120 },
    { task: 'Погулять в парке, подышать свежим воздухом', startTime: '18:00', endTime: '19:00', duration: 60 },
    { task: 'Написать письмо другу, которого давно не видел', startTime: '17:00', endTime: '18:00', duration: 60 },
    { task: 'Сходить на йогу, чтобы расслабиться после дня', startTime: '07:00', endTime: '08:00', duration: 60 },
    { task: 'Приготовить новый рецепт на ужин для всей семьи', startTime: '15:00', endTime: '16:30', duration: 90 },
    { task: 'Позвонить родителям и пообщаться по душам', startTime: '12:00', endTime: '12:30', duration: 30 },
    { task: 'Провести время с питомцем и выгулять его на улице', startTime: '09:30', endTime: '10:00', duration: 30 },
    { task: 'Устроить уютный вечер с чаем и книгой', startTime: '21:00', endTime: '23:00', duration: 120 },
    { task: 'Поехать на дачу и помочь в огороде', startTime: '08:00', endTime: '14:00', duration: 360 },
    { task: 'Изучить новый язык или пройти курс', startTime: '14:30', endTime: '16:00', duration: 90 },
    { task: 'Посетить музей, чтобы провести день с пользой', startTime: '11:30', endTime: '13:00', duration: 90 },
    { task: 'Сходить в кафе и попробовать новое блюдо', startTime: '19:30', endTime: '21:00', duration: 90 },
  ];

  const numTasks = Math.floor(Math.random() * 5);
  const randomTasks = [];

  for (let i = 0; i < numTasks; i++) {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    randomTasks.push(tasks[randomIndex]);
  }

  randomTasks.sort((a, b) => {
    const [aHour, aMin] = a.startTime.split(':').map(Number);
    const [bHour, bMin] = b.startTime.split(':').map(Number);
    const aTime = aHour * 60 + aMin;
    const bTime = bHour * 60 + bMin;
    return aTime - bTime;
  });

  for (let i = 1; i < randomTasks.length; i++) {
    const prevTask = randomTasks[i - 1];
    const currTask = randomTasks[i];
    const [prevEndHour, prevEndMin] = prevTask.endTime.split(':').map(Number);
    const prevEndTime = prevEndHour * 60 + prevEndMin;
    const [currStartHour, currStartMin] = currTask.startTime.split(':').map(Number);
    const currStartTime = currStartHour * 60 + currStartMin;

    if (currStartTime < prevEndTime) {
      [randomTasks[i], randomTasks[i - 1]] = [randomTasks[i - 1], randomTasks[i]];
    }
  }

  return randomTasks;
};

export default function Schedule() {
  const [buttonOpacity, setButtonOpacity] = useState(new Animated.Value(1));
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

  const dayz = [
    { name: 'Понедельник', date: '13.01.2024', tasks: getRandomTasks() },
    { name: 'Вторник', date: '14.01.2024', tasks: getRandomTasks() },
    { name: 'Среда', date: '15.01.2024', tasks: getRandomTasks() },
    { name: 'Четверг', date: '16.01.2024', tasks: getRandomTasks() },
    { name: 'Пятница', date: '17.01.2024', tasks: getRandomTasks() },
    { name: 'Суббота', date: '18.01.2024', tasks: getRandomTasks() },
    { name: 'Воскресенье', date: '19.01.2024', tasks: getRandomTasks() },
  ];

  const handleScroll = (event) => {
    const scrolling = event.nativeEvent.contentOffset.y > 0;

    if (scrolling) {
      Animated.timing(buttonOpacity, {
        toValue: 0.1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMomentumScrollEnd = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.weekNavigation}>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.weekText}>Текущая неделя</Text>
        <TouchableOpacity style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View style={styles.header}>
              <Text style={styles.dayName}>{day.name}</Text>
              <Text style={styles.date}>{day.date}</Text>
            </View>
            <LinearGradient
              colors={['#9998FA', '#E6F7FF']}
              style={styles.tasksContainer}
            >
              {day.tasks.length === 0 ? (
                <Text style={styles.noTasksText}>Задач нет</Text>
              ) : (
                day.tasks.map((task, taskIndex) => (
                  <View key={taskIndex} style={styles.taskContainer}>
                    <View style={styles.taskRow}>
                      <Text style={styles.timeTextLeft}>
                        {task.startTime} - {task.endTime}
                      </Text>
                      <Text style={styles.taskText}>{task.task}</Text>
                      <Text style={styles.timeTextRight}>
                        {task.duration} мин
                      </Text>
                    </View>
                    {taskIndex < day.tasks.length - 1 && (
                      <View style={styles.shortDashedLine} />
                    )}
                  </View>
                ))
              )}
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      <Animated.View style={[styles.floatingButton, styles.leftButton, { opacity: buttonOpacity }]}>
        <Link replace href="/profile">
          <View style={styles.leftButtonBackground}>
            <Image source={require('../assets/images/image2.png')} style={styles.leftButtonImage} />
          </View>
        </Link>
      </Animated.View>
      <Animated.View style={[styles.floatingButton, styles.rightButton, { opacity: buttonOpacity }]}>
        <Link replace href="/chat">
          <View style={styles.rightButtonBackground}>
            <Image source={require('../assets/images/image.png')} style={styles.rightButtonImage} />
          </View>
        </Link>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#BCEEFC',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  arrowButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9998FA',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 16,
    color: '#000',
  },
  tasksContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  taskContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  timeTextLeft: {
    position: 'absolute',
    top: -10,
    left: 0,
    fontSize: 14,
    color: '#555',
  },
  timeTextRight: {
    position: 'absolute',
    top: -10,
    right: 0,
    fontSize: 14,
    color: '#555',
  },
  noTasksText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  shortDashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#6A5ACD',
    borderStyle: 'dashed',
    marginVertical: 5,
    marginHorizontal: 40,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 20,
    width: 30,
    height: 30,
  },
  rightButton: {
    right: 20,
    width: 60,
    height: 60,
  },
  leftButtonBackground: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButtonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rightButtonBackground: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
