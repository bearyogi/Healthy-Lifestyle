import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Heading, Progress, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';

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
        await firebase.firestore().collection('userPersonalData').doc(userID).get().then(snapshot => setAllValues(snapshot.data()));
    }

    return (
        <NativeBaseProvider>
            <Box w="100%" h="93%" bg="white">
                <VStack space="md" marginTop={7}>
                    <Heading textAlign="center" >
                        {t('Hello')}, {allValues.name}
                    </Heading>
                    <Heading size="md" textAlign="center">
                        {t(greeting)}
                    </Heading>
                    <VStack mx={4} space="md">
                        <Heading size="md">{t('dailyGoalsMain')}:</Heading>
                        <Progress colorScheme="primary" value={(1300/allValues.dailyGoalCalories)*100} />
                        <Heading size="sm" textAlign="right">{t('goalCaloriesMain')}: 1300/{allValues.dailyGoalCalories}</Heading>
                        <Progress colorScheme="secondary" value={(6000/allValues.dailyGoalDistance)*100} />
                        <Heading size="sm" textAlign="right">{t('goalDistanceMain')}: 6000/{allValues.dailyGoalDistance}m</Heading>
                        <Progress colorScheme="emerald" value={(9000/allValues.dailyGoalSteps)*100} />
                        <Heading size="sm" textAlign="right">{t('goalStepsMain')}: 9000/{allValues.dailyGoalSteps}</Heading>
                    </VStack>
                </VStack>

            </Box>
    <Footer choice={0} user={props.extraData.user}/>
        </NativeBaseProvider>
    )
}