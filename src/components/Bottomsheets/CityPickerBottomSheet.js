import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Image, Keyboard, FlatList, ActivityIndicator, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RBSheet from "react-native-raw-bottom-sheet";
import { Colors } from '../../styling';
import { useSelector, useDispatch } from 'react-redux';
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from '../snackbar';

const ic_checked_radio = require('../../assets/ic_checked_radio.png')
const ic_unchecked_radio = require('../../assets/ic_unchecked_radio.png')
const ic_down_arrow = require('../../assets/ic_down_arrow.png')


const CityPickerBottomSheet = (props, ref) => {

    const userData = useSelector((state) => state.userAuth.value)

    let { onSelect, selectedID, selectedValue } = props

    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const rbSheetRef = useRef(null)

    useImperativeHandle(ref, () => ({
        show: () => {
            rbSheetRef.current.open()
        },
        hide: () => {
            rbSheetRef.current.close()
        }
    }));

    useEffect(() => {
        fetchBrandListFromServer()
        return () => {
            setData([]);
        };
    }, [])

    const fetchBrandListFromServer = () => {

        // console.log(`${ApiRoute.BASE_URL}${ApiRoute.GET_ALL_CITIES}`)

        let data = {
            "id": 0
        }

        try {
            ApiClient.get(`${ApiRoute.BASE_URL}${ApiRoute.GET_ALL_CITIES}`)
                .then((response) => {
                    // console.log('response: ', response.data.data)
                    // console.log('response: ', response)

                    if (response.data?.isSuccess && response.data?.data !== null) {
                        // console.log(response.data?.data)
                        setData(response.data?.data)
                    } else {
                        AlertMessage.showMessage(response.data?.message)
                    }
                }).catch((error) => {
                    console.log('error : ', error)
                    AlertMessage.showMessage(error?.message)
                })

        } catch (e) {
            AlertMessage.showMessage(e.message)
        }

    }


    // console.log('selectedID by props ',selectedID)
    // console.log('statusName by props ',selectedValue)

    const onSelectItem = (item, index) => {
        onSelect(item)
        rbSheetRef.current.close()
    }


    const renderListItem = ({ item, index }) => (
        <TouchableOpacity style={styles.item} onPress={() => {
            onSelectItem(item, index)
        }}>
            <Text style={[styles.title, { fontWeight: 'bold' }]}>{item?.cityName}</Text>
            {/* <Text style={[styles.title, selectedID === item.city_Id ? { fontWeight: 'bold' } : { fontWeight: 'normal' }]}>{item?.cityName}</Text> */}
            {/* <Image source={selectedID === item.city_Id ? ic_checked_radio : ic_unchecked_radio} style={styles.radioIcon} /> */}
            <Image source={ic_checked_radio} style={styles.radioIcon} />
        </TouchableOpacity>
    );


    const RenderItem = () => {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.header}>Select City</Text>
                    <FlatList
                        data={data}
                        style={{ flex: 1, marginTop: wp('5%') }}
                        renderItem={renderListItem}
                        keyExtractor={item => item.city_Id}
                    // maxToRenderPerBatch={1}
                    // initialNumToRender={1}
                    />

                    {data.length < 1 && <ActivityIndicator size={'small'} style={styles.indicator} color={'white'} />}

                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.containerMain}>

            <TouchableOpacity style={styles.fieledContainer}
                onPress={() => { rbSheetRef.current.open() }}>
                <Text style={styles.label}>{selectedValue !== '' ? selectedValue : 'Select City'}</Text>
                <Image source={ic_down_arrow} style={styles.icon} />
                <RBSheet
                    ref={rbSheetRef}
                    height={wp('80%')}
                    closeOnDragDown={true}
                    animationType={'slide'}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "transparent"
                        },
                        draggableIcon: {
                            backgroundColor: "#000"
                        }
                    }}
                >
                    <View style={styles.modalContainer} >
                        <RenderItem />
                    </View>
                </RBSheet>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    containerMain: {
        // flex: 3,
        flexDirection: 'column'
    },
    fieledContainer: {
        width: '90%',
        height: wp('10%'),
        alignSelf: 'center',
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: Colors.textColorLight,
        flexDirection: 'row',
    },
    label: {
        fontSize: wp('4%'),
        color: Colors.textColor,
        flex: 1,
        alignSelf: 'center',
    },
    icon: {
        width: wp('3%'),
        height: wp('3%'),
        tintColor: Colors.textColorLight,
        resizeMode: 'contain',
        marginTop: wp('3%'),
        marginRight: wp('3%')
    },
    radioIcon: {
        width: wp('5%'),
        height: wp('5%'),
        tintColor: 'white'
    },
    radioContainer: {
        flexDirection: 'row',
        paddingVertical: wp('2%'),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: wp('5%')
    },
    item: {
        backgroundColor: 'transparent',
        marginVertical: wp('2%'),
        marginHorizontal: wp('5%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: wp('2%'),
        borderColor: 'white',
        borderWidth: .8,
        borderRadius: wp('5%'),
        flexDirection: 'row'
    },
    title: {
        fontSize: wp('4%'),
        color: 'white',
        flex: 1
    },
    header: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: wp('5%')
    },
    indicator: {
        alignSelf: 'center',
        flex: 1,
        position: 'absolute',
        top: wp('30%')
    },
    fieldHeader: {
        color: 'white',
        width: '100%',
        fontWeight: '400',
        fontSize: wp('3%'),
    },
    modalContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('100%'),
        height: wp('80%'),
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
        borderTopRightRadius: wp('7%'),
        borderTopLeftRadius: wp('7%')
    }
})


export default forwardRef(CityPickerBottomSheet);