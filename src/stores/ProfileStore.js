import {observable} from 'mobx';

export class ProfileStore {

    @observable firstName = ''
    @observable lastName = ''

    changeFirstName = e => this.firstName = e.target.value
    changelastName = e => this.lastName = e.target.value
}

export default ProfileStore;
