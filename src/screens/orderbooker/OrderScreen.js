import React, { useEffect, useState, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, SectionList, ScrollView } from 'react-native'
import { CommonHeaderWithBackButton } from "../../components/Headers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "../../styling";
import { CustomSearchBar } from "../../components/searchbar";
import { useSelector, useDispatch } from "react-redux";
import { AlertMessage } from "../../components/snackbar";
import { ApiClient, ApiRoute } from "../../network_utils";
import { useNavigation } from "@react-navigation/native";
import { LoadingModal } from "../../components/modal";

const Item = ({ item }) => {
    // console.log('item : ', item)


    return (
        <View style={styles.itemsContainer} >
            <TouchableOpacity style={styles.itemNameContainer} >
                <Text style={styles.brandName}>{item?.productName}</Text>
            </TouchableOpacity>
            <Text style={styles.priceText} >{item?.orderQuantity.toLocaleString()}</Text>
            <Text style={styles.priceText} >{item?.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        </View>
    )
}

const OrderScreen = ({ route }) => {

    const userData = useSelector((state) => state.userAuth.value)
    const navigation = useNavigation();
    const loadingModalRef = useRef();


    let { data, shopDetail } = route?.params
    // console.log('Invoice Amount: ', invoiceAmount)
    // console.log('Product ID: ', productId)
    // console.log('Increase Quantity: ', increaseQuantity)
    // console.log('Shop Details: ', shopDetail)
    console.log('DATA: ', data)

    const [totalQty, setTotalQty] = useState()
    const [isRefreshing, setIsRefreshing] = useState()
    const [Data, setData] = useState([])
    const [saucesTotalQuantity, setSaucesTotalQuantity] = useState()
    const [saucesTotalAmount, setSaucesTotalAmount] = useState()
    const [tetraTotalQuantity, setTetraTotalQuantity] = useState()
    const [tetraTotalAmount, setTetraTotalAmount] = useState()
    const [isFlatListRender, setIFlatListRender] = useState(false)

    useEffect(() => {
        let totalQty = 0
        let saucesTotalQuantity = 0
        let tetraTotalQuantity = 0
        let totalAmountForTetra = 0
        let totalAmountForSauces = 0
        data.products_List.map((element) => {
            // console.log('element: ', element);
            totalQty += element.orderQuantity
            element?.productCategory == "Tetra" ? tetraTotalQuantity += element?.orderQuantity : saucesTotalQuantity += element?.orderQuantity
            element?.productCategory == "Tetra" ? totalAmountForTetra += element?.totalAmount : totalAmountForSauces += element?.totalAmount
        })

        setTotalQty(totalQty)
        setSaucesTotalQuantity(saucesTotalQuantity)
        setTetraTotalQuantity(tetraTotalQuantity)
        setTetraTotalAmount(totalAmountForTetra)
        setSaucesTotalAmount(totalAmountForSauces)

        setIFlatListRender(true)

    }, [])

    console.log('totalQty===========> ', totalQty);
    console.log('saucesTotalQuantity===========> ', saucesTotalQuantity);
    console.log('tetraTotalQuantity===========> ', tetraTotalQuantity);
    console.log('totalAmountForSauces===========> ', saucesTotalAmount);
    console.log('totalAmountForTetra===========> ', tetraTotalAmount);

    const renderItemForTetra = ({ item, navigation }) => (
        item?.productCategory === "Tetra" && (
            <Item
                item={item}
                navigation={navigation}
            />
        )
    );
    const renderItemForSauces = ({ item, navigation }) => (
        item?.productCategory === "Sauces" && (
            <Item
                item={item}
                navigation={navigation}
            />
        )
    );

    const onPressSpotSale = () => {


        let object = {
            "customer_ID": shopDetail?.customerId_Encrypted,
            "salesMan_ID": userData?.salesMan_Encrypted,
            "totalAmount": data?.totalAmount,
            "discount": 0,
            "balance": 0,
            "orderType": 1,
            "products_List": data.products_List
        }
        console.log("Object For Spot Sale : ", object)

        loadingModalRef.current.show()

        try {
            ApiClient.post(`${ApiRoute.BASE_URL}${ApiRoute.INSERT_ORDER_BY_SALESMANID}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    // console.log('response: ', response.data)
                    if (response.data.isSuccess && response.data.data != null) {
                        AlertMessage.showMessage(response.data?.message)
                        setTimeout(() => {
                            navigation.pop(2)
                            navigation.navigate('SpotSaleReciptScreen', { recipt: response.data?.data })
                        }, 100)

                    }
                    else {
                        AlertMessage.showMessage(response.data?.message)
                        // console.log('Data : ', response.message)
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
        // }))
    }

    const onPressBookOrder = () => {

        loadingModalRef.current.show()

        let object = {
            "customer_ID": shopDetail?.customerId_Encrypted,
            "salesMan_ID": userData?.salesMan_Encrypted,
            "totalAmount": data?.totalAmount,
            "discount": 0,
            "balance": 0,
            "orderType": 2,
            "products_List": data.products_List
        }
        console.log("Object For Book Order : ", object)

        try {
            ApiClient.post(`${ApiRoute.BASE_URL}${ApiRoute.INSERT_ORDER_BY_SALESMANID}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    console.log('response: ', response.data)
                    if (response.data.isSuccess == true) {
                        setTimeout(() => {
                            AlertMessage.showMessage(response.data?.message)
                            navigation.pop(2)
                            navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: response.data?.data })
                        }, 1000)
                    }
                    else {
                        AlertMessage.showMessage(response.data?.message)
                        // console.log('Data : ', response.message)
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <CommonHeaderWithBackButton title={'Order Summary'} />
            <View style={styles.shopDetailsContainer} >
                <Text style={styles.title} >Shop: </Text>
                <Text style={styles.value} >{shopDetail.shopName}</Text>
            </View>
            <View style={styles.shopDetailsContainer} >
                <Text style={styles.title} >Area: </Text>
                <Text style={styles.value} >{shopDetail.areaName}</Text>
            </View>
            <View style={styles.headingContainer} >
                <Text style={[styles.headingTitleContainer, { width: wp('20%'), color: 'white' }]} >Products</Text>
                <Text style={[styles.headingTitleContainer, { width: wp('20%'), color: 'white' }]} >Net Quantity</Text>
                <Text style={[styles.headingTitleContainer, { width: wp('20%'), color: 'white' }]} >Net Value</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>

                <View style={{ flex: 1 }} >
                    <Text style={styles.categoryHeadingContainer} >Tetra</Text>
                    {isFlatListRender ?
                        <>
                            <FlatList
                                data={data.products_List}
                                renderItem={renderItemForTetra}
                                keyExtractor={item => item.productId + Math.random()}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: wp('2%') }} >
                                <View style={styles.BottomHeadingContainer} >
                                    <Text style={styles.totalQuantityText} >
                                        Total Tetra Quantity:
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.totalQuantityText} >
                                        {isFlatListRender ? tetraTotalQuantity.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
                                    </Text>
                                </View>
                                <View style={styles.BottomHeadingContainer} >
                                    <Text style={styles.totalQuantityText} >
                                        Total Tetra Value:
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.totalQuantityText} >
                                        {isFlatListRender ? tetraTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
                                    </Text>
                                </View>
                            </View>
                        </> : null

                    }
                    <LoadingModal ref={loadingModalRef} />
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={styles.categoryHeadingContainer} >Sauces</Text>
                    {isFlatListRender ?
                        <>
                            <FlatList
                                data={data.products_List}
                                renderItem={renderItemForSauces}
                                keyExtractor={item => item.productId + Math.random()}
                            />

                            {/* <View style={styles.BottomHeadingContainer} >
                                <Text style={[styles.headingTitleContainer, { color: 'black' }]} >Total Sauces Quantity:</Text>
                                <Text style={[styles.headingTitleContainer, { color: 'black' }]} >Total Sauces Value:</Text>
                            </View>
                            <View style={styles.BottomHeadingContainer} >
                                <Text style={styles.headingTitleContainer} >{saucesTotalQuantity}</Text>
                                <Text style={styles.headingTitleContainer} >{saucesTotalAmount.toFixed(2)}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: wp('3%'), marginBottom: wp('3%') }} >
                                <View style={styles.BottomHeadingContainer} >
                                    <Text style={styles.totalQuantityText} >
                                        Total Sauces Quantity:
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.totalQuantityText} >
                                        {isFlatListRender ? saucesTotalQuantity.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
                                    </Text>
                                </View>
                                <View style={styles.BottomHeadingContainer} >
                                    <Text style={styles.totalQuantityText} >
                                        Total Sauces Value:
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.totalQuantityText} >
                                        {isFlatListRender ? saucesTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
                                    </Text>
                                </View>
                            </View>
                        </> : null
                    }
                </View>

            </ScrollView>
            {/* <View style={styles.BottomTextContainer} >

                <Text style={styles.bottomText} >Total Quantity:</Text>
                <Text style={styles.bottomText} >Grand Total Value:</Text>
            </View>
            <View style={styles.BottomTextContainer} >
                <Text style={[styles.bottomText, { color: Colors.primaryColor }]} >{totalQty}</Text>
                <Text style={[styles.bottomText, { color: Colors.primaryColor }]} >{data?.totalAmount.toFixed(2)}</Text>
            </View> */}
            <View style={styles.bottomContainer} >
                <View style={styles.headingContainerForGrandTotalQuantity} >
                    <Text style={styles.headingContainerText} >
                        Total Quantity:
                    </Text>
                    <Text style={styles.headingContainerText} >
                        Grand Total Value:
                    </Text>
                </View>
                <View style={styles.headingContainerForGrandTotalAmount} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('100%'), marginTop: wp('1%') }} >
                        <Text style={styles.headingContainerText} >
                            {isFlatListRender ? totalQty.toLocaleString(undefined, { minimumFractionDigits: 0 }) : null}
                        </Text>
                        <Text style={styles.headingContainerText} >
                            {isFlatListRender ? data?.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onPressBookOrder} style={styles.ButtonContainer} >
                        <Text style={styles.buttonText} >Book Order</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* <View style={styles.submitOrderBottonContainer}
            >
                <View style={styles.BottomHeadingContainer} >
                    <Text style={styles.headingTitleContainer} >Total Quantity: {totalQty}</Text>
                    <Text style={styles.headingTitleContainer} >Grand Total Value: {data?.totalAmount}</Text>
                </View>
                <TouchableOpacity onPress={onPressBookOrder} style={styles.ButtonContainer} >
                    <Text style={styles.buttonText} >Book Order</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressSpotSale} style={styles.ButtonContainer} >
                    <Text style={styles.buttonText} >Spot Sale</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    )
}

