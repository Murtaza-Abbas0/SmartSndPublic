
import 'react-native-gesture-handler';
import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StackActions } from '@react-navigation/native';
import { ApiClient, ApiRoute } from '../../network_utils';
import { AlertMessage } from '../../components/snackbar';
import { LoadingModal } from '../../components/modal';

import { Colors } from '../../styling';
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';

import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

let pageNo = 1;
let onEndReachedCalledDuringMomentum = false;

const PendingDeliveriesScreenForDeliveryman = ({ route, navigation }) => {
  const userData = useSelector(state => state.userAuth.value);



  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadingModalRef = useRef();


  useFocusEffect(
    useCallback(() => {
      setData([])
      getOrderSummary(true, pageNo);
    }, []),
  );


  const renderListItem = ({ item, index }) => {

    // console.log("item: ", item)

    return (
      <TouchableOpacity
        style={styles.headerContainerListItem}
        onPress={() => {
          navigation.navigate('ConfirmDeliveryScreen', {
            item,
          });
        }}>
        {/* <Text style={styles.headerLabelListItem}>index</Text> */}
        <Text style={styles.headerLabelListItem}>{item?.shopName}</Text>
        <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>
          {item?.order_Id}
        </Text>
        <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>
          {item?.totalAmount}
        </Text>
        <Text style={[styles.headerLabelListItem, { color: Colors.textColor }]}>
          {item?.orderDate}
        </Text>
      </TouchableOpacity>
    );
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

  const getOrderSummary = async (showLoadingModal, pageNo) => {
    let object = {
      shopID: null,
      pagenumber: pageNo,
    };
    console.log('object: ', object)
    // console.log('userData : ',userData)
    if (showLoadingModal) {
      loadingModalRef.current.show();
    }

    try {
      await ApiClient.post(
        `${ApiRoute.BASE_URL}${ApiRoute.PENDING_DELIVIVERIES_LIST}`,
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
          setIsRefreshing(false);
          setLoading(false)
          if (response.data.isSuccess && response.data.data != null) {
            console.log('Data : ', response?.data);
            // console.log('Data : ', response?.data.data?.deliveryOrderDetails);
            AlertMessage.showMessage(response.data?.message);
            if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
            if (response?.data.data?.deliveryOrderDetails != null){
            setData(data => [...data, ...response.data.data?.deliveryOrderDetails]);
          }
          }
          else {
            if (response.data?.data?.deliveryOrderDetails == []) setLoading(false);
            console.log('Data : ', response.data?.message)
          }
        })
        .catch(err => {
          console.log(err);
          setIsRefreshing(false);
          loadingModalRef.current.hide();
          AlertMessage.showMessage(err?.message);
        });
    } catch (e) {
      console.log('login error => ', e);
      setIsRefreshing(false);
      loadingModalRef.current.hide();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    pageNo = 1;
    setData([]);
    getOrderSummary(false, pageNo);
  };

  // const onReachEndLoadMore = async () => {
  // if (!onEndReachedCalledDuringMomentum) {
  //   // console.log('onReachEndLoadMore')
  //   pageNo = ++pageNo;
  //   setLoading(true);
  //   getOrderSummary(false, pageNo);
  //   onEndReachedCalledDuringMomentum = true;
  // }
  // };
  const onReachEndLoadMore = async () => {
    if (!onEndReachedCalledDuringMomentum) {
      console.log('onReachEndLoadMore')
      pageNo = ++pageNo;
      setLoading(true);
      getOrderSummary(false, pageNo);
      onEndReachedCalledDuringMomentum = true;
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <CommonHeaderWithDrawerButton title={'Pending Deliveries'} />
      <View style={styles.headerContainer}>
        {/* <Text style={styles.headerLabel}>S.No</Text> */}
        {/* <Text style={styles.headerLabel}>S.No</Text> */}
        <Text style={styles.headerLabel}>Shop</Text>
        <Text style={styles.headerLabel}>Invoice #</Text>
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
          <View
            style={{
              backgroundColor: Colors.primaryColorLight,
              height: 0.8,
              width: '85%',
              alignSelf: 'center',
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={Colors.primaryColor}
            onRefresh={handleRefresh}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          onReachEndLoadMore();
        }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        // ListEmptyComponent={
        //     < View style={styles.emptyPlaceHolderContainer} >
        //         <Image source={ic_no_record_found} style={styles.emptyPlaceHolderImage} />
        //         <Text style={styles.emptyPlaceHolderLabel}>{
        //             loading ? 'Loading please wait...' : 'Records not found!'}
        //         </Text>
        //     </View >
        // }
        ListFooterComponent={renderFooter}
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
    justifyContent: 'center',
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
    alignItems: 'center',
  },
  headerLabel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.primaryColor,
    flex: 1,
    fontWeight: '500',
    fontSize: wp('3%'),
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
    alignItems: 'center',
  },
  headerLabelListItem: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.primaryColor,
    flex: 1,
    // fontWeight:'500',
    fontSize: wp('4%'),
    paddingVertical: wp('4%'),
  },
  loadingLabel: {
    color: Colors.primaryTextColor,
    fontSize: wp('3%'),
    textAlign: 'center',
    marginTop: wp('2%')
  },
});

export default PendingDeliveriesScreenForDeliveryman;
