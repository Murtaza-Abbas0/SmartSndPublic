import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl, Text, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
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
import { SubmitOrderListItem } from '../../components/listitems';
import DashboardDetailsScreen from './DashbaordDetailsScreen';
import { useNavigation } from '@react-navigation/native';

let tempArr = []
let searchText = ''
let pageNo = 1
let onEndReachedCalledDuringMomentum = false
let isAssigned = false
let isunAssigned = false

const ic_AllTargets = require('../../assets/ic_AllTargets.png')
const ic_close = require('../../assets/ic_close.png')
const ic_back = require('../../assets/ic_back.png')


const RenderListItem = ({ item }) => {

    // console.log("item: ", item);

    return (
        <View style={styles.headerContainerListItem}>
            <Text style={styles.headingContainer}>{item.productCategory}</Text>

            {
                item.productGroupModels.map((val) => {
                    return (
                        <View style={styles.objectRowContainer} >
                            <Text style={styles.headerLabelListItem}>{val.productName}</Text>
                            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{val.targetQuantity}</Text>
                            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{val.salesQuantity}</Text>
                            <View style={styles.divider} />
                        </View>
                    )
                })
            }
        </View>
    )
}

const SubmitOrderScreen = ({ route }) => {

    const navigation = useNavigation();

    const userData = useSelector((state) => state.userAuth.value)

    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [isMonthWise, setIsMonthWise] = useState(true);
    const [isDayWise, setIsDayWise] = useState(false);
    const [dashboardData, setDashboardData] = useState([])

    const loadingModalRef = useRef()

    const getHead = (istarget) => {
        if (!isAssigned && istarget === 1) {
            isAssigned = true
            return "Assigned"
        }
        else if (!isunAssigned && istarget === 0) {
            isunAssigned = true
            return "Un Assigned"
        }
        else {
            return ""
        }
    }
    const onChangeQuantityCallback = useCallback((item) => {

        // console.log('item : ', item)

        if (tempArr.length === 0) {
            tempArr.push(item)
        } else {
            let index = tempArr.findIndex((element) => element.productId === item.productId);

            // console.log('index : ', index)

            if (index >= 0) {
                tempArr.splice(index, 1, item)
            } else {
                tempArr.push(item)
            }
        }

        tempArr = tempArr.filter((item) => {
            return (item.orderQuantity !== 0)
        })

        let total = 0
        tempArr.map((element) => {
            total += element.totalAmount
        })

        setTotalInvoiceAmount(total)

        console.log('tempArr: ', tempArr)

    }, [totalInvoiceAmount])

    useEffect(() => {
        // getOrderSummary();
    })


    useEffect(() => {
        const fetchData = async () => {
            setData([])
            getProductList(true, pageNo, searchText)
        }

        fetchData()
    }, [])

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


    const isGoingBack = () => {
        console.log(tempArr.length)
        if (tempArr.length == 0) {
            navigation.goBack()
        } else {
            Alert.alert(
                '',
                'Your data is not saved',
                [
                    { text: 'Cancel', onPress: () => console.log('NO Pressed'), style: 'cancel' },
                    { text: 'Proceed', onPress: () => navigation.goBack() },
                ],
                { cancelable: false }
            )
        }
    }

    const getProductList = async (showLoadingModal, pageNo, searchKey) => {
        tempArr = []
        // let object = {
        //     // "salesmanID": userData?.salesMan_Encrypted,
        //     "productId": 0,
        //     "productName": null,
        //     "pagenumber": pageNo,
        //     // "pageSize": 200
        // }
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
                    setLoading(false)
                    var { data, message } = response?.data
                    if (response.data?.isSuccess && response.data?.data != null) {
                        console.log('response: ', response.data?.data)
                        // console.log('Data length: ', response.data.data.length)
                        if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        if (response.data?.data.length > 0)
                            // let TempArray = []
                            // data.assignedTargetProducts.map((assignItems) => {
                            //     TempArray.push(assignItems)
                            // })

                            // data.unAssignedTargetProducts.map((unassignItems) => {
                            //     TempArray.push(unassignItems)
                            // })
                            // AlertMessage.showMessage(message)
                            // setData(data => [...data, ...response.data?.data]);
                            // setLoading(false)
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
        pageNo = 1
        setTotalInvoiceAmount(0)
        // tempArr = []
        getProductList(false, pageNo, searchText)
    };

    const getOrderSummary = async (showLoadingModal, pageNo) => {
        setModalVisible(!modalVisible);
        let object = {
            "salesMan_Encr_ID": userData?.salesMan_Encrypted,
        }
        if (showLoadingModal)
            loadingModalRef.current.show()

        try {
            await ApiClient.post(`${ApiRoute.BASE_URL}${ApiRoute.DASHBOARD_DETAILS}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    setLoading(false)
                    if (response.data.isSuccess && response.data.data != null) {
                        AlertMessage.showMessage(response.data.message)
                        setDashboardData(response.data?.data.productCategoryModels);
                        // console.log('response.data?.data.productCategoryModels: ', response.data?.data.productCategoryModels);

                    } else {
                        AlertMessage.showMessage(response.data.message)
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

    const onReachEndLoadMore = async () => {
        if (!onEndReachedCalledDuringMomentum) {
            // console.log('onReachEndLoadMore')
            pageNo = ++pageNo
            setLoading(true)
            getProductList(false, pageNo, searchText)
            onEndReachedCalledDuringMomentum = true
        }
    }

    const onSubmitSearch = (text) => {
        pageNo = 1
        searchText = text
        setData([])
        setTotalInvoiceAmount(0)
        tempArr = []
        getProductList(false, pageNo, searchText)
    }

    const onClearSeach = () => {
        pageNo = 1
        searchText = ''
        setData([])
        setTotalInvoiceAmount(0)
        tempArr = []
        getProductList(false, pageNo, searchText)
    }


    const renderItem = ({ item }) => (

        <SubmitOrderListItem item={item} onChangeQuantity={onChangeQuantityCallback} getHead={getHead} />
    );

    const { shopDetails } = route?.params

    const onPressSubmitButton = () => {

        let data = {
            "customer_ID": "1",
            "salesMan_ID": "1",
            "totalAmount": totalInvoiceAmount,
            "discount": 0,
            "balance": 0,
            "orderType": 0,
            "products_List": tempArr,
        }

        // console.log("Data: ", data)

        if (totalInvoiceAmount > 1) {
            navigation.navigate('OrderScreen', { data: data, shopDetail: shopDetails, })
        }
        else {
            AlertMessage.showMessage('Cart is empty!')
        }

    }

    // const renderFooter = () => {
    //     return (
    //         <View style={styles.footer}>
    //             {
    //                 loading && (
    //                     <View style={styles.loadingContainer}>
    //                         <ActivityIndicator color={Colors.primaryColor} size={"large"} />
    //                         <Text style={styles.loadingLabel}>Loading</Text>
    //                     </View>
    //                 )
    //             }
    //         </View>
    //     );
    // };




    return (
        <SafeAreaView style={{ flex: 1 }} >
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', width: wp('10%'), height: wp('10%') }} onPress={() => setModalVisible(!modalVisible)}>
                            <Image source={ic_close} style={{ alignSelf: 'flex-end', resizeMode: 'contain', width: wp('7%'), height: wp('7%') }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: wp('4%'), color: Colors.primaryColor }} >All Target</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                        </TouchableOpacity>
                        <FlatList
                            data={dashboardData}
                            showsVerticalScrollIndicator={false}
                            style={styles.list}
                            renderItem={RenderListItem}
                            keyExtractor={(item, index) => Math.random()}
                            refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={Colors.primaryColor} onRefresh={handleRefresh} />}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                onReachEndLoadMore();
                            }}
                            onMomentumScrollBegin={() => {
                                onEndReachedCalledDuringMomentum = false;
                            }}
                        />
                    </View>
                </View>
            </Modal>

            {/* <CommonHeaderWithBackButton title={'Select Products'} /> */}
            <View style={styles.container}>
                <TouchableOpacity onPress={() => isGoingBack()} style={styles.iconContainer}>
                    <Image style={styles.icon} source={ic_back} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Products</Text>
            </View>
            <View style={styles.shopDetailsContainer} >
                <Text style={styles.title} >Shop: </Text>
                <Text style={styles.value} >{shopDetails.shopName}</Text>
            </View>
            <View style={styles.shopDetailsContainer} >
                <Text style={styles.title} >Area: </Text>
                <Text style={styles.value} >{shopDetails.areaName}</Text>
            </View>
            <TouchableOpacity onPress={() => getOrderSummary()} style={styles.allTargetsButtonContainer} >
                <Text style={{ color: 'white', }} >All Targets</Text>
                <Image style={styles.allTargetsImage} source={ic_AllTargets} />
            </TouchableOpacity>
            {/* <CustomSearchBar placeholder={'Search Product'} onSubmit={(text) => { onSubmitSearch(text) }} onClearSearch={() => { onClearSeach() }} /> */}
            <View style={styles.headingContainerText} >
                <Text style={styles.headingTitleContainer} >Products</Text>
                <Text style={styles.headingTitleContainer} >Order Quantity</Text>
                <Text style={styles.headingTitleContainer} >Net Order</Text>
            </View>

            <View style={styles.flatListContainer} >
                <FlatList
                    removeClippedSubviews={false}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index + ''}
                    // keyExtractor={item => item.product_Id}
                    ItemSeparatorComponent={() => <View style={{ backgroundColor: Colors.textColorLight, height: wp('0.3%') }} />}
                    refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={Colors.primaryColor} onRefresh={handleRefresh} />}
                    // onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                // onEndReached={() => { onReachEndLoadMore() }}
                // onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false }}
                // ListFooterComponent={renderFooter}
                />
                <LoadingModal ref={loadingModalRef} />
                <View style={styles.submitOrderBottonContainer} >
                    {/* <TouchableOpacity style={styles.invoiceButtonContainer} > */}
                    <Text style={styles.invoiceButtonContainer} >Invoice Value: {totalInvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    {/* </TouchableOpacity> */}
                    <TouchableOpacity style={styles.submitOrderButton} onPress={onPressSubmitButton} >
                        <Text style={styles.submitOrderText} >Submit Order</Text>
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
        width: wp('95%'),
        height: wp('150%')
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
})


export default memo(SubmitOrderScreen);