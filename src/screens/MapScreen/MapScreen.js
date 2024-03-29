import * as Location from 'expo-location';
import {
    View,
    Text,
     NativeModules,
} from "react-native";
import React, {Component} from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import haversine from "haversine";
import { installWebGeolocationPolyfill} from "expo-location";
import {Box, Button, Icon, IconButton, Modal, ScrollView} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import {TouchableOpacity} from 'react-native';
import {firebase} from "../../firebase/config";
import { Ionicons } from '@expo/vector-icons';
import styles from "../MapScreen/styles"
import { Hidden } from 'native-base';
import Footer from "../../utils/Footer";

installWebGeolocationPolyfill()
class TrackCurrentUser extends Component{
    state = {
        region: {
            latitude: 50.8660773,
            longitude: 20.6285677,
            latitudeDelta: 155.0922, // must give some valid value
            longitudeDelta: 155.0421 // must give some valid value
        },
        error: "",
        routeCoordinates: [],
        distanceTravelled: 0, // contain live distance
        caloriesBurned: 0, // calculated calories
        prevLatLng: {}, // contain pass lat and lang values
        timeStarted: new Date().getTime(),
        timeActual: 0,
        hmsStarted: this.getHms(),
        displayCategory: 1,
        trainingCategoryInfo: [],
        choosenCategoryInfo: "",
        choosenCategoryNumber: 0,
        locale: "",
        begin: 0,
        end: 0,
        userCred: "",
        id: 0
    };

    constructor(props) {
        super(props);
        this.stopActivity = this.stopActivity.bind(this);
    }

    //   getLocation Permission and call getCurrentLocation method
    componentDidMount() {
        this.getData().then(Promise.resolve());
    }

    getHms() {
        let min = new Date().getMinutes();
        if(min.toString().length < 2){
            min = "0" + min;
        }
        return new Date().getHours() + ":" + min  + ":" + new Date().getSeconds()
    }

    componentWillUnmount() {
        this.setState({displayCategory: 0})
        this.render();
        const user = this.props.route.params.user;
        this.props.navigation.push('Home',{user});
        //RootNavigation.navigate('Home', this.props.route.params.user);
    }

