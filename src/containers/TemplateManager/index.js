import React, {Component} from 'react';
import {Segment, SwipeItem, Icon} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {php} from '../../stores';

@withRouter
export default class TemplateManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      revealIndex: null,
      revealSide: null
    };
  }

  loadTemplates = () => php.get('/api/v1/templates')
  .then(({templates}) => this.setState({templates}));

  componentDidMount() {
    this.loadTemplates();
  }

  getSwipeActions = id => ({
    right: [
      {
        label: (
          <div className={styles.icon}>
            <Icon name="trash"/>
            <div>Delete</div>
          </div>
        ),
        func: this.deleteTemplate(id)
      }
    ]
  })

  setReveal = i => side => () => this.setState({revealIndex: i, revealSide: side})

  resetReveal = () => this.setState({revealIndex: null, revealSide: null})

  goToEditor = () => this.props.history.push('/template-editor')

  deleteTemplate = id => () => php.delete(`/api/v1/templates/${id}`)
  .then(this.loadTemplates)

  renderHeader = () => (
    <div className={styles.header}>
      <div>Your Templates</div>
      <div className={styles.add} onClick={this.goToEditor}>+ Add</div>
    </div>
  )

  renderTemplate = (template, i) => (
    <SwipeItem
      key={template.id}
      className={styles.template}
      reveal={this.state.revealIndex === i && this.state.revealSide}
      onSwipe={this.setReveal(i)}
      actions={this.getSwipeActions(template.id)}
      afterAction={this.resetReveal}
    >
      <div>{template.title}</div>
      <div>{`Created by: ${template.owner.first_name} ${template.owner.last_name}`}</div>
    </SwipeItem>
  )

  render() {
    const {templates} = this.state;
    return (
      <div className={styles.container}>
        <Segment elementClassName={styles.element} title={this.renderHeader()}>
          {templates.map(this.renderTemplate)}
        </Segment>
      </div>
    );
  }
}
