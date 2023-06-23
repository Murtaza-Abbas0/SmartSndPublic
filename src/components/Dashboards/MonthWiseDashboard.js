import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, StatusBar, BackHandler, Text, Image, TouchableOpacity, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ApiClient, ApiRoute } from "../../network_utils";
import { AlertMessage } from "../../components/snackbar";
import { LoadingModal } from "../../components/modal";
import { Colors } from "../../styling";
import CommonHeaderWithDrawerButton from '../../components/Headers/CommonHeaderWithDrawerButton';
import { useFocusEffect } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'

const RenderListItem = ({ item, navigation, isDayWise }) => {

    const getPropToPass = () => {
        // item?.title == "Today's Bookings" ? 0 : item?.title === "Today's Bookings (Tetra)" ? 1 : item?.title === "Today's Bookings (Sauces)" ? 2 : null 
        if (item?.title == "Combined Today's Bookings") {
            return 0;
        } else if (item?.title == "Today's Bookings (Tetra)") {
            return 1;
        } else if (item?.title == "Today's Bookings (Sauces)") {
            return 2;
        }
    }

    const onPressItems = () => {
        if (item?.title == "Combined Today's Bookings") {
            navigation.navigate('TodaysBookingCountViaCategory', { isTetra: getPropToPass() })
        } else if (item?.title == "Today's Bookings (Tetra)") {
            navigation.navigate('TodaysBookingCountViaCategory', { isTetra: getPropToPass() })
        } else if (item?.title == "Today's Bookings (Sauces)") {
            navigation.navigate('TodaysBookingCountViaCategory', { isTetra: getPropToPass() })
        } else if (item?.title == "Productive Shops") {
            navigation.navigate("TodayBookingList")
        } else if (item?.title == "Non Productive Shops") {
            navigation.navigate("ShopCoveredWithoutOrderList")
        }
        else {
            null
        }
    }


    // console.log('item: ', item);
    return (
        <View style={styles.listItemContainer}>
            {/* {item?.title == "Combined Today's Bookings" || item?.title == "Today's Bookings (Tetra)" || item?.title == "Today's Bookings (Sauces)" ? */}
            <TouchableOpacity onPress={() => {
                // console.log('hey');
                onPressItems()
            }} >
                <View style={styles.listItemTitleLabelContainer}>
                    <Text style={styles.listItemTitleLabel}>{item?.title}</Text>
                </View>
                <View style={styles.listItemTitleValueContainer}>
                    <Text style={styles.listItemValueLabel}>{item?.value}</Text>
                </View>
            </TouchableOpacity>
            {/* : */}
            {/* <>
                    <View style={styles.listItemTitleLabelContainer}>
                        <Text style={styles.listItemTitleLabel}>{item?.title}</Text>
                    </View>
                    <View style={styles.listItemTitleValueContainer}>
                        <Text style={styles.listItemValueLabel}>{item?.value}</Text>
                    </View>
                </>
            } */}
        </View>
    )
}

