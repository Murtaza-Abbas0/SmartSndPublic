import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { CommonHeaderWithBackButton } from '../../components/Headers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../../styling';
import { CustomSearchBar } from '../../components/searchbar';
import { useSelector, useDispatch } from 'react-redux';
import { AlertMessage } from '../../components/snackbar';
import { ApiClient, ApiRoute } from '../../network_utils';
import { useNavigation } from '@react-navigation/native';
import { LoadingModal } from '../../components/modal';
import { firebase } from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const Item = ({ item, UpdateItems }) => {

  const [orderQuantity, setOrderQuantity] = useState(item?.orderQuantity)

  const onChangeQuantity = (quantity, id) => {
    setOrderQuantity(quantity === "" ? 0 : parseInt(quantity))
    UpdateItems(quantity, id)
  }
  return (
    <View style={styles.itemsContainer}>
      <TouchableOpacity style={styles.itemNameContainer}>
        <Text style={styles.brandName}>{item?.productName}</Text>
      </TouchableOpacity>
      {/* <Text style={styles.priceText}>{item?.orderQuantity}</Text> */}
      {/* {item.map((detail, index) => { */}
      {/* console.log(detail) */}
      {/* return ( */}
      <TextInput
        // key={index}
        style={styles.inputStyles}
        value={String(orderQuantity)}
        // defaultValue={String(item.orderQuantity
        onChangeText={(quantity) => { onChangeQuantity(quantity, item?.orderDetails_Id) }}
        keyboardType={'decimal-pad'}
      />
      {/* ) */}
      {/* })} */}
      <Text style={styles.priceText}>{item?.totalValue}</Text>
    </View>
  );
};

let isTracking = false

