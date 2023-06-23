import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';

import { Colors } from "../../styling";
import { CommonHeaderWithBackButton } from '../../components/Headers';
import FieldForMyProfile from '../../components/New folder/FieldForMyProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { MapView, Marker } from 'react-native-maps';
import { memo } from 'react';
import ViewLocationField from '../../components/maps/ViewLocationField';

const ShopDetailScreen = ({ route, navigation }) => {

    const mapViewRef = useRef()
    const makerRef = useRef()
    let { shopDetails } = route?.params
    console.log('shopDetails : ', shopDetails)
    return (
        <SafeAreaView style={styles.container}>
            <CommonHeaderWithBackButton title={'Shop Details'} />
            <ScrollView style={{ flex: 1, flexGrow: 1, paddingTop: wp('5%') }} showsVerticalScrollIndicator={false} bounces={false}>
                <FieldForMyProfile Field={'Shop Name'} Value={shopDetails?.shopName} />
                <FieldForMyProfile Field={'Address'} Value={shopDetails?.shop_Address} />
                <FieldForMyProfile Field={'Area'} Value={shopDetails?.areaName} />
                <FieldForMyProfile Field={'City'} Value={shopDetails?.cityName} />
                <FieldForMyProfile Field={'Phone Number'} Value={shopDetails?.ph_Number} />
                <FieldForMyProfile Field={'Owner Name/ Handling Person'} Value={shopDetails?.handlingPerson} />
                <FieldForMyProfile Field={'Channel'} Value={shopDetails?.channel} />
                <FieldForMyProfile Field={'Class'} Value={shopDetails?.shopClass} />
                <FieldForMyProfile Field={'Payment Team'} Value={shopDetails?.payment_Type} />
                <FieldForMyProfile Field={'Credit Days'} Value={shopDetails?.credit_Days} />
                <FieldForMyProfile Field={'Maximum Limit (PKR)'} Value={shopDetails?.max_Credit_Limit} />
                <FieldForMyProfile Field={'Vat Number'} Value={shopDetails?.vat_Number} />
                <FieldForMyProfile Field={'Order Booker Name'} Value={shopDetails?.salesManName} />
                <FieldForMyProfile Field={'Van Name'} Value={shopDetails?.vanName} />
                <View style={styles.fieldAndValueContainer} >
                    <Text style={styles.field} >Location:</Text>
                </View>
                {shopDetails?.latiitude == 0 && shopDetails?.longitude == 0 ?
                    <View style={styles.TextContainer} >
                        <Text style={styles.textField} >No Location Found!</Text>
                    </View>
                    :
                    <View style={styles.mapContainer} >
                        <ViewLocationField latitude={shopDetails?.latiitude} longitude={shopDetails?.longitude} />
                    </View>
                }
                <View style={styles.Divider} />

                <View style={{ width: '100%', marginBottom: wp('25%') }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    mapContainer: {
        width: wp('80%'),
        height: wp('50%'),
        marginTop: wp('10%'),
        alignSelf: 'center',
        borderRadius: wp('5%'),
    },
    TextContainer: {
        width: wp('80%'),
        height: wp('50%'),
        marginTop: wp('10%'),
        alignSelf: 'center',
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'column',
        // paddingTop: wp('5%')
    },
    textField: {
        color: Colors.textColor,
        fontSize: wp('5%'),
        fontWeight: 'bold'
    },
    field: {
        color: Colors.primaryColor,
        fontWeight: "bold",
        fontSize: wp('4.5%')
    },
    fieldAndValueContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: wp('5%')
    },
    Divider: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.primaryColorLight,
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        paddingVertical: wp('7%')
    },

})


export default memo(ShopDetailScreen);