// import React from 'react'
// import { View, Text, StyleSheet } from 'react-native'

// const UpdateProfileOfDeliveryman = () => {
//     return(
//         <View style={styles.mainContainer} >
//             <Text>This is update profile screen</Text>
//         </View>
//     )
// }

// export default UpdateProfileOfDeliveryman;

// const styles = StyleSheet.create({
//     mainContainer:{
//         flex:1
//     }
// })
import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CommonHeaderWithBackButton from '../../components/Headers/CommonHeaderWithBackButton';
import InputFieldForUpdateProfile from '../../components/New folder/InputFieldForUpdateProfile';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {VanPickerBottomSheet} from '../../components/Bottomsheets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../../styling';
import {ApiClient, ApiRoute} from '../../network_utils';
import {AlertMessage} from '../../components/snackbar';
import {LoadingModal} from '../../components/modal';
import {login} from '../../stores/slices/userAuthSlice';
import BirthdayPicker from '../../components/DatePicker/BirthdayPicker';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import base64 from 'react-native-base64';

const ic_myprofile = require('../../assets/ic_myprofile.png');
const ic_confirm = require('../../assets/ic_confirm.png');

const UpdateProfileOfDeliveryman = ({route}) => {
  const loadingModalRef = useRef();
  let {userData} = route.params;

  // console.log('USERDATA: ', userData);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [vanId, setVanId] = useState(userData?.van_Id);
  const [vanName, setVanName] = useState(userData?.vanName);
  const [selectedStperIndex, setSelectedStperIndex] = useState(-1);

  const [startDate, setStartDate] = useState(userData?.dateOfBirth);
  const [userName, setUserName] = useState(userData?.name);
  const [contactNo, setContactNo] = useState(userData?.contactNo);
  const [Data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  const [visible, setIsVisible] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [convertedImagePath, setConvertedImagePath] = useState(null);

  const onSelectStartDateCallback = useCallback(
    date => {
      setStartDate(date);
    },
    [startDate],
  );

  const onSelectVanCallback = useCallback(
    van => {
      setVanId(van?.van_Id);
      setVanName(van?.name);
      // console.log('vanId', vanId)
    },
    [selectedStperIndex],
  );

  // const userData = useSelector((state) => state.userAuth.value)

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // console.log('User Data: ', userData)

  // console.log('selectedImagePath: ', selectedImagePath);

  const captureImage = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true,
      freeStyleCropEnabled: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    })
      .then(image => {
        // console.log('Image: ', image?.path);
        setConvertedImagePath(image?.data);
        setSelectedImagePath(image?.path);
        // const convertedImagePathForRequestBody = base64.decode(selectedImagePath)
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateOrderBookerProfile = async (
    showLoadingModal,
    pageNo,
    searchKey,
  ) => {
    // console.log(convertedImagePath);

    // console.log('userData: ', userData)
    // console.log('BASE URL:',`${ApiRoute.BASE_URL}${ApiRoute.UPDATE_DELIVERYMAN_PROFILE}`);
    let updateData = userData;
    updateData.name = userName;
    updateData.contactNo = contactNo;
    updateData.van_Id = vanId;
    updateData.vanName = vanName;
    updateData.dateOfBirth = startDate;
    // updateData.imageURL = convertedImagePath ? convertedImagePath : userData.imageURL;
    // updateData.imageURL = null
    // updateData.image = conver
    // updateData.imageURL = selectedImagePath;

    // console.log('updated data : ', updateData);

    let object = {
      usr_id_enc: userData?.userId_Encrypted,
      dateOfBirth: startDate,
      imageURL: convertedImagePath ? null : userData.imageURL,
      image: convertedImagePath ? convertedImagePath : null,
      contactNo: contactNo,
      van_Id: vanId,
      salesmanId_Enc: userData?.salesMan_Encrypted,
      deliverymanId_Enc: userData?.deliveryMan_Encrypted,
      name: userName,
      email: userData?.email,
    };

    // console.log("updateData: ", updateData)
    // console.log('object: ', object);
    // return
    if (userName != '' && contactNo != '' && contactNo.length == 11) {
      try {
        await ApiClient.put(
          `${ApiRoute.BASE_URL}${ApiRoute.UPDATE_DELIVERYMAN_PROFILE}`,
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
            // console.log('response: ', response.data);
            if (response.data.isSuccess && response.data.data != null) {
              // setTimeout(() => {
              setSelectedImagePath(response.data?.imageURL);
              updateData.imageURL = response.data.data?.imageURL;

              // console.log('IMAGE: ', response.data.data?.imageURL);

              // dispatch(userData(updateData))
              dispatch(login(updateData));
              global.UserData = updateData;
              navigation.navigate('DashboardScreenForDeliveryman');
              setTimeout(() => {
                // console.log('USERDATAAAAAAAAAAAA: ', userData)
              }, 5000);
              // console.log('Data : ', response?.data)
              AlertMessage.showMessage(response.data?.message);
              if (response.data?.data.length > 0) setData(response.data?.data);
            } else {
              AlertMessage.showMessage(response.data?.message);
              // console.log('Data : ', response.message)
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
    } else {
      AlertMessage.showMessage('Please Fill All Required Field!');
    }
  };

  const onInputChange = e => {
    const value = e;

    const re = /^[a-zA-Z ]*$/;
    if (value === '' || re.test(value)) {
      setUserName(value);
    } else {
      AlertMessage.showMessage('Numbers Are Not Allowed In Name!');
    }
  };

  // const getImage = () => {
  //   // userData?.imageURL? userData?.imageURL: selectedImagePath?selectedImagePath:
  //   // if (userData?.imageURL) {
  //   //   return {uri: userData?.imageURL};
  //   // } else if (selectedImagePath) {
  //   //   return {uri: selectedImagePath};
  //   // } else {
  //   //   return ic_myprofile;
  //   // }
  //   if (selectedImagePath != null && userData?.imageURL == null) {
  //     return ic_myprofile;
  //   } else if (selectedImagePath != null) {
  //     return {uri: selectedImagePath};
  //   } else if (userData?.imageURL != null && selectedImagePath == null) {
  //     return {uri: userData?.imageURL};
  //   }
  // };

  const getImage = () => {
    // userData?.imageURL? userData?.imageURL: selectedImagePath?selectedImagePath:
    // if (userData?.imageURL) {
    //   return {uri: userData?.imageURL};
    // } else if (selectedImagePath) {
    //   return {uri: selectedImagePath};
    // } else {
    //   return ic_myprofile;
    // }
    if (selectedImagePath == null && userData?.imageURL == null) {
      return ic_myprofile;
    } else if (selectedImagePath != null) {
      return {uri: selectedImagePath};
    } else if (userData?.imageURL != null && selectedImagePath == null) {
      return {uri: userData?.imageURL};
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{width: '100%', height: '100%'}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <CommonHeaderWithBackButton title={'Update Profile Detail'} />
          <TouchableOpacity onPress={updateOrderBookerProfile}>
            <Image source={ic_confirm} style={styles.confirmIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => captureImage()}>
            {/* <Image source={getImage()} style={styles.myProfileImage} /> */}
            <Image source={getImage()} style={styles.myProfileImage} />
          </TouchableOpacity>

          <ImageView
            images={[selectedImagePath]}
            imageIndex={0}
            visible={visible}
            swipeToCloseEnabled={false}
            onRequestClose={() => setIsVisible(false)}
          />
          <View style={{width: wp('100%'), height: wp('100%')}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.field}>Full Name:</Text>
              {userName == '' ? (
                <Text
                  style={{color: 'red', fontSize: wp('4%'), margin: wp('1%')}}>
                  *
                </Text>
              ) : null}
            </View>
            <TextInput
              style={styles.textField}
              placeholder={'Please Enter Your Name'}
              value={userName}
              onChangeText={onInputChange}
              returnKeyType={'next'}
              blurOnSubmit={false}
            />

            <Text style={styles.field}>Select Van</Text>
            <VanPickerBottomSheet
              fieledContainerStyle={{backgroundColor: '#575757'}}
              onSelect={onSelectVanCallback}
              selectedID={vanId}
              selectedValue={vanName}
              labelTitle={'Select Van'}
              headerTitle={'Van'}
              defaultValue={userData?.vanName}
            />
            <Text style={styles.field}>Select Birthday</Text>
            <BirthdayPicker
              onSelectDate={onSelectStartDateCallback}
              selectedDate={startDate}
              labelTitle={userData?.dateOfBirth}
            />
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.field}>Contact Number:</Text>
              {contactNo == '' ? (
                <Text
                  style={{color: 'red', fontSize: wp('4%'), margin: wp('1%')}}>
                  *
                </Text>
              ) : null}
            </View>
            <TextInput
              style={styles.textField}
              placeholder={'Please Enter Contact Number'}
              value={contactNo}
              onChangeText={text => setContactNo(text)}
              returnKeyType={'next'}
              blurOnSubmit={false}
              keyboardType="decimal-pad"
              maxLength={11}
            />
          </View>
          <LoadingModal ref={loadingModalRef} />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfileOfDeliveryman;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myProfileImage: {
    resizeMode: 'contain',
    width: wp('32%'),
    height: wp('32%'),
    alignSelf: 'center',
    marginTop: wp('10%'),
    borderRadius: wp('100%'),
  },
  confirmIcon: {
    resizeMode: 'contain',
    width: wp('6%'),
    height: wp('6%'),
    alignSelf: 'flex-end',
    marginRight: wp('3%'),
    marginTop: wp('3%'),
  },
  field: {
    marginLeft: wp('5%'),
    marginTop: wp('3%'),
    color: Colors.primaryColor,
  },
  textField: {
    borderBottomWidth: wp('0.1%'),
    height: wp('13%'),
    width: wp('90%'),
    alignSelf: 'center',
    borderBottomColor: Colors.textColorLight,
    marginTop: wp('1%'),
    fontSize: wp('4%'),
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
