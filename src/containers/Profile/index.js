import React, {Component} from 'react';
import {isEmpty, noop} from 'lodash-es';
import styles from './styles.scss';
import {Segment} from '../../atoms';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {Overlay, Preview, Modal} from '../../components';
import {withRouter} from 'react-router';
import FontAwesome from 'react-fontawesome';
import avatarPlaceholder from './avatarPlaceholder.png';
import iconPlaceholder from './iconPlaceholder.png';
import GoogleLogin from 'react-google-login';
import youtube from './youtube.png';

@withRouter
@inject('profile')
@inject('session')
@observer
export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeAsset: null
    };
  }

  componentWillMount() {
    this.props.profile.loadProfile().then(() => {
      if (this.props.profile.user.team) {
        this.props.profile.getTeam();
      }
    });
  }

  goToCustomize = () => this.props.history.push('/customize')

  renderField = (left, right, func) => (
    <div className={styles.field} onClick={func || noop}>
      <div className={styles.fieldLeft}>{left}</div>
      <div className={styles.fieldRight}>{right}</div>
    </div>
  )

  renderPersona = () => {
    const {first_name, last_name, team} = this.props.profile.user;
    const {avatar, logo, uploadAvatar, uploadIcon} = this.props.profile;
    const {userType} = this.props.session;
    return (
      <div className={styles.persona}>
        <div className={styles.avatar} style={{backgroundImage: `url(${avatar || avatarPlaceholder})`}}>
          <input className={styles.imageUpload} type="file" accept="image/*" onChange={uploadAvatar} />
          <div className={styles.logoWrapper}>
            {userType === 'teamManager' && <input className={styles.imageUpload} type="file" accept="image/*" onChange={uploadIcon}/>}
            <img className={styles.logo} src={logo || iconPlaceholder} />
          </div>
        </div>
        <div className={styles.fullName}>{`${first_name} ${last_name}`}</div>
        <div className={styles.companyName}>{team}</div>
      </div>
    );
  }

  renderFields = () => {
    const {email, team} = this.props.profile.user;
    return (
      <Segment>
        {this.renderField('E-mail', email)}
        {this.renderField('Account Type', team ? 'Team' : 'Personal')}
        {this.renderField('Customize', <FontAwesome className={styles.icon} name="chevron-right" />, this.goToCustomize)}
      </Segment>
    );
  }

  renderYoutube = () => (
    <div className={styles.youtubeButton}>
      <div>Link with</div>
      <img className={styles.youtube} src={youtube} />
    </div>
  )

  renderLinks = () => (
    <Segment title="Links">
      <GoogleLogin
        className={styles.googleLogin}
        buttonText={this.renderYoutube()}
        clientId="814043436795-k11mvtqeal0rmj7dob63c092lmlit08l.apps.googleusercontent.com"
        scope="https://www.googleapis.com/auth/youtube"
        responseType="code"
        onSuccess={console.log}
        onFailure={console.log}
        redirectUri="http://google.com"
      />
    </Segment>
  )

  render() {
    const {user} = this.props.profile;
    return (
      <div className={styles.container}>
        {user && this.renderPersona()}
        {user && this.renderFields()}
        {user && this.renderLinks()}

      </div>
    );
  }
}
