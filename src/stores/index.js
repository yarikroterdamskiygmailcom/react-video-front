import axios from 'axios';
import encode from 'object-to-formdata';
import {sessionStore} from '..';
export {AssetsStore} from './AssetsStore';
export {ProfileStore} from './ProfileStore';
export {ProjectStore} from './ProjectStore';
export {SessionStore} from './SessionStore';
export {SettingsStore} from './SettingsStore';
export {TemplatesStore} from './TemplatesStore';
export {VlogEditorStore} from './VlogEditorStore';
export {VlogsStore} from './VlogsStore';

export const php = axios.create({
  baseURL: 'https://videodb.vlogahead.cloud',
});

php.interceptors.request.use(
  config => ({...config, data: encode(config.data)}),
  error => error
);

php.interceptors.response.use(
  response => {
    if (response.data.error) {
      sessionStore.showError(response.data.error);
    }
    return response.data;
  },
  error => Promise.reject(error)
);

export const userDB = axios.create({
  baseURL: 'https://userdb.vlogahead.cloud',
});

userDB.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

