import {observable} from 'mobx';
import {userDB} from '.';

export class ProfileStore {

    @observable user = null

    changeFirstName = e => this.firstName = e.target.value
    changelastName = e => this.lastName = e.target.value

    loadProfile = () => userDB.get('/api/v1/auth/user/')
    .then(res => this.user = res);

}

export default ProfileStore;
