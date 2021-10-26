import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Flex, Heading, HStack, Progress, ScrollView, Spacer, Stack, Text, View, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
import {Button} from "native-base";
import * as RootNavigation from "../../utils/RootNavigation";
import styles from "../HomeScreen/styles"
import MapView, {Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {List} from "react-native-paper";

export default function HomeScreen(props) {
    const userID = props.extraData.id;
    const { t } = useTranslation();

    const [greeting, setGreeting] = useState("GreetingsMorning")
    const [lastTraining, setLastTraining] = useState([]);
    const [lt, setLt] = useState(false);
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
        steps: 0
    })

    const pickGreeting = () => {
        let h = new Date().getHours();
        if(h > 4 && h < 12){
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
    }, [])

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

            querySnapshot.forEach((doc) => {
                let dd = doc.data();
                let ddDate = dd.date.split("-")
                let ddTime = dd.timeStarted.split(":")
                if(ddDate[0] === lastDate[0] && ddDate[1] === lastDate[1] && ddDate[2] === lastDate[2]
                    && ddTime[0] === lastTime[0] && ddTime[1] === lastTime[1] && ddTime[2] === lastTime[2]){
                    setLastTraining(lastTraining, ...dd)
                    setLt(true);
                }
            })

            const tempDoc = {
                calories: calories,
                distance: distance,
                steps: steps
            }
           setDailyActivityInfo(tempDoc);
        })


    }

    return (
        <NativeBaseProvider >
            <ScrollView style={{flex: 1, height: '100%'}}>
            <Box w="100%" h="94%" bg="white">
                <VStack space="md" marginTop={7}>
                    <Heading marginTop={10} textAlign="center" >
                        {t('Hello')}, {allValues.name}
                    </Heading>
                    <Heading padding={4} size="md" textAlign="center">
                        {t(greeting)}
                    </Heading>
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
                        onPress={() => RootNavigation.navigate('History', {userID})}
                        style={styles.press}
                    >
                        <Box p="5" rounded="8" bg="#8ccdff">
                            <HStack alignItems="flex-start">
                                <Text fontSize={18} color="#000" fontWeight="medium">
                                    {t('trainingHistory')} &#10140;
                                </Text>
                            </HStack>
                            {
                                lastTraining.map(function(d){
                                    return (
                                        <View>
                                            <Text style={{ marginTop: 30}} fontSize={22} color="#000" fontWeight="medium">{t('lastTraining')}</Text>
                                            <View style={{  width: '98%', alignSelf: 'center', marginTop: 3, marginBottom: 3}}>

                                                <View style={{height: 250, width: '100%'}}>
                                                    <MapView
                                                        style={{ flex: 1, width: '100%', alignContent: 'center', height: '100%'}}
                                                        provider={PROVIDER_GOOGLE}
                                                        region={d.region}
                                                        zoomEnabled={true}
                                                        pitchEnabled={false}
                                                        scrollEnabled={false}
                                                        rotateEnabled={false}
                                                        zoomControlEnabled={false}
                                                        zoomTapEnabled={false}

                                                        initialRegion={d.initialRegion}
                                                        lineDashPattern={[0]}

                                                    >

                                                        <Polyline
                                                            coordinates={d.coords}
                                                            geodesic={true}
                                                            strokeColor='#01bffe'
                                                            fillColor="rgba(0,0,255,0.5)"
                                                            strokeWidth={4}
                                                            lineDashPattern={[5]}
                                                        />

                                                    </MapView>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 10}}>
                                                <Text  fontSize={18} color="#000" fontWeight="medium">    {t('distance')} {d.distance} km  </Text>
                                                <Text fontSize={18} color="#000" fontWeight="medium">{t('calories')} {d.calories}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }

                        </Box>

                    </Pressable>



                </VStack>

            </Box>
            <Footer choice={0} user={props.extraData.user}/>
                </ScrollView>
        </NativeBaseProvider>
    )
}