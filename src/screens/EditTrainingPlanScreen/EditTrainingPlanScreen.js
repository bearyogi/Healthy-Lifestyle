import React, {useEffect, useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack, Select, CheckIcon} from "native-base";
import colors from "../../utils/colors.json";

export default function EditTrainingPlanScreen(props) {
    const colorsList = colors;
    const [allValues, setAllValues] = useState({
        color: "",
        dateOfAdding: "",
        description: "",
        descriptionEng: "",
        descriptionFr: "",
        exercises: [],
        name: "",
        nameEng: "",
        nameFr: ""
    });

    useEffect(() => {
        getData().then(Promise.resolve());
    },[] )

    const getData = async () => {
        const snapshot = firebase.firestore().collection('trainingPlans');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                if (doc.data().id === props.route.params.id) {
                    let obj = {
                        color: doc.data().color,
                        dateOfAdding: doc.data().dateOfAdding,
                        description: doc.data().description,
                        descriptionEng: doc.data().descriptionEng,
                        descriptionFr: doc.data().descriptionFr,
                        exercises: doc.data().exercises,
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
    function checkExercises() {
        let check = 0;
        allValues.exercises.map(d => {
            if(d.text === ""){
                check = 1;
            }
        })
        return check;
    }

    const addExercise = () => {
        let number = 0;
        allValues.exercises.map(d => {
            if(d.id >= number){
                number++;
            }
        })

        let ex = allValues.exercises;
        let newEx1 = {id: number, text: "", language: "pl"}
        number = number + 1;
        let newEx2 = {id: number, text: "", language: "eng"}
        number = number + 1;
        let newEx3 = {id: number, text: "", language: "fr"}
        ex.push(newEx1)
        ex.push(newEx2)
        ex.push(newEx3)
        setAllValues({...allValues, ["exercises"]: ex})
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

    const updateTrainingPlan = async ()  => {
        if (allValues.name !== "" && allValues.nameEng !== "" && allValues.nameFr !== "" && allValues.exercises.length !== 0
            && allValues.description !== "" && allValues.descriptionEng !== "" && allValues.descriptionFr && allValues.color !== "" && checkExercises() === 0) {
            const snapshot = firebase.firestore().collection('trainingPlans');
            await snapshot.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().id === allValues.id) {
                        firebase.firestore().collection('trainingPlans').doc(doc.id).update(allValues);
                    }
                })
            })
            const user = props.route.params.user;
            props.navigation.push('Training',{user});
        }
    }

    const returnToTrainingPlans = () => {
        const user = props.route.params.user;
        props.navigation.push('Training',{user});
    }

    return (
        <NativeBaseProvider theme={theme}>
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' , marginTop: '10%'}}
                keyboardShouldPersistTaps="always">
                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.name)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('trainingPlanName')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('trainingPlanEnterName')}
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
                        <FormControl.Label>{t('trainingPlanNameEng')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            value={allValues.nameEng}
                            placeholder= {t('trainingPlanEnterNameEng')}
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
                        <FormControl.Label>{t('trainingPlanNameFr')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            value={allValues.nameFr}
                            placeholder= {t('trainingPlanEnterNameFr')}
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
                        <FormControl.Label>{t('trainingPlanDescription')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            value={allValues.description}
                            placeholder= {t('trainingPlanEnterDescription')}
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
                        <FormControl.Label>{t('trainingPlanDescriptionEng')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            value={allValues.descriptionEng}
                            placeholder= {t('trainingPlanEnterDescriptionEng')}
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
                        <FormControl.Label>{t('trainingPlanDescriptionFr')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            value={allValues.descriptionFr}
                            placeholder= {t('trainingPlanEnterDescriptionFr')}
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
                        <FormControl.Label>{t('trainingPlanColor')}:</FormControl.Label>
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                        <View style={{height: 50, backgroundColor: allValues.color, borderRadius: 7, marginBottom: 10}}></View>
                        <Select

                            minWidth={200}
                            placeholder= {t('trainingPlanColor')}
                            selectedValue={allValues.color}
                            onValueChange={(any) => setAllValues({...allValues, ["color"]: any})}
                            _selectedItem={{
                                bg: "cyan.600",
                                endIcon: <CheckIcon size={4} />,
                            }}
                            _light={{
                                placeholderTextColor: "blueGray.400",
                            }}
                            _dark={{
                                placeholderTextColor: "blueGray.50",
                            }}
                        >
                            {colorsList.color.map(function(d){
                                const text = t('startButton') === "Commencer" ? d.textFr : t('startButton') === "Start" ? d.textEng : d.text;
                                return(
                                    <Select.Item style={{color: d.value}} key={d.id} label={text} value={d.value} />
                                )
                            })}

                        </Select>
                        <View style={{height: 10}}></View>
                    </Stack>

                </FormControl>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addExercise()}>
                    <Text style={styles.buttonTitle}>{t('addExercises')}</Text>
                </TouchableOpacity>

                {allValues.exercises.map(function(d){
                    return (
                        <FormControl key={d.id} style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.exercises[d.id].text)}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('trainingPlanExercises') + " (" + allValues.exercises[d.id].language + ")"}:</FormControl.Label>
                                <Input
                                    fontSize={'md'}
                                    name="goalSteps"
                                    placeholder= {t('trainingPlanEnterExercises')}
                                    value={allValues.exercises[d.id].text}
                                    onChangeText={(any) => {
                                        let val = allValues.exercises;
                                        val[d.id].text = any;
                                        setAllValues({...allValues, ["exercises"]: val})
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
                    onPress={() => updateTrainingPlan()}>
                    <Text style={styles.buttonTitle}>{t('updateTrainingPlan')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonReturn}
                    onPress={() => returnToTrainingPlans()}>
                    <Text style={styles.buttonTitle}>{t('returnToTrainingPlans')}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
         </NativeBaseProvider>
    )
}