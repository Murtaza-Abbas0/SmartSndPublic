import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Image, ScrollView } from 'react-native'
import { Colors } from "../../styling";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { CommonHeaderWithBackButton } from "../../components/Headers";
import { useEffect } from "react";

const ic_back = require('../../assets/ic_back.png')

const ViewShopLocationScreen = ({ route, navigation }) => {

    let { shopDetails } = route?.params
    console.log('shopDetails: ', shopDetails);

    const mapViewRef = useRef();

    const [latLng, setLatLng] = useState({
        latitude: shopDetails?.latiitude,
        longitude: shopDetails?.longitude
    })

    useEffect(() => {
        mapViewRef.current.animateToRegion(latLng, 100)
    })

    // const navigateToShopLocation = () => {
    //     let region = {
    //         latitude: shopDetails.latiitude,
    //         longitude: shopDetails.longitude,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //     }
    //     mapViewRef.current.animateToRegion(region, 1000)
    // }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <CommonHeaderWithBackButton title={`Location of ${shopDetails.shopName}`} />
            <MapView
                ref={mapViewRef}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: shopDetails?.latiitude,
                    longitude: shopDetails?.longitude,
                    latitudeDelta: 0,
                    longitudeDelta: 0.05,
                }}
                pitchEnabled={false}
                rotateEnabled={false}
                // zoomEnabled={false}
                scrollEnabled={false}
                onMapReady={() => { console.log('Map is ready now!') }}
            >
                <Marker
                    coordinate={{ latitude: shopDetails?.latiitude, longitude: shopDetails?.longitude }}
                />
            </MapView>
        </SafeAreaView>
    )
}


export default ViewShopLocationScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    iconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        start: wp('5%'),
        top: wp('13%'),
        zIndex: 100,
        backgroundColor: Colors.backgroundColor,
        borderRadius: wp('5%')
    },
    icon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: Colors.primaryColor
    },
    buttonContainer: {
        width: '80%',
        height: wp('12%'),
        alignSelf: 'center',
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('3%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        position: 'absolute',
        bottom: wp('5%')
    },
})