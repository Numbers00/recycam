import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  blueGreen,
  BText1,
  BText2, BGText2,
  ScreenContents1,
  globalStyles
} from '../globals/styles.js';


const TopModeBar = ({ mode, setMode }) => (
  <View style={[styles.modesContainer, { marginBottom: 16 }]}>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => setMode('Clear')}
      >
        {mode === 'Clear'
          ? <BGText2>Clear</BGText2>
          : <BText2>Clear</BText2>
        }
      </TouchableOpacity>
    </View>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => setMode('Record')}
      >
        {mode === 'Record'
          ? <BGText2>Record</BGText2>
          : <BText2>Record</BText2>
        }
      </TouchableOpacity>
    </View>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => setMode('Pause')}
      >
        {mode === 'Pause'
          ? <BGText2>Pause</BGText2>
          : <BText2>Pause</BText2>
        }
      </TouchableOpacity>
    </View>
  </View>
);


const Record = ({ currRouteName }) => {
  const [mode, setMode] = useState('Clear');

  const [recognizables, setRecognizables] = useState([]);
  const [recyclables, setRecyclables] = useState([]);

  return (
    <View style={styles.recordContainer}>
      <View style={styles.videoPlaceholder}>
      </View>
      <ScreenContents1>
        <TopModeBar />
        <View style={styles.mainContents}>
          <View style={[globalStyles.flexRow, { marginBottom: 16 }]}>
            <BText1 style={{ textDecorationLine: 'underline', marginRight: 24 }}>
              recyclables: {recyclables.length}
            </BText1>
            <BText1 style={{ textDecorationLine: 'underline' }}>
              non-recyclables: {recognizables.length - recognizables.length}
            </BText1>
          </View>
        </View>
      </ScreenContents1>
    </View>
  );
};

const styles = StyleSheet.create({
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
  recordContainer: {
    position: 'relative',
    flex: 1,
  },
  videoPlaceholder: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'gray',
    width: '100%',
    height: 240
  }
});

export default Record;
