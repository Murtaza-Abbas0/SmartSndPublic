import 'react-native-gesture-handler';
import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import { StackActions } from '@react-navigation/native';
import { AlertMessage } from "../components/snackbar";
import InputScrollView from 'react-native-input-scroll-view';
import { ApiRoute } from "../network_utils";
import { Colors } from '../styling';
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../stores/slices/userAuthSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const logo = require('../assets/logo.png')
const open_eye = require('../assets/ic_open_eye.png')
const close_eye = require('../assets/ic_close_eye.png')
const ic_forward_arrow = require('../assets/ic_forward_arrow_long.png')
const ic_back = require('../assets/ic_back.png')
const IAC_Logo = require('../assets/IAC_Logo.png')

const SignInScreen = ({ route, navigation }) => {

    const dispatch = useDispatch()

    console.log(ApiRoute.BASE_URL)

    let { roleID } = route?.params

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordInputRef = useRef(null)

    const loginUser = async () => {
        console.log('`${ApiRoute.BASE_URL}${ApiRoute.USER_LOGIN}`: ', `${ApiRoute.BASE_URL}${ApiRoute.USER_LOGIN}`);
        if (!checkIsValidiate()) {
            return
        }
        Keyboard.dismiss()
        setIsLoading(true)

        let object = {
            loginId: userName,
            password: password
        }

        let data = JSON.stringify(object);

        if (roleID == 0) {

            try {
                await axios.post(`${ApiRoute.BASE_URL}${ApiRoute.USER_LOGIN}`, data, {
                    headers: {
                        'Accept': 'text/plain',
                        "Content-Type": "application/json",
                    }
                })
                    .then(async (response) => {
                        setIsLoading(false)
                        if (response.data.isSuccess && response.data.data != null) {
                            // console.log('Data : ', response?.data)
                            AlertMessage.showMessage(response.data?.message)
                            dispatch(login(response.data?.data))
                            global.UserData = response.data?.data
                            global.token = response.headers?.token
                            global.refreshToken = response.headers?.refreshtoken
                            await storeUserData(response.data?.data)
                            await storeUserToken(response.headers?.token, response.headers?.refreshtoken)

                            navigation.navigate('MainDrawerScreen')

                        } else {
                            AlertMessage.showMessage(response.data?.message)
                            // console.log('Data : ',response.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                        AlertMessage.showMessage(err?.message)
                    })

            } catch (e) {
                console.log('login error => ', e)
                setIsLoading(false)
            }
        } else {

            // let object = {
            //     loginId: userName,
            //     password: password
            // }

            // let data = JSON.stringify(object);

            // console.log(data)

            try {
                await axios.post(`${ApiRoute.BASE_URL}${ApiRoute.ADMIN_LOGIN}`, data, {
                    headers: {
                        'Accept': 'text/plain',
                        "Content-Type": "application/json",
                    }
                })
                    .then(async (response) => {
                        // console.log('Data : ', response?.data)
                        setIsLoading(false)
                        if (response.data.isSuccess && response.data.data != null) {
                            // console.log('Data : ', response?.data)
                            AlertMessage.showMessage(response.data?.message)
                            dispatch(login(response.data?.data))
                            global.UserData = response.data?.data
                            global.token = response.headers?.token
                            global.refreshToken = response.headers?.refreshtoken
                            await storeUserData(response.data?.data)
                            await storeUserToken(response.headers?.token, response.headers?.refreshtoken)

                            navigation.navigate('CompleteFlowOfAdmin')

                        } else {
                            AlertMessage.showMessage(response.data?.message)
                            // console.log('Data : ',response.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                        AlertMessage.showMessage(err?.message)
                    })

            } catch (e) {
                console.log('login error => ', e)
                setIsLoading(false)
            }
        }
    }


    const storeUserData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await EncryptedStorage.setItem('userData', jsonValue)
        } catch (e) {
            console.log('Error : ', e)
        }
    }


    const storeUserToken = async (token, refreshToken) => {
        try {
            const jsonValueToken = JSON.stringify(token)
            const jsonValueRefToken = JSON.stringify(refreshToken)

            await EncryptedStorage.setItem('user_token', jsonValueToken)
            await EncryptedStorage.setItem('user_refresh_token', jsonValueRefToken)

        } catch (e) {
            console.log('Error : ', e)
        }
    }

    function checkIsValidiate() {

        if (userName.toString().length < 1 || userName.toString() === '') {
            return false
        }

        if (password.toString().length < 1 || password.toString() === '') {
            return false
        }

        return true
    }

    const getRoleNameByRoleId = (roleId) => {
        switch (roleId) {
            case 1:
                return 'Admin'
            case 0:
                return 'Order Booker'
            case 2:
                return 'Delivery Man'
            default:
                break;
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
            <KeyboardAvoidingView
                style={{ width: '100%', height: '100%' }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.container}>

                        <TouchableOpacity style={styles.backIconContainer} onPress={() => { navigation.goBack() }}>
                            <Image style={styles.backIcon} source={ic_back} />
                        </TouchableOpacity>

                        <InputScrollView contentContainerStyle={styles.scrollview}>

                            <View style={styles.innerContainer}>
                                <Image style={styles.logo} source={IAC_Logo} />

                                <Text style={styles.roleLabel}>{getRoleNameByRoleId(roleID)}</Text>
                                {/* <Text style={styles.roleLabel}>Order Booker</Text> */}

                                <TextInput
                                    style={[styles.input, { marginTop: wp('10%') }]}
                                    onChangeText={setUserName}
                                    value={userName}
                                    placeholder="Username"
                                    keyboardType="default"
                                    placeholderTextColor={Colors.textColorLight}
                                    returnKeyType="next"
                                    onSubmitEditing={() => { passwordInputRef.current.focus() }}
                                    blurOnSubmit={false}
                                />

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={passwordInputRef}
                                        style={[styles.input, { width: '100%' }]}
                                        secureTextEntry={!isPasswordVisible}
                                        onChangeText={setPassword}
                                        value={password}
                                        placeholder="Password"
                                        keyboardType="default"
                                        placeholderTextColor={Colors.textColorLight}
                                        returnKeyType="done"
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        blurOnSubmit={false}
                                    />
                                    <TouchableOpacity style={styles.eyeIconContainer} onPress={() => { setIsPasswordVisible(!isPasswordVisible) }}>
                                        <Image style={styles.eyeIcon} source={isPasswordVisible ? close_eye : open_eye} />
                                    </TouchableOpacity>
                                </View>


                                {isLoading ?
                                    <ActivityIndicator size={'large'} color={"#77B3E1"} style={{ marginTop: wp('13.5%') }} />
                                    :
                                    <TouchableOpacity style={styles.loginButton} onPress={() => {
                                        loginUser()
                                    }}>
                                        <Text style={styles.loginButtonText}>LOG IN</Text>
                                        <Image source={ic_forward_arrow} style={styles.forwardArrow} />
                                    </TouchableOpacity>
                                }


                            </View>
                        </InputScrollView>

                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    scrollview: {
        flex: 1,
        width: '100%',
        flexGrow: 1,
        backgroundColor: Colors.backgroundColor

    },
    container: {
        width: '100%',
        flex: 1,
        resizeMode: 'cover'
    },
    innerContainer: {
        width: wp('100%'),
        height: wp('150%'),
        alignSelf: 'center',

    },
    input: {
        height: wp('12%'),
        width: '85%',
        alignSelf: 'center',
        paddingStart: wp('5%'),
        color: Colors.textColor,
        fontSize: wp('3.5%'),
        backgroundColor: Colors.inputBackground,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: wp('3%'),

    },
    logo: {
        width: '45%',
        alignSelf: 'center',
        marginTop: wp('15%'),
        height: wp('40%'),
        resizeMode: 'contain',
    },
    inputContainer: {
        width: '85%',
        height: wp('12%'),
        marginTop: wp('6%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    eyeIconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        position: 'absolute',
        right: wp('2%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        tintColor: 'white'
    },
    eyeIcon: {
        width: wp('5%'),
        height: wp('5%'),
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },
    loginButton: {
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
    loginButtonText: {
        color: Colors.onPrimaryColor,
        fontWeight: '500',
        fontSize: wp('4%')
    },
    forwardArrow: {
        width: wp('4%'),
        height: wp('4%'),
        marginStart: wp('2%'),
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: Colors.onPrimaryColor
    },
    backButton: {
        width: wp('12%'),
        height: wp('12%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: wp('2%'),
        start: wp('2%')
    },
    backIcon: {
        width: wp('6%'),
        height: wp('6%'),
        alignSelf: 'center',
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },
    backIconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginStart: wp('5%'),
        marginTop: wp('5%'),
    },
    backIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },
    roleLabel: {
        fontSize: wp('4%'),
        color: Colors.textColor,
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: wp('5%')
    }
})


export default SignInScreen;