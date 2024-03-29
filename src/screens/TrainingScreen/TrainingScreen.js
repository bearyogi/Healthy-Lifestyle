import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {
    Button,
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
export default function TrainingScreen(props) {

    const [trainingInfo, setTrainingInfo] = useState([]);
    const [expandInfo, setExpandInfo] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        getData().then(Promise.resolve);
    }, [])

    const getData = async () => {
        const snapshot = await firebase.firestore().collection('trainingPlans');
        snapshot.get().then((querySnapshot) => {
            const tempDoc = []
            const tempInfo = []
            querySnapshot.forEach((doc) => {
                console.log("0")
                tempDoc.push({ id: doc.id, ...doc.data() })
                tempInfo.push({id: doc.id, val: false})
            })
            setExpandInfo(tempInfo);
            setTrainingInfo(tempDoc);
        })
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
        let lng = NativeModules.I18nManager.localeIdentifier.substring(0,2);
        if(lng === "en"){
            lng = "eng";
        }
        return lng;
    }

    const getExpandInfo = (id) => {
        return expandInfo[expandInfo.findIndex(element => element.id === id)];
    }
    const addTrainingPlan = () => {
        const user = props.route.params.user;
        props.navigation.push('CreateTrainingPlan',{user})
    }

    const editTrainingPlan = (id) => {
        const user = props.route.params.user;
        props.navigation.push('EditTrainingPlan', {user: user, id: id})
    }

    const deleteTrainingPlan = (id) => {
        const snapshot = firebase.firestore().collection('trainingPlans');
        snapshot.get().then(async (querySnapshot) => {
            await querySnapshot.forEach((doc) => {
                if (doc.data().id === id) {
                    firebase.firestore().collection('trainingPlans').doc(doc.id).delete().then(getData());
                }
            })
        })
        //props.navigation.push('Training', {user})
    }

    const propStyle = (color) =>{
        return(
     {
         backgroundColor: color,
         borderRadius: 15,
         height: 100,
         padding: 17,
         paddingTop: 22,
         margin: 4,
         borderWidth: 2,
         borderColor: '#bdbdbd'
    })}

    return (
        <NativeBaseProvider>
            <View backgroundColor={'#fff'} style={{flex: 1}}>

                <ScrollView marginTop={props.route.params.user.permissionLevel === 1 ? 0 : 10} backgroundColor={'#fff'}>
                    {props.route.params.user.permissionLevel === 1 ?
                        (<View>
                            <Text style={styles.employeeTextAdd}> {t('addTrainingPlan')} </Text>
                            <Button onPress={() => addTrainingPlan() }  style ={styles.addButton}> <Text style={styles.addButtonText}> {t('add')} </Text> </Button>
                            <Text style={styles.employeeText}> {t('activeTrainingPlans')} </Text>
                        </View>) : (<View></View>)
                    }
                    <List.Section>
                    {
                        trainingInfo.map(function(d){
                            return (
                                <View key={d.id} style={{background: '#fff'}}>
                                <List.Accordion
                                    key={d.id}
                                    theme={{ colors: {primary: '#fff'}}}
                                    style={propStyle(d.color)}
                                    title={<Text textAlign={'center'} fontSize={d.name.length > 8 ? "2xl" : "3xl"} > {getLocale() === "pl" ? d.name : getLocale() === "fr" ? d.nameFr : d.nameEng} </Text>}
                                    expanded={getExpandInfo()}
                                    onPress={ () => handlePress1(d.id) }>
                                    <Stack style={{backgroundColor: 'fff', borderRadius: 5}} mx={2} key={d.id}>
                                        <Text marginBottom={7} fontSize={"md"} textAlign={'justify'}>
                                            {getLocale() === "pl" ? d.description : getLocale() === "fr" ? d.descriptionFr : d.descriptionEng}</Text>
                                        <Text marginBottom={3} fontSize={"lg"} >{t('trainingList')}</Text>
                                            {d.exercises.length > 0 ? d.exercises.map((d) => (getLocale() === d.language ? <Text key={d.id} fontSize={"md"} style={{marginBottom: 15}}>● {d.text}</Text> : <View key={d.id}></View>)) : <View></View>}

                                    </Stack>

                                </List.Accordion>
                                    {props.route.params.user.permissionLevel === 1 ?
                            <View style={{flexDirection: 'row'}}>
                                <Button onPress={() => editTrainingPlan(d.id) } style={styles.editButton} >{t('edit')}</Button>
                                <Button onPress={() => deleteTrainingPlan(d.id)} style ={styles.deleteButton}>{t('delete')}</Button>
                            </View> : <View></View>}
                              </View>
                            )
                        })
                    }
                    </List.Section>
                </ScrollView>
                <Footer choice={2} user={props.route.params.user} navigation={props.navigation}/>
            </View>
        </NativeBaseProvider>
    )
}