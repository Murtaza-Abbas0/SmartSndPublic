import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    RefreshControl,
    StatusBar,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { ApiClient, ApiRoute } from '../../network_utils';
import { AlertMessage } from '../../components/snackbar';
import { LoadingModal } from '../../components/modal';
import { useSelector, useDispatch } from 'react-redux';

import { Colors } from '../../styling';
import CommonHeaderWithBackButton from '../../components/Headers/CommonHeaderWithBackButton';
import { CustomSearchBar } from '../../components/searchbar';
import { ShopListItem } from "../../components/listitems";
import { useFocusEffect } from '@react-navigation/native';


const ic_update_product = require('../../assets/ic_update_product.png')
const ic_view_invoice = require('../../assets/ic_view_invoice.png')

let pageNo = 1;
let searchText = '';

const Item = ({ item, navigation }) => {
    // console.log('item: ', item);

    const onPressViewInvoice = () => {
        navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: item?.invoiceURL })
    }
    const onPressUpdateOrder = () => {
        navigation.navigate('UpdateBookedOrders', { productsArray: item?.deliveryOrderDetails, item: item })
    }


    return (
        <View style={styles.itemsContainer}>
            <Text style={styles.shopName}>{item?.shopName}</Text>
            <Text style={styles.shopArea}>{item?.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.shopArea}>{item?.orderDate}</Text>
            <TouchableOpacity onPress={() => onPressViewInvoice()} style={styles.editIconContainer}>
                <Image source={ic_view_invoice} style={styles.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressUpdateOrder()} style={styles.editIconContainer}>
                <Image source={ic_update_product} style={styles.editIcon} />
            </TouchableOpacity>
        </View>
    )
}