const ConfirmDeliveryScreen = ({ route }) => {
  const userData = useSelector(state => state.userAuth.value);
  const navigation = useNavigation();
  const loadingModalRef = useRef();

  let { item } = route?.params;

  const [totalQty, setTotalQty] = useState();
  const [isRefreshing, setIsRefreshing] = useState();
  const [Data, setData] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState(0);
  const [orderDetails, setOrderDetails] = useState([
    {
      orderDetails_Id: item?.deliveryOrderDetails[0].orderDetails_Id,
      orderQuantity: 1
    }
  ])

  const UpdateItems = (Quantity, OrderId) => {

    var index = item.deliveryOrderDetails.findIndex((x) => x.orderDetails_Id === OrderId)

    if (index !== -1) {
      item.deliveryOrderDetails[index].orderQuantity = Quantity === "" ? 0 : parseInt(Quantity)
    }
    console.log("called: ", item)
  }

  let watchID = null

  const getUserLocation = () => {
    AlertMessage.showMessage('Delivery has been started!')
    watchID = Geolocation.watchPosition((lastPosition) => {
      console.log("Latitude & Longitude: ", lastPosition)
      sendDataToFirebase(lastPosition);
      sendDataToFirebaseForTracking(lastPosition);
    },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 });
  }

  const sendDataToFirebase = (lastPosition) => {
    firebase.database()
      .ref(`/LiveLocation/${userData?.deliveryMan_Encrypted}`)
      .set({
        latitude: lastPosition.coords.latitude,
        longitude: lastPosition.coords.longitude
      })
      .then(() => { console.log('Data Added') })
  }

  console.log(item?.order_Id)

  const sendDataToFirebaseForTracking = (lastPosition) => {
    firebase.database()
      .ref(`/LocationTracking/${userData?.deliveryMan_Encrypted}/${item?.order_Id}`)
      .push({
        latitude: lastPosition.coords.latitude,
        longitude: lastPosition.coords.longitude
      })
      .then(() => { console.log('Data Added') })
  }

  // console.log('item1: ', item?.deliveryOrderDetails[0].orderDetails_Id);
  // console.log('item2: ', item?.deliveryOrderDetails[0].orderQuantity);
  // console.log("koi or naam: ", item)

  const getTotalQty = useMemo(() => {
    // console.log(item.deliveryOrderDetails)
    let result = 0;
    if (item.deliveryOrderDetails)
      item.deliveryOrderDetails.forEach(element => {
        result += element.orderQuantity;
      });

    return result;
  }, []);

  const getTotalAmount = useMemo(() => {
    // console.log(item.deliveryOrderDetails)
    let result = 0;
    if (item.deliveryOrderDetails)
      item.deliveryOrderDetails.forEach(element => {
        result += element.totalValue;
      });

    return result;
  }, []);


  const renderItem = ({ item, navigation }) => (
    <Item item={item} navigation={navigation} UpdateItems={UpdateItems} />
  );

  const startDelivery = async () => {
    isTracking = true
    if (isTracking == true) {
      // console.log('Is Tracking after start Delivery: ', isTracking);
      Alert.alert(
        '',
        `You'll be tracked until you deliver this order`,
        [
          { text: 'OK', onPress: () => getUserLocation() },
        ],
        { cancelable: false }
      )
    }
    // console.log('startDelivery!')
  };

  const startedDelivery = async () => {
    // console.log('startedDelivery!')
  };

  const deliverNow = async () => {
    // console.log('deliverNow!')
    Alert.alert(
      '',
      'Are you sure you want to confirm?',
      [
        { text: 'NO', onPress: () => console.log('NO Pressed'), style: 'cancel' },
        { text: 'YES', onPress: () => confirmDelivery() },
      ],
      { cancelable: false }
    )
  };

  const onPressButton = useCallback(() => {
    if (deliveryStatus === 0) {
      startDelivery()
      setDeliveryStatus(1)
      startedDelivery()
      setTimeout(() => {
        setDeliveryStatus(2)
      }, 3000)
    } else if (deliveryStatus === 1) {

    } else if (deliveryStatus === 2) {
      deliverNow()

    }
  }, [deliveryStatus]);

  const confirmDelivery = async () => {
    isTracking = false
    if(isTracking == false) {
      Geolocation.stopObserving()
    }
    console.log('isTracking After order delivered: ', isTracking)
    if (isTracking == false) {
      console.log('Order Delivered!')

      loadingModalRef.current.show();

      try {
        await ApiClient.put(
          `${ApiRoute.BASE_URL}${ApiRoute.CONFIRM_DELIVERY}?OrderID=${item?.order_Id}`,
          {
            headers: {
              Accept: 'text/plain',
              'Content-Type': 'application/json',
            },
          },
        )
          .then(async response => {
            loadingModalRef.current.hide();
            if (response.data.isSuccess && response.data.data != null) {
              console.log('Data : ', response?.data);
              AlertMessage.showMessage(response.data?.message);
              setTimeout(() => {
                navigation.goBack()
                navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: item?.invoiceURL })
              }, 2000)
            } else {
              AlertMessage.showMessage(response.data?.message);
            }
          })
          .catch(err => {
            console.log(err);
            loadingModalRef.current.hide();
            AlertMessage.showMessage(err?.message);
          });
      } catch (e) {
        console.log('login error => ', e);
        loadingModalRef.current.hide();
      }
      // console.log('userData : ',userData)
      // loadingModalRef.current.show();
      let OrderArray = [];
      let model = {}
      item.deliveryOrderDetails.map((items) => {
        OrderArray.push(
          {
            orderDetails_Id: items.orderDetails_Id,
            orderQuantity: items.orderQuantity
          }
        )
      })
      model.order_ID = item.order_Id
      model.deliveredQuantity = OrderArray

      console.log('object: ', model)



      try {
        await ApiClient.put(
          `${ApiRoute.BASE_URL}${ApiRoute.UPDATE_ORDER_DETAILS}`,
          model,
          {
            headers: {
              Accept: 'text/plain',
              'Content-Type': 'application/json',
            },
          },
        )
          .then(async response => {
            loadingModalRef.current.hide();
            if (response.data.isSuccess && response.data.data != null) {
              console.log('Data : ', response?.data);
              AlertMessage.showMessage(response.data?.message);
              setTimeout(() => {
                navigation.goBack()
                navigation.navigate('OrderSummaryDetailsScreen', { invoiceURL: item?.invoiceURL })
              }, 2000)
            } else {
              AlertMessage.showMessage(response.data?.message);
            }
          })
          .catch(err => {
            console.log(err);
            loadingModalRef.current.hide();
            AlertMessage.showMessage(err?.message);
          });
      } catch (e) {
        console.log('login error => ', e);
        loadingModalRef.current.hide();
      }
    };
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommonHeaderWithBackButton title={'Order Summary'} />
      <View style={styles.shopDetailsContainer}>
        <Text style={styles.title}>Shop: </Text>
        <Text style={styles.value}>{item?.shopName}</Text>
      </View>
      <View style={styles.shopDetailsContainer}>
        <Text style={styles.title}>Area: </Text>
        <Text style={styles.value}>Testing</Text>
      </View>
      <View style={styles.headingContainer}>
        <Text style={styles.headingTitleContainer}>Products</Text>
        <Text style={styles.headingTitleContainer}>Net Quantity</Text>
        <Text style={styles.headingTitleContainer}>Net Value</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          removeClippedSubviews={false}
          data={item?.deliveryOrderDetails}
          renderItem={renderItem}
          keyExtractor={item => item?.productID}
          ItemSeparatorComponent={() => <View style={{ backgroundColor: Colors.textColorLight, height: wp('0.3%') }} />}
        />
        <LoadingModal ref={loadingModalRef} />
      </View>
      <View style={styles.BottomHeadingContainer}>
        <Text style={styles.headingTitleContainer}>Total Quantity</Text>
        <Text style={styles.headingTitleContainer}>Total Value</Text>
      </View>
      <View style={styles.BottomTextContainer}>
        <Text style={styles.bottomText}>{getTotalQty}</Text>
        <Text style={styles.bottomText}>{getTotalAmount}</Text>
      </View>
      <View style={styles.submitOrderBottonContainer}>
        <TouchableOpacity
          onPress={() => onPressButton()}
          style={styles.ButtonContainer}>
          <Text style={styles.buttonText}>{deliveryStatus === 0 ? "Start Delivery" : deliveryStatus === 1 ? "Delivery Started" : "Deliver Now"}</Text>
        </TouchableOpacity>
        <LoadingModal ref={loadingModalRef} />

      </View>
    </SafeAreaView>
  );
};

