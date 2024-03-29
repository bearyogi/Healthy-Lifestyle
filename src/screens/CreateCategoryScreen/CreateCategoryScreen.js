import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack} from "native-base";

export default function CreateCategoryScreen(props) {
    const { t } = useTranslation();
    const [allValues, setAllValues] = useState({
        title: "",
        titleEng: "",
        titleFr: "",
        caloriePerKm: 0,
        id: 0
    });

    const theme = extendTheme({
        components: {
            FormControl: {
                baseStyle: {rounded: 'xl', fontWeight: 'normal'},
                defaultProps: {},
                variants: {},
                sizes: {lg: { fontSize: '32px' }},
            },
            Input: {
                baseStyle: {rounded: '2xl', fontWeight: 'normal'},
                defaultProps: {},
                variants: {},
                sizes: {lg: { fontSize: '32px' }},
            }
        }
    });

    const createCategory = async () => {
        if (allValues.title !== "" && allValues.titleEng !== "" && allValues.titleFr !== "" && allValues.caloriePerKm !== 0) {
            let id = 0;
            const snapshot = firebase.firestore().collection('trainingCategory');
            await snapshot.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    if (doc.data().id >= id) {
                        id = doc.data().id + 1;
                    }
                })
            })
            let obj = {
                title: allValues.title,
                titleEng: allValues.titleEng,
                titleFr: allValues.titleFr,
                caloriePerKm: allValues.caloriePerKm,
                id: id
            }
            await firebase.firestore().collection('trainingCategory').add(obj);
            const user = props.route.params.user;
            props.navigation.push('Map',{user});
        }
    }

    const returnToMap = () => {
        const user = props.route.params.user;
        props.navigation.push('Map',{user});
    }

    return (
        <NativeBaseProvider theme={theme}>
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' , marginTop: '10%'}}
                keyboardShouldPersistTaps="always">
                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.title)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('categoryText')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('categoryEnterText')}
                            onChangeText={(any) => setAllValues({...allValues, ["title"]: any})}
                            my={2}
                            _light={{
                                placeholderTextColor: "blueGray.400",
                            }}
                            _dark={{
                                placeholderTextColor: "blueGray.50",
                            }}
                        />
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                    </Stack>

                </FormControl>

                <FormControl  style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.titleEng)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('categoryTextEng')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('categoryEnterTextEng')}
                            onChangeText={(any) => setAllValues({...allValues, ["titleEng"]: any})}
                            my={2}
                            _light={{
                                placeholderTextColor: "blueGray.400",
                            }}
                            _dark={{
                                placeholderTextColor: "blueGray.50",
                            }}
                        />
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                    </Stack>

                </FormControl>

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.titleFr)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('categoryTextFr')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('categoryEnterTextFr')}
                            onChangeText={(any) => setAllValues({...allValues, ["titleFr"]: any})}
                            my={2}
                            _light={{
                                placeholderTextColor: "blueGray.400",
                            }}
                            _dark={{
                                placeholderTextColor: "blueGray.50",
                            }}
                        />
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                    </Stack>

                </FormControl>

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.caloriePerKm)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('categoryCalorie')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('categoryEnterCalorie')}
                            keyboardType="numeric"
                            onChangeText={(any) => setAllValues({...allValues, ["caloriePerKm"]: any})}
                            my={2}
                            _light={{
                                placeholderTextColor: "blueGray.400",
                            }}
                            _dark={{
                                placeholderTextColor: "blueGray.50",
                            }}
                        />
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                    </Stack>

                </FormControl>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => createCategory()}>
                    <Text style={styles.buttonTitle}>{t('createCategory')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonReturn}
                    onPress={() => returnToMap()}>
                    <Text style={styles.buttonTitle}>{t('returnToMap')}</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </View>
         </NativeBaseProvider>
    )
}