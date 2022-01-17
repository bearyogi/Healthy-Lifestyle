import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";

export default function RegistrationScreen({navigation}) {
    const badFormatMsg = "Error: The email address is badly formatted."
    const usedMailMsg = "Error: The email address is already in use by another account.";
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { t } = useTranslation();
    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert(t('passwordMatchError'))
            return
        }
        if (password.length < 6) {
            alert(t('passwordTooShort'))
            return
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid;
                let permissionLevel = 0;
                const data = {
                    id: uid,
                    email,
                    name,
                    surname,
                    permissionLevel,
                };
                const userData = {
                    userId: uid,
                    age: 0,
                    email: email,
                    gender: 0,
                    height: 0,
                    name: name,
                    surname: surname,
                    weight: 0,
                    dailyGoalCalories: 0,
                    dailyGoalDistance: 0,
                    dailyGoalSteps: 0
                }
                const userDataRef = firebase.firestore().collection('userPersonalData');
                userDataRef.doc(uid).set(userData).then(Promise.resolve);

                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate('Login')
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                if(error.toString() === badFormatMsg){
                    alert(t('emailFormatError'))
                }
                if(error.toString() === usedMailMsg){
                    alert(t('emailInUseError'))
                }
            });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' , marginTop: '25%'}}
                keyboardShouldPersistTaps="always">
                <Text style={styles.helloText}>Healthy Lifestyle</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('registerNameInput')}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setName(text)}
                    value={name}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder={t('registerSurnameInput')}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setSurname(text)}
                    value={surname}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

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
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder={t('registerConfirmPasswordInput')}
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>{t('createAccount')}</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>{t('yesAccountText')} <Text onPress={onFooterLinkPress} style={styles.footerLink}>{t('logInText')}</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}