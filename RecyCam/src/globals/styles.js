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

// Colors
export const blueGreen = '#0096C7';
export const columbiaBlue = '#BFD7EA';
export const danger = '#DC3545';
export const primary = '#0D6EFD';
export const secondary = '#6C757D';
export const success = '#198754';
export const vividSkyBlue = '#48CAE4';

export const window = Dimensions.get('window');


// Text Components
export const Text1 = styled.Text`
  font-size: 12px;
`;

export const Text2 = styled.Text`
  font-size: 14px;
`;

export const BText1 = styled(Text1)`
  color: black;
`;

export const BText2 = styled(Text2)`
  color: black;
`;

export const BGText1 = styled(Text1)`
  color: ${blueGreen};
`;

export const BGText2 = styled(Text2)`
  color: ${blueGreen};
`;

export const DText1 = styled(Text1)`
  color: ${danger};
`;

export const DText2 = styled(Text2)`
  color: ${danger};
`;

export const PText1 = styled(Text1)`
  color: ${primary};
`;

export const PText2 = styled(Text2)`
  color: ${primary};
`;

export const SText1 = styled(Text1)`
  color: ${secondary};
`;

export const SText2 = styled(Text2)`
  color: ${secondary};
`;

export const WText1 = styled(Text1)`
  color: white;
`;

export const WText2 = styled(Text2)`
  color: white;
`;

// View Components
export const FeatureModal = styled.View`
  border-radius: 16px;
  background-color: white;
  width: ${window.width - 64}px;
  height: ${window.width - 64}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
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

export const ScreenContents1 = styled.ScrollView`
  position: relative;
  bottom: 24px;
  z-index: 2;
  min-height: ${window.height - 300 + 24}px;
  max-height: ${window.height - 300 + 24}px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
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
