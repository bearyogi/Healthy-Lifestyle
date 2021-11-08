import React, {useEffect, useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack} from "native-base";

import * as RootNavigation from "../../utils/RootNavigation";

export default function EditCategoryScreen(props) {

    const [allValues, setAllValues] = useState({
        title: "",
        titleEng: "",
        titleFr: "",
        caloriePerKm: 0,
        id: 0
    });

    useEffect(() => {
        getData().then(Promise.resolve());
    },[] )

    const getData = async () => {
        const snapshot = firebase.firestore().collection('trainingCategory');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                if (doc.data().id === props.route.params.id) {
                    let obj = {
                        title: doc.data().title,
                        titleEng: doc.data().titleEng,
                        titleFr: doc.data().titleFr,
                        caloriePerKm: doc.data().caloriePerKm,
                        id: props.route.params.id
                    }
                    setAllValues(obj);
                }
            })
        })
    }


    const { t } = useTranslation();

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

    const editCategory = async ()  => {
        const snapshot = firebase.firestore().collection('trainingCategory');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().id === allValues.id){
                    firebase.firestore().collection('trainingCategory').doc(doc.id).update(allValues);
                }
            })})
        RootNavigation.navigate("Map");
    }

    const returnToMap = () => {
        RootNavigation.navigate("Map");
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
                            value={allValues.title}
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
                            value={allValues.titleEng}
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
                            value={allValues.titleFr}
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
                            value={allValues.caloriePerKm.toString()}
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
                    onPress={() => editCategory()}>
                    <Text style={styles.buttonTitle}>{t('editCategory')}</Text>
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