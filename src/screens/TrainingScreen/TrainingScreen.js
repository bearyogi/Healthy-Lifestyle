import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {Box, Center, Heading, HStack, Icon, Progress, Text, VStack} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
export default function TrainingScreen(props, { navigation }) {

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    const [selected, setSelected] = React.useState(1);
    const { t } = useTranslation();
    useEffect(() => {

    }, [])

    const onLogoutPress = () => {
        firebase.auth().signOut();
    }

    return (
        <NativeBaseProvider>

    <Footer choice={2} user={props.extraData.user}/>
        </NativeBaseProvider>
    )
}