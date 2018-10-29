import React, {Component} from 'react';
import {Segment} from '../../atoms';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';

export default class Share extends Component {

    youtube = () => {

    }

    renderOption = (left, right, func) => (
      <div className={styles.option} onClick={func}>
        {left}
        {right}
      </div>
    )

    render() {
      return (
        <div className={styles.container}>
          <Segment title="Share">
            {this.renderOption(<div><FontAwesome name="youtube"/> YouTube</div>, <FontAwesome name="chevron-right"/>, this.youtube)}
          </Segment>
        </div>
      );
    }
}
