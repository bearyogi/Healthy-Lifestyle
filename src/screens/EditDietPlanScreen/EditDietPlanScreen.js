import React, {useEffect, useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack} from "native-base";

import * as RootNavigation from "../../utils/RootNavigation";
import ColorPicker from "react-native-wheel-color-picker";

export default function EditDietPlanScreen(props) {

    const [allValues, setAllValues] = useState({
        color: "",
        dateOfAdding: "",
        description: "",
        descriptionEng: "",
        descriptionFr: "",
        ingredients: [],
        name: "",
        nameEng: "",
        nameFr: ""
    });

    useEffect(() => {
        getData().then(Promise.resolve());
    },[] )

    function checkIngredients() {
        let check = 0;
        allValues.ingredients.map(d => {
            if(d.text === ""){
                check = 1;
            }
        })
        return check;
    }

    const getData = async () => {
        const snapshot = firebase.firestore().collection('dietPlans');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                if (doc.data().id === props.route.params.id) {
                    let obj = {
                        color: doc.data().color,
                        dateOfAdding: doc.data().dateOfAdding,
                        description: doc.data().description,
                        descriptionEng: doc.data().descriptionEng,
                        descriptionFr: doc.data().descriptionFr,
                        ingredients: doc.data().ingredients,
                        name: doc.data().name,
                        nameEng: doc.data().nameEng,
                        nameFr: doc.data().nameFr,
                        id: props.route.params.id
                    }
                    setAllValues(obj);
                }
            })
        })

    }

    const addIngredient = () => {
        let number = 0;
        allValues.ingredients.map(d => {
            if(d.id >= number){
                number++;
            }
        })

        let ex = allValues.ingredients;
        let newEx1 = {id: number, text: "", language: "pl"}
        number = number + 1;
        let newEx2 = {id: number, text: "", language: "eng"}
        number = number + 1;
        let newEx3 = {id: number, text: "", language: "fr"}
        ex.push(newEx1)
        ex.push(newEx2)
        ex.push(newEx3)
        setAllValues({...allValues, ["ingredients"]: ex})
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

    const updateDietPlan = async ()  => {
        if (allValues.name !== "" && allValues.nameEng !== "" && allValues.nameFr !== "" && allValues.ingredients.length !== 0
            && allValues.description !== "" && allValues.descriptionEng !== "" && allValues.descriptionFr && allValues.color !== "" && checkIngredients() === 0) {
            const snapshot = firebase.firestore().collection('dietPlans');
            await snapshot.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().id === allValues.id) {
                        firebase.firestore().collection('dietPlans').doc(doc.id).update(allValues);
                    }
                })
            })
            RootNavigation.navigate("Diet");
        }
    }

    const returnToDietPlans = () => {
        RootNavigation.navigate("Diet");
    }

    return (
        <NativeBaseProvider theme={theme}>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' , marginTop: '10%'}}
                    keyboardShouldPersistTaps="always">
                    <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.name)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanName')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                placeholder= {t('dietPlanEnterName')}
                                value={allValues.name}
                                onChangeText={(any) => setAllValues({...allValues, ["name"]: any})}
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

                    <FormControl  style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.nameEng)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanNameEng')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.nameEng}
                                placeholder= {t('dietPlanEnterNameEng')}
                                onChangeText={(any) => setAllValues({...allValues, ["nameEng"]: any})}
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

                    <FormControl  style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.nameFr)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanNameFr')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.nameFr}
                                placeholder= {t('dietPlanEnterNameFr')}
                                onChangeText={(any) => setAllValues({...allValues, ["nameFr"]: any})}
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

                    <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.description)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanDescription')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.description}
                                placeholder= {t('dietPlanEnterDescription')}
                                onChangeText={(any) => setAllValues({...allValues, ["description"]: any})}
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

                    <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.descriptionEng)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanDescriptionEng')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.descriptionEng}
                                placeholder= {t('dietPlanEnterDescriptionEng')}
                                onChangeText={(any) => setAllValues({...allValues, ["descriptionEng"]: any})}
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

                    <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.descriptionFr)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanDescriptionFr')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.descriptionFr}
                                placeholder= {t('dietPlanEnterDescriptionFr')}
                                onChangeText={(any) => setAllValues({...allValues, ["descriptionFr"]: any})}
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

                    <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.color)}>
                        <Stack mx={2}>
                            <FormControl.Label>{t('dietPlanColor')}:</FormControl.Label>
                            <Input
                                fontSize={'md'}
                                name="goalSteps"
                                value={allValues.color}
                                placeholder= {t('dietPlanEnterColor')}
                                onChangeText={(any) => setAllValues({...allValues, ["color"]: any})}
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

                    <View style={styles.hexColor}>
                        <ColorPicker

                            color={allValues.color ? allValues.color : '#fff'}
                            swatchesOnly={0}
                            onColorChange={(any) => setAllValues({...allValues, ["color"]: any})}
                            thumbSize={40}
                            sliderSize={40}
                            noSnap={true}
                            row={false}
                            swatchesLast={0}
                            swatches={0}
                            discrete={0}
                            autoResetSlider onColorChangeComplete={(any) => setAllValues({...allValues, ["color"]: any})} shadeSliderThumb shadeWheelThumb/>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => addIngredient()}>
                        <Text style={styles.buttonTitle}>{t('addIngredients')}</Text>
                    </TouchableOpacity>

                    {allValues.ingredients.map(function(d){
                        return (
                            <FormControl key={d.id} style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.ingredients[d.id].text)}>
                                <Stack mx={2}>
                                    <FormControl.Label>{t('dietPlanIngredients') + " (" + allValues.ingredients[d.id].language + ")"}:</FormControl.Label>
                                    <Input
                                        fontSize={'md'}
                                        name="goalSteps"
                                        placeholder= {t('dietPlanEnterIngredients')}
                                        value={allValues.ingredients[d.id].text}
                                        onChangeText={(any) => {
                                            let val = allValues.ingredients;
                                            val[d.id].text = any;
                                            setAllValues({...allValues, ["ingredients"]: val})
                                        }}
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
                        )
                    })}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => updateDietPlan()}>
                        <Text style={styles.buttonTitle}>{t('updateDietPlan')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonReturn}
                        onPress={() => returnToDietPlans()}>
                        <Text style={styles.buttonTitle}>{t('returnToDietPlans')}</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        </NativeBaseProvider>
    )
}