    //   getting the current Location of a user...
    getData = async () => {
        const snapshot = await firebase.firestore().collection('trainingCategory');
        snapshot.get().then((querySnapshot) => {
            const tempDoc = []
            let num = 1;
            querySnapshot.forEach((doc) => {
                tempDoc.push({ key: doc.id, ...doc.data(), number: num })
                num = num + 1;
            })
            this.setState({locale: NativeModules.I18nManager.localeIdentifier.substring(0,2)})
            this.setState({trainingCategoryInfo: tempDoc})
        })

        const snap = await firebase.firestore().collection('userPersonalData');
        snap.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().userId === this.props.route.params.user.id) {
                    this.setState({userCred: doc.data().name + " " + doc.data().surname})
                }
            })
        })

        let idTraining = 0;
        const snapshot2 = await firebase.firestore().collection('gpsTrainingInfo');
        await snapshot2.get().then((querySnapshot2) => {
            querySnapshot2.forEach((doc) => {
                if (doc.data().id >= idTraining) {
                    idTraining = doc.data().id + 1;
                }
            })
            this.setState({id: idTraining});
        })

    }

    getCurrentLocation =  async () => {
        await Location.requestForegroundPermissionsAsync();
        navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                const {routeCoordinates} = this.state;
                const newCoordinate = {latitude, longitude};
                let region = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                };

                this.setState({
                    initialRegion: region,
                    region: region,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled: this.state.distanceTravelled + this.calcDistance(newCoordinate),
                    caloriesBurned: this.state.caloriesBurned + this.calcCalories(newCoordinate),
                    prevLatLng: newCoordinate,
                    timeActual: new Date().getTime()
                });
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 1
            }
        );

    };

    //   animate to current user Location
    goToInitialLocation = () => {
        let initialRegion = Object.assign({}, this.state.initialRegion);
        initialRegion["latitudeDelta"] = 155;
        initialRegion["longitudeDelta"] = 155;
    };

    secondsToHms = (d) => {
        d = d/1000;
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h > 0 ? h+':' : "";
        let mDisplay = m > 9 ? m : '0'+m;
        let sDisplay = s > 9 ? s : '0'+s;
        return hDisplay+mDisplay+':'+sDisplay;
    };

    //   calculate the total distance
    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    calcCalories = newLatLng => {
        const { prevLatLng } = this.state;
        return (haversine(prevLatLng, newLatLng) * this.state.choosenCategoryInfo.caloriePerKm) || 0;
    };

    setCategory = number => {
        this.setState({choosenCategoryInfo: this.state.trainingCategoryInfo[number-1]})
        this.setState({displayCategory: 0})
    }

    startActivity = () => {
        const date = new Date();
        const hmsDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log(hmsDate)
        this.setState({begin: 1})
        this.setState({ timeStarted: date.getTime()})
        this.setState({hmsStarted: hmsDate})
        this.getCurrentLocation().then(Promise.resolve);
        return null;
    }

    async stopActivity() {
        const date = new Date();
        const dateYMD = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.setState({end: 1})

        const data = {
            id: this.state.id,
            activityType: this.state.choosenCategoryInfo,
            coords: this.state.routeCoordinates,
            date: dateYMD,
            timeStarted: this.state.hmsStarted,
            distance: this.state.distanceTravelled.toFixed(2),
            calories: this.state.caloriesBurned.toFixed(0),
            time: this.secondsToHms(this.state.timeActual - this.state.timeStarted),
            userId: this.props.route.params.user.id,
            userCredensials: this.state.userCred,
            initialRegion: this.state.initialRegion,
            region: this.state.region,
        }
        firebase.firestore().collection('gpsTrainingInfo').add(data).then(Promise.resolve);
        return null;
    }

    addCategory = () => {
        const user = this.props.route.params.user;
        this.props.navigation.push('CreateCategory',{user})
    }

    editCategory = (id) => {
        const user = this.props.route.params.user;
        this.props.navigation.push('EditCategory',{user: user, id: id})
    }

      deleteCategory (id) {
          const snapshot = firebase.firestore().collection('trainingCategory');
          snapshot.get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  if(doc.data().id === id){
                      firebase.firestore().collection('trainingCategory').doc(doc.id).delete().then(Promise.resolve);
                      this.getData().then(Promise.resolve);
                  }
              })})

    }

    render(){
        const dispCat = this.state.displayCategory;
        return (
            <NativeBaseProvider>
                {this.props.route.params.user.permissionLevel === 0 ?
                <View style={{ flex: 1 }}>
                    {dispCat ? <View style={{ flex: 1 }}>
                    <Modal isOpen={dispCat} onClose={() => this.componentWillUnmount()}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton style={styles.closeButton}/>

                        <Modal.Body>
                            <Text style={styles.hello}>{this.state.locale === 'pl' ? "Wybierz rodzaj aktywności" : this.state.locale === 'fr' ? "Sélectionnez une catégorie d'activité" : "Choose activity category"}</Text>
                            {
                            this.state.trainingCategoryInfo.map((info) => {
                            return (
                            <TouchableOpacity key={info.key} onPress={() => this.setCategory(info.number) } style={styles.categoryButton}>
                                <Text style={styles.categoryText}> {this.state.locale === 'pl' ? info.title : this.state.locale === 'fr' ? info.titleFr : info.titleEng} </Text>
                            </TouchableOpacity>
                            );
                            })}

                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </View> : this.state.end === 0 ? (<View style={styles.mapContainer}>
                    <MapView
                        style={{ flex: 0.75 }}
                        provider={PROVIDER_GOOGLE}
                        region={this.state.region}
                        followUserLocation={true}
                        ref={ref => (this.mapView = ref)}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        onMapReady={this.goToInitialLocation}
                        initialRegion={this.state.initialRegion}
                        lineDashPattern={[0]}
                    >

                        <Polyline
                            coordinates={this.state.routeCoordinates}
                            geodesic={true}
                            strokeColor='#01bffe'
                            fillColor="rgba(0,0,255,0.5)"
                            strokeWidth={4}
                            lineDashPattern={[5]}
                        />

                    </MapView>
                    {  <View style={styles.distanceContainer}>
                        <Text style={styles.textTrainingTime}>
                            { this.secondsToHms(this.state.timeActual - this.state.timeStarted) }
                        </Text>
                            <Text style={styles.textTrainingSmallTime}>
                                {this.state.locale === 'pl' ? "czas" : this.state.locale === 'fr' ? "times": "time"}
                            </Text>

                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.textTrainingDistance}>
                                {parseFloat(this.state.distanceTravelled).toFixed(2)}
                            </Text>
                            <Hidden>
                                <IconButton
                                    icon={<Icon as={Ionicons} name="stop-circle-outline" onPress={setTimeout(() => {this.getCurrentLocation().then(Promise.resolve)},500)}/>}
                                    borderRadius="full"
                                    style={styles.stopIcon}
                                    _icon={{
                                        color: "black",
                                        size: "3xl",
                                    }}
                                />
                            </Hidden>
                            <IconButton
                                icon={<Icon as={Ionicons} name="stop-circle-outline" onPress={() =>this.stopActivity()}/>}
                                borderRadius="full"
                                style={styles.stopIcon}
                                _icon={{
                                    color: "black",
                                    size: "3xl",
                                }}
                            />


                            <Text style={styles.textTrainingCalories}>
                                {
                                    parseFloat(this.state.caloriesBurned).toFixed(0) < 10 ? "00"+parseFloat(this.state.caloriesBurned).toFixed(0) : parseFloat(this.state.caloriesBurned).toFixed(0) < 100 ? "0"+parseFloat(this.state.caloriesBurned).toFixed(0) : parseFloat(this.state.caloriesBurned).toFixed(0)}
                            </Text>
                        </View>

                            <View style={{flexDirection: 'row'}}>
                        <Text style={styles.textTrainingSmallDistance}>
                            {this.state.locale === 'pl' ? "dystans" : this.state.locale === 'fr' ? "distance": "distance"}
                        </Text>

                            <Text style={styles.textTrainingSmallCalorie}>
                             {this.state.locale === 'pl' ? " kalorie" : this.state.locale === 'fr' ? " calories": "calories"}
                            </Text>
                    </View>
                    </View>}
                </View>) : (<View style={{ flex: 1 }}>
                    <Modal style={styles.summaryModal} isOpen={1} size={"xl"} onClose={() => this.componentWillUnmount()}>
                    <Modal.Content maxWidth="600px">
                    <Modal.CloseButton style={styles.closeButton}/>
                    <Modal.Header>
                        <Text style={styles.summaryText4}> {this.state.locale === 'pl' ? "Podsumowanie treningu" : this.state.locale === 'fr' ? "TEMP" : "Training summary"}</Text>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            <View>
                                <View id={"mapView"} style={styles.mapContainer}>
                                <MapView
                                    style={{ flex: 0.35, width: '100%', height: 250, borderWidth: 2, borderColor: '#000', borderStyle: 'solid'}}
                                    provider={PROVIDER_GOOGLE}
                                    region={this.state.region}
                                    ref={ref => (this.mapView = ref)}
                                    zoomEnabled={true}
                                    onMapReady={this.goToInitialLocation}
                                    initialRegion={this.state.initialRegion}
                                    lineDashPattern={[0]}
                                >

                                    <Polyline
                                        coordinates={this.state.routeCoordinates}
                                        geodesic={true}
                                        strokeColor='#01bffe'
                                        fillColor="rgba(0,0,255,0.5)"
                                        strokeWidth={4}
                                        lineDashPattern={[5]}
                                    />

                                </MapView>
                                    </View>
                            <Text style={styles.summaryText1}>{this.state.locale === 'pl' ? "Aktywność" : this.state.locale === 'fr' ? "TEMP" : "Activity"}: {this.state.locale === 'pl' ? this.state.choosenCategoryInfo.title : this.state.locale === 'fr' ? this.state.choosenCategoryInfo.titleFr : this.state.choosenCategoryInfo.titleEng}</Text>
                            <Text style={styles.summaryText2}>{this.state.locale === 'pl' ? "Czas trwania" : this.state.locale === 'fr' ? "TEMP" : "Duration"}: {this.secondsToHms(this.state.timeActual-this.state.timeStarted)}</Text>
                            <Text style={styles.summaryText2}>{this.state.locale === 'pl' ? "Spalone kalorie" : this.state.locale === 'fr' ? "TEMP" : "Calories burned"}: {this.state.caloriesBurned.toFixed(0)} </Text>
                            <Text style={styles.summaryText2}>{this.state.locale === 'pl' ? "Dystans" : this.state.locale === 'fr' ? "Distance" : "Distance"}: {this.state.distanceTravelled.toFixed(2)} km</Text>
                            <Text style={styles.summaryText3}>{this.state.locale === 'pl' ? "Dobra robota!" : this.state.locale === 'fr' ? "TEMP" : "Well done!"}</Text>

                            </View>
                       }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={styles.endButtonModal} onPress={() => this.componentWillUnmount()}><Text style={{fontSize: 30, color: '#fff'}}>{this.state.locale === 'pl' ? "Kończymy" : this.state.locale === 'fr' ? "TEMP" : "Let's end"}</Text></Button>
                    </Modal.Footer>
                    </Modal.Content>
                    </Modal>
                </View>)}</View> : (<View style={{flex: 1, height: '100%'}}>
                        <ScrollView style={{flex: 1, height: '100%', backgroundColor: '#f5f9ff'}}>
                            <Text style={styles.employeeTextAdd}> {this.state.locale === 'pl' ? "Dodaj kategorię treningową " : this.state.locale === 'fr' ? "FRTEXT" : "Add new training category"} </Text>
                            <Button onPress={() => this.addCategory() }  style ={styles.addButton}> <Text style={styles.addButtonText}> {this.state.locale === 'pl' ? "Dodaj" : this.state.locale === 'fr' ? "t" : "Add"} </Text> </Button>
                            <Text style={styles.employeeText}> {this.state.locale === 'pl' ? "Aktywne kategorie treningowe: " : this.state.locale === 'fr' ? "FRTEXT" : "Active training categories:"} </Text>
                            {

                                this.state.trainingCategoryInfo.map((info) => {
                                    return (
                                        <View key={info.id} style={{flex: 1, marginBottom: 15}}>
                                        <Box key={info.id}  style={styles.categoryEmployee}>
                                            <Text style={styles.employeeCategoryText}> {this.state.locale === 'pl' ? info.title : this.state.locale === 'fr' ? info.titleFr : info.titleEng} </Text>
                                            <Text style={styles.employeeCategoryText}> {this.state.locale === 'pl' ? "Kalorie (Km)" : this.state.locale === 'fr' ? "Calorie (Km)" : "Calories (Km)"} :{info.caloriePerKm} </Text>

                                        </Box>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button onPress={() => this.editCategory(info.id) } style={styles.editButton} >{this.state.locale === 'pl' ? "Edytuj" : this.state.locale === 'fr' ? "t" : "Edit"}</Button>
                                        <Button onPress={() => this.deleteCategory(info.id)} style ={styles.deleteButton}>{this.state.locale === 'pl' ? "Usuń" : this.state.locale === 'fr' ? "t" : "Delete"}</Button>
                                    </View>
                                        </View>
                                    );
                                })}
                        </ScrollView>
                    <Footer choice={1} user={this.props.route.params.user} navigation={this.props.navigation}/>
                        </View>
                )}
            </NativeBaseProvider>
        )};
}

export default TrackCurrentUser;