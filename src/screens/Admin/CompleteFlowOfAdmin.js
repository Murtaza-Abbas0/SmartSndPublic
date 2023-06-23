import React from "react";
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview';

const CompleteFlowOfAdmin = () => {
    return (
        <View style={{ flex: 1 }} >
            <WebView
                source={{ uri: 'https://qa.digitallandscape.com.pk:1036' }}
            />
        </View>
    )
}

export default CompleteFlowOfAdmin;