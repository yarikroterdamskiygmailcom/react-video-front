import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';

export class VideosStore {

    @observable list = [];
    @observable currentVlog = null;

      loadVideos = sessionId => {
        php.post('handleoverview.php', encode({
          react: true,
          action: 'load',
          SessionID: sessionId
        })).then(res => {
          console.log(res);
          this.list = res.data.project;
        });
      }
}

export default VideosStore;
