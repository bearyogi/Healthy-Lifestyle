import React, {useEffect, useState} from 'react'
import {Text, View} from 'react-native'
import {firebase} from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {Button, Heading, NativeBaseProvider, ScrollView} from "native-base";
import {List} from "react-native-paper";
import Footer from "../../utils/Footer";

export default function EditUsersHistoryScreen(props) {

    const { t } = useTranslation();
    const [trainingInfo, setTrainingInfo] = useState([]);
    const [expandInfo, setExpandInfo] = useState([]);
    const [date, setDate] = useState([{
        year: 0,
        month: 0
    }])
    useEffect(() => {
        getData().then(Promise.resolve);
    }, [])

    const getData = async () => {
        const snap = firebase.firestore().collection('gpsTrainingInfo');
        snap.get().then((querySnapshot) => {
            const tempInfo = []
            const tempDate = []
            const tempExpand = []
            querySnapshot.forEach((doc) => {
                    let tempDateDoc = doc.data().date.split("-");
                    let dataIndicator = false;
                    tempDate.forEach(dataCollection => {
                        if(dataCollection.year === tempDateDoc[0] && dataCollection.month === tempDateDoc[1]){
                            dataIndicator = true;
                        }
                    })
                    if(!dataIndicator){
                        tempExpand.push({id: tempDateDoc[0] + tempDateDoc[1], val: false})
                        tempDate.push({year: tempDateDoc[0], month: tempDateDoc[1]})
                    }
                    tempInfo.push({id: doc.id, ...doc.data()})
            })
            setExpandInfo(tempExpand)
            setDate(tempDate);
            setTrainingInfo(tempInfo);
        })

    }

    const getExpandInfo = (id) => {
        return expandInfo[expandInfo.findIndex(element => element.id === id)];
    }

    const editHistory = (id) => {
        const user = props.route.params.user;
        props.navigation.push('EditHistory', {user: user, id: id});
    }

    const deleteHistory = (id) => {
        const snapshot = firebase.firestore().collection('gpsTrainingInfo');
        snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().id === id){
                    firebase.firestore().collection('gpsTrainingInfo').doc(doc.id).delete().then(getData());
                }
            })})

    }
    const handlePress = (id) => {
        const idx = expandInfo.findIndex(element => element.id === id);
        let items = expandInfo;
        let item = {...expandInfo[idx]};
        item.val = !item.val;
        items[idx] = item;
        setExpandInfo(items);
        return expandInfo[idx];
    }

    return (
        <NativeBaseProvider>
            <View backgroundColor={'#fff'} style={{flex: 1}}>
                <ScrollView marginTop={10} backgroundColor={'#f0f7f1'}>
                    <View style={styles.historyHeading}>
                        <Heading>{t('historyHeading')}</Heading>
                    </View>
                    <List.Section>
                        {
                            date.map(function(d){
                                return(

                                    <List.Accordion
                                        key={d}
                                        style={styles.accordion}
                                        theme={{ colors: {background : '#fff' ,primary: '#25c53a'}}}
                                        title={<Text style={{fontSize: 22}}>{d.year  + "/" + d.month}</Text>}
                                        expanded={getExpandInfo()}
                                        onPress={ () => handlePress(d.year + "" + d.month) }>
                                        {
                                            trainingInfo.map(function(dd){
                                                let check = dd.date.split("-");
                                                if(check[0] === d.year && check[1] === d.month) return (
                                                    <View key={dd.id} style={{ backgroundColor: '#fff', flexDirection: 'row', borderWidth: 1, borderColor: '#a8a8a8', width: '98%', alignSelf: 'center', marginTop: 3, marginBottom: 3}}>

                                                        <View style={styles.trainingInfo}>
                                                            <Text style={styles.summaryText2}>{t('activity')} {dd.activityType.title}</Text>
                                                            <Text style={styles.summaryText2}>{t('date')} {dd.date} : {dd.timeStarted}</Text>
                                                            <Text style={styles.summaryText2}>{t('timeElapsed')} {dd.time}</Text>
                                                            <Text style={styles.summaryText2}>{t('distance')} {dd.distance} km</Text>
                                                            <Text style={styles.summaryText2}>{t('calories')} {dd.calories}</Text>
                                                            <Text style={styles.summaryText2}>{t('user')} : {dd.userCredensials}</Text>
                                                        </View>

                                                        <View style={{height: 150, width: 220, padding: 14}}>
                                                            <Button style={styles.editButton} onPress={() => editHistory(dd.id)}> {t('edit')}</Button>
                                                            <Button style={styles.deleteButton} onPress={() => deleteHistory(dd.id)}> {t('delete')}</Button>
                                                        </View>

                                                    </View>
                                                )
                                            })
                                        }
                                    </List.Accordion>
                                )})
                        }
                    </List.Section>
                </ScrollView>
                <Footer choice={6} user={props.route.params.user} navigation={props.navigation}/>
            </View>
         </NativeBaseProvider>
    )
}