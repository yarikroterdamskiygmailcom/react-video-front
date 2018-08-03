import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles';

export default class Arranger extends Component {

  renderItem = () =>
    <div className={styles.item}>
      <div className={styles.thumb}/>
      <div className={styles.info}>
        <div className={styles.title}></div>
        <div className={styles.runtime}></div>
      </div>
      <FontAwesome className={styles.handle} name="bars"/>
    </div>

  render() {
    return (
      <div className={styles.container}>
        {this.props.items.map(this.renderItem)}
      </div>
    );
  }
}
