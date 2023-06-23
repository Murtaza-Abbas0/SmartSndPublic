import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl, Text, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { CustomSearchBar } from '../../components/searchbar';
import { LoadingModal } from "../../components/modal";
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { useSelector, useDispatch } from 'react-redux'

const ic_view_invoice = require('../../assets/ic_view_invoice.png')

const Item = ({ item, navigation }) => {

    const openProductDetails = () => {
        navigation.navigate('ProductDetailScreen', { productDetails: item })
    }

    console.log('DATA: ', item)

    return (
        // <TouchableOpacity style={styles.itemsContainer} onPress={() => { openProductDetails() }}>
        //     <Text style={styles.brandName}>{item?.name}</Text>
        //     <Text style={styles.brandPerPiecePrice}>{item?.perPiecePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
        //     {/* <TouchableOpacity style={styles.editIconContainer} onPress={() => navigation.navigate('UpdateProfileDetailScreen', { productDetails: item })} >
        //         <Image source={ic_edit} style={styles.editIcon} />
        //     </TouchableOpacity> */}
        // </TouchableOpacity>
        <View style={styles.itemsContainer} onPress={() => { openProductDetails() }}>
            <Text style={styles.brandName}>{item?.name}</Text>
            <Text style={styles.brandPerPiecePrice}>{item?.perPiecePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            <TouchableOpacity style={styles.editIconContainer} onPress={() => openProductDetails()} >
                <Image source={ic_view_invoice} style={styles.editIcon} />
            </TouchableOpacity>
        </View>
    );
}
let pageNo = 1
let searchText = ''

const ProductListScreen = ({ route, navigation }) => {

    const userData = useSelector((state) => state.userAuth.value)

    let onEndReachedCalledDuringMomentum = false

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);

    const loadingModalRef = useRef()

    useEffect(() => {
        setData([])
        const fetchData = async () => {
            getProductList(true, pageNo, searchText)
        }

        fetchData()
    }, [])


    const getProductList = async (showLoadingModal, pageNo, searchKey) => {
        let object = {
            "productId": 0,
            "productName": searchKey,
            "pagenumber": pageNo
        }
        // console.log('userData : ',userData)
        console.log('OBJECT : ', object);
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
                    setLoading(false)
                    setIsRefreshing(false)
                    if (response.data.isSuccess && response.data.data != null) {
                        // console.log('Data : ', response?.data)
                        // AlertMessage.showMessage(response.data?.message)
                        if (response.data?.data.length > 0)
                            setData((data) => [...data, ...response.data?.data])
                    } else {
                        AlertMessage.showMessage(response.data?.message)
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
        setIsRefreshing(true);
        pageNo = 1
        setData([])
        getProductList(false, pageNo, searchText)
    };


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
        if (text.length > 0) {
            setData([]);
            pageNo = 1
            searchText = text
            getProductList(false, pageNo, searchText)
        }
    }

    const onClearSeach = () => {
        pageNo = 1
        searchText = ''
        setData([])
        getProductList(false, pageNo, searchText)
    }


    const renderItem = ({ item }) => (
        <Item item={item} navigation={navigation} />
    );


    const renderFooter = () => {
        if (loading) {
            return (
                <View style={styles.footer}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={Colors.primaryColor} size={"large"} />
                        <Text style={styles.loadingLabel}>Loading</Text>
                    </View>
                </View>
            );
        }

    };

    return (
        <View style={styles.mainContainer}>
            <CommonHeaderWithDrawerButton title={'Product List'} />

            <View style={styles.innerContainer}>
                <CustomSearchBar placeholder={'Search Products.'} onSubmit={(text) => { onSubmitSearch(text) }} onClearSearch={() => { onClearSeach() }} />

                <View style={styles.flatListContainer} >

                    {/* <View style={{ flexDirection: 'row', marginTop: wp('2%'), marginHorizontal: wp('0%'), borderBottomWidth: 1, width: wp('100%'), borderBottomColor: Colors.textColorLight }}>

                        <Text style={styles.headingVisitText}> Product Name</Text>
                        <Text style={styles.headingVisitTextleft}>Product Price</Text>

                    </View> */}
                    <View style={styles.listHeaderContainer} >
                        <Text style={[styles.headerItemsText, { width: wp('35%'), paddingStart: wp('4%') }]} >Product Name</Text>
                        <Text style={[styles.headerItemsText, { paddingStart: wp('6%') }]} >Price</Text>
                        <Text style={[styles.headerItemsText, { paddingEnd: wp('3%') }]} >View Details</Text>
                    </View>
                    <View style={{ backgroundColor: 'black', height: wp('0.2%'), marginTop: wp('1%') }} />
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        // keyExtractor={item => item.product_Id}
                        keyExtractor={(item, index) => index + ''}
                        ItemSeparatorComponent={() => <View style={{ backgroundColor: Colors.textColorLight, height: wp('0.3%') }} />}
                        refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={Colors.primaryColor} onRefresh={handleRefresh} />}
                        onEndReachedThreshold={0.5}
                        initialNumToRender={10}
                        pagingEnabled={true}
                        onEndReached={() => { onReachEndLoadMore() }}
                        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false }}
                        ListFooterComponent={() => { renderFooter() }}
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
        flexDirection: 'row',
        // backgroundColor: 'pink',
        height: wp('18%'),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brandName: {
        // flex: 1,
        fontSize: wp('4%'),
        color: Colors.primaryColor,
        paddingStart: wp('4%'),
        width: wp('35%'),
        // backgroundColor: 'red'
    },
    brandPerPiecePrice: {
        fontSize: wp('4%'),
        color: Colors.textColorLight,
        width: wp('20%'),
        textAlign: 'center',
        // backgroundColor: 'green'
    },
    editIconContainer: {
        width: wp('15%'),
        height: wp('8%'),
        // backgroundColor: 'blue',
        // alignItems: 'center',
        // justifyContent: 'center',
        marginHorizontal: wp('2%'),
        paddingEnd: wp('10%')
    },
    editIcon: {
        resizeMode: 'contain',
        // tintColor: Colors.primaryColor,
        width: wp('7%'),
        height: wp('7%')
    },
    headingVisitText: {
        flex: 1,
        fontSize: wp('4%'),
        marginEnd: wp('10%'),
        marginBottom: wp('2%'),
        marginLeft: wp('3%'),
        color: Colors.primaryColor
    },
    headingVisitTextleft: {
        flex: 1,
        fontSize: wp('4%'),
        marginBottom: wp('2%'),
        marginLeft: wp('33%'),
        // marginEnd: wp('0%'),
        color: Colors.primaryColor
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
        // backgroundColor: 'pink',
        width: wp('35%'),
        alignSelf: 'center',
        textAlign: 'center',
    },
    buttonContainer: {
        width: wp('12%'),
        height: wp('7%'),
        // backgroundColor:'pink',
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
    listHeaderContainer: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: wp('12%')
    },
    headerItemsText: {
        // backgroundColor: 'skyblue',
        fontSize: wp('4%'),
        color: Colors.primaryColor
    }
})


export default ProductListScreen;