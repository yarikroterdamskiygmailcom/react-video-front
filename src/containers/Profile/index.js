import React, {Component} from 'react';
import {isEmpty, noop} from 'lodash-es';
import styles from './styles.scss';
import {ProgressBar} from '../../atoms';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {Overlay, Preview, Modal} from '../../components';
import {withRouter} from 'react-router';
import FontAwesome from 'react-fontawesome';
import placeholder from './profile-placeholder.png';

@withRouter
@inject('profile')
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
      if(this.props.profile.user.team) {
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
    const {avatar, logo} = this.props.profile;
    return (
      <div className={styles.persona}>
        <div className={styles.avatar} style={{backgroundImage: `url(${avatar || placeholder})`}}>
          <div className={styles.logoWrapper}>
            <img className={styles.logo} src={logo}/>
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
      <div className={styles.fields}>
        {this.renderField('E-mail', email)}
        {this.renderField('Account Type', team ? 'Team' : 'Personal')}
        {this.renderField('Customize', <FontAwesome className={styles.icon} name="chevron-right"/>, this.goToCustomize)}
      </div>
    );
  }

  render() {
    const {user} = this.props.profile;
    return (
      <div className={styles.container}>
        {user && this.renderPersona()}
        {user && this.renderFields()}
      </div>
    );
  }
}
