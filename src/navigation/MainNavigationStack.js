import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainDrawerScreen from '../screens/MainDrawerScreen';

import {
    SplashScreen,
    MainSignInScreen,
    SignInScreen,
    OrderSummaryDetailsScreen,
} from '../screens'

import {
    UpdateProfileScreen,
    UpdateShopDetailScreen,
    UpdateProfileDetailScreen,
    ProductDetailScreen,
    ShopDetailScreen,
    AddNewShopScreen,
    MakeNewOrderScreen,
    SubmitOrderScreen,
    ViewShopLocationScreen,
    AddStoreLocationScreen,
    OrderScreen,
    SpotSaleReciptScreen,
    BookOrderBarcodeScreen,
    UpdateBookedOrders,
    TodaysBookingCountViaCategory
} from "../screens/orderbooker";

import {
    UpdateProfileOfDeliveryman,
    PendingDeliveriesDetailScreen,
    DeliveryHistoryDetailScreen,
    ConfirmDeliveryScreen
} from '../screens/deliveryman'

import CompleteFlowOfAdmin from '../screens/Admin/CompleteFlowOfAdmin';

const Stack = createNativeStackNavigator();

const options = {
    headerShown: false,
    gestureEnabled: false
}


const MainNavigationStack = () => {
    return (
        <NavigationContainer independent={true} >
            <Stack.Navigator initialRouteName="SplashScreen">
                <Stack.Screen name='SplashScreen' component={SplashScreen} options={options} />
                <Stack.Screen name='MainSignInScreen' component={MainSignInScreen} options={options} />
                <Stack.Screen name='SignInScreen' component={SignInScreen} options={options} />
                <Stack.Screen name='MainDrawerScreen' component={MainDrawerScreen} options={options} />
                <Stack.Screen name='CompleteFlowOfAdmin' component={CompleteFlowOfAdmin} options={options} />

                <Stack.Screen name='UpdateProfileScreen' component={UpdateProfileScreen} options={options} />
                <Stack.Screen name='OrderSummaryDetailsScreen' component={OrderSummaryDetailsScreen} options={options} />
                <Stack.Screen name='UpdateShopDetailScreen' component={UpdateShopDetailScreen} options={options} />
                <Stack.Screen name='UpdateProfileDetailScreen' component={UpdateProfileDetailScreen} options={options} />
                <Stack.Screen name='ShopDetailScreen' component={ShopDetailScreen} options={options} />
                <Stack.Screen name='ProductDetailScreen' component={ProductDetailScreen} options={options} />
                <Stack.Screen name='AddNewShopScreen' component={AddNewShopScreen} options={options} />
                <Stack.Screen name='MakeNewOrderScreen' component={MakeNewOrderScreen} options={options} />
                <Stack.Screen name='SubmitOrderScreen' component={SubmitOrderScreen} options={options} />
                <Stack.Screen name='ViewShopLocationScreen' component={ViewShopLocationScreen} options={options} />
                <Stack.Screen name='AddStoreLocationScreen' component={AddStoreLocationScreen} options={options} />
                <Stack.Screen name='OrderScreen' component={OrderScreen} options={options} />
                <Stack.Screen name='SpotSaleReciptScreen' component={SpotSaleReciptScreen} options={options} />
                <Stack.Screen name='BookOrderBarcodeScreen' component={BookOrderBarcodeScreen} options={options} />
                <Stack.Screen name='UpdateProfileOfDeliveryman' component={UpdateProfileOfDeliveryman} options={options} />
                <Stack.Screen name='PendingDeliveriesDetailScreen' component={PendingDeliveriesDetailScreen} options={options} />
                <Stack.Screen name='DeliveryHistoryDetailScreen' component={DeliveryHistoryDetailScreen} options={options} />
                <Stack.Screen name='ConfirmDeliveryScreen' component={ConfirmDeliveryScreen} options={options} />
                <Stack.Screen name='UpdateBookedOrders' component={UpdateBookedOrders} options={options} />
                <Stack.Screen name='TodaysBookingCountViaCategory' component={TodaysBookingCountViaCategory} options={options} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default MainNavigationStack;