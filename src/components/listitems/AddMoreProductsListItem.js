import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, memo } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    RefreshControl,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    SafeAreaView,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../styling';
import { TextInput } from 'react-native-gesture-handler';

const ic_edit = require('../../assets/ic_edit.png');
const ic_add = require('../../assets/ic_add.png');
const ic_substarct = require('../../assets/ic_substract.png');


const AddMoreProductsListItem = ({ item, onChangeQuantityCallback }) => {
    // console.log('Item: ', item);

    const navigation = useNavigation();
    const isFirstRender = useRef(true);

    const [totalQuantity, setTotalQuantity] = useState(0);
    const handleAmount = (val) => {
        val === 0 ? setTotalQuantity(0) : setTotalQuantity(parseInt(val))
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // toggle flag after first render/mounting
            return;
        }

        onChangeQuantityCallback({
            productID: item?.product_Id,
            orderQuantity: totalQuantity,
            totalValue: item?.perPiecePrice * totalQuantity,
            returnQuantity: 0,
            productName: item?.name,
            productCategory: item?.categoryName,
            retailPrice: item?.perPiecePrice
            // productID: item?.productID,
            // orderQuantity: totalQuantity == 0 ? 0 : totalQuantity,
            // totalValue: parseInt(item?.retailPrice) * parseInt(totalQuantity),
        });
    }, [totalQuantity]);

    return (
        <TouchableOpacity onPress={() => { handleAmount(1) }} style={styles.itemsContainer} >
            <Text style={styles.brandName} >{item.name}</Text>
            <Text style={styles.priceText}>{totalQuantity === 0 ? item?.perPiecePrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : (item?.perPiecePrice * totalQuantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    innerContainer: {
        flex: 1,
    },
    flatListContainer: {
        flex: 1,
    },
    itemsContainer: {
        paddingVertical: wp('3%'),
        marginVertical: wp('2%'),
        // marginHorizontal: wp('4%'),
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: 'pink',
        width: wp('100%')
    },
    itemsContainerForAssigned: {
        // paddingVertical: wp('3%'),
        // marginVertical: wp('2%'),
        // marginHorizontal: wp('4%'),
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#B5DDFF',
        height: wp('20%')
    },
    brandName: {
        // flex: 1,
        width: wp('35%'),
        fontSize: wp('4%'),
        color: Colors.primaryColor,
        // paddingStart: wp('4%'),
    },
    brandPerPiecePrice: {
        fontSize: wp('4%'),
        color: Colors.textColorLight,
        width: wp('10%'),
        textAlign: 'center',
    },
    editIconContainer: {
        width: wp('10%'),
        height: wp('8%'),
        // backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp('2%'),
    },
    editIcon: {
        resizeMode: 'contain',
        tintColor: Colors.primaryColor,
        width: wp('5.5%'),
        height: wp('5.5%'),
    },
    shopDetailsContainer: {
        // backgroundColor: 'pink',
        width: wp('100%'),
        // height: wp('10%'),
        flexDirection: 'row',
        marginTop: wp('5%'),
    },
    title: {
        color: Colors.primaryColor,
        marginLeft: wp('10%'),
    },
    value: {
        color: Colors.textColorLight,
    },
    headingContainer: {
        flexDirection: 'row',
        width: wp('100%'),
        height: wp('10%'),
        // backgroundColor: 'pink',
        marginTop: wp('2%'),
        borderTopWidth: wp('0.5%'),
        borderColor: Colors.primaryColor,
        borderBottomWidth: wp('0.4%'),
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    headingTitleContainer: {
        color: Colors.primaryColor,
    },
    submitOrderBottonContainer: {
        width: wp('100%'),
        height: wp('20%'),
        flexDirection: 'row',
        borderTopWidth: wp('0.4%'),
        borderColor: Colors.primaryColor,
    },
    invoiceButtonContainer: {
        width: wp('50%'),
        // backgroundColor: 'pink',
        alignSelf: 'center',
        textAlign: 'center',
    },
    submitOrderButton: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('50%'),
    },
    quantityContainer: {
        // backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('30%'),
    },
    addIconContianer: {
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('10%'),
        height: wp('5%'),
    },
    addIcon: {
        width: wp('5%'),
        height: wp('5%'),
    },
    quantity: {
        fontSize: wp('5%'),
        marginTop: wp('2%'),
        color: 'black',
    },
    substracticon: {
        // resizeMode:'contain',
        width: wp('5%'),
        height: wp('1%'),
        marginTop: wp('3%'),
        // backgroundColor:'red',
        alignSelf: 'center',
    },
    priceText: {
        // backgroundColor: 'green',
        width: wp('25%'),
        alignSelf: 'center',
        textAlign: 'center',
        color: 'black'
    },
    buttonContainer: {
        width: wp('12%'),
        height: wp('7%'),
        // backgroundColor:'pink',
    },
    TextInputContainer: {
        borderWidth: wp('0.3%'),
        width: wp('20%'),
        height: wp('10%'),
        borderColor: Colors.textColor
    },
    headerLabelListItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.textColor,
        flex: 1,
        fontSize: wp('3.5%'),
        paddingVertical: wp('4%'),
        backgroundColor: Colors.primaryColor
    },
});

export default memo(AddMoreProductsListItem);
