import * as Location from 'expo-location';
import {
    StyleSheet,
    View,
    Text,
    Button,
} from "react-native";
import React, {Component} from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import haversine from "haversine";
import { installWebGeolocationPolyfill} from "expo-location";

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
        prevLatLng: {}, // contain pass lat and lang value
        timeStarted: new Date().getTime(),
        timeActual: 0
    };

    //   getLocation Permission and call getCurrentLocation method
    componentDidMount() {
        this.getCurrentLocation();
    }

    //   getting the current Location of a user...
    getCurrentLocation =  () => {
         Location.requestBackgroundPermissionsAsync();
        navigator.geolocation.watchPosition( position => {

                const { latitude, longitude } = position.coords;
                const { routeCoordinates } = this.state;
                const newCoordinate = { latitude, longitude };
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
        this.mapView.animateToRegion(initialRegion, 2000);
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
        return (

            <View style={{ flex: 1 }}>
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
                    {<Button  title="HEllo" color="#841584"/>}
                </View>
            </View>
        )};
}

export default TrackCurrentUser;

const styles = StyleSheet.create({
    distanceContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
    }
});