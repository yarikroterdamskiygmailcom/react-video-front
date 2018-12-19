import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {Icon} from '../../atoms';
import {ConfirmProfessional} from '../';
import {inject, observer} from 'mobx-react';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import {isEmpty} from 'lodash-es';
import {php} from '../../stores';

const renderSpinner = () => (
  <div className={styles.option}>
    <FontAwesome className={styles.spinner} name="spinner" />
  </div>
);

class VlogTypePicker extends Component {

  render() {
    const {onSelect, onClose} = this.props;
    return (
      <div className={styles.options}>
        <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>Create Vlog</div>
          <div className={styles.option} onClick={onSelect('template')}>From template</div>
          <div className={styles.option} onClick={onSelect('scratch')}>From scratch</div>
          <div className={styles.option} onClick={onSelect('professional')}>
            <div className={styles.prof}>Professional Vlog</div>
          </div>
        </div>
        <div className={styles.optionsGroup}>
          <div className={styles.option} onClick={onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

class TemplatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      templates: []
    };
  }

  componentWillMount() {
    php.get('/api/v1/templates')
    .then(res => this.setState({pending: false, templates: res.templates}));
  }

  onSelect = template => () => this.props.onSelect(template)

  renderTemplate = (template, i) => (
    <div
      key={`${template.title}-${i}`}
      className={styles.option}
      onClick={this.onSelect(template)}
    >
      {template.title}
    </div>
  );

  render() {
    const {onClose} = this.props;
    const {pending, templates} = this.state;
    return (
      <div className={styles.options}>
        <div className={styles.optionsGroup}>
          <div className={styles.optionsHeader}>
            {isEmpty(templates) ? 'No templates available' : 'Choose template'}
          </div>
          {pending
            ? renderSpinner()
            : templates.map(this.renderTemplate)
          }
        </div>
        <div className={styles.optionsGroup}>
          <div className={styles.option} onClick={onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

@withRouter
@inject('overlay')
@inject('template')
@inject('project')
@observer
export default class NavBar extends Component {

  start = selection => template => {
    ({
      scratch: () => this.props.project.startFromScratch().then(() => this.props.history.push('/edit-vlog')),
      template: () => this.props.project.startFromTemplate(template).then(() => this.props.history.push('/template')),
      professional: () => this.props.project.startProfessional().then(() => this.props.history.push('/edit-vlog'))
    })[selection]();
    this.props.overlay.closeOverlay();
  }

  handleSelection = selection => () => {
    if (selection === 'scratch') {
      this.start('scratch')();
    } else {
      this.props.overlay.openOverlay({
        template: TemplatePicker,
        professional: ConfirmProfessional
      }[selection])({onSelect: this.start(selection)})();
    }
  }

  routes = [
    {
      name: 'Home',
      icon: 'home',
      path: '/home'
    },
    {
      name: 'Add Vlog',
      icon: 'video',
      onClick: this.props.overlay.openOverlay(VlogTypePicker)({onSelect: this.handleSelection})
    },
    {
      name: 'Profile',
      icon: 'profile',
      path: '/profile'
    },
  ]

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

  render() {
    return (
      <div className={styles.container}>
        {this.routes.map(this.renderRoute)}
      </div>
    );
  }
}
