import React, { memo, useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from "../../styling";

const ic_search = require('../../assets/ic_search.png')
const ic_cross = require('../../assets/ic_cross.png')

const CustomSearchBar = ({ placeholder, onSubmit, onClearSearch }) => {

    const [value, setValue] = useState('')

    useFocusEffect(
        useCallback(() => {
            clearSearch();
        }, []),
    );

    const onSearchResult = () => {
        Keyboard.dismiss()
        onSubmit(value)
    }

    const clearSearch = () => {
        Keyboard.dismiss()
        onClearSearch()
        setValue('')
    }
    onChangeText = (text) => {
        if (text == ' ') {
            setValue('')
        }
        else {
            setValue(text)
        }
    }
    // const onTapSearch = () => {
    //     onSearchResult()
    // }

    useEffect(() => {
        if (value.length == '') clearSearch()
    }, [value])


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                editable={true}
                placeholder={placeholder ? placeholder : ''}
                value={value}
                onChangeText={text => onChangeText(text)}
                keyboardType={'default'}
                placeholderTextColor={Colors.textColorLight}
                returnKeyType={'search'}
                onSubmitEditing={() => { onSearchResult() }}
                blurOnSubmit={false}
            />
            {value.length > 0 ?
                <TouchableOpacity style={styles.clearContainer} onPress={() => { clearSearch() }}>
                    < Image source={ic_cross} style={styles.iconClearSearch} />
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={1} style={styles.searchContainer} onPress={() => {
                    // onTapSearch()
                }}>
                    < Image source={ic_search} style={styles.iconSearch} />
                </TouchableOpacity>

            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: wp('12%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: wp('4%'),
        alignSelf: 'center',
        marginTop: wp('4%'),
        marginBottom: wp('2%'),
        paddingHorizontal: wp('5%'),
    },
    iconSearch: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },
    input: {
        flex: 1,
        backgroundColor: 'tranparent',
        color: Colors.textColor,
        fontSize: wp('4%'),
    },
    searchContainer: {
        width: wp('8%'),
        height: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearContainer: {
        width: wp('8%'),
        height: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: Colors.primaryColor,
        // borderWidth: 0.5,
        // borderRadius: wp('100%')
    },
    iconClearSearch: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },


})

export default memo(CustomSearchBar)