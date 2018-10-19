import {observable} from 'mobx';
import {userDB} from '.';

export class ProfileStore {

    @observable user = null
    @observable teamId = null

    changeFirstName = e => this.firstName = e.target.value
    changelastName = e => this.lastName = e.target.value

    loadProfile = () => userDB.get('/api/v1/auth/user/')
    .then(res => {
      this.user = res;
      this.teamId = this.user.team_id;
    });

    getTeam = () => userDB.post('api/v1/team/', {
      id: this.teamId
    }).then(res => console.log(res))

}

export default ProfileStore;
