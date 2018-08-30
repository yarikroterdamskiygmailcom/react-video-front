import {observable} from 'mobx';
import {php} from '.';
import encode from 'object-to-formdata';

export class AssetsStore {

    @observable assetList = []

    loadAssets = sessionId => {
      php.post('handleproject.php', encode({
        react: true,
        action: 'loadassets',
        SessionID: sessionId
      })).then(res => {
        this.assetList = res.data.asset;
      });
    }

}

export default AssetsStore;
