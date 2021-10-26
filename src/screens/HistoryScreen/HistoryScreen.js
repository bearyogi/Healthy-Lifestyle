import React, { useEffect } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {
    View,
} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";

export default function HistoryScreen(props, { }) {

    const userID = props.extraData.id
    const { t } = useTranslation();


    useEffect(() => {
        getData().then(Promise.resolve);
    }, [])

    const getData = async () => {
        const date = new Date();
        const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate();
        const snap = firebase.firestore().collection('gpsTrainingInfo');
        snap.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let inf = doc.data();
                setDailyActivityInfo(inf);
            })

        })
    }

    return (
        <NativeBaseProvider>
            <View backgroundColor={'#fff'} style={{flex: 1}}>
            </View>
        </NativeBaseProvider>
    )
}