import React, {Component} from 'react';
import styles from './styles.scss';
import Input from '../Input';

class Profile extends Component {

  render() {
    return (
      <div className={styles.container}>
        <Input fieldName="First Name" nameTop/>
        <Input fieldName="Last Name" nameTop/>
      </div>
    );
  }
}

export default Profile;
