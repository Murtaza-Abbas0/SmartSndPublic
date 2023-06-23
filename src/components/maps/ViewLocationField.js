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
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const ViewLocationField = ({ latitude, longitude, }) => {

    const mapViewRef = useRef()
    const makerRef = useRef()

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapViewRef}
                mapType={'standard'}
                style={{ flex: 1, }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0005,
                    longitudeDelta: 0.0004,
                }}
                pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}
                // onMapReady={() => { console.log('Map is ready now!') }}
            >
                <Marker
                    ref={makerRef}
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                />
            </MapView>

            {/* <TouchableOpacity style={styles.checkInButtonContainer} onPress={() => { onPressCheckIn() }}>
                <Text style={styles.checkInButtonLabel}>Check In</Text>
            </TouchableOpacity> */}

        </View>
    );
};

export default memo(ViewLocationField);

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
