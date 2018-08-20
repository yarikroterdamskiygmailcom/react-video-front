import axios from 'axios';

export {AddVlogStore} from './AddVlogStore';
export {ProfileStore} from './ProfileStore';
export {SessionStore} from './SessionStore';
export {VlogsStore} from './VlogsStore';

export const php = axios.create({
  baseURL: 'https://intranet.sonicvoyage.nl/fileuploader/web/',
});
