import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Colors } from "../../styling";
import { SafeAreaView } from 'react-native-safe-area-context';
const ic_back = require('../../assets/ic_back.png')
import RNPrint from 'react-native-print';
import { CommonHeaderWithBackButton } from '../../components/Headers';

const DeliveryHistoryDetailScreen = ({ route, navigation }) => {

    let { invoiceURL, itemId } = route?.params

    // console.log(invoiceURL)

    useEffect(() => {

    }, [])

    const printRemotePDF = async () => {
        await RNPrint.print({ filePath: invoiceURL })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ flex: 1, flexDirection: 'column' }}>
                <CommonHeaderWithBackButton title={`Invoice Of Order No. ${itemId}`} />
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                    <Image style={styles.backIcon} source={ic_back} />
                </TouchableOpacity>
                <Image style={styles.summaryImage} source={{ uri: invoiceURL }} />
                {/* <TouchableOpacity style={styles.downloadButton} onPress={() => { printRemotePDF() }}>
                    <Text style={styles.downloadButtonText}>Print</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    summaryImage: {
        flex: 1,
        width: '100%',
        resizeMode: 'contain'
    },
    downloadButton: {
        width: '85%',
        height: wp('12%'),
        backgroundColor: Colors.primaryColor,
        borderRadius: wp('3%'),
        alignSelf: 'center',
        marginTop: wp('5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,

    },
    downloadButtonText: {
        color: Colors.onPrimaryColor,
        fontWeight: '500',
        fontSize: wp('4%')
    },
    backIconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        start: wp('4%'),
        zIndex: 100,
    },
    backIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: Colors.primaryColor
    },


})


export default DeliveryHistoryDetailScreen;