import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "../../styling";
import { CommonHeaderWithBackButton } from "../../components/Headers";

const SpotSaleReciptScreen = ({ route }) => {

    let { recipt } = route?.params

    console.log('recipt: ', recipt)

    return (
        <SafeAreaView style={styles.mainContainer} >
            <View style={{ flex: 1 }} >
                <CommonHeaderWithBackButton title={'Order Summary'} />
                <Image source={{ uri: recipt }} style={{ flex: 1, resizeMode: 'contain' }} />
            </View>
            {/* <TouchableOpacity style={styles.printButtonContainer} >
                <Text style={styles.printButtonText} >Print</Text>
            </TouchableOpacity> */}

        </SafeAreaView>
    )
}

export default SpotSaleReciptScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    printButtonContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('90%'),
        height: wp('13%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('3%'),
        position: 'absolute',
        bottom: wp('10%')
    },
    printButtonText: {
        color: Colors.onPrimaryColor,
        fontSize: wp('4%'),
        fontWeight: "800"
    }
})