import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, Image, ScrollView } from 'react-native'
import { Colors } from "../../styling";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonHeaderWithBackButton from "../../components/Headers/CommonHeaderWithBackButton";

import { AlertMessage } from "../../components/snackbar";
import { LoadingModal } from "../../components/modal";
import { ApiClient, ApiRoute } from "../../network_utils";

const ic_confirm = require('../../assets/ic_confirm.png')
const ic_productprofile = require('../../assets/ic_productprofile.png')


const UpdateProfileDetailScreen = ({ route, navigation }) => {

    let { productDetails } = route?.params

    const loadingModalRef = useRef()


    console.log(productDetails)

    const [productName, setProductName] = useState(productDetails?.name ? productDetails?.name : '')
    const [retialPrice, setRetailPrice] = useState(productDetails?.retailPrice+'')
    const [packSize, setPackSize] = useState(productDetails?.packSize ? productDetails?.packSize : 0)
    const [weight, setWeight] = useState(productDetails?.pieceWeight ? productDetails?.pieceWeight : 0)
    const [shelfLife, setShelfLife] = useState(productDetails?.shelfLife ? productDetails?.shelfLife : '')

    const onConfirm = () => {
        // {"invoicePrice": 10, "name": "Panadol Cold", "packSize": "4", "perPiecePrice": 4, "picture": "http://13.13.13.14:1100/ProductPictures//Product/2680a107-65fa-45b8-aaf5-68fa19b8da23.jpg", "pieceWeight": "4", "product_Id": 54, "retailPrice": 10, "shelfLife": "10 days", "totalCount": 50}

        let object = {
            "productId": productDetails?.product_Id,
            "productName": productName,
            "packSize": parseInt(packSize),
            "pieceWeight": parseInt(weight),
            "perPiecePrice": productDetails?.perPiecePrice,
            "retailPrice": parseFloat(retialPrice),
            "shelfLife": shelfLife,
            "invoicePrice": productDetails?.invoicePrice,
            "imageURL": productDetails?.picture ? productDetails?.picture : null
        }

        // console.log('object : ', object)
        updateProduct(object)
    }


    const updateProduct = async (object) => {

        console.log('object : ',object)
        loadingModalRef.current.show()


        try {
            await ApiClient.put(`${ApiRoute.BASE_URL}${ApiRoute.UPDATE_PRODUCT_DETAILS}`, object, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    if (response.data.isSuccess && response.data.data != null) {
                        AlertMessage.showMessage(response.data?.message)
                        // console.log('Data : ', response?.data)
                        setTimeout(()=>{
                            navigation.goBack()                       
                        },2000)
                    } else {
                        AlertMessage.showMessage(response.data?.message)
                        // console.log('Data : ',response.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    loadingModalRef.current.hide()
                    AlertMessage.showMessage(err?.message)
                })

        } catch (e) {
            console.log('login error => ', e)
            loadingModalRef.current.hide()
        }
    }



    return (
        <SafeAreaView style={styles.mainContainer} >
            <CommonHeaderWithBackButton title={'Update Product Detail'} />
            <TouchableOpacity onPress={onConfirm} >
                <Image source={ic_confirm} style={styles.confirmIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.productProfilePictureContainer} >
                <Image source={ic_productprofile} style={styles.productProfilePicture} />
            </TouchableOpacity>
            <ScrollView style={styles.InputFieldContainer} >
                <Text style={styles.field} >Product Name:</Text>
                <TextInput
                    style={styles.textField}
                    placeholder='Product Name'
                    value={productName}
                    onChangeText={text => setProductName(text)}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                />
                <Text style={styles.field} >Pack Size:</Text>
                <TextInput
                    style={styles.textField}
                    placeholder='Pack Size'
                    value={packSize}
                    onChangeText={text => setPackSize(text)}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    keyboardType="decimal-pad"
                />

                <Text style={styles.field} >Weight:</Text>
                <TextInput
                    style={styles.textField}
                    placeholder='Weight'
                    value={weight}
                    onChangeText={text => setWeight(text)}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    keyboardType="decimal-pad"
                />
                <Text style={styles.field} >Retail Price:</Text>
                <TextInput
                    style={styles.textField}
                    placeholder='Retail Price'
                    value={retialPrice}
                    onChangeText={text => setRetailPrice(text)}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    keyboardType="decimal-pad"
                />
                <Text style={styles.field} >Shelf Life (In Days):</Text>
                <TextInput
                    style={styles.textField}
                    placeholder='Shelf Life'
                    value={shelfLife}
                    onChangeText={text => setShelfLife(text)}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    keyboardType="decimal-pad"
                />
                <View style={{ height: wp('5%') }} />
                <LoadingModal ref={loadingModalRef} />

            </ScrollView>
        </SafeAreaView>
    )
}


export default UpdateProfileDetailScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
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
        marginTop: wp('4%')
    },
    confirmIcon: {
        resizeMode: 'contain',
        width: wp('6%'),
        height: wp('6%'),
        alignSelf: 'flex-end',
        marginRight: wp('3%'),
        marginTop: wp('3%')
    },
    productProfilePicture: {
        resizeMode: 'contain',
        width: wp('35%'),
        height: wp('35%')
    },
    productProfilePictureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: wp('35%'),
        height: wp('35%'),
    }
})