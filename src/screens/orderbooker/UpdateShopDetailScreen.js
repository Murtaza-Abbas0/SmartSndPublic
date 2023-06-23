import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../styling';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CommonHeaderWithBackButton from '../../components/Headers/CommonHeaderWithBackButton';
import InputField from '../../components/New folder/InputFieldForUpdateProfile';
import { useDispatch, useSelector } from 'react-redux';
import CityPickerBottomSheet from '../../components/Bottomsheets/CityPickerBottomSheet';
import AreaPickerBottomSheet from '../../components/Bottomsheets/AreaPickerBottomSheet';
import ClassPickerBottomSheet from '../../components/Bottomsheets/ClassPickerBottomSheet';
import MultiSelectionBottomSheet from '../../components/Bottomsheets/MultiSelectionBottomSheet';
import PaymentTermPickerBottomSheet from '../../components/Bottomsheets/PaymentTermPickerBottomSheet';
import VanPickerBottomSheet from '../../components/Bottomsheets/VanPickerBottomSheet';
import { ApiClient, ApiRoute } from '../../network_utils';
import { LoadingModal } from '../../components/modal';
import { AlertMessage } from '../../components/snackbar';
import { useNavigation } from '@react-navigation/native';
import { CheckInMapFeild } from '../../components/maps';

const ic_confirm = require('../../assets/ic_confirm.png');

