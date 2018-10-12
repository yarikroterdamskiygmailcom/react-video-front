import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {Icon} from '../../atoms';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import styles from './styles.scss';
import Overlay from '../Overlay';

@withRouter
@inject('templates')
@observer
export default class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      fromTemplate: false
    };
  }

  openOverlay = () => this.setState({isOpen: true})

  closeOverlay = () => this.setState({isOpen: false, fromTemplate: false})

  routes = [
    {
      name: 'Home',
      icon: 'home',
      path: '/home'
    },
    {
      name: 'Add Vlog',
      icon: 'camera',
      onClick: this.openOverlay
    },
    {
      name: 'Profile',
      icon: 'profile',
      path: '/profile'
    },
  ]

  startFromScratch = () => this.props.history.push('/add-vlog')

  startFromTemplate = i => () => {
    this.props.templates.setTemplate(i);
    this.props.history.push('template');
  }

  loadTemplates = () => {
    this.props.templates.loadTemplates().then(() => {
      this.setState({fromTemplate: true});
    });

  }

  renderTemplate = ({title}, i) => (
    <div key={title} className={styles.option} onClick={this.startFromTemplate(i)}>
      {title}
    </div>
  );

  renderRoute = ({name, icon, path, onClick}) => path
    ? <NavLink key={name} to={path} className={styles.route} activeClassName={styles.active}>
      <Icon className={styles.icon} name={icon} />
      <div className={styles.routeName}>{name}</div>
    </NavLink>

    : <div key={name} className={styles.route} onClick={onClick}>
      <Icon className={styles.icon} name={icon} />
      <div className={styles.routeName}>{name}</div>
    </div>

  renderOverlayContent = () => (
    <div className={styles.options}>
      {this.state.fromTemplate
        ? <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>Choose template</div>
          {this.props.templates.templates.map(this.renderTemplate)}
        </div>
        : <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>Add Vlog</div>
          <div className={styles.option} onClick={this.loadTemplates}>Start from template</div>
          <div className={styles.option} onClick={this.startFromScratch}>Start from scratch</div>
        </div>}
      <div className={styles.optionsGroup}>
        <div className={styles.option} onClick={this.closeOverlay}>Cancel</div>
      </div>
    </div>
  )

  render() {
    const {isOpen} = this.state;
    return (
      <div className={styles.container}>
        {this.routes.map(this.renderRoute)}
        <Overlay active={isOpen} content={this.renderOverlayContent()} onClose={this.closeOverlay} />
      </div>
    );
  }
}