const TodayBookingList = ({ route, navigation }) => {
    const userData = useSelector(state => state.userAuth.value);

    let onEndReachedCalledDuringMomentum = false;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const loadingModalRef = useRef();

    useFocusEffect(
        useCallback(() => {
            getShopList(true)
            return () => isActive = false;
        }, [])
    );

    const GetFormattedDay = (date) => {
        let day = date.getDate();
        let month = (date.getMonth() + 1);
        if (day < 10) { day = "0" + day }
        if (month < 10) { month = "0" + month }
        return date.getFullYear() + "-" + month + "-" + day
    }

    const getShopList = async (showLoadingModal) => {
        let object = {
            "shopID": "",
            "pagenumber": 1,
            "pageSize": 1000,
            "salesMan_EncryptedId": userData?.salesMan_Encrypted,
            "date": GetFormattedDay(new Date())
        }
        // console.log('userData : ',userData)
        console.log('OBJECT : ', object);
        if (showLoadingModal) loadingModalRef.current.show();
        // if (searchKey.length > 0)
        //     setData([])

        try {
            await ApiClient.post(
                `${ApiRoute.BASE_URL}${ApiRoute.GET_TODAY_BOOKINGS}`,
                object,
                {
                    headers: {
                        Accept: 'text/plain',
                        'Content-Type': 'application/json',
                    },
                },
            )
                .then(async response => {
                    loadingModalRef.current.hide();
                    // setIsRefreshing(false);
                    setLoading(false)
                    if (response.data.isSuccess && response.data.data != null) {
                        console.log('Data===>>>>: ', response?.data?.data?.deliveryOrderDetails[0])
                        console.log('Data===>>>>: ', response?.data?.message)
                        AlertMessage.showMessage(response?.data?.message)
                        // setData(response?.data?.data?.deliveryOrderDetails)
                        //     if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        //     if (response.data?.data.length > 0)
                        // AlertMessage.showMessage(response.data?.message);
                        setData(response?.data?.data?.deliveryOrderDetails);
                        //   } else {
                        //     if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
                        // console.log('Data : ',response.message)
                    }
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
    };

    const onSubmitSearch = text => {
        if (text.length > 0) setData([]);
        pageNo = 1;
        searchText = text;
        getShopList(false, pageNo, searchText);
    };

    const handleRefresh = () => {
        // setIsRefreshing(true);
        pageNo = 1;
        setData([]);
        getShopList(false, pageNo, searchText);
    };

    const onReachEndLoadMore = async () => {
        if (!onEndReachedCalledDuringMomentum) {
            // console.log('onReachEndLoadMore')
            pageNo = ++pageNo;
            setLoading(true);
            getShopList(false, pageNo, searchText);
            onEndReachedCalledDuringMomentum = true;
        }
    };

    const onClearSeach = () => {
        pageNo = 1;
        searchText = '';
        setData([])
        getShopList(false, pageNo, searchText);
    };

    const renderItem = ({ item, index }) => <Item item={item} index={index} navigation={navigation} />;

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
        // <Text style={{flex:1, textAlign:'center'}}>ShopList</Text>
        <View style={styles.mainContainer}>
            <CommonHeaderWithBackButton title={'Productive Shops'} />
            <View style={styles.innerContainer}>
                <CustomSearchBar
                    placeholder={'Search Shop.'}
                    onSubmit={text => {
                        onSubmitSearch(text);
                    }}
                    onClearSearch={() => {
                        onClearSeach();
                    }}
                />
                <View style={styles.flatListContainer}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.headingText}>Shop Name</Text>
                        <Text style={styles.headingText}>Total Amount</Text>
                        <Text style={styles.headingText}>Date / Time</Text>
                        <Text style={styles.headingText}>View Invoice</Text>
                        <Text style={styles.headingText}>Update</Text>
                    </View>
                    <View style={styles.divider} />
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item?.order_Uid}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    backgroundColor: Colors.textColorLight,
                                    height: wp('0.3%'),
                                }}
                            />
                        )}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={isRefreshing}
                        //         tintColor={Colors.primaryColor}
                        //         onRefresh={handleRefresh}
                        //     />
                        // }
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            onReachEndLoadMore();
                        }}
                        onMomentumScrollBegin={() => {
                            onEndReachedCalledDuringMomentum = false;
                        }}
                        ListFooterComponent={renderFooter}

                    />
                    <LoadingModal ref={loadingModalRef} />
                </View>
            </View>
        </View>
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
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        flex: 1,
        // width: wp('35%'),
        fontSize: wp('4%'),
        color: Colors.primaryColor,
        paddingStart: wp('4%'),
    },
    shopArea: {
        flex: 1,
        fontSize: wp('3.2%'),
        color: Colors.textColorLight,
        paddingStart: wp('4%'),
        marginTop: wp('1%'),
    },
    ShopClassText: {
        fontSize: wp('3.5%'),
        color: Colors.textColorLight,
        width: wp('22%'),
    },
    ShopVisitDatText: {
        fontSize: wp('3.5%'),
        color: Colors.textColorLight,
        // flex: 1,
        width: wp('26%'),
    },
    editIconContainer: {
        width: wp('18%'),
        height: wp('8%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp('2%'),
        // backgroundColor: 'pink'
    },
    editIcon: {
        resizeMode: 'contain',
        // tintColor: Colors.primaryColor,
        width: wp('8%'),
        height: wp('8%'),
    },
    shopAndAreaContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    headingContainer: {
        // backgroundColor: 'pink',
        width: wp('100%'),
        // flex: 1,
        justifyContent: 'space-between',
        height: wp('12%'),
        alignItems: 'center',
        flexDirection: 'row',
    },
    headingText: {
        flex: 1,
        marginStart: wp('4%'),
        color: Colors.primaryColor,
        // backgroundColor: 'green',
        // width: wp('25%'),
        fontSize: wp('4%')
    },
    divider: {
        backgroundColor: Colors.textColorLight,
        height: wp('0.3%'),
        marginVertical: wp('1%'),
    },
    headingVisitText: {
        flex: 1,
        marginEnd: wp('10%'),
        color: Colors.primaryColor,
    },
    menuItem: {
        margin: wp('0%'),
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
        color: Colors.primaryColorLight,
        fontSize: wp('3%'),
        textAlign: 'center',
        marginTop: wp('2%'),
    },
    loadingContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default memo(TodayBookingList);
