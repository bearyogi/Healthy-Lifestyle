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
import styles from "./styles";
export default function TrainingScreen(props) {

    const [dietInfo, setDietInfo] = useState([]);
    const [expandInfo, setExpandInfo] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        getData().then(Promise.resolve);
    }, [])

    const getData = async () => {
        const snapshot = await firebase.firestore().collection('dietPlans');
        snapshot.get().then((querySnapshot) => {
            const tempDoc = []
            const tempInfo = []
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
                tempInfo.push({id: doc.id, val: false})
            })
            setExpandInfo(tempInfo);
            setDietInfo(tempDoc);
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
        return NativeModules.I18nManager.localeIdentifier.substring(0,2);
    }

    const getExpandInfo = (id) => {
        return expandInfo[expandInfo.findIndex(element => element.id === id)];
    }

    const addDietPlan = () => {
        const user = props.route.params.user;
        props.navigation.push('CreateDietPlan',{user});
    }

    const editDietPlan = (id) => {
        const user = props.route.params.user;
        props.navigation.push('EditDietPlan',{user: user, id: id});
    }

    const deleteDietPlan = (id) => {
        const snapshot = firebase.firestore().collection('dietPlans');
        snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().id === id){
                    firebase.firestore().collection('dietPlans').doc(doc.id).delete().then(getData());
                }
            })})

    }

    const propStyle = (color) =>{
        return(
            {
                backgroundColor: color,
                borderRadius: 15,
                height: 140,
                padding: 17,
                paddingTop: 37,
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
                            <Text style={styles.employeeTextAdd}> {t('addDietPlan')} </Text>
                            <Button onPress={() => addDietPlan() }  style ={styles.addButton}> <Text style={styles.addButtonText}> {t('add')} </Text> </Button>
                            <Text style={styles.employeeText}> {t('activeDietPlans')} </Text>
                        </View>) : (<View></View>)
                    }
                    <List.Section theme={{colors: {backgroundColor: '#fff'}}}>
                    {
                        dietInfo.map(function(d){
                            return (
                                <View key={d.id} style={{background: '#fff'}}>
                                    <List.Accordion
                                        key={d.id}
                                        theme={{ colors: {primary: '#fff'}}}
                                        style={propStyle(d.color)}
                                        title={<Text textAlign={'center'} fontSize={d.name.length > 8 ? "2xl" : "3xl"}> {getLocale() === "pl" ? d.name : getLocale() === "fr" ? d.nameFr : d.nameEng} </Text>}
                                        expanded={getExpandInfo()}
                                        onPress={ () => handlePress1(d.id) }>
                                        <Stack mx={2}>
                                            <Text key={d.id} marginBottom={7} fontSize={"md"} textAlign={'justify'}>
                                                {getLocale() === "pl" ? d.description : getLocale() === "fr" ? d.descriptionFr : d.descriptionEng}</Text>
                                            <Text  marginBottom={3} fontSize={"lg"} >{t('dietList')}</Text>
                                            {d.ingredients.length > 0 ? d.ingredients.map((dd) => (getLocale() === dd.language ? <Text key={dd.id} fontSize={"md"} style={{marginBottom: 15}}>● {dd.text}</Text> : <View key={dd.id}></View>)) : <View></View>}

                                        </Stack>

                                    </List.Accordion>
                            {props.route.params.user.permissionLevel === 1 ?
                                <View style={{flexDirection: 'row'}}>
                                    <Button onPress={() => editDietPlan(d.id) } style={styles.editButton} >{t('edit')}</Button>
                                    <Button onPress={() => deleteDietPlan(d.id)} style ={styles.deleteButton}>{t('delete')}</Button>
                                </View> : <View></View>}
                            </View>

                            )
                        })
                    }
                    </List.Section>
                </ScrollView>
                <Footer choice={3} user={props.route.params.user} navigation={props.navigation}/>
            </View>
        </NativeBaseProvider>
    )
}