const ShopDetails = ({ route }) => {
  const userData = useSelector(state => state.userAuth.value);
  const loadingModalRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let { shopDetails } = route?.params;

  console.log('shopDetails', shopDetails);
  // console.log('userData: ', userData)
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState(
    shopDetails?.shopName ? shopDetails?.shopName : '',
  );
  const [phoneNumber, setPhoneNumber] = useState(shopDetails?.ph_Number);
  const [address, setAddress] = useState(
    shopDetails?.shop_Address ? shopDetails?.shop_Address : '',
  );
  const [ownerName, setOwnerName] = useState(shopDetails?.handlingPerson);
  const [channel, setChannel] = useState(shopDetails?.channel);
  const [vatNumber, setVatNumber] = useState(shopDetails?.vat_Number);
  const [creditDays, setcreditDays] = useState(shopDetails?.credit_Days);
  const [maximumLimit, setMaximumLimit] = useState(
    shopDetails?.max_Credit_Limit,
  );
  const [cityId, setCityId] = useState(shopDetails?.city_id);
  const [cityName, setCityName] = useState(shopDetails?.cityName);
  const [areaId, setAreaId] = useState(shopDetails?.area_id);
  const [areaName, setAreaName] = useState(shopDetails?.areaName);
  const [paymentTermId, setPaymentTermId] = useState(
    shopDetails?.paymentType_Id,
  );
  const [paymentTermName, setPaymentTermName] = useState(
    shopDetails?.payment_Type,
  );
  const [shopClassID, setShopClassID] = useState(-1);
  const [shopClassName, setShopClassName] = useState(shopDetails?.shopClass);
  const [vanID, setVanID] = useState(shopDetails?.van_id);
  const [vanName, setVanName] = useState(shopDetails?.vanName);
  const [selectedStperIndex, setSelectedStperIndex] = useState(-1);
  const [prescriptionIds, setPrescriptionIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState([0]);
  const [latLng, setLatlng] = useState({
    latitude: shopDetails?.latiitude ? shopDetails?.latiitude : 0.0,
    longitude: shopDetails?.longitude ? shopDetails?.longitude : 0.0,
  });

  const onSelectPrescriptionTypesCallback = useCallback(
    prescriptionIds => {
      let tempArray = prescriptionIds.split(',').map(id => {
        return parseInt(id);
      });
      // console.log('converted Array : ', tempArray)
      setPrescriptionIds(tempArray);
      // console.log('setPrescriptionIds : ', tempArray)
    },
    [prescriptionIds],
  );

  useEffect(() => {
    let tempArray = shopDetails?.days_Ids.split(',').map(id => {
      return parseInt(id);
    });
    // console.log('converted Array : ', tempArray)
    setPrescriptionIds(tempArray);
  }, [shopDetails?.days_Ids])

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

  const onConfirm = async () => {
    setLoading(true)

    let object = {
      customerID_encryp: shopDetails?.customerId_Encrypted,
      shopName: shopName,
      address: address,
      areaID: areaId,
      phnumber: phoneNumber,
      ownerName: ownerName,
      channel: channel,
      class: shopClassName,
      pamentTypeId: paymentTermId,
      creditDays: creditDays,
      maxCreditlimit: maximumLimit,
      vat_Number: vatNumber,
      salesmanId: userData?.salesMan_Encrypted,
      vanID: vanID,
      visitfrequencyID: 1,
      latitude: latLng ? latLng.latitude + "" : '',
      longitude: latLng ? latLng.longitude + "" : '',
      days: prescriptionIds,
    };
    console.log('object : ', object)

    try {
      await ApiClient.put(
        `${ApiRoute.BASE_URL}${ApiRoute.UPDATE_SHOP_LIST}`,
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
          setLoading(false)
          setIsRefreshing(false);
          // console.log('response: ', response.data)
          if (response.data.isSuccess && response.data.data != null) {
            setTimeout(() => {
              navigation.goBack()
            }, 1000);
            AlertMessage.showMessage(response.data?.message);
            if (response.data?.data.length > 0) setData(response.data?.data);
          } else {
            AlertMessage.showMessage(response.data?.message);
            // console.log('Data : ', response.message)
          }
        })
        .catch(err => {
          // console.log(err)
          setIsRefreshing(false);
          setLoading(false)
          loadingModalRef.current.hide();
          AlertMessage.showMessage(err?.message);
        });
    } catch (e) {
      // console.log('login error => ', e)
      setIsRefreshing(false);
      setLoading(false)
      loadingModalRef.current.hide();
    }
  };

  const onSelectedItemsChange = selectedItems => {
    setItems(selectedItems);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CommonHeaderWithBackButton title={'Update Shop Detail'} />
      {!loading ?
        <TouchableOpacity
          onPress={() => {
            onConfirm();
          }}>
          <Image source={ic_confirm} style={styles.confirmIcon} />
        </TouchableOpacity>
        :
        <ActivityIndicator style={{ alignSelf: 'flex-end', margin: wp('5%') }} size={'small'} />
      }


      <ScrollView style={styles.InputFieldContainer}>
        <Text style={styles.field}>Shop Name:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.shopName}
          value={shopName}
          onChangeText={text => setShopName(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        <Text style={styles.field}>Address:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.shop_Address}
          value={address}
          onChangeText={text => setAddress(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        <Text style={styles.field}>Select City:</Text>
        <CityPickerBottomSheet
          fieledContainerStyle={{ backgroundColor: '#575757' }}
          onSelect={onSelectCityCallback}
          selectedID={cityId}
          selectedValue={cityName}
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
        <Text style={styles.field}>Phone Number:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.ph_Number}
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
        />
        <Text style={styles.field}>Owner Name/ Handling Person:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.handlingPerson}
          value={ownerName}
          onChangeText={text => setOwnerName(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        <Text style={styles.field}>Channel:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.channel}
          value={channel}
          onChangeText={text => setChannel(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
        />
        <Text style={styles.field}>VAT Number:</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.vat_Number}
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
          style={styles.textField}
          placeholder={shopDetails?.credit_Days}
          value={creditDays}
          onChangeText={text => setcreditDays(text)}
          returnKeyType={'next'}
          blurOnSubmit={false}
          keyboardType="decimal-pad"
        />
        <Text style={styles.field}>Maximum Limit (PKR):</Text>
        <TextInput
          style={styles.textField}
          placeholder={shopDetails?.max_Credit_Limit}
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
        />
        {/* <Text style={styles.field} >Select Van:</Text> */}
        <MultiSelectionBottomSheet
          selectedIds={shopDetails?.days_Ids}
          selectedValues={shopDetails?.day_Name}

          onSubmit={onSelectPrescriptionTypesCallback}
        />

        <CheckInMapFeild
          location={latLng}
          onLocationUpdate={onLocationUpdateCallback}
        />

        <View style={{ height: wp('10%') }} />
        <LoadingModal ref={loadingModalRef} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopDetails;

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
