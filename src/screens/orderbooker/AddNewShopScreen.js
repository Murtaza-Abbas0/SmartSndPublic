import React from "react";
import { SafeAreaView } from 'react-native'
import ShopDetails from '../../components/Details/ShopDetails'
import CommonHeaderWithBackButton from "../../components/Headers/CommonHeaderWithBackButton";

const AddNewShopScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <CommonHeaderWithBackButton title={'Add New Shop'} />
            <ShopDetails />
        </SafeAreaView>
    )
}

export default AddNewShopScreen;