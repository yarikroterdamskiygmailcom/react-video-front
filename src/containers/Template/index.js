import React, {Component} from 'react';
import {Segment} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {withRouter} from 'react-router';
import {noop, isNumber} from 'lodash-es';

@withRouter
@inject('templates')
@observer
export default class Template extends Component {

  constructor(props) {
    super(props);
    this.resumableRefs = props.templates.activeTemplate.fields.map(() => React.createRef());
  }

  componentWillMount() {
    this.props.templates.handleAssets();
  }

  componentDidMount() {
    this.props.templates.initResumables();
    this.resumableRefs.forEach(ref => ref.current.children[1].accept = 'video/*');
  }

  next = () => {
    this.props.templates.next();
    this.props.history.push('/configure-vlog');
  }

  clearField = i => () => this.props.templates.media[i] = null

  renderField = ({title, type, description, short_description, asset_id}, i) => {
    const progress = this.props.templates.uploading[i];
    return (
      <div key={title} className={classNames(styles.field)}>
        <div
          ref={this.resumableRefs[i]}
          className={classNames(
            styles.button,
            isNumber(progress) && styles.uploading
          )}
          id={`fieldTarget-${i}`}
        >
          {this.props.templates.media[i]
            ? <img
              className={styles.thumb}
              src={this.props.templates.media[i].thumb}
              onClick={this.props.templates.media[i].mediatype === 'asset'
                ? noop
                : this.clearField(i)
              }
            />
            : progress
              ? <div
                className={styles.progressBar}
                style={{width: `${progress}%`}}
              />
              : <FontAwesome name="plus" />}
        </div>
        <div className={styles.stack}>
          <div className={styles.title}>{title}</div>
          <div className={styles.descShort}>{short_description}</div>
        </div>
      </div>
    );
  }

  allowNext = () => {
    const {media, activeTemplate} = this.props.templates;
    return media.length === activeTemplate.fields.length;
  }

  render() {
    const template = this.props.templates.activeTemplate;
    return (
      <div className={styles.container}>
        <Segment title={template.title}>
          {template.fields.map(this.renderField)}
        </Segment>
        <div
          className={classNames(styles.next, this.allowNext() && styles.active)}
          onClick={this.allowNext() ? this.next : noop}
        >
          <FontAwesome name="chevron-right" />
        </div>
      </div>
    );
  }
}
