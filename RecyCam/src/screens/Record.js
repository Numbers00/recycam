import _ from 'lodash';
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

import ItemBox from '../common/ItemBox.js';

import itemService from '../services/item.service.js';

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
    const computeRecognitionEveryNFrames = 120;
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
  } else if (mode === 'Record') {
    // if (mode === 'Pause')
    //   cameraRef.current.pausePreview();

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
      <WText2>Start Recording?</WText2>
    </View>
  );
};


const TopModeBar = ({ mode, setMode }) => (
  <View style={[styles.modesContainer, { marginBottom: 16 }]}>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => mode !== 'Stop' ? setMode('Stop') : console.log('Already stopped.')}
      >
        {mode === 'Stop'
          ? <BGText2>Stop</BGText2>
          : <BText2>Stop</BText2>
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
  </View>
);

// Code for Tensorflow adapted from and thanks to
// https://www.bam.tech/article/how-to-recognize-real-time-object-in-reactnative-for-dummies
const Record = ({ currRouteName }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const [net, setNet] = useState(null);

  const [mode, setMode] = useState('Stop');

  const [detections, setDetections] = useState([]);
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
        // inputRange: [0, 1]
      });
      // console.log('model', model);
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
    if (mode === 'Record' && !hasPermission)
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    // else if (mode === 'Pause' && cameraRef.current)
    //   cameraRef.current.pausePreview();
  }, [mode]);

  const getItems = async () => {
    const processedDetections = _.flatten(detections.map(detection => detection.split(/,\s|\s/)));

    const options = {};
    options.name_in = processedDetections.join(',');
    console.log('options', options);
    await itemService
      .getAll(options)
      .then((items) => {
        // setRecyclables([...recyclables, ...items]);
        console.log('items', items);
        setRecyclables(items);
      })
      .catch((err) => {
        const formattedErr = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err;

        console.log(formattedErr);
      });
  };

  useEffect(() => {
    // Cannot work while video is recording
    // Thread taken up by Tensorflow
    console.log('mode', mode);
    if (mode === 'Stop' && detections.length)
      getItems();
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
          {detections.map((detection, i) => 
            <Text key={i} style={{ textAlign: 'center', marginBottom: i === detections.length - 1 ? 16 : 0 }}>{detection}</Text>
          )}
          {recyclables.map(recyclable => (
            <ItemBox
              key={recyclable._id}
              name={recyclable.name}
              url={recyclable.url}
              options={recyclable.options}
            />
          ))}
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
    width: '50%',
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
    height: 300
  },
  videoPlaceholder: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'gray',
    width: '100%',
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Record;
