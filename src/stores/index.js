import axios from 'axios';

export {AddVlogStore} from './AddVlogStore';
export {AssetsStore} from './AssetsStore';
export {ProfileStore} from './ProfileStore';
export {SessionStore} from './SessionStore';
export {VlogConfigStore} from './VlogConfigStore';
export {VlogEditorStore} from './VlogEditorStore';
export {VlogRenderStore} from './VlogRenderStore';
export {VlogsStore} from './VlogsStore';

export const php = axios.create({
  baseURL: 'https://intranet.sonicvoyage.nl/fileuploader/web/',
});
