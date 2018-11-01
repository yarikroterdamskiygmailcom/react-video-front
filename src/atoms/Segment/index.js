import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Segment extends Component {

    renderElement = child => (
      ((child.props && child.props.noRender) || this.props.hideChildren)
        ? null
        : (
          <div className={styles.element}>
            {child}
          </div>
        )
    )

    render() {
      const {title, hideChildren, children, className} = this.props;
      return (
        <div className={classNames(styles.container, className)}>
          <div className={styles.title}>{title}</div>
          <div className={classNames(styles.content, hideChildren && styles.hidden)}>
            {React.Children.map(children, this.renderElement)}
          </div>
        </div>
      );
    }
}
