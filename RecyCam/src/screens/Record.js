import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
const mobilenet = require('@tensorflow-models/mobilenet');

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
  ScreenContents1,
  globalStyles
} from '../globals/styles.js';

const TensorCamera = cameraWithTensors(Camera);
const TopVideo = (props) => {
  const {
    cameraRef,
    detections, setDetections,
    hasPermission, setHasPermission,
    net, setNet,
    mode, setMode
  } = props;

  const handleCameraStream = (images) => {
    let frame = 0;
    const computeRecognitionEveryNFrames = 60;
    const loop = async () => {
      if (net) {
        if(frame % computeRecognitionEveryNFrames === 0){
          const nextImageTensor = images.next().value;
          if (nextImageTensor) {
            const objects = await net.classify(nextImageTensor);
            if(objects && objects.length > 0){
              setDetections(objects.map(object => object.className));
            }
            tf.dispose([nextImageTensor]);
          }
        }
        frame += 1;
        frame = frame % computeRecognitionEveryNFrames;
      }
      requestAnimationFrame(loop);
    }
    loop();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.videoPlaceholder}>
        <WText2>Start Recording?</WText2>
      </View>
    );
  } else if (hasPermission === false) {
    return (
      <View style={styles.videoPlaceholder}>
        <WText2>Camera access has not been granted.</WText2>
      </View>
    );
  } else if (!net) {
    return (
      <View style={styles.videoPlaceholder}>
        <WText2>Model not loaded.</WText2>
      </View>
    );
  } else if (['Record', 'Pause'].includes(mode)) {
    return (
      <View style={styles.videoContainer}>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera} 
          type={Camera.Constants.Type.back}
          onReady={handleCameraStream}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          autorender={true}
          cameraTextureHeight={240}
          cameraTextureWidth={240}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.videoPlaceholder}>
      <WText2>Data Cleared, Start Recording?</WText2>
    </View>
  );
};


const TopModeBar = ({ mode, setMode }) => (
  <View style={[styles.modesContainer, { marginBottom: 16 }]}>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => mode !== 'Clear' ? setMode('Clear') : console.log('Already clear.')}
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
        onPress={() => mode !== 'Record' ? setMode('Record') : console.log('Already recording.')}
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
        onPress={() => mode !== 'Pause' ? setMode('Pause') : console.log('Already paused.')}
      >
        {mode === 'Pause'
          ? <BGText2>Pause</BGText2>
          : <BText2>Pause</BText2>
        }
      </TouchableOpacity>
    </View>
  </View>
);

// Code for Tensorflow adapted from and thanks to
// https://www.bam.tech/article/how-to-recognize-real-time-object-in-reactnative-for-dummies
const Record = ({ currRouteName }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [net, setNet] = useState(null);

  const [mode, setMode] = useState('Clear');

  const [detections, setDetections] = useState([]);
  const [recognizables, setRecognizables] = useState([]);
  const [recyclables, setRecyclables] = useState([]);

  const cameraRef = useRef(null);

  const load = async () => {
    try {
      // Load mobilenet.
      await tf.ready();
      // tf.getBackend();
      const model = await mobilenet.load({
        version: 1,
        alpha: 0.25,
        inputRange: [0, 1]
      });
      setNet(model);
      // console.log(model);
      setIsTfReady(true);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    console.log(cameraRef.current);
    if (mode === 'Record' && !hasPermission)
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    // else if (mode === 'Pause' && cameraRef.current)
    //   cameraRef.current.pausePreview();
  }, [mode]);

  return (
    <View style={styles.recordContainer}>
      <TopVideo
        cameraRef={cameraRef}
        detections={detections}
        setDetections={setDetections}
        hasPermission={hasPermission}
        setHasPermission={setHasPermission}
        net={net}
        setNet={setNet}
        mode={mode}
        setMode={setMode}
      />
      <ScreenContents1>
        <TopModeBar
          mode={mode}
          setMode={setMode}
        />
        <View style={styles.mainContents}>
          <View style={[globalStyles.flexRow, { marginBottom: 16 }]}>
            <BText1 style={{ textDecorationLine: 'underline', marginRight: 24 }}>
              recyclables: {recyclables.length}
            </BText1>
            <BText1 style={{ textDecorationLine: 'underline' }}>
              non-recyclables: {recognizables.length - recyclables.length}
            </BText1>
          </View>
          {detections.map((detection, index) => 
            <Text key={index}>{detection}</Text>
          )}
        </View>
      </ScreenContents1>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1
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
  recordContainer: {
    position: 'relative',
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: 240
  },
  videoPlaceholder: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'gray',
    width: '100%',
    height: 240,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Record;
