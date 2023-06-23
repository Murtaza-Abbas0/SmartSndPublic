import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";

const LoadingModal = (props, ref) => {

    let { } = props

    const [isLoading, setIsLoading] = useState(false)

    useImperativeHandle(ref, () => ({
        show: () => {
            setTimeout(() => {
                setIsLoading(true)
            }, 200)
        },
        hide: () => {
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
        }
    }));


    useEffect(() => {

    }, [])

    return (
        <View >
            <Modal
                isVisible={isLoading}
                animationIn={'slideInRight'}
                animationOut={'slideOutLeft'}
                // animationIn={'bounceInRight'}
                // animationOut={'bounceOutLeft'}
                useNativeDriver={true}

            >
                <View style={styles.container}>
                    <Text style={styles.header}> Loading </Text>
                    <Text style={styles.desc}> Please wait... </Text>
                    {/* <Image source={gif_loading_fading_lines2} style={styles.loadingImage} /> */}
                    <ActivityIndicator color={'#575757'} size={'large'} style={styles.indicator} animating={isLoading} />
                </View>
            </Modal>
        </View >

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: wp('50%'),
        height: wp('50%'),
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: wp('8%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    indicator: {
        zIndex: 1000,
        alignSelf: 'center',
        marginTop: wp('5%')
    },
    header: { fontSize: wp('4%'), alignSelf: 'center', color: '#575757', fontWeight: 'bold' },
    desc: { fontSize: wp('3%'), alignSelf: 'center', color: '#575757', marginTop: wp('5%') },
    loadingImage: { width: wp('10%'), height: wp('10%'), marginTop: wp('5%'), resizeMode: 'contain', alignSelf: 'center' }

})


export default forwardRef(LoadingModal);
