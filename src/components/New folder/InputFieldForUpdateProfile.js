import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native'
import { TextInput } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonHeaderWithBackButton from "../../components/Headers/CommonHeaderWithBackButton";
import { Colors } from "../../styling"

const ic_myprofile = require('../../assets/ic_myprofile.png')

const UpdateProfileScreen = ({ Title, Value, returnKeyType }) => {

    return (
        <View style={styles.container} >
            <Text style={styles.field} >{Title}</Text>
            <TextInput returnKeyType={returnKeyType} style={styles.textField} >
                <Text>{Value}</Text>
            </TextInput>
        </View>
    )
}

export default UpdateProfileScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: wp('3%'),
    },
    textField: {
        borderBottomWidth: wp('0.1%'),
        height: wp('13%'),
        width: wp('90%'),
        alignSelf: 'center',
        borderBottomColor: Colors.textColorLight,
        marginTop: wp('1%'),
        fontSize: wp('4%'),
    },
    field: {
        marginLeft: wp('5%'),
        color: Colors.primaryColor,
    }
})