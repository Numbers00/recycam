import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  blueGreen,
  BText1,
  BText2, BGText2, WText2,
  FeatureModal,
  globalStyles
} from '../globals/styles.js';

const Profile = ({ currRouteName }) => {
  
  return (
    <View style={styles.profileContainer}>
      <View style={styles.featureModalContainer}>
        <FeatureModal>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>
            This feature is not yet available.
            We will notify you once it is ready!
          </Text>
        </FeatureModal>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  featureModalContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContents: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 32,
    paddingRight: 32
  },
  modeBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modeBox: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '33.33%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modesContainer: {
    width: '100%',
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: blueGreen
  },
  profileContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: blueGreen
  },
});

export default Profile;
