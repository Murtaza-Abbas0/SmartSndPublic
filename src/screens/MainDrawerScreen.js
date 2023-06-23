import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '../styling';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSelector, useDispatch } from 'react-redux';

import {
  DashboardScreen,
  ProfileScreen,
  ShopListScreen,
  ProductListScreen,
  OrderSummaryScreen,
  DashboardDetailsScreen,
  ShopCoveredWithoutOrderList,
  TodayBookingList,
} from '../screens/orderbooker';

import {
  DashboardScreenForDeliveryman,
  ProfileScreenOfDeliveryman,
  PendingDeliveriesScreenForDeliveryman,
  DeliveryHistoryScreenForDeliveryman,
} from '../screens/deliveryman';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertMessage } from '../components/snackbar';
import base64 from 'react-native-base64';

const Drawer = createDrawerNavigator();

const ic_avatar = require('../assets/ic_avatar.png');
const ic_profile = require('../assets/ic_profile.png');
const ic_productlist = require('../assets/ic_productlist.png');
const ic_ordersummary = require('../assets/ic_ordersummary.png');
const ic_dashboard = require('../assets/ic_dashboard.png');
const ic_shoplist = require('../assets/ic_shoplist.png');
const ic_logout = require('../assets/ic_logout.png');
const ic_myprofile = require('../../assets/ic_myprofile.png');
const ic_dashboardDetails = require('../assets/ic_dashboardDetails.png')
const ic_Shop_Coverage = require('../assets/ic_Shop_Coverage.png');
const ic_productive_shop = require('../assets/ic_productive_shop.png');
const ic_non_productive_shop = require('../assets/ic_non_productive_shop.png');

