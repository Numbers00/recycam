import AsyncStorage from '@react-native-async-storage/async-storage';

const authHeader = async () => {
  const auth = JSON.parse(await AsyncStorage.getItem('userAuth'));

  if (auth && auth.accessToken)
    return { Authorization: 'Bearer ' + auth.accessToken };
  
  return {};
};

const exportedObject = {
  authHeader
};
export default exportedObject;
