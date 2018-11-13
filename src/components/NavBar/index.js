import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {Icon} from '../../atoms';
import {ConfirmProfessional} from '../';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import styles from './styles.scss';
import Overlay from '../Overlay';
import {Modal} from '../';
import FontAwesome from 'react-fontawesome';

@withRouter
@inject('templates')
@inject('project')
@observer
export default class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlayOpen: false,
      overlay: 'main',
    };
  }

  openOverlay = () => this.setState({overlayOpen: true})

  closeOverlay = () => {
    this.setState({overlayOpen: false});
    setTimeout(() => this.setState({overlay: 'main'}), 200);
  }

  setOverlay = overlay => () => {
    overlay === 'template' && this.loadTemplates();
    this.setState({overlay});
  }

  startFromScratch = () => {
    this.props.project.startFromScratch()
    .then(() => this.props.history.push('/edit-vlog'));
  }

  startProfessional = () => {
    this.props.project.startProfessional()
    .then(() => this.props.history.push('/edit-vlog'));
  }

  startFromTemplate = i => () => {
    this.props.project.startFromTemplate(i)
    .then(() => this.props.history.push('/template'));
  }

  loadTemplates = () => {
    this.setState({pending: true});
    this.props.templates.loadTemplates()
    .then(() => this.setState({pending: false}));
  }

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

  renderSpinner = () => (
    <div className={styles.option}>
      <FontAwesome className={styles.spinner} name="spinner" />
    </div>
  )

  renderTemplate = ({title}, i) => (
    <div key={title} className={styles.option} onClick={this.startFromTemplate(i)}>
      {title}
    </div>
  );

  renderRoute = ({name, icon, path, onClick}) => path
    ? (
      <NavLink key={name} to={path} className={styles.route} activeClassName={styles.active}>
        <Icon className={styles.icon} name={icon} />
        <div className={styles.routeName}>{name}</div>
      </NavLink>
    )

    : (
      <div key={name} className={styles.route} onClick={onClick}>
        <Icon className={styles.icon} name={icon} />
        <div className={styles.routeName}>{name}</div>
      </div>
    )

  renderOverlay = () => {
    const {overlay, pending} = this.state;
    switch (overlay) {
      case 'main': return (
        <div className={classNames(styles.options, this.state.overlayOpen && styles.active)}>
          <div className={styles.optionsGroup}>
            <div className={styles.optionsHeader}>Create Vlog</div>
            <div className={styles.option} onClick={this.setOverlay('template')}>From template</div>
            <div className={styles.option} onClick={this.startFromScratch}>From scratch</div>
            <div className={styles.option} onClick={this.setOverlay('modal')}>
              <div className={styles.prof}>Professional Vlog</div>
            </div>
          </div>
          <div className={styles.optionsGroup}>
            <div className={styles.option} onClick={this.closeOverlay}>Cancel</div>
          </div>
        </div>
      );

      case 'template': return (
        <div className={classNames(styles.options, this.state.overlayOpen && styles.active)}>
          <div className={styles.optionsGroup}>
            <div className={styles.optionsHeader}>Choose template</div>
            {pending
              ? this.renderSpinner()
              : this.props.templates.templates.map(this.renderTemplate)
            }
          </div>
          <div className={styles.optionsGroup}>
            <div className={styles.option} onClick={this.closeOverlay}>Cancel</div>
          </div>
        </div>
      );

      case 'modal': return <ConfirmProfessional onCancel={this.setOverlay('main')} onConfirm={this.startProfessional}/>;

      default: return null;
    }
  }

  render() {
    const {overlayOpen} = this.state;
    return (
      <div className={styles.container}>
        {this.routes.map(this.renderRoute)}
        <Overlay active={overlayOpen} onClose={this.closeOverlay}>
          {this.renderOverlay()}
        </Overlay>
      </div>
    );
  }
}
