import { Shadow } from 'react-native-shadow-2';

import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  window,
  blueGreen, borderGray,
  BText1, BText2,
} from '../globals/styles.js';
import styled from 'styled-components/native';

const ListItem = ({ expanded, method }) => (
  <View style={styles.listItem}>
    <Text style={styles.bulletPoint}>{'\u2022'}</Text>
    <BText1 numberOfLines={expanded ? undefined : 2}>{method}</BText1>
  </View>
);


const ExpandableContainer = styled.View`
  border-radius: 4px;
  border-width: 1px;
  border-color: ${borderGray};
  border-top-width: 2px;
  border-top-color: ${blueGreen};
  width: ${window.width - 64}px;
  height: ${props => props.expanded ? 'auto' : '120px'};
  margin-bottom: 16px;
  padding: 12px;
`;

const ItemBox = ({ name, url, options }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const truncatedOptions = options.slice(0, 2);

  return (
    <TouchableOpacity onPress={toggleExpansion}>
      <Shadow
        distance={4}
        sides={{ bottom: true }}
      >
        <ExpandableContainer expanded={expanded}>
          <View style={styles.leftCol}>
            <BText2>{name}</BText2>
            {expanded ? (
              options.map((option, i) => (
                <ListItem key={i} expanded={expanded} method={option.method} />
              ))
            ) : (
              truncatedOptions.map((option, i) => (
                <ListItem key={i} expanded={expanded} method={option.method} />
              ))
            )}
          </View>
        </ExpandableContainer>
      </Shadow>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bulletPoint: {
    marginRight: 5,
    fontSize: 20,
    color: 'black',
  },
  expandedItemBox: {
    height: 600
  },
  itemBox: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: borderGray,
    borderTopWidth: 2,
    borderTopColor: blueGreen,
    width: window.width - 64,
    height: 120,
    marginBottom: 16,
    padding: 12
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  listItem: {
    flexDirection: 'row',
    paddingRight: 16
  },
});

export default ItemBox;
