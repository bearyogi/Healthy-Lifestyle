import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {
    LoginScreen,
    HomeScreen,
    RegistrationScreen,
    MapScreen,
    CreateCategoryScreen,
    EditCategoryScreen, CreateDietPlanScreen, EditDietPlanScreen, EditTrainingPlanScreen, EditUsersHistoryScreen
} from './src/screens'
import {firebase} from './src/firebase/config'
import {decode, encode} from 'base-64'
import {navigationRef} from "./src/utils/RootNavigation";
import DietScreen from "./src/screens/DietScreen/DietScreen";
import ProfileScreen from "./src/screens/ProfileScreen/ProfileScreen";
import TrainingScreen from "./src/screens/TrainingScreen/TrainingScreen";
import HistoryScreen from "./src/screens/HistoryScreen/HistoryScreen";
import CreateTrainingPlanScreen from "./src/screens/CreateTrainingPlanScreen/CreateTrainingPlanScreen";
import ComponentWithFocus from "./src/utils/ComponentWithFocus";
import EditHistoryScreen from "./src/screens/EditHistoryScreen/EditHistoryScreen";

if (!global.btoa) {
    global.btoa = encode
}
if (!global.atob) {
    global.atob = decode
}
const Stack = createStackNavigator();

export default function App() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const usersRef = firebase.firestore().collection('users');
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data()
                        setLoading(false)
                        setUser(userData)
                    })
                    .catch((S) => {
                        setLoading(false)
                    });
            } else if (!user) {
                setUser(null)
                setLoading(false)
            } else {
                setLoading(false)
            }
        });
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator  screenOptions={{
                headerShown: false,
                swipeEdgeWidth: 0
            }}>
                    <>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="Registration" component={RegistrationScreen}/>
                        <Stack.Screen name="Home" component={HomeScreen}/>
                        <Stack.Screen name="Map" component={MapScreen}/>
                        <Stack.Screen name="Diet" component={DietScreen}/>
                        <Stack.Screen name="Training" component={TrainingScreen}/>
                        <Stack.Screen name="Profile" component={ProfileScreen}/>
                        <Stack.Screen name="History" component={HistoryScreen}/>
                        <Stack.Screen name="CreateCategory" component={CreateCategoryScreen}/>
                        <Stack.Screen name="EditCategory" component={EditCategoryScreen}/>
                        <Stack.Screen name="CreateTrainingPlan" component={CreateTrainingPlanScreen}/>
                        <Stack.Screen name="EditTrainingPlan" component={EditTrainingPlanScreen}/>
                        <Stack.Screen name="CreateDietPlan" component={CreateDietPlanScreen}/>
                        <Stack.Screen name="EditDietPlan" component={EditDietPlanScreen}/>
                        <Stack.Screen name="EditUsersHistory" component={EditUsersHistoryScreen}/>
                        <Stack.Screen name="EditHistory" component={EditHistoryScreen}/>
                    </>
            </Stack.Navigator>
        </NavigationContainer>
    );

}