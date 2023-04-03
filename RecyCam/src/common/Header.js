import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { WText2 } from '../globals/styles.js';

const LeftIcon = ({ currRouteName }) => {
  if (currRouteName === 'Profile')
    return <FontAwesome name='user' size={24} color='white' style={{ marginRight: 8 }} />;
  else if (currRouteName === 'Database')
    return <FontAwesome5 name='recycle' size={24} color='white' style={{ marginRight: 8 }} />;

  return null;
};


const Header = (props) => {
  const { currRouteName } = props;

  const visibleOnPages = ['Profile', 'Database'];
  if (!visibleOnPages.includes(currRouteName))
    return null;

  const navigation = useNavigation();
  return (
    <View style={styles.topBar}>
      <LeftIcon currRouteName={currRouteName} />
      <WText2>{currRouteName}</WText2>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: 32,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default Header;
