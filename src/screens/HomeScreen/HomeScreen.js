import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Heading, HStack, Progress, ScrollView,Text, View, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
import * as RootNavigation from "../../utils/RootNavigation";
import styles from "../HomeScreen/styles"
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function HomeScreen(props) {
    const user = props.route.params.user ? props.route.params.user : props.extraData
    const userID = props.route.params.user.id ? props.route.params.user.id : props.extraData.id;
    const { t } = useTranslation();

    const [greeting, setGreeting] = useState("GreetingsMorning")
    const [allValues, setAllValues] = useState({
        name: "",
        surname: "",
        email: "",
        age: 0,
        gender: 0,
        height: 0,
        weight: 0,
        dailyGoalCalories: 0,
        dailyGoalDistance: 0,
        dailyGoalSteps: 0,
    });

    const [dailyActivityInfo, setDailyActivityInfo] = useState({
        calories: 0,
        distance: 0,
        steps: 0,
        lastTraining: []
    })

    const pickGreeting = () => {
        let h = new Date().getHours();
        if(user.permissionLevel === 1) {
            setGreeting("GreetingsEmployee")
        } else if(h > 4 && h < 12){
            setGreeting("GreetingsMorning");
        }else if(h >= 12 && h < 13){
            setGreeting("GreetingsNoon");
        }else if(h >=13 && h<18){
            setGreeting("GreetingsAfternoon");
        }else if(h >=18 && h<22){
            setGreeting("GreetingsEvening");
        }else{
            setGreeting("GreetingsNight");
        }
    }

    useEffect(() => {
        getData();
        pickGreeting();

    },[] )

    const getData = async () => {
        const date = new Date();
        const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate();
        await firebase.firestore().collection('userPersonalData').doc(userID).get().then(snapshot => setAllValues(snapshot.data()));
        const snap = firebase.firestore().collection('gpsTrainingInfo');
        snap.get().then((querySnapshot) => {
            let calories = 0;
            let steps = 0;
            let distance = 0;
            let lastDate = "1999-01-01".split("-")
            let lastTime = "00:00:00".split(":");
            querySnapshot.forEach((doc) => {
                let inf = doc.data();
                let date = inf.date.split("-");
                let time = inf.timeStarted.split(":");
                if(inf.userId === userID && dateYMD === inf.date){
                    calories = calories +  parseInt(inf.calories);
                    distance = distance + (inf.distance * 1000);
                    steps = 0
                }
                if(date[0] > lastDate[0]){
                    lastDate = date;
                    lastTime = time;
                }

                if(date[0] === lastDate[0]){
                    if(date[1] > lastDate[1]){
                        lastDate = date;
                        lastTime = time;
                    } else if(date[1] === lastDate[1]){
                        if(date[2] > lastDate[2]){
                            lastDate = date;
                            lastTime = time;
                        }else if(date[2] === lastDate[2]){
                            if(time[0] > lastTime[0]){
                                lastDate = date;
                                lastTime = time;
                            }else if(time[0] === lastTime[0]){
                                if(time[1] > lastTime[1]){
                                    lastDate = date;
                                    lastTime = time;
                                } else if(time[1] === lastTime[1]){
                                    if(time[2] > lastTime[2]){
                                        lastDate = date;
                                        lastTime = time;
                                    }
                                }
                            }
                        }
                    }
                }
            })
            let tr = {};
            querySnapshot.forEach((doc) => {
                let dd = doc.data();
                let ddDate = dd.date.split("-")
                let ddTime = dd.timeStarted.split(":")
                if(ddDate[0] === lastDate[0] && ddDate[1] === lastDate[1] && ddDate[2] === lastDate[2]
                    && ddTime[0] === lastTime[0] && ddTime[1] === lastTime[1] && ddTime[2] === lastTime[2]){
                    tr = dd;
                }
            })
            const tempDoc = {
                calories: calories,
                distance: distance,
                steps: steps,
                lastTraining: tr
            }
            setDailyActivityInfo(tempDoc);
        })
    }

    return (
        <NativeBaseProvider>
            <ScrollView style={{flex: 1, height: '100%'}}>
            <Box w="100%" h="100%" bg="white" >
                <VStack space="md" marginTop={7}>
                    <View style={styles.headingUser}>
                    <Heading marginTop={10} textAlign="center" >
                        {t('Hello')}, {allValues.name}
                    </Heading>
                    <Heading padding={4} size="md" textAlign="center">
                        {t(greeting)}
                    </Heading>
                    </View>
                    {user.permissionLevel === 0 ? <View>
                    <VStack style={styles.dailyProgress} mx={4} space="md">
                        <Heading size="md">{t('dailyGoalsMain')}:</Heading>
                        <Progress style={styles.progressBar} colorScheme="primary" value={(dailyActivityInfo.calories/allValues.dailyGoalCalories)*100} />
                        <Heading size="sm" textAlign="right">{t('goalCaloriesMain')}: {dailyActivityInfo.calories}/{allValues.dailyGoalCalories}</Heading>
                        <Progress style={styles.progressBar} colorScheme="secondary" value={(dailyActivityInfo.distance/allValues.dailyGoalDistance)*100} />
                        <Heading size="sm" textAlign="right">{t('goalDistanceMain')}: {dailyActivityInfo.distance}/{allValues.dailyGoalDistance}m</Heading>
                        <Progress style={styles.progressBar} colorScheme="emerald" value={(dailyActivityInfo.steps/allValues.dailyGoalSteps)*100} />
                        <Heading size="sm" textAlign="right">{t('goalStepsMain')}: {dailyActivityInfo.steps}/{allValues.dailyGoalSteps}</Heading>

                    </VStack>
                    <Pressable
                        onPress={() => RootNavigation.navigate('History', {user})}
                        style={styles.press}
                    >
                        <Box p="5" rounded="8" bg="#8ccdff">
                            <HStack alignItems="flex-start">
                                <Text fontSize={23} color="#000" fontWeight="medium">
                                    {t('trainingHistory')} &#10140;
                                </Text>
                            </HStack>
                            {
                                        <View style={{borderWidth: 1, borderColor: '#338cb5', marginTop: 10 , borderRadius: 10, padding: 5}}>
                                            <View style={{ flexDirection: 'row',}}>
                                                <Text fontSize={20} color="#000" fontWeight="medium">{t('lastTraining')}:</Text>
                                                <Text fontSize={20} color="#000" fontWeight="medium"> {dailyActivityInfo.lastTraining.date}</Text>
                                            </View>

                                            <View style={{ marginTop: 10}}>
                                                <Text  fontSize={15} color="#000" fontWeight="medium">{t('distance')} {dailyActivityInfo.lastTraining.distance} km  </Text>
                                                <Text fontSize={15} color="#000" fontWeight="medium">{t('calories')} {dailyActivityInfo.lastTraining.calories}</Text>
                                                <Text fontSize={15} color="#000" fontWeight="medium">{t('timeElapsed')} {dailyActivityInfo.lastTraining.time}</Text>
                                            </View>
                                        </View>
                            }

                        </Box>

                    </Pressable></View> : <View style={{backgroundColor: '#fff', marginBottom: '45%'} }>
                        <Pressable
                            onPress={() => RootNavigation.navigate('Map', {user})}
                            style={styles.press1}>
                            <Box p="5" rounded="8" bg="#c0b5ff" style={{flex: 1}}>
                                <HStack alignItems="flex-start">
                                    <Text fontSize={25} color="#000" fontWeight="medium">
                                        {t('employeeGoToMap')} &#10140;
                                    </Text>
                                </HStack>
                            </Box>
                        </Pressable>

                        <Pressable
                            onPress={() => RootNavigation.navigate('Training', {user})}
                            style={styles.press2}>
                            <Box p="5" rounded="8" bg="#ffccb8" style={{flex: 1}}>
                                <HStack alignItems="flex-start">
                                    <Text fontSize={25} color="#000" fontWeight="medium">
                                        {t('employeeGoToTraining')} &#10140;
                                    </Text>
                                </HStack>
                            </Box>
                        </Pressable>

                        <Pressable
                            onPress={() => RootNavigation.navigate('Diet', {user})}
                            style={styles.press3}>
                            <Box p="5" rounded="8" bg="#8ccdff" style={{flex: 1}}>
                                <HStack alignItems="flex-start">
                                    <Text fontSize={25} color="#000" fontWeight="medium">
                                        {t('employeeGoToDiet')} &#10140;
                                    </Text>
                                </HStack>
                            </Box>
                        </Pressable>

                        <Pressable
                            onPress={() => RootNavigation.navigate('EditUsersHistory', {user})}
                            style={styles.press4}>
                            <Box p="5" rounded="8" bg="#87faeb" style={{flex: 1}}>
                                <HStack alignItems="flex-start">
                                    <Text fontSize={25} color="#000" fontWeight="medium">
                                        {t('employeeGoToHistory')} &#10140;
                                    </Text>
                                </HStack>
                            </Box>
                        </Pressable>
                    </View> }



                </VStack>
            </Box>
            </ScrollView>
            <Footer choice={0} user={user}/>
        </NativeBaseProvider>
    )
}