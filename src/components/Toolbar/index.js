import React, {Component} from 'react';
import classNames from 'classnames';
import {Icon} from '../../atoms';
import {Overlay} from '../../components';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {noop} from 'lodash-es';

@inject('session')
@observer
class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  openMenu = () => {
    this.setState({isOpen: true});
  }

  closeMenu = e => {
    e && e.stopPropagation();
    this.setState({isOpen: false});
  }

  handleClick = func => e => {
    e.stopPropagation();
    this.closeMenu();
    func();
  }

  renderAction = (action, i) =>
    <div key={`action-${i}`} className={styles.action} onClick={this.handleClick(action.fn)}>
      <Icon className={styles.actionIcon} name={action.icon} />
      {action.render}
    </div>

  renderMenu = () =>
    <div className={styles.menu}>
      <div className={styles.menuInner}>
        <div className={styles.menuHeader}>Add</div>
        {this.props.actions.map(this.renderAction)}
      </div>
      <div className={styles.menuClose} onClick={this.closeMenu}>Cancel</div>
    </div>

  render() {
    const {className, allowNext, next, session} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.left} onClick={this.openMenu}>
          <FontAwesome name="plus" />
        </div>
        <div className={classNames(styles.right, !allowNext && styles.disabled)} onClick={allowNext ? next : noop}>
          <FontAwesome name="angle-right" />
        </div>
        <Overlay active={this.state.isOpen} onClose={this.closeMenu}>
          {this.renderMenu()}
        </Overlay>
      </div>
    );
  }
}

export default Toolbar;
