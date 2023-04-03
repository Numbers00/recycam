import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  blueGreen, secondary,
  BGText2, SText2
} from '../globals/styles.js';

const Footer = ({ currRouteName }) => {

  const navigation = useNavigation();

  const guestPages = ['Forgot Password', 'Login', 'Register'];
  if (guestPages.includes(currRouteName)) return null;

  return (
    <View style={styles.bottomBar}>
      <View style={styles.navbox}>
        <TouchableOpacity
          title=''
          style={styles.navbtn}
          onPress={() => navigation.navigate('Record')}
        >
          <FontAwesome name='camera' size={20} color={currRouteName === 'Record' ? blueGreen : secondary} />
          {currRouteName === 'Record'
            ? <BGText2>Record</BGText2>
            : <SText2>Record</SText2>
          }
        </TouchableOpacity>
      </View>
      <View style={styles.navbox}>
        <TouchableOpacity
          title=''
          style={styles.navbtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <FontAwesome name='user' size={20} color={currRouteName === 'Profile' ? blueGreen : secondary} />
          {currRouteName === 'Profile'
            ? <BGText2>Profile</BGText2>
            : <SText2>Profile</SText2>
          }
        </TouchableOpacity>
      </View>
      <View style={styles.navbox}>
        <TouchableOpacity
          title=''
          style={styles.navbtn}
          onPress={() => navigation.navigate('Database')}
        >
          <FontAwesome5 name='recycle' size={20} color={currRouteName === 'Database' ? blueGreen : secondary} />
          {currRouteName === 'Database'
            ? <BGText2>Database</BGText2>
            : <SText2>Database</SText2>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: blueGreen,
    width: '100%',
    height: 52,
    display: 'flex',
    flexDirection: 'row'
  },
  navbox: {
    flex: 1,
    width: '33.33%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navbtn: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

export default Footer;
