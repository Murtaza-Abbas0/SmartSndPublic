import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Colors } from "../../styling";
import { SafeAreaView } from 'react-native-safe-area-context';
const ic_back = require('../../assets/ic_back.png')
const ic_no_data = require('../../assets/ic_no_data.png')
import RNPrint from 'react-native-print';
import { CommonHeaderWithBackButton } from '../../components/Headers';
import Pdf from 'react-native-pdf';

const OrderSummaryScreen = ({ route, navigation }) => {

    let { invoiceURL } = route?.params
    // const invoiceURL = require('../../pdfs/dummyInvoice.pdf')
    const [onLoadImage, setLoadImage] = useState(false);
    // alert('invoiceURL: ' + invoiceURL)

    console.log('invoiceURL: ', invoiceURL)
    console.log('hereeeeeeeeeeeeeeeee');

    useEffect(() => {

    }, [])

    const printRemotePDF = async () => {
        await RNPrint.print({ filePath: invoiceURL })
    }

    const imageLoading = () => {
        setLoadImage(true);
    }

    return (
        // <SafeAreaView style={{ flex: 1 }}>
        //     <View style={{ flex: 1, flexDirection: 'column' }}>
        //         <CommonHeaderWithBackButton title={'Order Summary'} />
        //         {/* {
        //             invoiceURL ?
        //                 <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>

        //                     {onLoadImage
        //                         ?
        //                         <Image
        //                             style={styles.summaryImage}
        //                             source={{ uri: invoiceURL }}
        //                             onLoad={() => { imageLoading() }}
        //                         />
        //                         :
        //                         <ActivityIndicator style={{alignSelf:'center'}} size={'large'} />
        //                     }

        //                 </View>
        //                 :
        //                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        //                     <Image style={styles.noDataImage} source={ic_no_data} />
        //                     <Text style={{ fontSize: wp('3%'), color: 'black', alignSelf: 'center' }}>No record found!</Text>
        //                 </View>

        //         } */}

        //         <Image
        //             style={styles.summaryImage}
        //             source={invoiceURL}
        //             onLoad={() => { imageLoading() }}
        //         />
        //         {/* <TouchableOpacity style={styles.downloadButton} onPress={() => { printRemotePDF() }}>
        //             <Text style={styles.downloadButtonText}>Print</Text>
        //         </TouchableOpacity> */}
        //     </View>
        // </SafeAreaView>
        <View style={styles.container}>
            <CommonHeaderWithBackButton title={'Order Summary'} />
            <Pdf
                trustAllCerts={false}
                source={{ uri: invoiceURL }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf} />
        </View>
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
    noDataImage: {
        width: wp('20%'),
        height: wp('20%'),
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
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }

})


export default OrderSummaryScreen;