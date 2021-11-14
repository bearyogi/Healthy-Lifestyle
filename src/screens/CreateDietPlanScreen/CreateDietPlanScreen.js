import React, { useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack, Select, CheckIcon} from "native-base";
import colors from "../../utils/colors.json"

export default function CreateDietPlanScreen(props) {
    const { t } = useTranslation();
    const colorsList = colors;
    const [allValues, setAllValues] = useState({
        color: colorsList.color[0].value,
        dateOfAdding: "",
        description: "",
        descriptionEng: "",
        descriptionFr: "",
        ingredients: [],
        name: "",
        nameEng: "",
        nameFr: ""
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


    function checkIngredients() {
        let check = 0;
        allValues.ingredients.map(d => {
            if(d.text === ""){
                check = 1;
            }
        })
        console.log(check);
        return check;
    }

    const createDietPlan = async () => {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        const dateFinal = year + "-" + month + "-" + day;

        if (allValues.name !== "" && allValues.nameEng !== "" && allValues.nameFr !== ""
            && allValues.description !== "" && allValues.descriptionEng !== "" && allValues.descriptionFr && allValues.color !== "" && checkIngredients() === 0) {

            let id = 0;
            const snapshot = firebase.firestore().collection('dietPlans');
            await snapshot.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    if (doc.data().id >= id) {
                        id = doc.data().id + 1;
                    }
                })
            })
            let obj = {
                color: allValues.color,
                dateOfAdding: dateFinal,
                description: allValues.description,
                descriptionEng: allValues.descriptionEng,
                descriptionFr: allValues.descriptionFr,
                ingredients: allValues.ingredients,
                name: allValues.name,
                nameEng: allValues.nameEng,
                nameFr: allValues.nameFr,
                id: id
            }
            await firebase.firestore().collection('dietPlans').add(obj);
            const user = props.route.params.user;
            props.navigation.push('Diet',{user});
        }
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

    const returnToDietPlans = () => {
        const user = props.route.params.user;
        props.navigation.push('Diet',{user});
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
                            <FormControl.ErrorMessage my={2}>
                                {t('emptyFieldWarning')}
                            </FormControl.ErrorMessage>
                            <View style={{height: 50, backgroundColor: allValues.color, borderRadius: 7, marginBottom: 10}}></View>
                            <Select

                                minWidth={200}
                                placeholder= {t('dietPlanColor')}
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
                        onPress={() => addIngredient()}>
                        <Text style={styles.buttonTitle}>{t('addIngredient')}</Text>
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
                        onPress={() => createDietPlan()}>
                        <Text style={styles.buttonTitle}>{t('createDietPlan')}</Text>
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