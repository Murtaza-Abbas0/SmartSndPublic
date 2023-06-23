import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, StatusBar, BackHandler, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { LoadingModal } from "../../components/modal";
import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'

const RenderListItem = ({ item, navigation,  }) => {

    const onPressItems = () => {
        console.log('Testing');
        if (item?.title == "Combined Current Month Target") {
            navigation.navigate('DashboardDetailsScreen')
        }
    }

    return (
        <TouchableOpacity onPress={() => onPressItems()} style={styles.listItemContainer}>
            <View style={styles.listItemTitleLabelContainer}>
                <Text style={styles.listItemTitleLabel}>{item?.title}</Text>
            </View>
            <View style={styles.listItemTitleValueContainer}>
                <Text style={styles.listItemValueLabel}>{item?.value}</Text>
            </View>
        </TouchableOpacity>
    )
}

const MonthWiseDashboardScreen = ({ getDataFromChild }) => {

    let tempArr = []

    console.log('Month Wise');

    const navigation = useNavigation();

    let isActive = true;

    const userData = useSelector((state) => state.userAuth.value)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTetra, setIsTetra] = useState(true)
    const [isMonthWise, setIsMonthWise] = useState(false);
    const [isDayWise, setIsDayWise] = useState(true);


    const loadingModalRef = useRef()

    useFocusEffect(
        useCallback(() => {
            getDashboardData()
            return () => isActive = false;
        }, [isDayWise])
    );

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    const getDashboardData = async () => {
        let id = userData?.salesMan_Encrypted
        // console.log('userData : ', userData)
        // loadingModalRef.current.show()

        try {
            await ApiClient.get(`${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_DASHBOARD_MONTHWISE}?Request=${id}`, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false);

                    let { data, message, isSuccess } = response?.data;

                    if (response?.data.isSuccess && response?.data.data != null) {
                        // AlertMessage.showMessage(response?.data.message)

                        console.log('response: ', response.data?.data);
                        if (isDayWise) {
                            tempArr = [
                                {
                                    "title": "Combined Current Month Target",
                                    "value": `PKR ${response?.data?.data[0].value} / ${response?.data?.data[2].value} Cartons`
                                },
                                {
                                    "title": "Combined Month to Date Sales",
                                    "value": `PKR ${response?.data?.data[3].value} / ${response?.data?.data[5].value} Cartons`
                                },
                                {
                                    "title": "Month Target (Tetra)",
                                    "value": `PKR ${response?.data?.data[6].value} / ${response?.data?.data[8].value} Cartons`
                                },
                                {
                                    "title": "Month to Date Sales (Tetra)",
                                    "value": `PKR ${response?.data?.data[9].value} / ${response?.data?.data[11].value} Cartons`
                                },
                                // {
                                //     "title": "Shop Productivity",
                                //     "value": `PKR ${response?.data?.data[17].value} / ${response?.data?.data[16].value} Packs`
                                // },
                                // {
                                //     "title": "Month Target (Sauce)",
                                //     "value": `PKR ${response?.data?.data[8].value} / ${response?.data?.data[9].value} Packs`
                                // },
                                // {
                                //     "title": "Month to Date Sales (Sauce)",
                                //     "value": `PKR ${response?.data?.data[10].value} / ${response?.data?.data[11].value} Packs`
                                // },
                            ];
                        } else {
                            tempArr = [
                                {
                                    "title": "Combined Current Month Target",
                                    "value": `PKR ${response?.data?.data[0].value} / ${response?.data?.data[2].value} Cartons`
                                },
                                {
                                    "title": "Combined Month to Date Sales",
                                    "value": `PKR ${response?.data?.data[3].value} / ${response?.data?.data[5].value} Cartons`
                                },
                                // {
                                //     "title": "Month Target (Tetra)",
                                //     "value": `PKR ${response?.data?.data[4].value} / ${response?.data?.data[5].value} Packs`
                                // },
                                // {
                                //     "title": "Month to Date Sales (Tetra)",
                                //     "value": `PKR ${response?.data?.data[6].value} / ${response?.data?.data[7].value} Packs`
                                // },
                                {
                                    "title": "Month Target (Sauce)",
                                    "value": `PKR ${response?.data?.data[12].value} / ${response?.data?.data[14].value} Cartons`
                                },
                                {
                                    "title": "Month to Date Sales (Sauce)",
                                    "value": `PKR ${response?.data?.data[15].value} / ${response?.data?.data[17].value} Cartons`
                                },
                                // {
                                //     "title": "Shop Productivity",
                                //     "value": `PKR ${response?.data?.data[17].value} / ${response?.data?.data[16].value} Packs`
                                // },
                            ]
                        }

                        // console.log('tempArr: ', tempArr);

                        setData(tempArr)

                    } else {
                        AlertMessage.showMessage(message)
                        // console.log('Data : ',response.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    loadingModalRef.current.hide()
                    setIsRefreshing(false)
                    AlertMessage.showMessage("Test: ", err?.message)
                })

        } catch (e) {
            console.log('login error => ', e)
            setIsRefreshing(false)
            loadingModalRef.current.hide()
        }
    }

    const checkIsMonthWise = () => {
        setIsMonthWise(true)
        setIsDayWise(false)
        console.log('Month wise is on');
    }

    const checkIsDayhWise = () => {
        setIsMonthWise(false)
        setIsDayWise(true)
        console.log('Day wise is on');
    }

    const getModifiedTitleByTitle = (title) => {
        return title.replace(/([A-Z])/g, ' $1').trim()
    }

    const getModifiedValueByTitle = (item) => {
        switch (item?.title) {
            case 'CurrentMonthTarget':
                return 'PKR ' + item?.value + " Packs"
            // case 'CurrentMonthTargetInCount':
            //     return item?.value + ' Packs'
            case 'TodaySaleAmount':
                return 'PKR ' + item?.value
            case 'TodaySaleCount':
                return item?.value + ' Packs'
            case 'MonthToDateAmount':
                return 'PKR ' + item?.value
            case 'AchievedPercentage':
                return item?.value + '%'
            case 'CurrentRunRate':
                return 'PKR ' + item?.value + '/ Day'
            case 'RequiredRunRate':
                return 'PKR ' + item?.value + '/ Day'
            // case 'ShopsProductivity':
            //     return item?.value
            case 'ShopsToVisitToday':
                return item?.value + " Shops"
            case 'TotalShopsVisitedToday':
                return item?.value + " Shops"
            case 'TotalSales':
                return "PKR " + item?.value + " Packs"
            case 'MonthToDate':
                return "PKR " + item?.value + " Packs"
            // case 'DropSize':
            //     return 'PKR ' + item?.value + '/ Shop'
            default:
                break;
        }
    }

    getDataFromChild({
        data: data
    })

    const handleRefresh = () => {
        setIsRefreshing(true);
        setData([]);
        getDashboardData(false);
    };


    return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, flexDirection: 'column', marginBottom: wp('20%') }}>

            <LoadingModal ref={loadingModalRef} />
            <View style={styles.buttonRowContainer} >
                <TouchableOpacity onPress={() => checkIsDayhWise()} style={[styles.toggleButtonContainer, isDayWise ? styles.toggleButtonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isDayWise ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Tetra
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => checkIsMonthWise()} style={[styles.toggleButtonContainer, isMonthWise ? styles.toggleButtonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isMonthWise ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Sauces
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                renderItem={({ item }) => <RenderListItem item={item} navigation={navigation} />}
                keyExtractor={(item, index) => index + '-' + item?.title}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        tintColor={Colors.primaryColor}
                        onRefresh={handleRefresh}
                    />
                }
            // refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={'white'} onRefresh={handleRefresh} />}
            // ListEmptyComponent={
            //     < View style={styles.emptyPlaceHolderContainer} >
            //         <Image source={ic_no_record_found} style={styles.emptyPlaceHolderImage} />
            //         <Text style={styles.emptyPlaceHolderLabel}>{
            //             loading ? 'Loading please wait...' : 'Records not found!'}
            //         </Text>
            //     </View >
            // }
            // ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        fontSize: wp('4%'),
        fontWeight: '600',
        alignSelf: 'center',
        color: Colors.primaryColor,
        marginTop: wp('3%')
    },
    list: {
        flex: 1,
        marginTop: wp('5%')
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
        paddingVertical: wp('2%')
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    buttonLabel: {
        color: Colors.onPrimaryColor,
        fontSize: wp('4%'),
        alignSelf: 'center',
    },
    toggleButtonContainer: {
        backgroundColor: Colors.primaryColor,
        width: wp('30%'),
        height: wp('9%'),
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: wp('7%')
        // borderBottomRightRadius: wp('7%')
    },
    toggleButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    whenSauces: {
        backgroundColor: 'white',
        alignSelf: 'center',
        width: wp('30%'),
        height: wp('11%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('7%'),
        marginTop: wp('3%')
    },
    whenSaucesText: {
        color: 'black',
        fontWeight: 'bold'
    },
    buttonRowContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: wp('4%')
    },
    buttonTextContainer: {
        color: 'white',
    },
    whenButtonOffText: {
        color: 'black'
    },
    whenButtonOff: {
        backgroundColor: 'white',
    },
})


export default React.memo(MonthWiseDashboardScreen);
