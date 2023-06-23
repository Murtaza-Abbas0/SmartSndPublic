import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl, TextInput, Text, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';

import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { CommonHeaderWithBackButton } from '../../components/Headers';
import { CustomSearchBar } from '../../components/searchbar';
import { LoadingModal } from "../../components/modal";
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { useSelector, useDispatch } from 'react-redux'
import { UpdateBookedOrderItems } from '../../components/listitems';
import DashboardDetailsScreen from './DashbaordDetailsScreen';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { AddMoreProductsListItem } from '../../components/listitems'

const ic_back = require('../../assets/ic_back.png')
const ic_close = require('../../assets/ic_close.png')

const UpdateBookedOrders = ({ route }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getProductList(true)
            return () => isActive = false;
        }, [])
    );

    let { productsArray } = route?.params

    useEffect(() => {
        let total = 0
        let totalQuantity = 0
        productsArray.map((element) => {
            // console.log('element:', element);
            total = total + parseFloat(element.retailPrice * element.orderQuantity)
            totalQuantity = totalQuantity + parseInt(element.orderQuantity)
            setTotalInvoiceAmount(total)
            setTotalQuantity(totalQuantity)
            // console.log('total: ', totalQuantity);
        })
    })


    // console.log('productsArray: ', productsArray);

    const navigation = useNavigation();

    const userData = useSelector((state) => state.userAuth.value)

    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0)
    const [TotalQuantity, setTotalQuantity] = useState(0)
    const [isCallbackRender, setIsCallbackRender] = useState(false)
    const [data, setData] = useState([])

    const loadingModalRef = useRef()


    let tempArr = productsArray

    const onChangeQuantityCallback = useCallback((item) => {
        setModalVisible(false)
        // console.log('item : ', item);
        const index = productsArray.findIndex((product) => (product.productID === item.productID));
        const indexForAddingProduct = productsArray.findIndex((product) => (product.productID === item.productID));
        // console.log('indexForAddingProduct: ', indexForAddingProduct);

        if (indexForAddingProduct < 0) {
            productsArray.push(item)
        }

        if (index >= 0)
            if (item?.orderQuantity !== 0) {
                productsArray[index].orderQuantity = item?.orderQuantity;
            } else {
                productsArray[index].orderQuantity = 0
            }

        let total = 0
        let totalQuantity = 0
        let totalValue = 0
        productsArray.map((element) => {
            // console.log('element:', element);
            total = total + parseFloat(element.retailPrice * element.orderQuantity)
            totalQuantity = totalQuantity + element.orderQuantity
            totalValue = element?.totalValue
        })
        setTotalInvoiceAmount(total)
        setTotalQuantity(totalQuantity)

        console.log('productsArray: ', productsArray);
    }, [totalInvoiceAmount]);

    // console.log('tempArr outside func: ', productsArray);

    const renderItem = ({ item }) => (

        <UpdateBookedOrderItems item={item} onChangeQuantityCallback={onChangeQuantityCallback} />
    );

    const RenderListItem = ({ item }) => (

        <AddMoreProductsListItem item={item} onChangeQuantityCallback={onChangeQuantityCallback} />
    );


    const { item } = route?.params

    const onPressUpdate = async (showLoadingModal) => {

        const productModel = productsArray.map(obj => ({ productId: obj.productID, orderQuantity: parseInt(obj.orderQuantity) }));
        const indexForDeleting = productsArray.findIndex((product) => (product.orderQuantity == 0));

        if (indexForDeleting >= 0) {
            productModel.splice(indexForDeleting, 1)
        }
        let data = {
            "order_ID": item?.order_Id,
            "salesMan_ID": userData?.salesMan_Encrypted,
            "totalAmount": totalInvoiceAmount,
            "customerID": item?.customer_Id,
            "orderDetails": productModel,
        }

        console.log('Data: ', data);
        // return

        if (showLoadingModal) loadingModalRef.current.show();

        try {
            await ApiClient.put(
                `${ApiRoute.BASE_URL}${ApiRoute.UPDATE_TODAYS_BOOKINGS}`,
                data,
                {
                    headers: {
                        Accept: 'text/plain',
                        'Content-Type': 'application/json',
                    },
                },
            )
                .then(async response => {
                    loadingModalRef.current.hide();
                    // console.log('response: ', response?.data);
                    // return
                    navigation.pop(1)
                    setTimeout(() => {
                        navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: response?.data?.data })
                    }, 100)
                    AlertMessage.showMessage(response?.data?.message)
                })
                .catch(err => {
                    console.log(err);
                    // setIsRefreshing(false);
                    loadingModalRef.current.hide();
                    AlertMessage.showMessage(err?.message);
                });
        } catch (e) {
            console.log('login error => ', e);
            // setIsRefreshing(false);
            loadingModalRef.current.hide();
        }
    }

    const getProductList = async (showLoadingModal, pageNo, searchKey) => {
        tempArr = []
        let object =
        {
            "productId": 0,
            "productName": "",
            "pagenumber": 1
        }

        console.log('object : ', object)
        if (showLoadingModal)
            loadingModalRef.current.show()
        try {
            await ApiClient.post(`${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_PRODUCT_LIST}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    // setLoading(false)
                    var { data, message } = response?.data
                    if (response.data?.isSuccess && response.data?.data != null) {
                        if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        if (response.data?.data.length > 0)
                            setData(response.data?.data)
                    } else {
                        if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        // console.log('Data : ',response.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setIsRefreshing(false)
                    loadingModalRef.current.hide()
                    AlertMessage.showMessage(err?.message)
                })

        } catch (e) {
            console.log('login error => ', e)
            setIsRefreshing(false)
            loadingModalRef.current.hide()
        }
    }

    const handleRefresh = () => {
        setData([])
        setIsRefreshing(true);
        // pageNo = 1
        setTotalInvoiceAmount(0)
        // tempArr = []
        getProductList(false, 1)
    };

    const ModalFlatListHeaderComponenet = () => {
        return (
            <View style={{ flexDirection: 'row', backgroundColor: Colors.primaryColor, width: wp('100%'), height: wp('12%'), alignItems: 'center', justifyContent: 'space-between' }} >
                <Text style={{ marginLeft: wp('4%'), color: 'white', fontWeight: 'bold' }} >Product Name</Text>
                <Text style={{ width: wp('15%'), marginRight: wp('4%'), color: 'white', fontWeight: 'bold' }} >Price</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Image style={styles.icon} source={ic_back} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update Product Quantity</Text>
            </View>
            <View style={styles.shopDetailsContainer} >
                <Text style={styles.title} >Shop: </Text>
                <Text style={styles.value} >{item?.shopName}</Text>
            </View>
            <View style={styles.headingContainerText} >
                <Text style={styles.headingTitleContainer} >Products</Text>
                <Text style={styles.headingTitleContainer} >Order Quantity</Text>
                <Text style={styles.headingTitleContainer} >Net Order</Text>
            </View>

            <View style={styles.flatListContainer} >
                <FlatList
                    removeClippedSubviews={false}
                    data={productsArray}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index + ''}
                    ItemSeparatorComponent={() => <View style={{ backgroundColor: Colors.textColorLight, height: wp('0.3%') }} />}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                />
                <LoadingModal ref={loadingModalRef} />
            </View>

            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} style={styles.modalOpenButton} >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add More Products</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <View style={styles.modalHeadingContainer} >
                            <Text style={{ color: Colors.textColor, fontWeight: 'bold', fontSize: wp('4%') }} >Choose Product You Want To Add</Text>
                            <TouchableOpacity style={{ alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', width: wp('10%'), height: wp('10%') }} onPress={() => setModalVisible(!modalVisible)}>
                                <Image source={ic_close} style={{ alignSelf: 'flex-end', resizeMode: 'contain', width: wp('7%'), height: wp('7%') }} />
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                        </TouchableOpacity> */}
                        <FlatList
                            data={data}
                            showsVerticalScrollIndicator={false}
                            style={styles.list}
                            renderItem={RenderListItem}
                            keyExtractor={(item, index) => Math.random()}
                            refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={Colors.primaryColor} onRefresh={handleRefresh} />}
                            ItemSeparatorComponent={() => <View style={{ backgroundColor: Colors.textColorLight, height: wp('0.3%') }} />}
                            ListHeaderComponent={ModalFlatListHeaderComponenet}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.BottomContainer} >
                <View style={styles.bottomHeadingContainer} >
                    <Text style={styles.headingText} >Total Quantity</Text>
                    <Text style={styles.headingText} >Total Amount</Text>
                </View>
                <View style={styles.bottomValueContainer} >
                    <Text style={styles.headingText} >{TotalQuantity.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Text>
                    <Text style={styles.headingText} >{totalInvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => { onPressUpdate(true) }} style={styles.updateButtonContainer} >
                        <Text style={{ color: Colors.primaryColor }} >Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        justifyContent: 'center',
    },
    brandName: {
        flex: 1,
        fontSize: wp('4%'),
        color: Colors.primaryColor,
        paddingStart: wp('4%'),
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
        marginHorizontal: wp('2%')
    },
    editIcon: {
        resizeMode: 'contain',
        tintColor: Colors.primaryColor,
        width: wp('5.5%'),
        height: wp('5.5%')
    },
    shopDetailsContainer: {
        // backgroundColor: 'pink',
        width: wp('100%'),
        // height: wp('10%'),
        flexDirection: 'row',
        marginTop: wp('5%')
    },
    title: {
        color: Colors.primaryColor,
        marginLeft: wp('10%')
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
        fontSize: wp('4%'),
        backgroundColor: Colors.primaryColor
    },
    headingContainerText: {
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
        fontSize: wp('4%'),
    },
    headingTitleContainer: {
        color: Colors.primaryColor
    },
    submitOrderBottonContainer: {
        width: wp('100%'),
        height: wp('20%'),
        flexDirection: 'row',
        borderTopWidth: wp('0.4%'),
        borderColor: Colors.primaryColor
    },
    invoiceButtonContainer: {
        width: wp('50%'),
        // backgroundColor: 'pink',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'black'
    },
    submitOrderButton: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('50%')
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
        height: wp('5%')
    },
    addIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    quantity: {
        fontSize: wp('4%'),
        marginTop: wp('2%')
    },
    substracticon: {
        width: wp('5%'),
        height: wp('5%'),
        marginTop: wp('2%')
    },
    priceText: {
        // backgroundColor: 'pink',
        width: wp('35%'),
        alignSelf: 'center',
        textAlign: "center"
    },
    footer: {
        // height: wp('25%'),
        backgroundColor: 'transparent',
        padding: wp('2%'),
        marginTop: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadingLabel: {
        color: Colors.primaryTextColor,
        fontSize: wp('3%'),
        textAlign: 'center',
        marginTop: wp('2%')
    },
    loadingContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
    allTargetsButtonContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryColor,
        width: wp('35%'),
        height: wp('12%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('3%'),
        alignSelf: 'center',
        marginRight: wp('3%'),
        marginTop: wp('2%'),
    },
    allTargetsImage: {
        resizeMode: 'contain',
        width: wp('5%'),
        height: wp('5%'),
        marginLeft: wp('2%'),
        tintColor: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: wp('110%'),
        height: wp('150%'),
    },
    objectRowContainer: {
        flexDirection: 'row',
        flex: 1,
        textAlign: "center",
        justifyContent: "center"
    },
    headerLabelListItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.primaryColor,
        flex: 1,
        fontSize: wp('3.5%'),
        paddingVertical: wp('4%')
    },
    divider: {
        backgroundColor: Colors.textColorLight,
        height: wp('1%'),
        marginVertical: wp('1%'),
    },
    headerContainerListItem: {
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        flex: 1
    },
    container: {
        width: '100%',
        height: wp('12%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor
    },
    headerTitle: {
        flex: 1,
        fontSize: wp('5%'),
        color: Colors.onPrimaryColor,
        alignSelf: 'center',
        textAlign: 'center',
        fontWeight: '400'
    },
    iconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        start: wp('1%'),
        zIndex: 100
    },
    icon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: Colors.onPrimaryColor
    },
    updateButtonContainer: {
        backgroundColor: 'white',
        width: wp('45%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp('5%')
    },
    updateButtonViewContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('100%'),
        height: wp('25%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    BottomContainer: {
        backgroundColor: '#299BFA',
        width: wp('100%'),
        height: wp('40%'),
    },
    bottomHeadingContainer: {
        backgroundColor: '#46ABFF',
        width: wp('100%'),
        height: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    headingText: {
        color: 'white',
        fontWeight: 'bold'
    },
    bottomValueContainer: {
        // backgroundColor: '#46ABFF',
        width: wp('100%'),
        height: wp('15%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    productFlatListContainer: {
        flex: 1,
        // backgroundColor: 'pink'
    },
    modalOpenButton: {
        backgroundColor: '#299BFA',
        width: wp('45%'),
        height: wp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp('5%'),
        marginBottom: wp('5%')
    },
    renderItemMainContainer: {
        backgroundColor: 'pink',
        width: wp('120%'),
    },
    modalHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: wp('100%')
    }
})


export default memo(UpdateBookedOrders);