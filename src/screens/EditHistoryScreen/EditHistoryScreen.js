import React, {useEffect, useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config'
import styles from './styles';
import {useTranslation} from "react-i18next";
import {NativeBaseProvider, extendTheme, FormControl, Input, Stack, CheckIcon, Select} from "native-base";

export default function EditHistoryScreen(props) {

    const [allValues, setAllValues] = useState({
        activityType: 0,
        calories: 0,
        coords: [],
        date: "",
        distance: "",
        time: "",
        timeStarted: "",
        initialRegion: "",
        region: "",
        userCredensials: "",
        userId: ""
    });

    const [choosenCategory, setChoosenCategory] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        getData().then(Promise.resolve());
    },[] )

    const getData = async () => {
        const tempCat = []
        const snapshot2 = firebase.firestore().collection('trainingCategory');
        await snapshot2.get().then((querySnapshot2) => {
            querySnapshot2.forEach((doc) => {
                tempCat.push({id: doc.data().id, text: doc.data().titleEng})
            })
        setAllCategories(tempCat);
        })

        const snapshot = firebase.firestore().collection('gpsTrainingInfo');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().id === props.route.params.id) {
                    let obj = {
                        activityType: doc.data().activityType.id,
                        calories: doc.data().calories,
                        coords: doc.data().coords,
                        date: doc.data().date,
                        distance: doc.data().distance,
                        time: doc.data().time,
                        timeStarted: doc.data().timeStarted,
                        initialRegion: doc.data().initialRegion,
                        region: doc.data().region,
                        userCredensials: doc.data().userCredensials,
                        userId: doc.data().userId,
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

    const changeCategory = async (any) => {
        const snapshot2 = firebase.firestore().collection('trainingCategory');
        await snapshot2.get().then((querySnapshot2) => {
            querySnapshot2.forEach((doc) => {

                if (doc.data().id === any) {
                    setChoosenCategory(doc.data())
                    setAllValues({...allValues, ["activityType"]: any})
                }
            })
        })
    }

    const editCategory = async ()  => {


        const snapshot = firebase.firestore().collection('gpsTrainingInfo');
        await snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().id === allValues.id && allValues.activityType !== ""
                    && allValues.calories !== 0 && allValues.date !== ""
                    && allValues.distance !== "" && allValues.time !== "" && allValues.timeStarted !== ""){
                    let obj = {
                        activityType: choosenCategory,
                        calories: allValues.calories,
                        coords: allValues.coords,
                        date: allValues.date,
                        distance: allValues.distance,
                        id: props.route.params.id,
                        initialRegion: allValues.initialRegion,
                        region: allValues.region,
                        time: allValues.time,
                        timeStarted: allValues.timeStarted,
                        userCredensials: allValues.userCredensials,
                        userId: allValues.userId
                    }
                    firebase.firestore().collection('gpsTrainingInfo').doc(doc.id).update(obj);
                }
            })})
        const user = props.route.params.user;
        props.navigation.push('EditUsersHistory',{user});
    }

    const returnToMap = () => {
        const user = props.route.params.user;
        props.navigation.push('EditUsersHistory',{user});
    }

    return (
        <NativeBaseProvider theme={theme}>
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' , marginTop: '10%'}}
                keyboardShouldPersistTaps="always">
                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={allValues.activityType < 0}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsActivity')}:</FormControl.Label>
                        <Select
                            minWidth={200}
                            placeholder= {t('gpsActivity')}
                            selectedValue={allValues.activityType}
                            onValueChange={(any) => changeCategory(any)}
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
                            {allCategories.map(function(d){
                                return(
                                <Select.Item key={d.id} label={d.text} value={d.id} />
                                )
                            })}
                        </Select>
                        <FormControl.ErrorMessage my={2}>
                            {t('emptyFieldWarning')}
                        </FormControl.ErrorMessage>
                    </Stack>

                </FormControl>

                <FormControl  style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.calories)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsCalories')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('gpsEnterCalories')}
                            keyboardType="numeric"
                            onChangeText={(any) => setAllValues({...allValues, ["calories"]: any})}
                            value={allValues.calories+""}
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

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.date)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsDate')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('gpsEnterDate')}
                            onChangeText={(any) => setAllValues({...allValues, ["date"]: any})}
                            value={allValues.date+""}
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

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.distance)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsDistance')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('gpsEnterDistance')}
                            onChangeText={(any) => setAllValues({...allValues, ["distance"]: any})}
                            value={allValues.distance+""}
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

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.time)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsTime')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('gpsEnterTime')}
                            onChangeText={(any) => setAllValues({...allValues, ["time"]: any})}
                            value={allValues.time+""}
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

                <FormControl style = {styles.formControl} isRequired backgroundColor={'#fff'} isInvalid={!(allValues.timeStarted)}>
                    <Stack mx={2}>
                        <FormControl.Label>{t('gpsTimeStarted')}:</FormControl.Label>
                        <Input
                            fontSize={'md'}
                            name="goalSteps"
                            placeholder= {t('gpsEnterTimeStarted')}
                            onChangeText={(any) => setAllValues({...allValues, ["timeStarted"]: any})}
                            value={allValues.timeStarted+""}
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