const DayWiseDashboardScreen = ({ getDataFromChild }) => {

    console.log('Day Wise');

    const navigation = useNavigation();

    let isActive = true;

    const userData = useSelector((state) => state.userAuth.value)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTetra, setIsTetra] = useState(true)
    const [isMonthWise, setIsMonthWise] = useState(false);
    const [isDayWise, setIsDayWise] = useState(1);
    const [dashboardData, setDashboardData] = useState('')

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
        console.log(`${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_DASHBOARD_DAYWISE}`);
        let id = userData?.salesMan_Encrypted
        // console.log('userData : ', userData)
        // loadingModalRef.current.show()

        try {
            await ApiClient.get(`${ApiRoute.BASE_URL}${ApiRoute.SALESMAN_DASHBOARD_DAYWISE}?Request=${id}`, {
                headers: {
                    'Accept': 'text/plain',
                    "Content-Type": "application/json",
                }
            })
                .then(async (response) => {
                    loadingModalRef.current.hide()
                    setIsRefreshing(false);
                    console.log(response?.data);

                    if (response?.data.isSuccess && response?.data.data != null) {
                        // AlertMessage.showMessage(response?.data.message)
                        console.log(response?.data?.data[16].title);
                        setDashboardData(parseInt(response?.data?.data[13].value) + parseInt(response?.data?.data[14].value))

                        if (isDayWise == 1) {
                            let tempArr = [
                                // FOR TETRA
                                // {
                                //     "title": "Current Day Target",
                                //     "value": `PKR ${response?.data?.data[8].value} / ${response?.data?.data[9].value} Packs`
                                // },
                                // {
                                //     "title": "Today Target (Tetra)",
                                //     "value": `PKR ${response?.data?.data[0].value} / ${response?.data?.data[1].value} Packs`
                                // },
                                {
                                    "title": "Combined Today's Bookings",
                                    "value": `PKR ${response?.data?.data[9].value} / ${response?.data?.data[11].value} Cartons`
                                },
                                {
                                    "title": "Today's Bookings (Tetra)",
                                    "value": `PKR ${response?.data?.data[0].value} / ${response?.data?.data[2].value} Cartons`
                                },
                                // {
                                //     "title": "Today Target (Sauces)",
                                //     "value": `PKR ${response?.data?.data[4].value} / ${response?.data?.data[5].value} Packs`
                                // },
                                // {
                                //     "title": "Today Sales (Sauces)",
                                //     "value": `PKR ${response?.data?.data[6].value} / ${response?.data?.data[7].value} Packs`
                                // },
                                // {
                                //     "title": "Today Target (Sauce)",
                                //     "value": `PKR ${response?.data?.data[8].value} / ${response?.data?.data[9].value} Packs`
                                // },
                                {
                                    "title": "Productive Shops",
                                    "value": `${response?.data?.data[13].value} / ${response?.data?.data[12].value}`
                                },
                                {
                                    "title": "Non Productive Shops",
                                    "value": `${response?.data?.data[14]?.value} / ${response?.data?.data[12].value}`
                                },
                                {
                                    "title": "Productive Shops (Tetra)",
                                    "value": `${response?.data?.data[15].value} / ${response?.data?.data[12].value}`
                                },
                                {
                                    "title": "Total Shops Covered",
                                    "value": `${parseInt(response?.data?.data[13].value) + parseInt(response?.data?.data[14].value)} / ${response?.data?.data[12].value}`
                                },

                                // {
                                //     "title": "Productive Shops (Sauces)",
                                //     "value": `${response?.data?.data[20].value}`
                                // },
                                // {
                                //     "title": "Today's Bookings (Tetra)",
                                //     "value": `PKR ${response?.data?.data[2].value} / ${response?.data?.data[3].value} Packs`
                                // },
                                // {
                                //     "title": "Month to Date Sales (Sauce)",
                                //     "value": `PKR ${response?.data?.data[10].value} / ${response?.data?.data[11].value} Packs`
                                // },
                            ];
                            setData(tempArr)
                        } else {
                            let tempArr = [
                                // FOR SAUCES
                                // {
                                //     "title": "Current Day Target",
                                //     "value": `PKR ${response?.data?.data[8].value} / ${response?.data?.data[9].value} Packs`
                                // },
                                // {
                                //     "title": "Today Target (Tetra)",
                                //     "value": `PKR ${response?.data?.data[0].value} / ${response?.data?.data[1].value} Packs`
                                // },
                                {
                                    "title": "Combined Today's Bookings",
                                    "value": `PKR ${response?.data?.data[9].value} / ${response?.data?.data[11].value} Cartons`
                                },

                                // {
                                //     "title": "Today Sales (Tetra)",
                                //     "value": `PKR ${response?.data?.data[2].value} / ${response?.data?.data[3].value} Packs`
                                // },
                                {
                                    "title": "Today's Bookings (Sauces)",
                                    "value": `PKR ${response?.data?.data[3].value} / ${response?.data?.data[5].value} Cartons`
                                },
                                {
                                    "title": "Productive Shops",
                                    "value": `${response?.data?.data[13].value} / ${response?.data?.data[12].value}`
                                },
                                {
                                    "title": "Non Productive Shops",
                                    "value": `${response?.data?.data[14]?.value} / ${response?.data?.data[12].value}`
                                },
                                // {
                                //     "title": "Productive Shops (Tetra)",
                                //     "value": `${response?.data?.data[19].value}`
                                // },
                                {
                                    "title": "Productive Shops (Sauces)",
                                    "value": `${response?.data?.data[16].value} / ${response?.data?.data[12].value}`
                                },
                                {
                                    "title": "Total Shops Covered",
                                    "value": `${parseInt(response?.data?.data[13].value) + parseInt(response?.data?.data[14].value)} / ${response?.data?.data[12].value}`
                                },
                                // {
                                //     "title": "Today Sales (Sauces)",
                                //     "value": `PKR ${response?.data?.data[6].value} / ${response?.data?.data[7].value} Packs`
                                // },
                                // {
                                //     "title": "Today Target (Sauce)",
                                //     "value": `PKR ${response?.data?.data[8].value} / ${response?.data?.data[9].value} Packs`
                                // },

                                // {
                                //     "title": "Month to Date Sales (Sauce)",
                                //     "value": `PKR ${response?.data?.data[10].value} / ${response?.data?.data[11].value} Packs`
                                // },
                            ];
                            setData(tempArr)
                        }
                    } else {
                        AlertMessage.showMessage(response?.data.message)
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

    getDataFromChild({
        data: dashboardData
    })

    const checkIsMonthWise = () => {
        setIsMonthWise(true)
        setIsDayWise(2)
        console.log('Month wise is on');
    }

    const checkIsDayhWise = () => {
        setIsMonthWise(false)
        setIsDayWise(1)
        console.log('Day wise is on');
    }

    // const getModifiedTitleByTitle = (title) => {
    //     return title.replace(/([A-Z])/g, ' $1').trim()
    // }

    // const getModifiedValueByTitle = (item) => {
    //     switch (item?.title) {
    //         case 'CurrentMonthTarget':
    //             return 'PKR ' + item?.value + " Packs"
    //         // case 'CurrentMonthTargetInCount':
    //         //     return item?.value + ' Packs'
    //         case 'TodaySaleAmount':
    //             return 'PKR ' + item?.value
    //         case 'TodaySaleCount':
    //             return item?.value + ' Packs'
    //         // case 'MonthToDateAmount':
    //         //     return 'PKR ' + item?.value
    //         case 'AchievedPercentage':
    //             return item?.value + '%'
    //         // case 'CurrentRunRate':
    //         //     return 'PKR ' + item?.value + ' / Day'
    //         // case 'RequiredRunRate':
    //         //     return 'PKR ' + item?.value + ' / Day'
    //         case 'ShopsProductivity':
    //             return item?.value
    //         case 'ShopsToVisitToday':
    //             return item?.value + " Shops"
    //         case 'TotalShopsVisitedToday':
    //             return item?.value + " Shops"
    //         case 'TotalSales':
    //             return "PKR " + item?.value + " Packs"
    //         // case 'MonthToDate':
    //         //     return "PKR " + item?.value + " Packs"
    //         case 'TodaySales':
    //             return "PKR " + item?.value + " Packs"
    //         // case 'DropSize':
    //         //     return 'PKR ' + item?.value + '/ Shop'
    //         default:
    //             break;
    //     }
    // }

    const handleRefresh = () => {
        setIsRefreshing(true);
        setData([]);
        getDashboardData(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, flexDirection: 'column', marginBottom: wp('20%') }}>

            <LoadingModal ref={loadingModalRef} />
            {/* <TouchableOpacity
                onPress={() => setIsTetra(!isTetra)}
                style={[styles.toggleButtonContainer, isTetra ? styles.toggleButtonContainer : styles.whenSauces]} >
                <Text style={[styles.toggleButtonText, isTetra ? styles.toggleButtonText : styles.whenSaucesText]} >{isTetra ? 'Tetra' : 'Sauces'}</Text>
            </TouchableOpacity> */}

            <View style={styles.buttonRowContainer} >
                <TouchableOpacity onPress={() => checkIsDayhWise()} style={[styles.toggleButtonContainer, isDayWise == 1 ? styles.toggleButtonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isDayWise == 1 ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Tetra
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => checkIsMonthWise()} style={[styles.toggleButtonContainer, isDayWise == 2 ? styles.toggleButtonContainer : styles.whenButtonOff]} >
                    <Text style={[styles.buttonTextContainer, isDayWise == 2 ? styles.buttonTextContainer : styles.whenButtonOffText]} >
                        Sauces
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                renderItem={({ item, }) => <RenderListItem item={item} navigation={navigation} isDayWise={isDayWise} />}
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
        marginVertical: wp('2%')
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
        height: wp('9%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp('7%'),
        marginTop: wp('1%')
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


export default React.memo(DayWiseDashboardScreen);
