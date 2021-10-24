import * as Location from 'expo-location';
import {
    StyleSheet,
    View,
    Text,
    Button, NativeModules,
} from "react-native";
import React, {Component} from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import haversine from "haversine";
import { installWebGeolocationPolyfill} from "expo-location";
import {Modal} from "native-base";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import * as RootNavigation from "../../utils/RootNavigation";
import {TouchableOpacity} from 'react-native';
import {firebase} from "../../firebase/config";

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
        prevLatLng: {}, // contain pass lat and lang values
        timeStarted: new Date().getTime(),
        timeActual: 0,
        displayCategory: 1,
        trainingCategoryInfo: [],
        locale: ""
    };

    //   getLocation Permission and call getCurrentLocation method
    componentDidMount() {
        this.getData().then(Promise.resolve());
        this.getCurrentLocation().then(r => Promise.resolve());
    }
    componentWillUnmount() {
        this.setState({displayCategory: 0})
        this.render();
        RootNavigation.navigate('Home', this.props.user);
    }

    //   getting the current Location of a user...
    getData = async () => {
        const snapshot = await firebase.firestore().collection('trainingCategory');
        snapshot.get().then((querySnapshot) => {
            const tempDoc = []
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            this.setState({locale: NativeModules.I18nManager.localeIdentifier.substring(0,2)})
            this.setState({trainingCategoryInfo: tempDoc})
        })
    }

    getCurrentLocation =  async () => {
        await Location.requestForegroundPermissionsAsync();
        navigator.geolocation.watchPosition(position => {

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
        initialRegion["latitudeDelta"] = 0.005;
        initialRegion["longitudeDelta"] = 0.005;
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

    render(){
        const dispCat = this.state.displayCategory;
        return (
            <NativeBaseProvider>
                {dispCat ? (<View style={{ flex: 1 }}>
                    <Modal isOpen={dispCat} onClose={() => this.componentWillUnmount()}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton style={styles.closeButton}/>

                        <Modal.Body>
                            <Text style={styles.hello}>{this.state.locale === 'pl' ? "Wybierz kategorię aktywności" : this.state.locale === 'fr' ? "Sélectionnez une catégorie d'activité" : "Choose activity category"}</Text>
                            {
                            this.state.trainingCategoryInfo.map(function(info){
                            return (
                            <TouchableOpacity onPress={() => this.setState({displayCategory: 1})} style={styles.categoryButton}>
                                <Text style={styles.categoryText}> {info.title} </Text>
                            </TouchableOpacity>
                            )
                            })}

                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </View>) : (<View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 0.9 }}
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
                    <View style={styles.distanceContainer}>
                        <Text>{this.secondsToHms(this.state.timeActual - this.state.timeStarted)} time {parseFloat(this.state.distanceTravelled).toFixed(4)} km </Text>
                        {<Button  title="START" color="#841584" onClick={this.getCurrentLocation()}/>}
                    </View>
                </View>)}

            </NativeBaseProvider>
        )};
}

export default TrackCurrentUser;

const styles = StyleSheet.create({
    distanceContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    categoryButton: {
        borderRadius: 15,
        marginTop: 10,
        width: '100%',
        height: 60,
        backgroundColor: '#8ab7ff'
    },
    categoryText: {
        paddingTop: 18,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 15,
        color: '#fff'
    },

    hello: {
        textAlign: "center",
        fontSize: 17,
        marginBottom: 10,
        marginTop: 10
    }

});