export default OrderScreen;

const styles = StyleSheet.create({
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
        backgroundColor: Colors.primaryColor,
        marginTop: wp('5%'),
        borderTopWidth: wp('0.5%'),
        borderColor: Colors.primaryColor,
        borderBottomWidth: wp('0.4%'),
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    BottomHeadingContainer: {
        backgroundColor: '#E9F4FF',
        width: wp('40%'),
        height: wp('25%'),
        alignSelf: 'center',
        borderRadius: wp('5%'),
        borderWidth: wp('0.3%'),
        borderColor: '#1A97FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    BottomTextContainer: {

    },
    headingTitleContainer: {
        color: Colors.primaryColor,
        width: wp('35%')
    },
    itemsContainer: {
        paddingVertical: wp('3%'),
        marginVertical: wp('2%'),
        // marginHorizontal: wp('4%'),
        flexDirection: 'row',
        flex: 1,
        // width: wp('35%'),
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#E9F4FF'
    },
    itemNameContainer: {
        // backgroundColor: 'pink',
        width: wp('35%')
    },
    brandName: {
        flex: 1,
        // fontSize: wp('4%'),
        color: '#299BFA',
        paddingStart: wp('10%'),
        // width: wp('30%'),
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
        width: wp('32%'),
        alignSelf: 'center',
        textAlign: "center",
        color: '#299BFA'
    },
    submitOrderBottonContainer: {
        width: wp('100%'),
        height: wp('20%'),
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    ButtonContainer: {
        width: wp('50%'),
        height: wp('10%'),
        backgroundColor: '#E9F4FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('5%'),
        alignSelf: 'center',
        marginTop: wp('5%')
    },
    submitOrderButton: {
        // backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('50%')
    },
    submitOrderText: {
    },
    buttonText: {
        alignSelf: 'center',
        textAlign: 'center',
        color: '#299BFA'
    },
    bottomText: {
        fontSize: wp('4%'),
        color: 'black',
        width: wp('35%')
    },
    categoryHeadingContainer: {
        backgroundColor: '#00000014',
        width: wp('100%'),
        height: wp('8%'),
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: wp('4%'),
        color: Colors.primaryColor,
        fontWeight: 'bold',
        marginTop: wp('2%')
    },
    totalQuantityText: {
        color: '#299BFA'
    },
    divider: {
        backgroundColor: '#299BFA',
        height: wp('0.3%'),
        width: wp('30%'),
        marginTop: wp('2%'),
        marginBottom: wp('2%')
    },
    bottomContainer: {
        backgroundColor: 'pink',
        width: wp('100%'),
        height: wp('35%'),
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    headingContainerForGrandTotalQuantity: {
        backgroundColor: '#46ABFF',
        width: wp('100%'),
        height: wp('10%'),
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    headingContainerForGrandTotalAmount: {
        alignItems: 'center',
        // justifyContent: 'space-around',
        // flexDirection: 'row',
        width: wp('100%'),
        height: wp('30%'),
        backgroundColor: '#46ABFF',
    },
    headingContainerText: {
        color: 'white'
    }
})