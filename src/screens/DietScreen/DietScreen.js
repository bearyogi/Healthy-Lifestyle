import React, { useEffect, useState } from 'react'
import { firebase } from '../../firebase/config'
import {useTranslation} from "react-i18next";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import Footer from '../../utils/Footer';
export default function DietScreen(props, { navigation }) {

    const userID = props.extraData.id
    const { t } = useTranslation();
    useEffect(() => {

    }, [])

    const onLogoutPress = () => {
        firebase.auth().signOut();
    }

    return (
        <NativeBaseProvider>

    <Footer choice={3} user={props.extraData.user}/>
        </NativeBaseProvider>
    )
}