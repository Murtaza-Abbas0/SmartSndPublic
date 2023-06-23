import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { LoadingModal } from "../../components/modal";

import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';

import { useSelector, useDispatch } from 'react-redux'

const DATA = [
    {
        "shopName": "Abdullah",
        "order_Uid": "ORD-00000027",
        "order_Id": 27,
        "orderValue": 123432,
        "orderDate": "03-09-2021",
        "invoiceURL": "http://13.13.13.14:1100/Customer_Invoice/27_OrderInvoice.jpg"
    },
    {
        "shopName": "Abdullah",
        "order_Uid": "ORD-00000026",
        "order_Id": 26,
        "orderValue": 23000,
        "orderDate": "03-09-2021",
        "invoiceURL": "http://13.13.13.14:1100/Customer_Invoice/26_OrderInvoice.jpg"
    }
]

let pageNo = 1
let onEndReachedCalledDuringMomentum = false

const OrderSummaryScreen = ({ route, navigation }) => {

    const userData = useSelector((state) => state.userAuth.value)

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);

    const loadingModalRef = useRef()


    useEffect(() => {
        const fetchData = async () => {
            getOrderSummary(true, pageNo)
        }

        fetchData()
    }, [])

    const renderListItem = ({ item, index }) => (
        <TouchableOpacity style={styles.headerContainerListItem} onPress={() => { navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: item?.invoiceURL }) }}>
            {/* <Text style={styles.headerLabelListItem}>index</Text> */}
            <Text style={styles.headerLabelListItem}>{item?.shopName}</Text>
            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{item?.order_Id}</Text>
            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{item?.orderValue}</Text>
            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{item?.orderDate}</Text>
        </TouchableOpacity>
    );


    const getOrderSummary = async (showLoadingModal, pageNo) => {
        let object = {
            "salesManID": userData?.salesMan_Encrypted,
            "pagenumber": pageNo
        }
        console.log('object : ', object)
        // console.log('userData : ',userData)
        if (showLoadingModal)
            loadingModalRef.current.show()

        try {
            await ApiClient.post(`${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_ORDER_SUMMARY}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    if (response.data.isSuccess && response.data.data != null) {
                        if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        if (response.data?.data?.ordersummaryList.length > 0)
                            // console.log('Data : ', response.data?.data.ordersummaryList)
                            // AlertMessage.showMessage(response.data?.message)
                            setData(data => [...data, ...response.data?.data.ordersummaryList]);
                    } else {
                        if (pageNo < 2) AlertMessage.showMessage(response.data?.message);

                    }
                    // } else {
                    //     AlertMessage.showMessage(response.data?.message)
                    //     // console.log('Data : ',response.message)
                    // }
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
        setIsRefreshing(true);
        pageNo = 1
        setData([])
        getOrderSummary(false, pageNo)
    };


    const onReachEndLoadMore = async () => {
        if (!onEndReachedCalledDuringMomentum) {
            // console.log('onReachEndLoadMore')
            pageNo = ++pageNo
            setLoading(true)
            getOrderSummary(false, pageNo)
            onEndReachedCalledDuringMomentum = true
        }
    }

    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                {
                    loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color={Colors.primaryColor} size={"large"} />
                            <Text style={styles.loadingLabel}>Loading</Text>
                        </View>
                    )
                }
            </View>
        );
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <CommonHeaderWithDrawerButton title={'Order Summary'} />
            <View style={styles.headerContainer}>
                {/* <Text style={styles.headerLabel}>S.No</Text> */}
                <Text style={styles.headerLabel}>Shop</Text>
                <Text style={styles.headerLabel}>Invoice No</Text>
                <Text style={styles.headerLabel}>Order Value</Text>
                <Text style={styles.headerLabel}>Date</Text>
            </View>

            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                renderItem={renderListItem}
                keyExtractor={(item, index) => index + '-' + item?.title}
                ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor: Colors.primaryColorLight, height: 0.8, width: '85%', alignSelf: 'center' }} />
                )}
                refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={Colors.primaryColor} onRefresh={handleRefresh} />}
                // ListEmptyComponent={
                //     < View style={styles.emptyPlaceHolderContainer} >
                //         <Image source={ic_no_record_found} style={styles.emptyPlaceHolderImage} />
                //         <Text style={styles.emptyPlaceHolderLabel}>{
                //             loading ? 'Loading please wait...' : 'Records not found!'}
                //         </Text>
                //     </View >
                // }
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    onReachEndLoadMore();
                }}
                onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum = false;
                }}
            />
            <LoadingModal ref={loadingModalRef} />

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerContainer: {
        width: wp('95%'),
        height: wp('8%'),
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        alignSelf: 'center',
        marginVertical: wp('4%'),
        borderRadius: wp('2%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLabel: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.primaryColor,
        flex: 1,
        fontWeight: '500',
        fontSize: wp('3%')
    },
    headerContainerListItem: {
        width: wp('95%'),
        // height: wp('8%'),
        // borderColor: Colors.primaryColor,
        // borderWidth: 1,
        alignSelf: 'center',
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLabelListItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.primaryColor,
        flex: 1,
        fontSize: wp('3%'),
        paddingVertical: wp('4%')
    },
    footer: {
        height: wp('25%'),
        backgroundColor: 'transparent',
        padding: wp('2%'),
        marginTop: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadingLabel: {
        color: Colors.primaryColor,
        fontSize: wp('3%'),
        textAlign: 'center',
        marginTop:wp('2%')
    },
    loadingContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
})


export default OrderSummaryScreen;