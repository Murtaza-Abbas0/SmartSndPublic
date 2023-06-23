import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, StatusBar, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { LoadingModal } from "../../components/modal";

import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'

let pageNo = 1
let onEndReachedCalledDuringMomentum = false

const RenderListItem = ({ item }) => {

    console.log("item: ", item);

    return (
        <View style={styles.headerContainerListItem}>
            <Text style={styles.headingContainer}>{item.productCategory}</Text>
            {
                item.productGroupModels.map((val) => {
                    return (
                        <View style={styles.objectRowContainer} >
                            <Text style={styles.headerLabelListItem}>{val.productName}</Text>
                            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{val.targetQuantity.toLocaleString()}</Text>
                            <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>{val.salesQuantity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                            <View style={styles.divider} />
                        </View>

                    )
                })
            }
        </View>
    )
}

const DashboardDetailsScreen = ({ route, navigation }) => {

    const userData = useSelector((state) => state.userAuth.value)

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [totalSalesQuantity, setTotalSalesQuantity] = useState(0)
    const [totalSalesAmount, setTotalSalesAmount] = useState(0)

    const loadingModalRef = useRef()

    let isActive = false

    // useEffect(() => {
    //     const fetchData = async () => {
    //         getOrderSummary(true, pageNo)
    //     }

    //     fetchData()
    // }, [])
    useFocusEffect(
        useCallback(() => {
            getOrderSummary(true)
            return () => isActive = false;
        }, [])
    );



    console.log('userData: ', userData);

    const getOrderSummary = async (showLoadingModal, pageNo) => {
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
                    if (response.data.isSuccess && response.data.data != null) {
                        AlertMessage.showMessage(response.data.message)
                        setData(response.data?.data.productCategoryModels);
                        console.log('response.data?.data.productCategoryModels: ', response.data?.data.productCategoryModels);
                        let totalsSalesQuantity = 0
                        let totalSales = 0
                        response.data?.data.productCategoryModels.map((val) => {
                            val.productGroupModels.map((item) => {
                                // console.log('item: ', item?.salesQuantity);
                                totalsSalesQuantity = item?.targetQuantity + totalsSalesQuantity
                                totalSales = item?.salesQuantity + totalSales
                                // console.log('val: ', val);
                                setTotalSalesQuantity(totalsSalesQuantity)
                                setTotalSalesAmount(totalSales)
                            })
                        })
                        console.log('totalSalesQuantity: ', totalSalesQuantity);
                        console.log('totalSalesAmount: ', totalSalesAmount);
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

    const handleRefresh = () => {
        setIsRefreshing(true);
        pageNo = 1
        setData([])
        getOrderSummary(false, pageNo)
    };


    const onReachEndLoadMore = async () => {
        if (!onEndReachedCalledDuringMomentum) {
            pageNo = ++pageNo
            setLoading(true)
            getOrderSummary(false, pageNo)
            onEndReachedCalledDuringMomentum = true
        }
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <CommonHeaderWithDrawerButton title={'Month To Date Sales'} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerLabel}>Name Of Product</Text>
                <Text style={styles.headerLabel}>Target Quantity</Text>
                <Text style={styles.headerLabel}>Sales Quantity</Text>
            </View>
            <FlatList
                data={data}
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
            <View style={styles.bottomContainer} >
                <View style={styles.bottomHeadingContainer} >
                    <Text style={styles.bottomHeadingText} >Total Target Quantity</Text>
                    <Text style={styles.bottomHeadingText} >Total Sales Quantity</Text>
                </View>
                <View style={styles.bottomValuesContainer} >
                    <Text style={styles.bottomHeadingText} >{totalSalesQuantity.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Text>
                    <Text style={styles.bottomHeadingText} >{totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Text>
                </View>
            </View>
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
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        flex: 1
    },
    headerLabelListItem: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.primaryColor,
        flex: 1,
        fontSize: wp('3.5%'),
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
        marginTop: wp('2%')
    },
    loadingContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headingContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('100%'),
        height: wp('10%'),
        textAlign: 'center',
        textAlignVertical: 'center',
        color: "white"
    },
    objectRowContainer: {
        flexDirection: 'row',
        flex: 1,
        textAlign: "center",
        justifyContent: "center"
    },
    divider: {
        backgroundColor: Colors.textColorLight,
        height: wp('1%'),
        marginVertical: wp('1%'),
    },
    bottomContainer: {
        width: wp('100%'),
        height: wp('35%'),
        backgroundColor: '#299BFA',
    },
    bottomHeadingContainer: {
        backgroundColor: '#46ABFF',
        width: wp('100%'),
        height: wp('12%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    bottomValuesContainer: {
        // backgroundColor: 'pink',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    bottomHeadingText: {
        color: 'white'
    }
})


export default DashboardDetailsScreen;