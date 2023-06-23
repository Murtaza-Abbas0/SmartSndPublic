import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Colors } from "../styling";

const ic_salesman = require('../assets/ic_salesman.png')
const ic_deliveryman = require('../assets/ic_deliveryman.png')
const ic_admin = require('../assets/ic_admin.png')
const logo = require('../assets/logo.png')
const IAC_Logo = require('../assets/IAC_Logo.png')

const MainSignInScreen = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={IAC_Logo} />

            <Text style={styles.selectRoleLabel}>Select Role</Text>

            <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.selectableItemContainer} onPress={() => { navigation.navigate('CompleteFlowOfAdmin') }}>
                    <Image style={styles.icon} source={ic_admin} />
                    <Text style={styles.label}>Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectableItemContainer} onPress={() => { navigation.navigate('SignInScreen', { roleID: 0 }) }}>
                    <Image style={styles.icon} source={ic_salesman} />
                    <Text style={styles.label}>Order Booker</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.selectableItemContainer} onPress={() => { navigation.navigate('SignInScreen', { roleID: 2 }) }}>
                    <Image style={styles.icon} source={ic_deliveryman} />
                    <Text style={styles.label}>Delivery Man</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    innerContainer: {
        width: wp('100%'),
        // height: wp('120%'),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginTop: wp('5%')
    },
    selectableItemContainer: {
        width: wp('25%'),
        height: wp('25%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp('5%'),
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.primaryColor,
        borderWidth: 1

    },
    label: {
        color: Colors.textColor,
        fontSize: wp('3%'),
        marginTop: wp('2%'),
        alignSelf: 'center'
    },
    icon: {
        width: wp('10%'),
        height: wp('10%'),
        resizeMode: 'contain',
        tintColor: Colors.backgroundColor
    },
    selectRoleLabel: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: Colors.primaryColor,
        alignSelf: 'center',
        marginVertical: wp('15%')

    },
    logo: {
        width: '45%',
        alignSelf: 'center',
        marginTop: wp('15%'),
        height: wp('40%'),
        resizeMode: 'contain',
        marginTop: wp('20%')
    },

})


export default MainSignInScreen;