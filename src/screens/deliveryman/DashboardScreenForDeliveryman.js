import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  RefreshControl
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ApiClient, ApiRoute } from '../../network_utils';
import { AlertMessage } from '../../components/snackbar';
import { LoadingModal } from '../../components/modal';
import { Colors } from '../../styling';
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import DashboardCards from '../../components/New folder/DashbaordCards';
import { useFocusEffect } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';

const DashboardScreenForDeliveryman = ({ route, navigation }) => {
  let isActive = true;

  const userData = useSelector(state => state.userAuth.value);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadingModalRef = useRef();

  useFocusEffect(
    useCallback(() => {
      getDashboardData();
      return () => (isActive = false);
    }, []),
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  const getDashboardData = async () => {
    let id = userData?.userId_Encrypted;
    // console.log('userData : ',userData)
    loadingModalRef.current.show();

    try {
      await ApiClient.get(
        `${ApiRoute.BASE_URL}${ApiRoute.DELIVERYMAN_DASHBOARD}`,
      )
        .then(async response => {
          loadingModalRef.current.hide();
          setIsRefreshing(false);
          if (response.data.isSuccess && response.data.data != null) {
            console.log('Data : ', response?.data);
            // AlertMessage.showMessage(response.data?.message);
            if (isActive) setData(response.data?.data);
          } else {
            AlertMessage.showMessage(response.data?.message);
            // console.log('Data : ',response.message)
          }
        })
        .catch(err => {
          console.log(err);
          loadingModalRef.current.hide();
          setIsRefreshing(false);
          AlertMessage.showMessage(err?.message);
        });
    } catch (e) {
      console.log('login error => ', e);
      loadingModalRef.current.hide();
      setIsRefreshing(false);
    }
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setData([]);
    getDashboardData(false);
  };

  const renderListItem = ({ item, index }) => {
    console.log('ITEM: ', item)
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemTitleLabelContainer}>
          <Text style={styles.listItemTitleLabel}>
            {/* {getModifiedTitleByTitle(item?.title)} */}
            {item?.title}
          </Text>
        </View>
        <View style={styles.listItemTitleValueContainer}>
          <Text style={styles.listItemValueLabel}>
            {/* {getModifiedValueByTitle(item)} */}
            {item?.value}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'column',
      }}>
      <CommonHeaderWithDrawerButton title={'Dashboard'} />
      <Text style={styles.header}>Delivery Man Performance Dashboard(Current Month)</Text>
      <LoadingModal ref={loadingModalRef} />

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index + '-' + item?.title}
        refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={'white'} onRefresh={handleRefresh} />}
      // ListEmptyComponent={
      //   < View style={styles.emptyPlaceHolderContainer} >
      //     <Image
      //       // source={ic_no_record_found}
      //       style={styles.emptyPlaceHolderImage} />
      //     <Text style={styles.emptyPlaceHolderLabel}>{
      //       loading ? 'Loading please wait...' : 'Records not found!'}
      //     </Text>
      //   </View >
      // }
      // ListFooterComponent={renderFooter}
      />

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('MakeNewOrderScreen')}
        style={styles.buttonContainer}>
        <Text style={styles.buttonLabel}>Make New Order</Text>
      </TouchableOpacity> */}
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
  header: {
    fontSize: wp('4%'),
    fontWeight: '600',
    alignSelf: 'center',
    color: Colors.primaryColor,
    marginTop: wp('3%'),
  },
  list: {
    flex: 1,
    marginTop: wp('5%'),
  },
  listItemContainer: {
    width: wp('85%'),
    alignSelf: 'center',
    flexDirection: 'column',
    marginVertical: wp('2%'),
  },
  listItemTitleLabelContainer: {
    backgroundColor: Colors.primaryColor,
    borderTopStartRadius: wp('2%'),
    borderTopEndRadius: wp('2%'),
    paddingVertical: wp('2%'),
  },
  listItemTitleValueContainer: {
    backgroundColor: Colors.primaryColorLight,
    borderBottomStartRadius: wp('2%'),
    borderBottomEndRadius: wp('2%'),
    paddingVertical: wp('2%'),
  },
  listItemTitleLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
  listItemValueLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    height: wp('12%'),
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp('3%'),
    marginVertical: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    position: 'absolute',
    bottom: wp('2%'),
  },
  buttonLabel: {
    color: Colors.onPrimaryColor,
    fontSize: wp('4%'),
    alignSelf: 'center',
  },
});

export default DashboardScreenForDeliveryman;
