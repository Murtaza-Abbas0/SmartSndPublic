import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from "../../styling";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CommonHeaderWithDrawerButton } from '../../components/Headers';
import { MonthWiseDashboard, DayWiseDashboard } from '../../components/Dashboards';
import { useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/database';

const DashboardScreen = () => {

    useEffect(() => {
        firebase.database()
            .ref('/LiveLocation/3638624446474E6B39366F792B73786A3750677059413D3D')
            .once('value')
            .then(snapshot => {
                console.log('User data: ', snapshot.val());
            });
    }, [])

    const navigation = useNavigation();

    const [isMonthWise, setIsMonthWise] = useState(false);
    const [isDayWise, setIsDayWise] = useState(true);
    const [targetType, settargetType] = useState("count");
    const [isPrice, setIsPrice] = useState(false);
    const [isCount, setIsCount] = useState(false)
    const [dashboardData, setDashboardData] = useState([])

    const checkIsMonthWise = () => {
        setIsMonthWise(true)
        setIsDayWise(false)
        console.log('Month wise is on');
    }

    const checkIsDayhWise = () => {
        setIsMonthWise(false)
        setIsDayWise(true)
        console.log('Day wise is on');
    }

    const checkIsCount = () => {
        setIsCount(true)
        setIsPrice(false)
    }

    const checkIsPrice = () => {
        setIsCount(false)
        setIsPrice(true)
    }

    const getDataFromChild = useCallback((data) => {
        // setData(values)
        setDashboardData(data)
        console.log('data======>', data);
    }, [])

    return (
        <View style={styles.mainContainer} >
            <CommonHeaderWithDrawerButton title={'Dashboard'} />
            <View style={styles.buttonRowContainer} >
                <TouchableOpacity onPress={() => checkIsDayhWise()} style={[styles.buttonContainer, isDayWise ? styles.buttonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isDayWise ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Day Wise
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => checkIsMonthWise()} style={[styles.buttonContainer, isMonthWise ? styles.buttonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isMonthWise ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Month Wise
                    </Text>
                </TouchableOpacity>
            </View>
            {isDayWise == true ? <MonthWiseDashboard getDataFromChild={getDataFromChild} /> : <DayWiseDashboard getDataFromChild={getDataFromChild} />}
            {/* <View style={styles.buttonBackgroundContainer} >
                <TouchableOpacity style={styles.makeNewOrderButtonContainer} onPress={() => navigation.navigate('MakeNewOrderScreen')} >
                    <Text style={styles.buttonLabel}>Make New Order</Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.buttonBackgroundContainer} >
                <TouchableOpacity style={styles.makeNewOrderButtonContainer} >
                    <Text style={styles.buttonLabel} >End Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MakeNewOrderScreen', { dashboardData: dashboardData })} style={styles.makeNewOrderButtonContainer} >
                    <Text style={styles.buttonLabel} >Make New Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    buttonContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('40%'),
        height: wp('12%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('7%')
        // borderBottomRightRadius: wp('7%')
    },
    buttonTextContainer: {
        color: 'white',
    },
    whenButtonOff: {
        backgroundColor: 'white',
    },
    whenButtonOffText: {
        color: 'black'
    },
    buttonRowContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: wp('5%')
    },
    makeNewOrderButtonContainer: {
        width: '45%',
        height: wp('12%'),
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp('3%'),
        marginVertical: wp('2%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        bottom: 0,
        // position: 'absolute',
    },
    buttonLabel: {
        color: Colors.onPrimaryColor,
        fontSize: wp('4%'),
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    buttonBackgroundContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: wp('20%'),
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    countButtonContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('25%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: wp('7%')
    },
    whenCountButtonOff: {
        backgroundColor: 'white',
    },
    countButtonRowContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        // marginTop: wp('5%')
    }
})


export default DashboardScreen;
