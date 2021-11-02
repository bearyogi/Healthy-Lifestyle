import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {
    ScrollView,
    Stack,
    Text,
    View,
} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
import { List } from 'react-native-paper';
import {NativeModules} from "react-native";
import styles from "../DietScreen/styles";
export default function TrainingScreen(props, { navigation }) {

    const [trainingInfo, setTrainingInfo] = useState([]);
    const [expandInfo, setExpandInfo] = useState([]);
    const [value, setValue] = useState(0);
    const entityRef = firebase.firestore().collection('entities')
    const userID = props.route.params.user.id;
    const { t } = useTranslation();


    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const snapshot = await firebase.firestore().collection('trainingPlans');
        snapshot.get().then((querySnapshot) => {
            const tempDoc = []
            const tempInfo = []
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
                tempInfo.push({id: doc.id, val: false})
            })
            setExpandInfo(tempInfo);
            setTrainingInfo(tempDoc);
        })
    }

    const onLogoutPress = () => {
        firebase.auth().signOut();
    }

    const handlePress1 = (id) => {
        const idx = expandInfo.findIndex(element => element.id === id);
        let items = expandInfo;
        let item = {...expandInfo[idx]};
        item.val = !item.val;
        items[idx] = item;
        setExpandInfo(items);
        return expandInfo[idx];
    }

    const getLocale = () => {
        return NativeModules.I18nManager.localeIdentifier.substring(0,2);
    }

    const lightenColor = (color, percent) => {
        let num = parseInt(color.replace("#",""),16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;
        return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    };

    const getExpandInfo = (id) => {
        return expandInfo[expandInfo.findIndex(element => element.id === id)];
    }
    const propStyle = (color, id) =>{
        const idx = expandInfo.findIndex(element => element.id === id);
        const expanded = expandInfo[idx];
        return(
     {
         backgroundColor: color,
      borderRadius: 15,
        height: 140,
        padding: 17,
        paddingTop: 37,
        margin: 10
    })}

    return (
        <NativeBaseProvider>
            <View backgroundColor={'#fff'} style={{flex: 1}}>
                <ScrollView marginTop={10} backgroundColor={'#fff'}>
                    <List.Section style={styles.sectionList} theme={{colors: {backgroundColor: '#fff'}}}>
                    {
                        trainingInfo.map(function(d){
                            return (
                                <List.Accordion
                                    key={d.key}
                                    theme={{ colors: {primary: '#fff'}}}
                                    style={propStyle(d.color,d.id)}
                                    title={<Text textAlign={'center'} fontSize={d.name.length > 8 ? "2xl" : "3xl"}> {getLocale() === "pl" ? d.name : getLocale() === "fr" ? d.nameFr : d.nameEng} </Text>}
                                    expanded={getExpandInfo()}
                                    onPress={ () => handlePress1(d.id) }>
                                    <Stack style={{backgroundColor: 'fff', borderRadius: 5}} mx={2} key={d.id}>
                                        <Text marginBottom={7} fontSize={"md"} textAlign={'justify'}>
                                            {getLocale() === "pl" ? d.description : getLocale() === "fr" ? d.descriptionFr : d.descriptionEng}</Text>
                                        <Text marginBottom={3} fontSize={"lg"} >{t('trainingList')}</Text>
                                            {d.exercises.map(d => (<Text fontSize={"md"}>● {d}</Text>))}

                                    </Stack>
                                </List.Accordion>

                            )
                        })
                    }
                    </List.Section>
                </ScrollView>
                <Footer choice={2} user={props.route.params.user}/>
            </View>
        </NativeBaseProvider>
    )
}