import {observable} from 'mobx';

class ProfileStore {

    @observable title = '';
    @observable finished = false;
}

export default ProfileStore;
