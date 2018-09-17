import React, {Component} from 'react';
import styles from './styles.scss';

export default class Segment extends Component {

    renderElement = child => <div className={styles.element}>{child}</div>

    render() {
      const {title, children} = this.props;
      console.log(children);
      return (
        <div className={styles.container}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>
            {React.Children.map(children, this.renderElement)}
          </div>
        </div>
      );
    }
}
