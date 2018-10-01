import React, {Component} from 'react';
import {Segment} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';

@inject('templates')
@observer
export default class Template extends Component {

  componentDidMount() {
    this.props.templates.initResumables();
  }

  renderField = ({title, type, description, short_description}, i) => (
    <div className={classNames(styles.field, this.props.templates.uploading.includes(i) && styles.active)}>
      <div className={styles.button} id={`fieldTarget-${i}`}>
        <FontAwesome name="plus" />
      </div>
      <div className={styles.stack}>
        <div className={styles.title}>{title}</div>
        <div className={styles.descShort}>{short_description}</div>
      </div>
    </div>
  )

  render() {
    const template = this.props.templates.activeTemplate;
    return (
      <div className={styles.container}>
        <Segment title={template.title}>
          {template.fields.map(this.renderField)}
        </Segment>
      </div>
    );
  }
}
