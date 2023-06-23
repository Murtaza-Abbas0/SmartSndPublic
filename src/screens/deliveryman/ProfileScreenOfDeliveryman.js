import 'react-native-gesture-handler';
import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StackActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styling';
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import FieldForMyProfile from '../../components/New folder/FieldForMyProfile';
import base64 from 'react-native-base64';

const ic_myprofile = require('../../assets/ic_myprofile.png');
const ic_edit = require('../../assets/ic_edit.png');

const ProfileScreenOfDeliveryman = ({route, navigation}) => {
  let {userData} = route.params;
  // const userData = useSelector((state) => state.userAuth.value)

  // console.log('userData: ', userData);


  
  return (
    <View>
      <CommonHeaderWithDrawerButton title={'Profile'} />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UpdateProfileOfDeliveryman', {userData: userData})
        }>
        <Image source={ic_edit} style={styles.editIcon} />
      </TouchableOpacity>
      <View style={{alignItems:'center', width:wp('100%'), height:wp('40%')}} >
        {userData?.imageURL != null ? 
          <Image
            source={{uri: userData?.imageURL}}
            style={styles.profileIcon}
          />
         : 
          <Image source={ic_myprofile} style={styles.defaultProfileIcon} />
        }
        <Image source={{uri: userData?.image}} style={styles.myProfileImage} />
      </View>
      <View>
        <FieldForMyProfile Field={'Full Name'} Value={userData?.name} />
        <FieldForMyProfile
          Field={'Date Of Birth'}
          Value={userData?.dateOfBirth}
        />
        <FieldForMyProfile Field={'Contact'} Value={userData?.contactNo} />
      </View>
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
  myProfileImage: {
    resizeMode: 'contain',
    width: wp('32%'),
    height: wp('32%'),
    alignSelf: 'center',
    marginTop: wp('10%'),
    borderRadius: wp('25%'),
  },
  editIcon: {
    alignSelf: 'flex-end',
    resizeMode: 'contain',
    width: wp('6%'),
    height: wp('6%'),
    marginRight: wp('3%'),
    marginTop: wp('3%'),
  },
  profileIcon: {
    resizeMode: 'contain',
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('30%'),
  },
  defaultProfileIcon: {
    resizeMode: 'contain',
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('30%'),
  },
});

export default ProfileScreenOfDeliveryman;
