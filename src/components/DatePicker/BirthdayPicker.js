import 'react-native-gesture-handler';
import React, { useEffect, memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Keyboard, FlatList, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker'
import { Colors } from '../../styling';

// const ic_calender = require('../../assets/ic_calender.png')


const BirthdayPicker = ({ onSelectDate, selectedDate, headerTitle, labelTitle, fieledContainerStyle }) => {

    const [open, setOpen] = useState(false)

    // console.log('Selected Date : ',selectedDate)

    const onConfirmData = (date) => {
        let dateObj = new Date(date);
        /* Date format you have */
        // let formatedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
        /* Date converted to MM-DD-YYYY format */
        /* Date converted to MM.DD.YYYY format */

        // let formatedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
        let formatedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

        onSelectDate(formatedDate)
        setOpen(false)
    }

    return (
        <View style={styles.containerMain}>

            <TouchableOpacity style={[styles.fieledContainer, fieledContainerStyle ? fieledContainerStyle : {}]}
                onPress={() => {
                    setOpen(true)
                }}>
                <Text style={styles.label}>{selectedDate !== '' ? selectedDate : labelTitle}</Text>
                {/* <Image source={ic_calender} style={styles.icon} /> */}
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={new Date()}
                mode={'date'}
                onConfirm={(date) => {
                    // console.log('data : ',date)
                    onConfirmData(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
                maximumDate={new Date()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerMain: {
        // flex: 1,
        flexDirection: 'column',
        // marginTop: wp('5%'),
        // backgroundColor: 'pink'
    },
    fieledContainer: {
        // flex: 1,
        // height: wp('12%'),
        width: wp('95%'),
        height: wp('14%'),
        alignSelf: 'center',
        // backgroundColor: '#2C2C2C',
        borderRadius: wp('3%'),
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: wp('5%'),
        marginTop: wp('2%'),
        borderBottomColor: Colors.textColorLight,
        borderBottomWidth: wp('0.1%')

    },
    label: {
        // flex: 1,
        fontSize: wp('4%'),
        color: Colors.textColor,
        fontWeight: '400',
        paddingHorizontal: wp('3%')
    },
    icon: {
        width: wp('5%'),
        height: wp('5%'),
        tintColor: 'white',
        resizeMode: 'contain',
        marginLeft: wp('2%')
    },

    container: {
        flex: 1,
        flexDirection: 'column'
    },

    title: {
        fontSize: wp('4%'),
        color: 'white',
        flex: 1
    },

    fieldHeader: {
        color: 'white',
        width: '100%',
        fontWeight: '400',
        fontSize: wp('3%')
    }
})


export default memo(BirthdayPicker);