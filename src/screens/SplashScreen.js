import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../stores/slices/userAuthSlice'
import { Colors } from "../styling";

const logo = require('../assets/logo2.png')
const IAC_Logo = require('../assets/IAC_Logo.png')

const SplashScreen = ({ route, navigation }) => {

    const dispatch = useDispatch()

    useEffect(() => {

        const getData = async () => {

            StatusBar.setHidden(true)
            global.userData = null
            global.token = ''
            global.refreshToken = ''

            global.userData = await getUserData()
            global.token = await getUserToken()
            global.refreshToken = await getUserRefreshToken()

            if (global.userData === null) {
                setTimeout(() => {
                    navigation.dispatch(
                        StackActions.replace('MainSignInScreen', {})
                    );
                    StatusBar.setHidden(false);
                }, 3000)
            } else {
                setTimeout(() => {
                    // console.log(global.userData)
                    dispatch(login(global.userData))

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainDrawerScreen' }],
                    });
                    StatusBar.setHidden(false);
                }, 3000)
            }
        }
        getData();
    }, [])

    const getUserData = async () => {
        try {
            const jsonValue = await EncryptedStorage.getItem('userData')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log('Error : ', e)
        }
    }

    const getUserToken = async () => {
        try {
            const jsonValue = await EncryptedStorage.getItem('user_token')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log('Error : ', e)
        }
    }

    const getUserRefreshToken = async () => {
        try {
            const jsonValue = await EncryptedStorage.getItem('user_refresh_token')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log('Error : ', e)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={IAC_Logo} />
            </View>
            <Text style={styles.labelPoweredBy}>Powered by Digital Landscape {'\u00A9'}</Text>
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
    logoContainer: {
        // width: '100%',
        // height: wp('35%'),
        // alignSelf: 'center',
        // marginTop: wp('5%'),
        // resizeMode: 'contain',
        // justifyContent: 'center',
        // alignItems: 'center'
        width: '45%',
        alignSelf: 'center',
        marginTop: wp('15%'),
        height: wp('40%'),
        resizeMode: 'contain',
        // marginTop: wp('20%')

    },
    logo: {
        width: wp('50%'),
        alignSelf: 'center',
        height: wp('50%'),
        resizeMode: 'contain',
    },
    labelPoweredBy: {
        fontSize: wp('3.5%'),
        position: 'absolute',
        bottom: wp('10%'),
        color: Colors.primaryColor,
        padding: wp('2%')
    }
})


export default SplashScreen;