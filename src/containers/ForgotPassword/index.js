import React, {Component} from 'react';
import styles from './styles.scss';
import {Input, Button} from '../../atoms';

export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

    onChange = e => {
      this.setState({email: e.target.value});
    }

    submit = () => {

    }

    render() {
      return (
        <div className={styles.container}>
          <div>Forgot your password? Enter your Email below and we'll send you a link to reset your password.</div>
          <Input value={this.state.email} onChange={this.onChange} fieldName="Email" />
          <Button onClick={this.submit} text="Submit" />
        </div>
      );
    }
}
