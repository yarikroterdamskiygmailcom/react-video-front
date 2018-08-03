import React, {Component} from 'react';
import styles from './styles.scss';

export default class Carousel extends Component {

    renderItem = item =>
      <div key={item.thumb} className={styles.item} onClick={item.fn}>
        <div className={styles.thumb} style={{background: `url(${item.thumb})`}}/>
        <div className={styles.title}>{item.title || 'Untitled'}</div>
        <div className={styles.duration}>{item.duration}</div>
      </div>

    render() {
      console.log(this.props.items);
      return (
        <div className={styles.container}>
          <div className={styles.header}>{this.props.title}</div>
          <div className={styles.items}>
            {this.props.items.map(this.renderItem)}
          </div>
        </div>
      );
    }
}
