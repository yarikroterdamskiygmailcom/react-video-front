import React, {Component} from 'react';
import {Segment} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';

@withRouter
@inject('templates')
@observer
export default class TemplateManager extends Component {

  componentDidMount() {
    this.props.templates.loadTemplates();
  }

  goToEditor = () => this.props.history.push('/template-editor')

    renderHeader = () => (
      <div className={styles.header}>
        <div>Your Templates</div>
        <div onClick={this.goToEditor}>Add</div>
      </div>
    )

    renderTemplate = template => (
      <div className={styles.template}>

      </div>
    )

    render() {
      const {templates} = this.props.templates;
      return (
        <div className={styles.container}>
          <Segment title={this.renderHeader()}>
            {templates.map(this.renderTemplate)}
          </Segment>
        </div>
      );
    }
}
