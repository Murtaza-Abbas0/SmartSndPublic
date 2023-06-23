import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from "../../styling";
import RNFetchBlob from 'rn-fetch-blob';
import { AlertMessage } from "../../components/snackbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonHeaderWithBackButtonForBookOrder } from "../../components/Headers";
const ic_qrcode = require('../../assets/ic_qrcode.png')

const BookOrderBarcodeScreen = () => {

    const REMOTE_IMAGE_PATH =
        'https://www.emoderationskills.com/wp-content/uploads/2010/08/QR1.jpg'
    const checkPermission = async () => {

        if (Platform.OS === 'ios') {
            downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'App needs access to your storage to download photos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Storage Permission Granted.');
                    downloadImage();
                } else {
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const downloadImage = () => {

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = REMOTE_IMAGE_PATH;
        // Getting the extention of the file
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                // Related to the Android only
                useDownloadManager: true,
                notification: true,
                path:
                    PictureDir +
                    '/image_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    ext,
                description: 'Image',
            },
        };
        config(options)
            .fetch('GET', image_URL)
            .then(res => {
                // console.log('res -> ', JSON.stringify(res));
                AlertMessage.showMessage('Image Downloaded Successfully.')
            });
    };

    const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ?
            /[^.]+$/.exec(filename) : undefined;
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }} >
            <CommonHeaderWithBackButtonForBookOrder title={'QR Code'} />
                <View style={styles.mainContainer} >
                    <Image source={ic_qrcode} style={styles.qrCodeImage} />
                </View>
                <View style={styles.ButtonsContainer} >
                    <TouchableOpacity onPress={checkPermission} style={styles.printButtonContainer} >
                        <Text style={styles.printButtonText} >Save</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.printButtonContainer} >
                        <Text style={styles.printButtonText} >Print</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default BookOrderBarcodeScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    qrCodeImage: {
        resizeMode: "contain",
        width: wp('100%'),
        height: wp('100%')
    },
    printButtonContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('43%'),
        height: wp('13%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: wp('3%'),
        // position: 'absolute',
        // bottom: wp('10%')
    },
    printButtonText: {
        color: Colors.onPrimaryColor,
        fontSize: wp('4%'),
        fontWeight: "800"
    },
    ButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
        // backgroundColor: 'pink'
    }
})