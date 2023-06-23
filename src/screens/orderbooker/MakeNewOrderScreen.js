import React, { useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CommonHeaderWithBackButton from '../../components/Headers/CommonHeaderWithBackButton';
import { CustomSearchBar } from '../../components/searchbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Colors } from '../../styling';
import { LoadingModal } from '../../components/modal';
import { AlertMessage } from '../../components/snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { ApiClient, ApiRoute } from '../../network_utils';
import { firebase } from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const ic_barcode = require('../../assets/ic_barcode.png');
const ic_options = require('../../assets/ic_options.png');
const ic_enable = require('../../assets/ic_enable.png');
const ic_disable = require('../../assets/ic_disable.png');

const Item = ({ item, userData, GetShopList_Callback, dashboardData }) => {

  const navigation = useNavigation();

  const [isVisited, setIsVisited] = useState(false)

  const updateShopDetails = () => {
    // console.log('item: ', item);
    hideMenu();
    navigation.navigate('UpdateShopDetailScreen', { shopDetails: item });
  };
  const openShopDetails = item => {
    hideMenu();
    navigation.navigate('ShopDetailScreen', { shopDetails: item });
  };

  const viewLocation = item => {
    hideMenu();
    navigation.navigate('ViewShopLocationScreen', { shopDetails: item })
  };

  const navigateForOrder = () => {
    navigation.navigate('SubmitOrderScreen', { shopDetails: item })
  }

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const GetFormattedDay = (date) => {
    let day = date.getDate();
    let month = (date.getMonth() + 1);
    if (day < 10) { day = "0" + day }
    if (month < 10) { month = "0" + month }
    return date.getFullYear() + "-" + month + "-" + day
  }

  const confirmCoverage = () => {
    Alert.alert(
      'Shop Visited:',
      ``,
      [
        { text: 'Yes', onPress: () => shopCoverage() },
        { text: 'No', onPress: () => null },
      ],
      { cancelable: true }
    )
  }


  const shopCoverage = async () => {
    // console.log('Executed')

    let object = {
      "shopID": item?.customerId_Encrypted,
      "salesmanID": userData?.salesMan_Encrypted,
      // "visitDate": GetFormattedDay(new Date())
    }
    // console.log('object: ', object)

    try {
      await ApiClient.post(
        `${ApiRoute.BASE_URL}${ApiRoute.SHOP_COVERAGE}`,
        object,
        {
          headers: {
            Accept: 'text/plain',
            'Content-Type': 'application/json',
          },
        },
      )
        .then(async response => {
          console.log('response: ', response.data)
          if (response.data.isSuccess) {
            setTimeout(() => {
              // navigation.goBack()
              GetShopList_Callback()
            }, 1000);
            AlertMessage.showMessage(response.data?.message);
            setIsVisited(!true)
          } else {
            AlertMessage.showMessage(response.data?.message);
            // console.log('Data : ', response.message)
          }
        })
        .catch(err => {
          // console.log(err)
          AlertMessage.showMessage(err?.message);
        });
    } catch (e) {
      // console.log('login error => ', e)
    }
  };

  let watchID = null

  const getUserLocation = () => {
    // AlertMessage.showMessage('Delivery has been started!')
    // if (dashboardData == 0) {
      watchID = Geolocation.watchPosition((lastPosition) => {
        console.log("Latitude & Longitude: ", lastPosition)
        sendDataToFirebase(lastPosition);
        sendDataToFirebaseForTracking(lastPosition);
      },
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 });
    // } 
    navigation.navigate('SubmitOrderScreen', { shopDetails: item })
  }

  const sendDataToFirebase = (lastPosition) => {
    firebase.database()
      .ref(`/LiveLocation/${userData?.salesMan_Encrypted}`)
      .set({
        latitude: lastPosition.coords.latitude,
        longitude: lastPosition.coords.longitude
      })
      .then(() => { console.log('Data Added') })
  }

  const sendDataToFirebaseForTracking = (lastPosition) => {
    firebase.database()
      .ref(`/TrackingHistory/${userData?.salesMan_Encrypted}/${GetFormattedDay(new Date())}`)
      .push({
        latitude: lastPosition.coords.latitude,
        longitude: lastPosition.coords.longitude
      })
      .then(() => { console.log('Data Added') })
  }

  return (
    <View style={styles.itemsContainer}>
      <View style={styles.shopAndAreaContainer}>
        <Text style={styles.shopName}>{item?.shopName}</Text>
        <Text style={styles.shopArea}>{item?.areaName}</Text>
      </View>
      {/* <Text style={styles.ShopClassText}>{item?.shopClass}</Text> */}
      <Text style={styles.ShopVisitDatText}>{item?.day_Name}</Text>
      {item?.isVisited ?
        <TouchableOpacity
          onPress={() =>
            // navigation.navigate('SubmitOrderScreen', { shopDetails: item })
            confirmCoverage()
          }
          style={styles.visitedButton}>
          {/* confirmCoverage() */}
          <Image source={ic_enable} style={styles.shopCoverageIcon} />
        </TouchableOpacity>
        :
        <TouchableOpacity
          onPress={() =>
            // navigation.navigate('SubmitOrderScreen', { shopDetails: item })
            confirmCoverage()
          }
          style={styles.visitedButton}>
          {/* confirmCoverage() */}
          <Image source={ic_disable} style={styles.shopCoverageIcon} />
        </TouchableOpacity>
      }
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('SubmitOrderScreen', { shopDetails: item })
          getUserLocation()
        }
        }
        style={styles.makeOrderButtonContainer}>
        {/* confirmCoverage() */}
        {/* <Image source={ic_Shop_Coverage} style={styles.shopCoverageIcon} /> */}
        <Text style={{ color: 'white' }} >Make Order</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showMenu} style={styles.editIconContainer}>
        <Image source={ic_options} style={styles.editIcon} />
      </TouchableOpacity>
      <Menu visible={visible} onRequestClose={hideMenu}>
        {/* <MenuItem textStyle={{ color: 'black' }} style={styles.menuItem} onPress={() => updateShopDetails()}>
          Update Shop Detail
        </MenuItem>
        <MenuDivider /> */}
        <MenuItem
          textStyle={{ color: 'black' }}
          style={styles.menuItem}
          onPress={() => {
            openShopDetails(item);
          }}>
          Shop Detail
        </MenuItem>
        <MenuDivider />
        <MenuItem textStyle={{ color: 'black' }} style={styles.menuItem} onPress={() => {
          viewLocation(item)
        }}>
          View Location
        </MenuItem>
        {/* <MenuDivider />
        <MenuItem textStyle={{ color: 'black' }} style={styles.menuItem} onPress={hideMenu}>
          Add Location
        </MenuItem> */}
      </Menu>
    </View>
  );
};
let pageNo = 1;
let searchText = '';
let onEndReachedCalledDuringMomentum = false;
let isActive = true;

