import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import {Colors} from '../../styling'

const DashboardCards = ({title, value}) => {
  return (
    <View>
      <View style={styles.listItemContainer}>
        <View style={styles.listItemTitleLabelContainer}>
          <Text style={styles.listItemTitleLabel}>{title}</Text>
        </View>
        <View style={styles.listItemTitleValueContainer}>
          <Text style={styles.listItemValueLabel}>
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DashboardCards;

const styles = StyleSheet.create({
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
  listItemTitleLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
  listItemTitleValueContainer: {
    backgroundColor: Colors.primaryColorLight,
    borderBottomStartRadius: wp('2%'),
    borderBottomEndRadius: wp('2%'),
    paddingVertical: wp('2%'),
  },
  listItemValueLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
});
