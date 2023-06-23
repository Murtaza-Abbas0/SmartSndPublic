import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Keyboard, FlatList, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RBSheet from "react-native-raw-bottom-sheet";
import { CustomSnackBar } from '.';
import { ApiCall, ApiRoute, ApiClient } from '../network_utils'
import { Colors } from '../../styling';
import { AlertMessage } from "../../components/snackbar";


const ic_checked_radio = require('../../assets/ic_checked_radio.png')
const ic_unchecked_radio = require('../../assets/ic_unchecked_radio.png')
// const ic_cheched_square = require('../assets/images/ic_cheched_square.png')
// const ic_uncheched_square = require('../assets/images/ic_uncheched_square.png')
const ic_down_arrow = require('../../assets/ic_down_arrow.png')

const Data = [
    {
        id: 1,
        day_Name: 'Monday'
    },
    {
        id: 2,
        day_Name: 'Tuesday'
    },
    {
        id: 3,
        day_Name: 'Wednesday'
    },
    {
        id: 4,
        day_Name: 'Thursday'
    },
    {
        id: 5,
        day_Name: 'Friday'
    },
    {
        id: 6,
        day_Name: 'Saturday'
    },
    {
        id: 7,
        day_Name: 'Sunday'
    },
    {
        id: 8,
        day_Name: 'On Order'
    },
]

const MultiSelectionBottomSheet = (props, ref) => {


    let { onSubmit, selectedIds, selectedValues } = props

    const [selectedId, setSelectedId] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [data, setData] = useState([]);

    const rbSheetRef = useRef(null)

    useImperativeHandle(ref, () => ({
        show: () => {
            loadDataAndOpenSheet()
        },
        hide: () => {
            rbSheetRef.current.close()
        }
    }));

    useEffect(() => {
        console.log('selectedIds : ',selectedIds+'')
        setSelectedId(selectedIds)
        setSelectedValue(selectedValues)

        // if(selectedIds){
        //     let ids = selectedIds.split(',')
        //     setSelectedId(ids)
        //     console.log('ids : ',ids)
        // }

    }, [selectedIds, selectedValues])

    const loadDataAndOpenSheet = () => {
        rbSheetRef.current.open()
        // getPrescriptionData()
    }

    const onSelectItem = (item, index) => {
        if (selectedId.length > 0) {
            setSelectedId(selectedId.concat(',', item.id))
        } else {
            setSelectedId(selectedId.concat(item.id))
        }
        if (selectedValue.length > 0) {
            setSelectedValue(selectedValue.concat(',', item.day_Name))
        } else {
            setSelectedValue(selectedValue.concat(item.day_Name))
        }
    }

    const onUnSelectItem = (item, index) => {
        let tempArray = selectedId.split(',')
        // console.log('tempArray : ', tempArray)
        let idsTemp = tempArray.filter((id) => { return id != item.id })
        let ids = ''
        let labels = ''
        idsTemp.map((id) => {
            if (ids.length > 0) {
                ids += ',' + id
            } else {
                ids += id
            }
        })

        Data.map((item) => {
            if (ids.includes(item.id)) {
                if (labels.length > 0) {
                    labels += ',' + item.day_Name
                } else {
                    labels += item.day_Name
                }
            }
        })

        // console.log('ids : ', ids)
        setSelectedId(ids)
        setSelectedValue(labels)
    }

    const renderListItem = ({ item, index }) => {
        if (item.id !== 0) {
            return (
                <TouchableOpacity style={styles.item}
                    onPress={() => { selectedId.includes(item.id) ? onUnSelectItem(item, index) : onSelectItem(item, index) }}>
                    <Text style={[styles.title, selectedId.includes(item.id) ? { fontWeight: 'bold' } : { fontWeight: 'normal' }]}>{item.day_Name}</Text>
                    <Image
                        source={selectedId.includes(item.id) ? ic_checked_radio : ic_unchecked_radio}
                        style={selectedId.includes(item.id) ? styles.checkedIcon : styles.unCheckedIcon} />
                </TouchableOpacity>
            )
        } else {
            return null
        }
    }

    const onPressDone = () => {
        // console.log('selected ids :', selectedId)
        if (selectedId !== '') {
            onSubmit(selectedId)
            rbSheetRef.current.close()
        } else {
            AlertMessage.showMessage('Please Select Atleast One Day!')
        }
    }


    const RenderItem = () => {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.header}>Select Days</Text>
                    <TouchableOpacity style={styles.doneButtonContainer} onPress={() => { onPressDone() }}>
                        <Text style={styles.header}>Done</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={Data}
                        style={{ flex: 1, marginTop: wp('5%') }}
                        renderItem={renderListItem}
                        keyExtractor={item => item.id}
                        extraData={Data}
                    // maxToRenderPerBatch={1}
                    // initialNumToRender={1}
                    />

                    {Data.length < 1 && <ActivityIndicator size={'small'} style={{ alignSelf: 'center', flex: 1, position: 'absolute', top: wp('30%') }} color={'white'} />}

                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={{ width: '100%', flexDirection: 'column' }}>

            <Text style={styles.fieldHeader}>Select Days</Text>

            <TouchableOpacity style={styles.fieledContainer}
                onPress={() => {
                    loadDataAndOpenSheet()
                }}>
                <Text style={styles.label}>{selectedValue ? selectedValue : 'Select Days'}</Text>
                <Image source={ic_down_arrow} style={styles.icon} />
                <RBSheet
                    ref={rbSheetRef}
                    height={wp('80%')}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    dragFromTopOnly={true}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "transparent",

                        },
                        draggableIcon: {
                            backgroundColor: "transparent"
                        },
                        container: {
                            backgroundColor: Colors.primaryColor,
                            borderTopLeftRadius: wp('7%'),
                            borderTopRightRadius: wp('7%'),
                        }
                    }}
                >
                    <RenderItem />
                </RBSheet>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fieledContainer: {
        width: '90%',
        height: wp('10%'),
        alignSelf: 'center',
        borderBottomWidth: wp('0.1%'),
        borderBottomColor: Colors.textColorLight,
        flexDirection: 'row',
        color: 'black'
    },
    label: {
        fontSize: wp('4%'),
        color: Colors.textColor,
        flex: 1,
        marginTop: wp('3%')
    },
    icon: {
        width: wp('3%'),
        height: wp('3%'),
        tintColor: Colors.textColorLight,
        resizeMode: 'contain',
        marginRight: wp('3%'),
        marginTop: wp('3%')
    },
    checkedIcon: {
        width: wp('4%'),
        height: wp('4%'),
        tintColor: 'white',
        alignSelf: 'center'
    },
    unCheckedIcon: {
        width: wp('4%'),
        height: wp('4%'),
        tintColor: 'white',
        alignSelf: 'center'
    },
    radioContainer: {
        flexDirection: 'row',
        paddingVertical: wp('2%'),
    },
    container: {
        flex: 1,
        flexDirection: 'column'
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
    dontLabel: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: 'white',
        marginHorizontal: wp('5%')
    },
    doneButtonContainer: {
        width: wp('20%'),
        height: wp('8%'),
        backgroundColor: 'transparent',
        position: 'absolute',
        top: wp('0%'),
        right: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    fieldHeader: {
        color: Colors.primaryColor,
        marginLeft: wp('5%'),
        marginTop: wp('4%')
    }
})


export default forwardRef(MultiSelectionBottomSheet);