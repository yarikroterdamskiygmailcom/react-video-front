import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Segment extends Component {

    renderElement = child => (
      <div className={classNames(styles.element, child.props && child.props.noRender && styles.noRender)}>
        {child}
      </div>
    )

    render() {
      const {title, children} = this.props;
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
