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
import * as RootNavigation from "../../utils/RootNavigation";
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

    const getExpandInfo = (id) => {
        return expandInfo[expandInfo.findIndex(element => element.id === id)];
    }
    const addTrainingPlan = () => {
        RootNavigation.navigate("CreateTrainingPlan");
    }

    const editTrainingPlan = (id) => {
        RootNavigation.navigate("EditTrainingPlan",{id});
    }

    const deleteTrainingPlan = (id) => {
        const snapshot = firebase.firestore().collection('trainingPlans');
        snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().id === id){
                    firebase.firestore().collection('trainingPlans').doc(doc.id).delete().then(r => this.getData());
                }
            })})

    }

    const propStyle = (color, id) =>{
        const idx = expandInfo.findIndex(element => element.id === id);
        return(
     {
         backgroundColor: color,
      borderRadius: 15,
        height: 140,
        padding: 17,
        paddingTop: 37,
         marginBottom: 15,
        margin: 10,
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
                                    style={propStyle(d.color,d.id)}
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
                <Footer choice={2} user={props.route.params.user}/>
            </View>
        </NativeBaseProvider>
    )
}