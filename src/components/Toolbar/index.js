import React, {Component} from 'react';
import classNames from 'classnames';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {noop} from 'lodash-es';

class Menu extends Component {

  handleClick = func => () => {
    this.props.onClose();
    func();
  }

  renderAction = (action, i) =>
    <div key={`action-${i}`} className={styles.action} onClick={this.handleClick(action.fn)}>
      <Icon className={styles.actionIcon} name={action.icon} />
      {action.render}
    </div>

  render() {
    const {actions} = this.props;
    return (
      <div className={styles.menu}>
        <div className={styles.menuInner}>
          <div className={styles.menuHeader}>Add</div>
          {actions.map(this.renderAction)}
        </div>
        <div className={styles.menuClose} onClick={this.props.onClose}>Cancel</div>
      </div>
    );
  }
}

@inject('overlay')
@observer
class Toolbar extends Component {

  render() {
    const {className, allowNext, next, actions} = this.props;
    const {openOverlay} = this.props.overlay;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.left} onClick={openOverlay(Menu)({actions})}>
          <FontAwesome name="plus" />
        </div>
        <div className={classNames(styles.right, !allowNext && styles.disabled)} onClick={allowNext ? next : noop}>
          <FontAwesome name="angle-right" />
        </div>
      </div>
    );
  }
}

export default Toolbar;
