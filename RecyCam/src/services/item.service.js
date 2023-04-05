import axios from 'axios';
import { SERVER_PORT } from '@env';

import servicesHelper from '../helpers/services.helper.js';

// const SERVER_IP_ADDR = process.env.REACT_NATIVE_PACKAGER_HOSTNAME.slice(0, -1);
// const SERVER_IP_ADDR = '192.168.0.160';
// const SERVER_IP_ADDR = '192.168.1.2';

// const BASE_URL = (() => {
//   // http://<wifi ip address>:3001/api/users works on actual android device
//   if (Platform.OS === 'android') return `http://${SERVER_IP_ADDR}:${SERVER_PORT || 3001}/api/items`;
//   return `http://${SERVER_IP_ADDR}:${SERVER_PORT || 3001}/api/items`;
// })();

// To connect to server deployed on cyclic.sh
const SERVER_ADDR = 'https://dull-tan-gharial-tie.cyclic.app';

const BASE_URL = (() => {
  // http://<wifi ip address>:3001/api/users works on actual android device
  if (Platform.OS === 'android') return `${SERVER_ADDR}/api/items`;
  return `${SERVER_ADDR}/api/items`;
})();

console.log('BASE_URL: ', BASE_URL);
// axios.interceptors.request.use(request => {
//   console.log('Starting Request', JSON.stringify(request, null, 2))
//   return request
// });

const getAll = (options) => {
  const urlPrepend = `?${options instanceof Object && Object.keys(options)
    .filter((key) => options[key])
    .map((key) => `${key}=${options[key]}`)
    .join('&')
  }`;
  return axios
    .get(BASE_URL + urlPrepend, { headers: servicesHelper.authHeader() })
    .then((res) => res.data);
};

const get = (id) => {
  return axios
    .get(`${BASE_URL}/${id}`, { headers: servicesHelper.authHeader() })
    .then((res) => res.data);
};

const create = (data) => {
  return axios
    .post(BASE_URL, data, { headers: servicesHelper.authHeader() })
    .then((res) => res.data);
};

const update = (id, data) => {
  return axios
    .put(`${BASE_URL}/${id}`, data, { headers: servicesHelper.authHeader() })
    .then((res) => res.data);
};

const exportedObject = {
  getAll, get,
  create,
  update
};
export default exportedObject;
