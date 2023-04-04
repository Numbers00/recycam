import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import ItemBox from '../common/ItemBox.js';

import itemService from '../services/item.service.js';

import {
  blueGreen,
  BText1,
  BText2, BGText2, WText2,
  T2TextInput,
  ScreenContents2, T2TextInputContainer, T2TextInputLeft,
  globalStyles,
} from '../globals/styles.js';
import styled from 'styled-components/native';

const TopSearchContainer = (props) => {
  const {
    searchName, setSearchName
  } = props;

  return (
    <View style={styles.searchContainer}>
      <T2TextInputContainer>
        <T2TextInputLeft>
          <BText2>Search</BText2>
        </T2TextInputLeft>
        <T2TextInput
          onChangeText={text => setSearchName(text)}
          value={searchName}
          placeholder='Search for an item'
        />
      </T2TextInputContainer>
    </View>
  );
};


const TopModeBar = ({ mode, setMode }) => (
  <View style={[styles.modesContainer, { marginBottom: 12 }]}>
    <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => mode !== 'Recyclables' ? setMode('Recyclables') : console.log('Already in Recyclables.')}
      >
        {mode === 'Recyclables'
          ? <BGText2>Recyclables</BGText2>
          : <BText2>Recyclables</BText2>
        }
      </TouchableOpacity>
    </View>
    {/* <View style={styles.modeBox}>
      <TouchableOpacity
        title=''
        style={styles.modeBtn}
        onPress={() => mode !== 'Others' ? setMode('Others') : console.log('Already in Others.')}
      >
        {mode === 'Others'
          ? <BGText2>Others</BGText2>
          : <BText2>Others</BText2>
        }
      </TouchableOpacity>
    </View> */}
  </View>
);

const TopButtonsContainer = styled.ScrollView.attrs({ horizontal: true })`
  min-width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const TopButton = styled.TouchableHighlight`
  width: auto;
  height: 28px;
  border-radius: 4px;
  padding: 0 8px;
`;

const TopButtons = ({ filterLetters, setFilterLetters }) => (
  <TopButtonsContainer>
    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
      <View key={i} style={[styles.buttonOuterLayout, { marginLeft: i === 0 ? 32 : 0, marginRight: i === 25 ? 32 : 16 }]}>
        <TopButton
          style={[globalStyles.flexRow, { backgroundColor: filterLetters.includes(letter) ? blueGreen : 'lightgray' }]}
          onPress={() => filterLetters.includes(letter) ? setFilterLetters(filterLetters.filter(l => l !== letter)) : setFilterLetters([...filterLetters, letter])}
        >
          <BText2>{letter}</BText2>
        </TopButton>
      </View>
      ))
    }
  </TopButtonsContainer>
);


const Database = ({ currRouteName }) => {
  const [filterLetters, setFilterLetters] = useState([]);
  const [mode, setMode] = useState('Recyclables');
  const [searchName, setSearchName] = useState('');

  const [recyclables, setRecyclables] = useState([]);
  // const [others, setOthers] = useState([]);

  const [page, setPage] = useState(1);

  const getItems = async () => {
    const options = {
      page: page,
      limit: 6
    };
    if (filterLetters) options.name_sw = filterLetters.join(',');
    if (searchName) options.q = searchName;
    console.log('options', options);
    await itemService
      .getAll(options)
      .then((res) => {
        // console.log('items', items);
        setRecyclables([...recyclables, ...res.results]);
        setPage(page + 1);
      })
      .catch((err) => {
        const formattedErr = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err;

        console.log(formattedErr);
      })
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleScroll = (e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      getItems();
    }
  };

  console.log('recyclables', recyclables.length);

  return (
    <View style={styles.databaseContainer}>
      <TopSearchContainer
        searchName={searchName}
        setSearchName={setSearchName}
      />
      <ScreenContents2>
        <TopModeBar
          mode={mode}
          setMode={setMode}
        />
        <TopButtons
          filterLetters={filterLetters}
          setFilterLetters={setFilterLetters}
        />
        <ScrollView
          style={styles.mainContents}
          onScroll={handleScroll}
          scrollEventThrottle={16} // set this to control the rate of onScroll events
        >
          {recyclables.map(recyclable => (
            <ItemBox
              key={recyclable._id}
              name={recyclable.name}
              url={recyclable.url}
              options={recyclable.options}
            />
          ))}
        </ScrollView>
      </ScreenContents2>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
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
  databaseContainer: {
    position: 'relative',
    flex: 1,
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: blueGreen,
    width: '100%',
    height: 96,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32
  }
});

export default Database;
