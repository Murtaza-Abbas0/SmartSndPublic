import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, memo } from 'react';
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
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { CustomSearchBar } from '../../components/searchbar';
import { ShopListItem } from "../../components/listitems";

let pageNo = 1;
let searchText = '';

const ShopListScreen = ({ route, navigation }) => {
  const userData = useSelector(state => state.userAuth.value);

  let onEndReachedCalledDuringMomentum = false;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadingModalRef = useRef();

  useEffect(() => {
    setData([])
    const fetchData = async () => {
      getShopList(true, pageNo, searchText);
    };

    fetchData();
  }, []);

  // console.log(ApiRoute.BASE_URL);

  const getShopList = async (showLoadingModal, pageNo, searchKey) => {
    let object = {
      userId: userData?.userId_Encrypted,
      shopName: searchKey,
      pagenumber: pageNo,
    };
    // console.log('userData : ',userData)
    // console.log('OBJECT : ', object);
    if (showLoadingModal) loadingModalRef.current.show();
    // if (searchKey.length > 0)
    //     setData([])

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
            // console.log('Data : ', response?.data)
            // if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
            if (response.data?.data.length > 0)
              setData(data => [...data, ...response.data?.data]);
          } else {
            // if (pageNo < 2) AlertMessage.showMessage(response.data?.message);
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

  const onSubmitSearch = text => {
    if (text.length > 0) setData([]);
    pageNo = 1;
    searchText = text;
    getShopList(false, pageNo, searchText);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
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

  const renderItem = ({ item, index }) => <ShopListItem item={item} index={index} />;

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
      <CommonHeaderWithDrawerButton title={'Shop List'} />
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
            <Text style={styles.headingText}>Shop/Area</Text>
            {/* <Text style={styles.headingText}>Class</Text> */}
            <Text style={styles.headingVisitText}>Visit Day</Text>
          </View>
          <View style={styles.divider} />
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?.shopId_Encrypted + Math.random()}
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
    justifyContent: 'center',
  },
  shopName: {
    flex: 1,
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

export default memo(ShopListScreen);