function CustomDrawerContent(props) {
  const userData = useSelector(state => state.userAuth.value);

  // console.log('USERDATAAAAAAAAAAA: ', userData);

  const logout = () => {
    // if (GlobalVar.navigation != null) {
    global.userData = null;
    EncryptedStorage.clear();
    AlertMessage.showMessage('Succesfully logout!');
    //   GlobalVar.navigation.reset({
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'MainSignInScreen' }],
    });
    // }
  };

  const navigationForDasboardScreen = () => {
    if (userData?.roleId == 3) {
      props.navigation.navigate('DashboardScreenForDeliveryman');
    } else if (userData?.roleId == 1) {
      props.navigation.navigate('DashboardScreen');
    }
  };

  const navigationForProfileScreen = () => {
    if (userData?.roleId == 3) {
      props.navigation.navigate('ProfileScreenOfDeliveryman', {
        userData: userData,
      });
    } else if (userData?.roleId == 1) {
      props.navigation.navigate('ProfileScreen', { userData: userData });
    }
  };

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <View style={styles.ProfileImageContainer}>
        {/* <Image source={{uri: ConvertedURL}} style={styles.profileIcon} /> */}
        {userData?.imageURL != null ? (
          <Image
            source={{ uri: userData?.imageURL }}
            // source={ic_avatar}
            style={styles.profileIcon}
          />
        ) : (
          <Image source={ic_profile} style={styles.defaultProfileIcon} />
        )}
        <Text style={styles.profileText}>{userData?.name}</Text>
        <Text style={{ fontSize: wp('3%'), color: Colors.backgroundColor }}>
          {userData?.roleName}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.iconButtonContainer}
        onPress={navigationForProfileScreen}>
        <Image source={ic_profile} style={styles.logoutButton} />
        <Text style={styles.drawerText}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButtonContainer}
        onPress={navigationForDasboardScreen}>
        <Image source={ic_dashboard} style={styles.logoutButton} />
        <Text style={styles.drawerText}>Dashboard</Text>
      </TouchableOpacity>

      {userData?.roleId == 3 ? (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            props.navigation.navigate('PendingDeliveriesScreenForDeliveryman');
          }}>
          <Image source={ic_shoplist} style={styles.logoutButton} />
          <Text style={styles.drawerText}>Pending Deliveries</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            props.navigation.navigate('ShopListScreen');
          }}>
          <Image source={ic_shoplist} style={styles.logoutButton} />
          <Text style={styles.drawerText}>View Shops</Text>
        </TouchableOpacity>
      )}
      {userData?.roleId == 3 ? (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            props.navigation.navigate('DeliveryHistoryScreenForDeliveryman');
          }}>
          <Image source={ic_productlist} style={styles.logoutButton} />
          <Text style={styles.drawerText}>Delivery History</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            props.navigation.navigate('ProductListScreen');
          }}>
          <Image source={ic_productlist} style={styles.logoutButton} />
          <Text style={styles.drawerText}>View Products</Text>
        </TouchableOpacity>
      )}
      {/* {userData?.roleId == 3 ? null : (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            props.navigation.navigate('OrderSummaryScreen');
          }}>
          <Image source={ic_ordersummary} style={styles.logoutButton} />
          <Text style={styles.drawerText}>Order Summary</Text>
        </TouchableOpacity>
      )} */}
      {userData?.roleId == 3 ? null : (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            navigation.navigate('DashboardDetailsScreen');
          }}>
          <Image source={ic_dashboardDetails} style={styles.logoutButton} />
          <Text style={styles.drawerText}>Month To Date Sales</Text>
        </TouchableOpacity>
      )}
      {userData?.roleId == 3 ? null : (
        <TouchableOpacity
          style={[styles.nonProdctiveIconContainer, {}]}
          onPress={() => {
            navigation.navigate('ShopCoveredWithoutOrderList');
          }}>
          <Image source={ic_non_productive_shop} style={styles.productiveIcon} />
          <Text style={styles.drawerText}>Non Productive Shops</Text>
        </TouchableOpacity>
      )}
      {userData?.roleId == 3 ? null : (
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={() => {
            navigation.navigate('TodayBookingList');
          }}>
          <Image source={ic_productive_shop} style={styles.logoutButton} />
          <Text style={styles.drawerText}>Productive Shops</Text>
        </TouchableOpacity>
      )}
      {/* <View style={styles.divider} /> */}

      <TouchableOpacity
        onPress={() => {
          logout();
        }}
        style={styles.iconButtonContainer}>
        <Image source={ic_logout} style={[styles.logoutButton, { tintColor: 'white' }]} />
        <Text style={styles.drawerText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MainDrawerScreen() {
  const userData = useSelector(state => state.userAuth.value);

  const options = {
    headerShown: false,
    gestureEnabled: false,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
      // initialRouteName={
      //   userData?.roleId == 3
      //     ? 'DashboardScreenForDeliveryman'
      //     : 'DashboardScreen'
      // }
      >
        {userData?.roleId == 3 ? (
          <Drawer.Screen
            name="DashboardScreenForDeliveryman"
            component={DashboardScreenForDeliveryman}
            options={options}
          />
        ) : (
          <Drawer.Screen
            name="DashboardScreen"
            component={DashboardScreen}
            options={options}
          />
        )}
        <Drawer.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={options}
        />
        <Drawer.Screen
          name="ShopListScreen"
          component={ShopListScreen}
          options={options}
        />
        <Drawer.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={options}
        />
        <Drawer.Screen
          name="ShopCoveredWithoutOrderList"
          component={ShopCoveredWithoutOrderList}
          options={options}
        />
        <Drawer.Screen
          name="OrderSummaryScreen"
          component={OrderSummaryScreen}
          options={options}
        />
        <Drawer.Screen
          name="TodayBookingList"
          component={TodayBookingList}
          options={options}
        />
        <Drawer.Screen
          name="DashboardDetailsScreen"
          component={DashboardDetailsScreen}
          options={options}
        />
        <Drawer.Screen
          name="ProfileScreenOfDeliveryman"
          component={ProfileScreenOfDeliveryman}
          options={options}
        />
        <Drawer.Screen
          name="PendingDeliveriesScreenForDeliveryman"
          component={PendingDeliveriesScreenForDeliveryman}
          options={options}
        />
        <Drawer.Screen
          name="DeliveryHistoryScreenForDeliveryman"
          component={DeliveryHistoryScreenForDeliveryman}
          options={options}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerText: {
    color: Colors.onPrimaryColor,
    fontSize: wp('4%'),
    paddingHorizontal: wp('2%'),
    marginTop: wp('5%'),
    fontWeight: '600',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('3%'),
  },
  divider: {
    marginVertical: wp('4%'),
    width: wp('82.5%'),
    backgroundColor: Colors.onPrimaryColor,
    borderWidth: wp('0.1%'),
  },
  ProfileImageContainer: {
    // backgroundColor: 'pink',
    width: wp('40%'),
    height: wp('40%'),
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: wp('5%'),
    justifyContent: 'center',
  },
  backIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    tintColor: Colors.primaryColor,
  },
  profileIcon: {
    resizeMode: 'contain',
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('30%'),
  },
  profileText: {
    color: Colors.backgroundColor,
    marginVertical: wp('3%'),
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
  },
  logoutButton: {
    resizeMode: 'contain',
    width: wp('4%'),
    height: hp('4%'),
    marginHorizontal: wp('2%'),
    marginTop: wp('4%'),
  },
  logoutIcon: {
    resizeMode: 'contain',
    width: wp('4%'),
    height: hp('4%'),
    marginHorizontal: wp('2%'),
    // marginTop: wp('4%'),
  },
  defaultProfileIcon: {
    resizeMode: 'contain',
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('30%'),
  },
  nonProdctiveIconContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('3%'),
    // backgroundColor: 'pink'
  },
  productiveIcon: {
    resizeMode: 'contain',
    width: wp('4.5%'),
    height: hp('4.5%'),
    marginHorizontal: wp('1.9%'),
    marginTop: wp('3.5%'),
    // backgroundColor: 'green',
  },
});
