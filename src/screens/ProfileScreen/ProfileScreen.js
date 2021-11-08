import React, {useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import { List } from 'react-native-paper';
import {
    Button,
    Center, CheckIcon,
    FormControl,
    Input,
    ScrollView, Select,
    Stack, View
} from "native-base";
import {firebase} from './../../firebase/config';
import Footer from "../../utils/Footer";

export default function ProfileScreen(props) {

    const [allValues, setAllValues] = useState({
        name: "",
        surname: "",
        email: "",
        age: 0,
        gender: 0,
        height: 0,
        weight: 0,
        dailyGoalCalories: 0,
        dailyGoalDistance: 0,
        dailyGoalSteps: 0,
    });
    const [expanded1, setExpanded1] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);
    const [expanded3, setExpanded3] = React.useState(false);
    const handlePress1 = () => setExpanded1(!expanded1);
    const handlePress2 = () => setExpanded2(!expanded2);
    const handlePress3 = () => setExpanded3(!expanded3);
    const userID = props.route.params.user.id;
    const { t } = useTranslation();

    useEffect(() => {
        getData().then(Promise.resolve);
    }, [])
    const getData = async () => {
        await firebase.firestore().collection('userPersonalData').doc(userID).get().then(snapshot => setAllValues(snapshot.data()));
    }

    const setDate = () => {
         firebase.firestore().collection('userPersonalData').doc(userID).update({
             name: allValues.name,
             surname: allValues.surname,
             email: allValues.email,
             age: allValues.age,
             gender: allValues.gender,
             height: allValues.height,
             weight: allValues.weight,
             dailyGoalCalories: allValues.dailyGoalCalories,
             dailyGoalDistance: allValues.dailyGoalDistance,
             dailyGoalSteps: allValues.dailyGoalSteps
         }).then(Promise.resolve)
    }
    const numberChanged = (value, name) => {

        let val = value.replace(/\D/g,'');
        setAllValues({...allValues, [name]: val})
    }
    const onUpdateButton = () => {
        if (validation() === 0){
            setDate();
            const user =  props.route.params.user;
            props.navigation.push('Home',{user})
        }

    }

    const onLogOutButton = () => {
        firebase.auth().signOut().then(Promise.resolve);
        const user = props.route.params.user;
        props.navigation.push('Login',{user})
    }

    function validation()  {
        let check = 0;

        if(allValues.name === "" || allValues.surname === "" || allValues.gender > 2
        || allValues.email === "" || allValues.age < 1 || allValues.height < 50 || allValues.weight < 10
        || allValues.dailyGoalSteps === 0 || allValues.dailyGoalDistance === 0 || allValues.dailyGoalCalories === 0
        || allValues.age > 120 || allValues.height > 220 || allValues.weight > 500){
            check = 1;
        }

        return check;
    }
    return (

        <NativeBaseProvider>

            <View style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView marginTop={10} backgroundColor={'#fff'}>
                <List.Section>
                    <List.Accordion
                        theme={{ colors: {background : '#fff' ,primary: '#25c53a'}}}
                        title={t('Credentials')}
                        expanded={expanded1}
                        onPress={handlePress1}>
                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!allValues.name}>
                            <Stack mx={2}>
                                <FormControl.Label marginTop = {5} >{t('name')}:</FormControl.Label>
                                <Input
                                    name="name"
                                    my={2}
                                    placeholder={allValues.name ? allValues.name : t('enter') + t('name').toLowerCase()}
                                    onChangeText={(any) => setAllValues({...allValues, ["name"]: any})}
                                    value={allValues.name}
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
                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!allValues.surname}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('surname')}:</FormControl.Label>
                                <Input
                                    name="surname"
                                    placeholder= {allValues.surname ? allValues.surname : t('enter') + t('surname').toLowerCase()}
                                    onChangeText={(any) => setAllValues({...allValues, ["surname"]: any})}
                                    value={allValues.surname}
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

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.gender+"")}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('gender')}:</FormControl.Label>

                                <Select
                                    minWidth={200}
                                    placeholder= {allValues.gender ? allValues.gender : t('enter') + t('gender').toLowerCase()}
                                    selectedValue={allValues.gender+""}
                                    onValueChange={(any) =>setAllValues({...allValues, ["gender"]: any})}
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
                                    <Select.Item label={t('female')} value="2" />
                                    <Select.Item label={t('male')} value="1" />
                                    <Select.Item label={t('unknown')} value="0" />
                                </Select>

                                <FormControl.ErrorMessage my={2}>
                                    {t('emptyFieldWarning')}
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!allValues.email} isDisabled={true}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('email')}:</FormControl.Label>
                                <Input
                                    name="email"
                                    placeholder= {allValues.email ? allValues.email : t('enter') + t('email').toLowerCase()}
                                    onChangeText={(any) => setAllValues({...allValues, ["email"]: any})}
                                    value={allValues.email}
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
                    </List.Accordion>

                    <List.Accordion
                        title={t('Measurements')}
                        theme={{ colors: {background : '#fff' ,primary: '#25c53a'}}}
                        expanded={expanded2}
                        onPress={handlePress2}>

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!allValues.age || allValues.age < 1 || allValues.age > 120}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('age')}:</FormControl.Label>
                                <Input
                                    name="age"
                                    placeholder= {allValues.age ? allValues.age : t('enter') + t('age').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"age")}
                                    keyboardType="numeric"
                                    value={allValues.age+""}
                                    my={2}
                                    _light={{
                                        placeholderTextColor: "blueGray.400",
                                    }}
                                    _dark={{
                                        placeholderTextColor: "blueGray.50",
                                    }}
                                />

                                <FormControl.ErrorMessage my={2}>
                                    {allValues.age === "" ? t('emptyFieldWarning') : allValues.age < 1 ? t('tooYoungWarning') : t('tooOldWarning')}
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>



                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.height+"") || allValues.height < 50 || allValues.height > 220}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('height')}:</FormControl.Label>
                                <Input
                                    name="height"
                                    keyboardType="numeric"
                                    placeholder = {allValues.height ? allValues.height : t('enter') + t('height').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"height")}
                                    value={allValues.height+""}
                                    my={2}
                                    _light={{
                                        placeholderTextColor: "blueGray.400",
                                    }}
                                    _dark={{
                                        placeholderTextColor: "blueGray.50",
                                    }}
                                />
                                <FormControl.ErrorMessage my={2}>
                                    {allValues.height === "" ? t('emptyFieldWarning') : allValues.height < 50 ? t('tooSmallWarning') : t('tooBigWarning')}
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.weight+"") || allValues.weight < 10 || allValues.weight > 500}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('weight')}:</FormControl.Label>
                                <Input
                                    name="weight"
                                    keyboardType="numeric"
                                    placeholder = {allValues.weight ? allValues.weight : t('enter') + t('weight').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"weight")}
                                    value={allValues.weight+""}
                                    my={2}
                                    _light={{
                                        placeholderTextColor: "blueGray.400",
                                    }}
                                    _dark={{
                                        placeholderTextColor: "blueGray.50",
                                    }}
                                />
                                <FormControl.ErrorMessage my={2}>
                                    {allValues.weight === "" ? t('emptyFieldWarning') : allValues.weight < 10 ? t('tooThinWarning') : t('tooFatWarning')}
                                </FormControl.ErrorMessage>
                            </Stack>
                        </FormControl>
                    </List.Accordion>

                    <List.Accordion
                        title={t('Goals')}
                        theme={{ colors: {background : '#fff' ,primary: '#25c53a'}}}
                        expanded={expanded3}
                        onPress={handlePress3}>
                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.dailyGoalCalories+"")}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('goalCalories')}:</FormControl.Label>
                                <Input
                                    name="goalCalories"
                                    keyboardType="numeric"
                                    placeholder= {allValues.dailyGoalCalories ? allValues.dailyGoalCalories : t('enter') + t('goalCalories').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"dailyGoalCalories")}
                                    value={allValues.dailyGoalCalories+""}
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

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.dailyGoalDistance+"")}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('goalDistance')}:</FormControl.Label>
                                <Input
                                    name="goalDistance"
                                    keyboardType="numeric"
                                    placeholder= {allValues.dailyGoalDistance ? allValues.dailyGoalDistance : t('enter') + t('goalDistance').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"dailyGoalDistance")}
                                    value={allValues.dailyGoalDistance+""}
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

                        <FormControl isRequired backgroundColor={'#fff'} isInvalid={!(allValues.dailyGoalSteps+"")}>
                            <Stack mx={2}>
                                <FormControl.Label>{t('goalSteps')}:</FormControl.Label>
                                <Input
                                    name="goalSteps"
                                    keyboardType="numeric"
                                    placeholder= {allValues.dailyGoalSteps ? allValues.dailyGoalSteps : t('enter') + t('goalSteps').toLowerCase()}
                                    onChangeText={value => numberChanged(value,"dailyGoalSteps")}
                                    value={allValues.dailyGoalSteps+""}
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
                    </List.Accordion>
                </List.Section>

                <Center>
                    <Button
                        onPress={onUpdateButton}
                        width={'50%'}
                        height={60}
                        marginBottom={10}
                        marginTop={10}
                        backgroundColor={'green.400'}
                    >
                        {t('updateButton')}
                    </Button>

                    <Button
                        onPress={onLogOutButton}
                        width={'50%'}
                        height={60}
                        backgroundColor={'orange.400'}
                    >
                        {t('logOutButton')}
                    </Button>

                </Center>
            </ScrollView>
            <Footer choice={4} user={props.route.params.user} navigation={props.navigation}/>
        </View>
        </NativeBaseProvider>
    )
}