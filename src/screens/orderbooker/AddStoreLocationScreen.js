import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Image, ScrollView } from 'react-native'
import { Colors } from "../../styling";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { ApiRoute, ApiClient } from "../../network_utils";
import { CommonHeaderWithBackButton } from "../../components/Headers";
import { useNavigation } from "@react-navigation/native";
import { AlertMessage } from "../../components/snackbar";
import { useSelector, useDispatch } from 'react-redux';

const ic_back = require('../../assets/ic_back.png')

const AddStoreLocationScreen = ({ route }) => {

    const userData = useSelector(state => state.userAuth.value);
    // console.log('userData: ', userData)

    let { shopDetails } = route?.params
    const mapViewRef = useRef()
    const makerRef = useRef()
    const navigation = useNavigation()
    // console.log('shopDetails: ', shopDetails)
    const [latLng, setLatLng] = useState({
        latitude: shopDetails?.latiitude,
        longitude: shopDetails?.longitude
    });
    const [deliveryStatus, setDeliveryStatus] = useState(0);

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
            console.log('info: ', info)

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
            console.log('Region: ', region)
        });
    }

    const onPressButton = useCallback(() => {
        if (deliveryStatus === 0) {
            setDeliveryStatus(1)
            checkIn()

            setTimeout(() => {
                setDeliveryStatus(2)
            }, 3000)

        } else if (deliveryStatus === 2) {
            updateStoreLocation();
        }
    }, [deliveryStatus]);

    console.log(latLng)

    const updateStoreLocation = async () => {
        console.log('Executed')
        let latitudeConvertedInString = String(latLng.latitude);
        // latitudeConvertedInString = latitudeConvertedInString.toString();
        let longitudeConvertedInString = String(latLng.longitude);
        // longitudeConvertedInString = longitudeConvertedInString.toString();

        console.log(typeof latitudeConvertedInString)
        console.log(typeof longitudeConvertedInString)

        let object = {
            "longitude": longitudeConvertedInString,
            "latitude": latitudeConvertedInString,
            "shopID": shopDetails?.shopId_Encrypted
        };
        console.log('object: ', object)

        try {
            await ApiClient.post(
                `${ApiRoute.BASE_URL}${ApiRoute.ADD_STORE_LOCATION}`,
                object,
                {
                    headers: {
                        Accept: 'text/plain',
                        'Content-Type': 'application/json',
                    },
                },
            )
                .then(async response => {
                    console.log('response: ', response.data)
                    if (response.data.isSuccess) {
                        setTimeout(() => {
                            navigation.goBack()
                        }, 1000);
                        AlertMessage.showMessage(response.data?.message);
                    } else {
                        AlertMessage.showMessage(response.data?.message);
                        // console.log('Data : ', response.message)
                    }
                })
                .catch(err => {
                    // console.log(err)
                    AlertMessage.showMessage(err?.message);
                });
        } catch (e) {
            // console.log('login error => ', e)
        }
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainContainer}>

                <CommonHeaderWithBackButton title={'Add Location'} />

                <MapView
                    ref={mapViewRef}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: latLng.latitude,
                        longitude: latLng.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onMapReady={() => { console.log('Map is ready now!') }}
                >
                    <Marker
                        ref={makerRef}
                        coordinate={{ latitude: latLng.latitude, longitude: latLng.longitude }}
                    />
                </MapView>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => { onPressButton() }}>
                    <Text>
                        {deliveryStatus === 0 ? "Navigate To Current Location!" : "Save"}
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}


export default AddStoreLocationScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column'
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
    buttonLabel: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: 'white'
    }
})