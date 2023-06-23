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

const ProductDetailScreen = ({ route, navigation }) => {

    let { productDetails } = route?.params
    console.log('productDetails : ', productDetails)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <View style={styles.container}> */}
                <CommonHeaderWithBackButton title={'Product Details'} />
                <ScrollView style={{ flex: 1, flexGrow: 1, paddingTop: wp('5%')}} showsVerticalScrollIndicator={false} bounces={false}>
                    <FieldForMyProfile Field={'Product Name'} Value={productDetails?.name} />
                    <FieldForMyProfile Field={'Pack Size'} Value={productDetails?.packSize} />
                    <FieldForMyProfile Field={'Weight'} Value={productDetails?.pieceWeight} />
                    <FieldForMyProfile Field={'Shelf Life (In Days)'} Value={productDetails?.shelfLife} />
                    <FieldForMyProfile Field={'Product Price'} Value={productDetails?.retailPrice} />
                   
                    <View style={{width: '100%', height: wp('20%')}}/>
                </ScrollView>
            {/* </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'column',
        paddingTop: wp('5%')
    },

})


export default ProductDetailScreen;