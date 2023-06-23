import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { Colors } from '../../styling';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CommonHeaderWithBackButton from '../../components/Headers/CommonHeaderWithBackButton';
import InputField from '../../components/New folder/InputFieldForUpdateProfile';
import { useDispatch, useSelector } from 'react-redux';
import { AlertMessage } from '../snackbar';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {
  CityPickerBottomSheet,
  AreaPickerBottomSheet,
  ClassPickerBottomSheet,
  MultiSelectionBottomSheet,
  PaymentTermPickerBottomSheet,
  VanPickerBottomSheet,
} from '../Bottomsheets';
import { ApiClient, ApiRoute } from '../../network_utils';
import { CheckInMapFeild } from '../maps';

const ic_confirm = require('../../assets/ic_confirm.png');

const ShopDetails = () => {
  const navigation = useNavigation();

  const userData = useSelector(state => state.userAuth.value);

  const [shopName, setShopName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [channel, setChannel] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [creditDays, setcreditDays] = useState('');
  const [maximumLimit, setMaximumLimit] = useState('');
  const [cityId, setCityId] = useState(-1);
  const [cityName, setCityName] = useState('');
  const [areaId, setAreaId] = useState(-1);
  const [areaName, setAreaName] = useState('');
  const [paymentTermId, setPaymentTermId] = useState(-1);
  const [paymentTermName, setPaymentTermName] = useState('');
  const [shopClassID, setShopClassID] = useState(-1);
  const [shopClassName, setShopClassName] = useState('');
  const [vanID, setVanID] = useState(-1);
  const [vanName, setVanName] = useState('');
  const [selectedStperIndex, setSelectedStperIndex] = useState(-1);
  const [prescriptionIds, setPrescriptionIds] = useState([]);
  const [latLng, setLatlng] = useState(null);

  const onSelectPrescriptionTypesCallback = useCallback(
    prescriptionIds => {
      let tempArray = prescriptionIds.split(',').map(id => {
        return parseInt(id);
      });
      // console.log('converted Array : ', tempArray)
      setPrescriptionIds(tempArray);
      // console.log('TempArray: ', tempArray);
    },
    [prescriptionIds],
  );

  const onSelectCityCallback = useCallback(
    city => {
      setCityId(city?.city_Id);
      setCityName(city?.cityName);
    },
    [selectedStperIndex],
  );
  const onSelectVanCallback = useCallback(
    van => {
      setVanID(van?.van_Id);
      setVanName(van?.name);
    },
    [selectedStperIndex],
  );
  const onSelectAreaCallback = useCallback(
    area => {
      setAreaId(area?.area_ID);
      setAreaName(area?.areaName);
    },
    [selectedStperIndex],
  );
  const onSelectshopClassCallback = useCallback(
    shopClass => {
      setShopClassID(shopClass?.shopClassID);
      setShopClassName(shopClass?.name);
    },
    [selectedStperIndex],
  );
  const onSelectPaymentTermCallback = useCallback(
    paymentTerm => {
      setPaymentTermId(paymentTerm?.paymentTermID);
      setPaymentTermName(paymentTerm?.name);
    },
    [selectedStperIndex],
  );
  const onLocationUpdateCallback = useCallback((locationData) => {
    console.log('location data : ', locationData)
    setLatlng({
      latitude: locationData.latitude,
      longitude: locationData.longitude
    })
  }, [latLng]);

  let confirmId = 0

  console.log('confirmId Outside func', confirmId);
  const onConfirm = () => {

    confirmId += 1
    // console.log(`${ApiRoute.BASE_URL}${ApiRoute.INSERT_NEW_CUSTOMERS}`)
    // console.log('onConfirm executes')
    console.log('confirmId inside func', confirmId);

    if (confirmId == 1) {
      let object = {
        shopName: shopName,
        address: address,
        areaID: areaId,
        phnumber: phoneNumber,
        ownerName: shopName,
        channel: channel,
        class: shopClassName,
        pamentTypeId: 1,
        creditDays: creditDays,
        maxCreditlimit: maximumLimit,
        vat_Number: vatNumber,
        salesmanId: userData?.salesMan_Encrypted,
        vanID: 1,
        visitfrequencyID: 1,
        latitude: latLng ? latLng.latitude + "" : '',
        longitude: latLng ? latLng.longitude + "" : '',
        days: prescriptionIds,
      };

      // if (
      //   shopName == '' ||
      //   address == '' ||
      //   areaId == -1 ||
      //   phoneNumber == '' ||
      //   ownerName == '' ||
      //   channel == '' ||
      //   shopClassName == '' ||
      //   paymentTermId == -1 ||
      //   creditDays == '' ||
      //   maximumLimit == '' ||
      //   vatNumber == '' ||
      //   vanID == -1 ||
      //   prescriptionIds == [] ||
      //   latLng == null
      // ) 
      if (
        shopName == ''
      ) {
        AlertMessage.showMessage('Please Fill Out Every Field!');
      } else {
        console.log('object:', object);
        // return;
        try {
          ApiClient.post(
            `${ApiRoute.BASE_URL}${ApiRoute.INSERT_NEW_CUSTOMERS}`,
            object,
            {
              headers: {
                Accept: 'text/plain',
                'Content-Type': 'application/json',
              },
            },
          )
            .then(async response => {
              // loadingModalRef.current.hide()
              // setIsRefreshing(false)
              // console.log('response: ', response.data);
              if (response.data.isSuccess && response.data.data != null) {
                AlertMessage.showMessage(response.data?.message);
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              } else {
                AlertMessage.showMessage(response.data?.message);
              }
            })
            .catch(err => {
              console.log(err);
              // setIsRefreshing(false)
              // loadingModalRef.current.hide()
              AlertMessage.showMessage(err?.message);
            });
        } catch (e) {
          console.log('login error => ', e);
          setIsRefreshing(false);
          loadingModalRef.current.hide();
        }
      }
    } else {
      null
    }
  };

  const onSelectedItemsChange = selectedItems => {
    setItems(selectedItems);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <CommonHeaderWithBackButton title={'Update Shop Detail'} /> */}
      <TouchableOpacity onPress={() => onConfirm()}>
        <Image source={ic_confirm} style={styles.confirmIcon} />
      </TouchableOpacity>
      <ScrollView style={styles.InputFieldContainer}>
        <Text style={styles.field}>Shop Name:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Shop Name"
          value={shopName}
          onChangeText={text => setShopName(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        {/* <Text style={styles.field}>Address:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        /> */}
        <Text style={styles.field}>Select City:</Text>
        <CityPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectCityCallback}
          // selectedID={cityId}
          // selectedValue={cityName}
          selectedID={0}
          selectedValue={'Karachi'}
          labelTitle={'Select City'}
          headerTitle={'City'}
        />
        <Text style={styles.field}>Select Area:</Text>
        <AreaPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectAreaCallback}
          selectedID={areaId}
          selectedValue={areaName}
          labelTitle={'Select Area'}
          headerTitle={'Area'}
        />
        {/* <Text style={styles.field}>Phone Number:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
          maxLength={11}
        /> */}
        {/* <Text style={styles.field}>Owner Name/ Handling Person:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Owner Name"
          value={ownerName}
          onChangeText={text => setOwnerName(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        /> */}
        {/* <Text style={styles.field}>Channel:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Channel"
          value={channel}
          onChangeText={text => setChannel(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        <Text style={styles.field}>VAT Number:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="VAT Number"
          value={vatNumber}
          onChangeText={text => setVatNumber(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
        />
        <Text style={styles.field}>Select Payment Term:</Text>
        <PaymentTermPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectPaymentTermCallback}
          selectedID={paymentTermId}
          selectedValue={paymentTermName}
          labelTitle={'Select Payment Term'}
          headerTitle={'Payment Term'}
        />
        <Text style={styles.field}>Credit Days:</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Credit Days"
          value={creditDays}
          onChangeText={text => setcreditDays(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
        />
        <Text style={styles.field}>Maximum Limit (PKR):</Text>
        <TextInput
          // placeholderTextColor={'black'}
          style={styles.textField}
          placeholder="Maximum Limit"
          value={maximumLimit}
          onChangeText={text => setMaximumLimit(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
        />
        <Text style={styles.field}>Select Shop Class:</Text>
        <ClassPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectshopClassCallback}
          selectedID={shopClassID}
          selectedValue={shopClassName}
          labelTitle={'Select Shop Class'}
          headerTitle={'Shop Class'}
        />
        <Text style={styles.field}>Select Van:</Text>
        <VanPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectVanCallback}
          selectedID={vanID}
          selectedValue={vanName}
          labelTitle={'Select Van'}
          headerTitle={'Van'}
          defaultValue={'Select Van'}
        /> */}
        {/* <Text style={styles.field} >Select Days:</Text> */}
        <MultiSelectionBottomSheet
          onSubmit={onSelectPrescriptionTypesCallback}
          selectedIds={''}
          selectedValues={''}
        />

        {/* <CheckInMapFeild
          location={null}
          onLocationUpdate={onLocationUpdateCallback}
        /> */}

        <View style={{ height: wp('10%') }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(ShopDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  InputFieldContainer: {
    marginVertical: wp('3%'),
  },
  textField: {
    borderBottomWidth: wp('0.1%'),
    height: wp('13%'),
    width: wp('90%'),
    alignSelf: 'center',
    borderBottomColor: Colors.textColorLight,
    marginTop: wp('1%'),
    fontSize: wp('4%'),
    color: 'black',
  },
  field: {
    marginLeft: wp('5%'),
    color: Colors.primaryColor,
    marginTop: wp('4%'),
  },
  confirmIcon: {
    resizeMode: 'contain',
    width: wp('6%'),
    height: wp('6%'),
    alignSelf: 'flex-end',
    marginRight: wp('3%'),
    marginTop: wp('3%'),
  },
});
