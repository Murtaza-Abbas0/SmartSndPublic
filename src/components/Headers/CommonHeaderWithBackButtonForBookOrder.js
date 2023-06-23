import React, { memo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styling";

const ic_back = require('../../assets/ic_back.png')

const CommonHeaderWithBackButtonForBookOrder = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('MakeNewOrderScreen')} style={styles.iconContainer}>
                <Image style={styles.icon} source={ic_back} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: wp('12%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor
    },
    headerTitle: {
        flex: 1,
        fontSize: wp('5%'),
        color: Colors.onPrimaryColor,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: '400'
    },
    iconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        start: wp('1%'),
        zIndex: 100
    },
    icon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: Colors.onPrimaryColor
    },

})

export default memo(CommonHeaderWithBackButtonForBookOrder)