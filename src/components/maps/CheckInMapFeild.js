import React, { useState, memo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    PermissionsAndroid

} from 'react-native';
import { Colors } from '../../styling';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';

import { AlertMessage } from '../snackbar';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const CheckInMapFeild = ({ location, onLocationUpdate }) => {

    const mapViewRef = useRef()
    const makerRef = useRef()


    const [latLng, setLatLng] = useState({
        latitude: location ? location?.latitude : 0.0,
        longitude: location ? location?.longitude : 0.0
    });

    useEffect(() => {
        let region = {
            ...latLng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        mapViewRef.current.animateToRegion(region, 1000)
    }, [latLng])

    const checkIn = () => {
        Geolocation.getCurrentPosition(info => {
            console.log(info)

            onLocationUpdate(info.coords)

            let region = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            setLatLng({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
            })
            mapViewRef.current.animateToRegion(region, 1000)
        });


    }


    const requestLocationPermission = async () => {
        let isGranted = false
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'SND App',
                    'message': 'SND App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
                // alert("You can use the location");
                isGranted = true
            } else {
                console.log("location permission denied")
                // alert("Location permission denied");
                isGranted = false
            }
        } catch (err) {
            console.warn(err)
        }

        return isGranted
    }

    const onPressCheckIn = () => {
        if (Platform.OS === 'android') {
            if (requestLocationPermission()) {
                checkIn()
            } else {
                AlertMessage.showMessage('Location deniend!')
            }
        } else {
            checkIn()
        }
    }

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapViewRef}
                mapType={'standard'}
                style={{ flex: 1, }}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0009,
                    longitudeDelta: 0.0008,
                }}
                onMapReady={() => { console.log('Map is ready now!') }}
            >
                <Marker
                    ref={makerRef}
                    coordinate={{
                        latitude: latLng.latitude,
                        longitude: latLng.longitude,
                    }}
                />
            </MapView>

            <TouchableOpacity style={styles.checkInButtonContainer} onPress={() => { onPressCheckIn() }}>
                <Text style={styles.checkInButtonLabel}>Check In</Text>
            </TouchableOpacity>

        </View>
    );
};

export default memo(CheckInMapFeild);

const styles = StyleSheet.create({
    mapContainer: {
        width: wp('80%'),
        height: wp('50%'),
        marginTop: wp('10%'),
        alignSelf: 'center',
        borderRadius: wp('5%')
    },
    checkInButtonContainer: {
        width: wp('25%'),
        height: wp('9%'),
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: wp('2%'),
        right: wp('5%'),
        borderRadius: wp('5%')

    },
    checkInButtonLabel: {
        fontSize: wp('3.5%'),
        color: Colors.onPrimaryColor,
        fontWeight: '600',
        alignSelf: 'center'
    }
});
