import React, {Component} from 'react';
import {Segment, ProgressBar} from '../../atoms';
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

  componentDidMount() {
    this.props.templates.initResumables();
  }

  next = () => {
    this.props.templates.next();
    this.props.history.push('/configure-vlog');
  }

  clearField = i => () => this.props.templates.media[i] = null

  renderField = ({title, type, description, short_description}, i) => {
    const progress = this.props.templates.uploading[i];
    return (
      <div key={title} className={classNames(styles.field)}>
        <div
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
              onClick={this.clearField(i)}
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
