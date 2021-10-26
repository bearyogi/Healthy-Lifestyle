import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Heading, Progress, Text, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
import {Button} from "native-base";
import * as RootNavigation from "../../utils/RootNavigation";
import styles from "../HomeScreen/styles"

export default function HomeScreen(props) {
    const userID = props.extraData.id;
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
            querySnapshot.forEach((doc) => {
                let inf = doc.data();
                if(inf.userId === userID && dateYMD === inf.date){
                    calories = calories +  parseInt(inf.calories);
                    distance = distance + (inf.distance * 1000);
                    steps = 0
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
                    <Button style={styles.historyButton} onPress={() => RootNavigation.navigate('History', {userID})}><Text style={{fontSize: 17, color: '#000'}}>{t('trainingHistory')}</Text></Button>
                </VStack>

            </Box>
            <Footer choice={0} user={props.extraData.user}/>
        </NativeBaseProvider>
    )
}