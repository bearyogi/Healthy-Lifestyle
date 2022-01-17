import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { t } = useTranslation();
    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                       createDailyTrainingData(user).then();

                    })
                    .catch(error => {
                        alert(t('invalidPass'))
                    });
            })
            .catch(error => {
                alert(t('invalidPass'))
            })
    }

    const createDailyTrainingData = async (user) => {
        const date = new Date();
        let id = 0;
        const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate();

        const objD = await firebase.firestore().collection('userPersonalData').doc(user.id).get()

        const snap = await firebase.firestore().collection('userDailyTrainingData');
        snap.get().then(async (querySnapshot) => {
            let check = true;
            querySnapshot.forEach((doc) => {
                    if (doc.data().userId === user.id && doc.data().date === dateYMD) {
                        check = false;
                    }
                    if (doc.data().id >= id) {
                        id = doc.data().id + 1;
                    }
                }
            )

            if (check) {
                let obj = {
                    actualGoalCalories: objD.data().dailyGoalCalories,
                    actualGoalDistance: objD.data().dailyGoalDistance,
                    actualGoalSteps: objD.data().dailyGoalSteps,
                    calories: 0,
                    distance: 0,
                    steps: 0,
                    id: id,
                    userId: user.id,
                    date: dateYMD,
                    weight: objD.data().weight,
                    firstLogon: 1
                }
                await firebase.firestore().collection('userDailyTrainingData').add(obj);
            }
            navigation.push('Home',{user})
        })
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%', marginTop: '25%'}}
                keyboardShouldPersistTaps="always">
                <Text style={styles.helloText}>Healthy Lifestyle</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('emailInputLogin')}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder={t('passwordInputLogin')}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>{t('loginText')}</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>{t('noAccountText')} <Text onPress={onFooterLinkPress} style={styles.footerLink}>{t('SignUpText')}</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}