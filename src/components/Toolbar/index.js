import React, {Component} from 'react';
import classNames from 'classnames';
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
    document.addEventListener('click', this.closeMenu, {once: true});
  }

  closeMenu = () => this.setState({isOpen: false})

  renderAction = (action, i) =>
    <div key={`action-${i}`} className={styles.action} onClick={action.fn}>
      {action.render}
    </div>

  renderMenu = () =>
    <div className={classNames(styles.menu, this.state.isOpen && styles.open)}>
      {this.props.actions.map(this.renderAction)}
    </div>

  render() {
    const {className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
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