const MakeNewOrderScreen = ({ route }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const loadingModalRef = useRef();
  const userData = useSelector(state => state.userAuth.value);

  let { dashboardData } = route?.params

  console.log('dashboardData: ', dashboardData);

  // console.log('USER DATA: ', userData);

  useFocusEffect(
    useCallback(() => {
      setData([])
      getShopList(true, pageNo, searchText);

      return () => {
        isActive = false;
      };
    }, [])
  );
  const GetShopList_Callback = () => {
    setData([])
    getShopList(false, pageNo, searchText);
  }

  const getShopList = async (showLoadingModal, pageNo, searchKey) => {
    let object = {
      userId: userData?.userId_Encrypted,
      shopName: searchKey,
      pagenumber: pageNo,
    };
    // console.log('object : ', object)
    if (showLoadingModal) loadingModalRef.current.show();
    // if (searchKey.length > 0) setData([]);

    try {
      await ApiClient.post(
        `${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_SHOP_LIST}`,
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
            // AlertMessage.showMessage(response.data?.message);
            if (response.data?.data.length > 0)
              // setData(response.data?.data)
              // if (isActive) {
              setData(data => [...data, ...response.data?.data]);
            // }
          } else {
            AlertMessage.showMessage(response.data?.message);
            // console.log('Data : ',response.message)
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
    getShopList(false, pageNo, searchText);
  };

  const onSubmitSearch = text => {
    setData([]);
    pageNo = 1;
    searchText = text;
    getShopList(false, pageNo, searchText);
  };

  const onClearSeach = () => {
    setData([]);
    pageNo = 1;
    searchText = '';
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



  const renderItem = ({ item }) => <Item item={item} userData={userData} GetShopList_Callback={GetShopList_Callback} dashboardData={dashboardData} />;

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

  let watchID = null




  return (
    <SafeAreaView style={styles.mainContainer}>
      <CommonHeaderWithBackButton title={'Make New Order'} />
      <Text style={styles.greetingsText}>Hello, {userData?.name}</Text>
      <Text style={styles.routePlanText}>Today's route plan for you</Text>
      <View style={styles.searchbarContainer}>
        <CustomSearchBar
          placeholder={'Search Shop'}
          onSubmit={text => {
            onSubmitSearch(text);
          }}
          onClearSearch={() => {
            onClearSeach();
          }}
        />
        {/* <TouchableOpacity style={styles.barcodeIconContainer}>
          <Image source={ic_barcode} style={styles.barcodeIcon} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.flatListContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Shop/Area</Text>
          {/* <Text style={styles.headingText}>Class</Text> */}
          <Text style={styles.headingVisitText}>Visit Day</Text>
          <Text style={[styles.headingVisitText, { marginRight: wp('6%') }]}>Visit Status</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddNewShopScreen')}
            style={styles.addShopButtonContainer}>
            <Text style={styles.addShopText}>Add Shop</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index + ''}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: Colors.textColorLight,
                height: wp('0.3%'),
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
          ListFooterComponent={renderFooter}

        />
        <LoadingModal ref={loadingModalRef} />
      </View>
    </SafeAreaView>
  );
};

export default MakeNewOrderScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  searchbarContainer: {
    flexDirection: 'row',
  },
  barcodeIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp('5.2%'),
  },
  barcodeIcon: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
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
    justifyContent: 'center',
  },
  shopName: {
    flex: 1,
    fontSize: wp('4%'),
    color: Colors.primaryColor,
    paddingStart: wp('4%'),
    width: wp('20%'),
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
    paddingEnd: wp('3%'),
    // width: wp('22%')
  },
  ShopVisitDatText: {
    fontSize: wp('3.5%'),
    color: Colors.textColorLight,
    paddingEnd: wp('1%'),
    width: wp('20%'),
  },
  editIconContainer: {
    width: wp('10%'),
    height: wp('8%'),
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
  shopAndAreaContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  headingContainer: {
    width: wp('100%'),
    height: wp('8%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    flex: 1,
    marginStart: wp('4%'),
    color: Colors.primaryColor,
  },
  divider: {
    backgroundColor: Colors.textColorLight,
    height: wp('0.3%'),
    marginVertical: wp('1%'),
  },
  headingVisitText: {
    flex: 1,
    // width: wp('25%'),
    // marginEnd: wp('15%'),
    color: Colors.primaryColor,
    // backgroundColor: 'green'
  },
  menuItem: {
    margin: wp('0%'),
    color: 'black'
  },
  makeOrderButtonContainer: {
    backgroundColor: Colors.primaryColor,
    width: wp('25%'),
    height: wp('10%'),
    // borderWidth: wp('0.4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    // borderColor: Colors.primaryColor,
    flexDirection: 'row'
  },
  visitedButton: {
    // backgroundColor: 'pink',
    width: wp('12%'),
    height: wp('10%'),
    // borderWidth: wp('0.4%'),
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: wp('3%'),
    // borderColor: Colors.primaryColor,
    flexDirection: 'row',
    marginRight: wp('3%')
  },
  addShopButtonContainer: {
    backgroundColor: Colors.primaryColor,
    width: wp('30%'),
    height: wp('9%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    marginEnd: wp('2%'),
  },
  addShopText: {
    color: 'white',
  },
  greetingsText: {
    color: Colors.primaryColor,
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('3%'),
    marginTop: wp('3%'),
  },
  routePlanText: {
    color: Colors.textColorLight,
    marginLeft: wp('3%'),
    marginTop: wp('2%'),
    fontWeight: '600',
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
  shopCoverageIcon: {
    resizeMode: 'contain',
    width: wp('9%'),
    height: wp('10%'),
    // marginLeft: wp('2%')
  }
});
