import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import svgs from './icons';

export default class Icon extends Component {

  render() {
    const {name, className, onClick} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <object data={svgs[name]}/>
        <div className={styles.clickable} onClick={onClick}/>
      </div>
    );
  }
}
