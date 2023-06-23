import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';


import { Colors } from '../../styling';

import { useNavigation } from '@react-navigation/native';
import { AlertMessage } from '../snackbar';

const ic_options = require('../../assets/ic_options.png');

const ShopListItem = ({ item, index }) => {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const openShopDetails = item => {
    hideMenu();
    navigation.navigate('ShopDetailScreen', { shopDetails: item });
  };

  const updateShop = item => {
    hideMenu();
    navigation.navigate('UpdateShopDetailScreen', { shopDetails: item });
  };

  const viewLocation = item => {
    // console.log('item: ', item)
    hideMenu();
    if (item?.latiitude && item?.longitude != 0.0) {
      navigation.navigate('ViewShopLocationScreen', { shopDetails: item })
    } else {
      AlertMessage.showMessage('Please Enter Location')
    }
  };

  const addLocation = item => {
    hideMenu();
    navigation.navigate('AddStoreLocationScreen', { shopDetails: item })
  };

  return (
    <View style={styles.itemsContainer}>
      <View style={styles.shopAndAreaContainer}>
        <Text style={styles.shopName}>{item?.shopName}</Text>
        <Text style={styles.shopArea}>{item?.areaName}</Text>
      </View>
      {/* <Text style={styles.ShopClassText}>{item?.shopClass}</Text> */}
      <Text style={styles.ShopVisitDatText}>{item?.day_Name}</Text>
      <TouchableOpacity onPress={showMenu} style={styles.editIconContainer}>
        <Image source={ic_options} style={styles.editIcon} />
      </TouchableOpacity>
      <Menu visible={visible} onRequestClose={hideMenu}>
        <MenuItem textStyle={{ color: 'black' }} style={styles.menuItem} onPress={() => updateShop(item)}>
          Update Shop Detail
        </MenuItem>
        <MenuDivider />
        <MenuItem
          textStyle={{ color: 'black' }}
          style={styles.menuItem}
          onPress={() => {
            openShopDetails(item);
          }}>
          Shop Detail
        </MenuItem>
        <MenuDivider />
        <MenuItem
          textStyle={{ color: 'black' }}
          style={styles.menuItem}
          onPress={() => {
            viewLocation(item);
          }}>
          View Location
        </MenuItem>
        <MenuDivider />
        <MenuItem
          textStyle={{ color: 'black' }}
          style={styles.menuItem}
          onPress={() => {
            addLocation(item);
          }}>
          Add Location
        </MenuItem>
      </Menu>
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
    width: wp('40%'),
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
    width: wp('40%'),
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
    color: 'black',

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
});

export default memo(ShopListItem);
