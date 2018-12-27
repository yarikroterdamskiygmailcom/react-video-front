import React, {Component} from 'react';
import {Segment} from '../../atoms';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import {php} from '../../stores';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';

@inject('project')
@observer
export default class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      links: {}
    };
  }

  componentWillMount() {
    php.get('api/v1/user/me')
    .then(({links}) => this.setState({links, pending: false}));
  }

  share = platform => () => php.get(`/api/v1/share/${platform}/${this.props.project.projectId}`)

  options = [
    {
      name: 'YouTube',
      key: 'google',
      icon: 'youtube',
      func: this.share('google')
    },
    {
      name: 'Facebook',
      key: 'facebook',
      icon: 'facebook',
      func: this.share('facebook')
    }
  ]

  renderOption = ({name, key, icon, func}) => (
    <div className={classNames(styles.option, this.state.links[key] && styles.active)} onClick={func}>
      <FontAwesome className={styles.icon} name={icon}/>
      <div>{this.state.links[key] ? `Share on ${name}` : `${name} not linked`}</div>
    </div>
  )

  render() {
    const {pending} = this.state;
    return (
      <div className={styles.container}>
        <Segment title="Share">
          {this.options.map(this.renderOption)}
        </Segment>
      </div>
    );
  }
}
