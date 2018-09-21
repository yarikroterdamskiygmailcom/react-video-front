import React, {Component} from 'react';
import classNames from 'classnames';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

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

  //TODO: WTF
  closeMenu = () => this.setState({isOpen: false}, () => this.setState({isOpen: false}));

  renderAction = (action, i) =>
    <div key={`action-${i}`} className={styles.action} onClick={action.fn}>
      <Icon className={styles.actionIcon} name={action.icon}/>
      {action.render}
    </div>

  renderMenu = () =>
    <div className={classNames(styles.menu, this.state.isOpen && styles.open)}>
      <div className={styles.menuInner}>
        <div className={styles.menuHeader}>Add</div>
        {this.props.actions.map(this.renderAction)}
      </div>
      <div className={styles.menuClose} onClick={this.closeMenu}>Cancel</div>
    </div>

  render() {
    const {className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={classNames(styles.overlay, this.state.isOpen && styles.active)}/>
        <div className={styles.left} onClick={this.openMenu}>
          <FontAwesome name="plus"/>
          {this.renderMenu()}
        </div>
        <div className={styles.right} onClick={this.props.next}>
          <FontAwesome name="angle-right" />
        </div>
      </div>
    );
  }
}

export default Toolbar;
