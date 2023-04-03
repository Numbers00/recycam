import RNPickerSelect from 'react-native-picker-select';

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import styled from 'styled-components/native';

export const borderGray ='#CED4DA';
export const danger = '#DC3545';
export const darkgreen = '#2C6E49';
export const green = '#4C956C';
export const lightpink = '#FFC9B9';
export const lightyellow = '#FEFEE3';
export const orange = '#FD7E14';
export const primary = '#0D6EFD';
export const purple = '#6F42C1';
export const secondary = '#6C757D';

export const window = Dimensions.get('window');

export const BText = styled.Text`
  font-size: 14px;
  color: black;
`;

export const DText = styled.Text`
  font-size: 14px;
  color: ${danger};
`;

export const PText = styled.Text`
  font-size: 14px;
  color: ${primary};
`;

export const SText = styled.Text`
  font-size: 14px;
  color: ${secondary};
`;

export const WText = styled.Text`
  font-size: 14px;
  color: white;
`;

export const FormikGroup = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
`;
export const globalStyles = StyleSheet.create({
  circleContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fsMd: {
    fontSize: 16
  },
  fsLg: {
    fontSize: 18
  },
  fsSm: {
    fontSize: 12
  },
});