export default ConfirmDeliveryScreen;

const styles = StyleSheet.create({
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
    marginTop: wp('5%'),
    borderTopWidth: wp('0.5%'),
    borderColor: Colors.primaryColor,
    borderBottomWidth: wp('0.4%'),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  BottomHeadingContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    height: wp('10%'),
    // backgroundColor: 'pink',
    borderWidth: wp('0.5%'),
    borderColor: Colors.primaryColor,
    borderBottomWidth: wp('0.4%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    marginBottom: wp('5%'),
  },
  BottomTextContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    height: wp('10%'),
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    marginBottom: wp('5%'),
  },
  headingTitleContainer: {
    color: Colors.primaryColor,
  },
  itemsContainer: {
    paddingVertical: wp('3%'),
    marginVertical: wp('2%'),
    // marginHorizontal: wp('4%'),
    flexDirection: 'row',
    flex: 1,
    width: wp('35%'),
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  itemNameContainer: {
    // backgroundColor: 'pink',
    width: wp('35%'),
  },
  brandName: {
    flex: 1,
    // fontSize: wp('4%'),
    color: Colors.primaryColor,
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
    height: wp('5%'),
  },
  addIcon: {
    width: wp('5%'),
    height: wp('5%'),
  },
  quantity: {
    fontSize: wp('4%'),
    marginTop: wp('2%'),
  },
  substracticon: {
    width: wp('5%'),
    height: wp('5%'),
    marginTop: wp('2%'),
  },
  priceText: {
    // backgroundColor: 'pink',
    width: wp('32%'),
    alignSelf: 'center',
    textAlign: 'center',
  },
  submitOrderBottonContainer: {
    width: wp('100%'),
    height: wp('20%'),
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
    // borderTopWidth: wp('0.4%'),
    // borderColor: Colors.primaryColor,
    // backgroundColor: 'red',
    // marginBottom: wp('4%'),
    // justifyContent: 'space-around',
  },
  ButtonContainer: {
    width: wp('80%'),
    height: wp('14%'),
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  submitOrderButton: {
    // backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('50%'),
  },
  submitOrderText: {},
  buttonText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  bottomText: {
    fontSize: wp('4%'),
    color: Colors.textColor,
  },
  inputStyles: {
    width: wp('30%'),
    height: wp('10%'),
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: wp('0.2%'),
    // backgroundColor:'red',
    color: 'black'
  }
});
