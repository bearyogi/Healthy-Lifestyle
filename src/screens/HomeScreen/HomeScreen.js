import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Heading, HStack, Progress, ScrollView,Text, View, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
import styles from "../HomeScreen/styles"
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function HomeScreen(props) {
    const user = props.route.params.user ? props.route.params.user : props.extraData
    const userID = props.route.params.user.id ? props.route.params.user.id : props.extraData.id;
    const { t } = useTranslation();

    const [ticks, setTicks] = useState({
        tick1 : "❔",
        tick2 : "❔",
        tick3 : "❔",
        tick4 : "❔",
        tick5 : "❔",
        tick6 : "❔",
        tick7 : "❔",

    });
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

    function getDayName(cnt) {
        const date = new Date();
        let dayNum = date.getDay()-1;
        if(cnt <= dayNum){
            dayNum = dayNum - cnt;
        }else{
            dayNum = dayNum + (7 - cnt)
        }
        if(dayNum === 0){
            return t('monday')
        }else if(dayNum === 1){
            return t('tuesday')
        }else if(dayNum === 2){
            return t('wednesday')
        }else if(dayNum === 3){
            return t('thursday')
        }else if(dayNum === 4){
            return t('friday')
        }else if(dayNum === 5){
            return t('saturday')
        }else if(dayNum === 6){
            return t('sunday')
        }
        return null;
    }

    useEffect(() => {
        getData().then(Promise.resolve);
        getTickData().then(Promise.resolve);
        pickGreeting();

    },[] )


    const getTickData = async () => {
        let date = new Date();
        let date1 = new Date();
        let date2 = new Date();
        let date3 = new Date();
        let date4 = new Date();
        let date5 = new Date();
        let date6 = new Date();
        let date7 = new Date();
        date1.setDate(date.getDate());
        date2.setDate(date.getDate() - 1);
        date3.setDate(date.getDate() - 2);
        date4.setDate(date.getDate() - 3);
        date5.setDate(date.getDate() - 4);
        date6.setDate(date.getDate() - 5);
        date7.setDate(date.getDate() - 6);
        date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1)+ "-" + date1.getDate();
        date2 = date2.getFullYear() + "-" + (date2.getMonth() + 1)+ "-" + date2.getDate();
        date3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)+ "-" + date3.getDate();
        date4 = date4.getFullYear() + "-" + (date4.getMonth() + 1)+ "-" + date4.getDate();
        date5 = date5.getFullYear() + "-" + (date5.getMonth() + 1)+ "-" + date5.getDate();
        date6 = date6.getFullYear() + "-" + (date6.getMonth() + 1)+ "-" + date6.getDate();
        date7 = date7.getFullYear() + "-" + (date7.getMonth() + 1)+ "-" + date7.getDate();

        let tick1 = "❔"
        let tick2 = "❔"
        let tick3 = "❔"
        let tick4 = "❔"
        let tick5 = "❔"
        let tick6 = "❔"
        let tick7 = "❔"

        const snap2 =  firebase.firestore().collection('userDailyTrainingData');
        snap2.get().then(async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                    if (doc.data().userId === props.route.params.user.id) {

                        let calories = parseInt(doc.data().calories);
                        let distance = parseInt(doc.data().distance);
                        let steps = parseInt(doc.data().steps);
                        let goalCalories = parseInt(doc.data().actualGoalCalories);
                        let goalDistance = parseInt(doc.data().actualGoalDistance);
                        let goalSteps = parseInt(doc.data().actualGoalSteps);

                        if(doc.data().date === date1 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick1 = "✔"
                        }else if(doc.data().date === date1){
                            tick1 = "❌"
                        }

                        if(doc.data().date === date2 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick2 = "✔"
                        }else if(doc.data().date === date2){
                            tick2 = "❌"
                        }

                        if(doc.data().date === date3 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick3 = "✔"
                        }else if(doc.data().date === date3){
                            tick3 = "❌"
                        }

                        if(doc.data().date === date4 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick4 = "✔"
                        }else if(doc.data().date === date4){
                            tick4 = "❌"
                        }

                        if(doc.data().date === date5 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick5 = "✔"
                        }else if(doc.data().date === date5){
                            tick5 = "❌"
                        }

                        if(doc.data().date === date6 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick6 = "✔"
                        }else if(doc.data().date === date6){
                            tick6 = "❌"
                        }

                        if(doc.data().date === date7 && calories >= goalCalories && distance >= goalDistance && steps >= goalSteps){
                            tick7 = "✔"
                        }else if(doc.data().date === date7){
                            tick7 = "❌"
                        }


                    }
                }
            )
        setTicks({
            tick1 : tick1,
            tick2 : tick2,
            tick3 : tick3,
            tick4 : tick4,
            tick5 : tick5,
            tick6 : tick6,
            tick7 : tick7,
        })
        })
    }

    const getData = async () => {
        let calories = 0;
        let steps = 0;
        let distance = 0;
        const date = new Date();
        const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate();
        const userDataObj = await firebase.firestore().collection('userPersonalData').doc(userID).get()
        setAllValues(userDataObj.data())
        const snap = await firebase.firestore().collection('gpsTrainingInfo');
        snap.get().then((querySnapshot) => {

            let lastDate = "1999-01-01".split("-")
            let lastTime = "00:00:00".split(":");
            querySnapshot.forEach((doc) => {
                if(doc.data().userId === userID){

                let inf = doc.data();
                let date = inf.date.split("-");
                let time = inf.timeStarted.split(":");
                if(inf.userId === userID && dateYMD === inf.date){
                    calories = calories +  parseInt(inf.calories);
                    distance = distance + (inf.distance * 1000);
                    if(userDataObj.data().gender === '1' || userDataObj.data().gender === '0'){
                        let stepLengthMeters = (parseInt(userDataObj.data().height) * 0.415).toFixed(2) / 100;
                        steps = (distance / stepLengthMeters).toFixed(0);

                    }else{
                        let stepLengthMeters = (parseInt(userDataObj.data().height) * 0.413).toFixed(2) * 100;
                        steps = (distance / stepLengthMeters).toFixed(0);

                    }
                }

                if(parseInt(date[0], 10) > parseInt(lastDate[0], 10)){
                    lastDate = date;
                    lastTime = time;
                }

                if(parseInt(date[0], 10) === parseInt(lastDate[0], 10)){
                    if(parseInt(date[1], 10) > parseInt(lastDate[1], 10)){
                        lastDate = date;
                        lastTime = time;
                    } else if(parseInt(date[1], 10) === parseInt(lastDate[1], 10)){
                        if(parseInt(date[2], 10) > parseInt(lastDate[2], 10)){
                            lastDate = date;
                            lastTime = time;
                        }else if(parseInt(date[2], 10) === parseInt(lastDate[2], 10)){
                            if(parseInt(time[0], 10) > parseInt(lastTime[0], 10)){
                                lastDate = date;
                                lastTime = time;
                            }else if(parseInt(time[0], 10) === parseInt(lastTime[0], 10)){
                                if(parseInt(time[1], 10) > parseInt(lastTime[1], 10)){
                                    lastDate = date;
                                    lastTime = time;
                                } else if(parseInt(time[1], 10) === parseInt(lastTime[1], 10)){
                                    if(parseInt(time[2], 10) > parseInt(lastTime[2], 10)){
                                        lastDate = date;
                                        lastTime = time;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            }

        )
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

            let id;
            const snap2 = firebase.firestore().collection('userDailyTrainingData');
            snap2.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().userId === props.route.params.user.id && doc.data().date === dateYMD){
                        id = doc.id;
                        firebase.firestore().collection('userDailyTrainingData').doc(id).update({
                            distance: distance,
                            calories: calories,
                            steps: steps
                        })
                    }}
                )

            })
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
                        onPress={() => props.navigation.push('History',{user})}
                        style={styles.press}
                    >
                        <Box p="5" rounded="8" bg="#d9ffcf">
                            <HStack alignItems="flex-start">
                                <Text fontSize={23} color="#000" fontWeight="medium">
                                    {t('trainingHistory')} &#10140;
                                </Text>
                            </HStack>
                            {
                                        <View style={{borderWidth: 1, borderColor: '#4ca649', marginTop: 10 , borderRadius: 10, padding: 3}}>
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

                    </Pressable>

                        <Pressable style={styles.press5}>
                            <Box p="5" rounded="8" bg="#fffbc2">
                                <HStack alignItems="flex-start" style={{height: 50}}>
                                    <Text fontSize={23} color="#000" fontWeight="medium">
                                        {t('activityOverWeek')}
                                    </Text>
                                </HStack>
                                {
                                    <View style={{ marginTop: 10 , borderRadius: 10, padding: 3}}>

                                        <View style={{ flexDirection: 'row',}}>
                                            <Text style={styles.tickText}>{ticks.tick7}</Text>
                                            <Text style={styles.tickText}>{ticks.tick6}</Text>
                                            <Text style={styles.tickText}>{ticks.tick5}</Text>
                                            <Text style={styles.tickText}>{ticks.tick4}</Text>
                                            <Text style={styles.tickText}>{ticks.tick3}</Text>
                                            <Text style={styles.tickText}>{ticks.tick2}</Text>
                                            <Text style={styles.tickText}>{ticks.tick1}</Text>

                                        </View>

                                        <View style={{ flexDirection: 'row',}}>
                                            <Text style={styles.weekText}>{getDayName(6)}</Text>
                                            <Text style={styles.weekText}>{getDayName(5)}</Text>
                                            <Text style={styles.weekText}>{getDayName(4)}</Text>
                                            <Text style={styles.weekText}>{getDayName(3)}</Text>
                                            <Text style={styles.weekText}>{getDayName(2)}</Text>
                                            <Text style={styles.weekText}>{getDayName(1)}</Text>
                                            <Text style={styles.weekText}>{getDayName(0)}</Text>

                                        </View>

                                        <View style={{ marginTop: 10}}>

                                        </View>
                                    </View>
                                }

                            </Box>

                        </Pressable>

                    </View> : <View style={{backgroundColor: '#fff', marginBottom: '45%'} }>
                        <Pressable
                            onPress={() => props.navigation.push('Map',{user})}
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
                            onPress={() => props.navigation.push('Training',{user})}
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
                            onPress={() => props.navigation.push('Diet',{user})}
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
                            onPress={() => props.navigation.push('EditUsersHistory',{user})}
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
            <Footer choice={0} user={user} navigation={props.navigation}/>
        </NativeBaseProvider>
    )
}