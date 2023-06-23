import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from "../../styling";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from "react-native-gesture-handler";

const Field = ({ Field, Value }) => {
    return (
        <View style={styles.fieldAndValueContainer} >
            <Text style={styles.field} >{Field}</Text>
            <Text style={styles.value} >{Value}</Text>
        </View>
    )
}

export default Field;

const styles = StyleSheet.create({
    fieldAndValueContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.primaryColorLight,
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        paddingVertical: wp('5%')
    },
    field: {
        color: Colors.primaryColor,
        fontWeight: "bold",
        flex: 1,
    },
    value: {
        color: Colors.textColorLight,
        flex: 1,
        textAlign: 'right',
    },

})