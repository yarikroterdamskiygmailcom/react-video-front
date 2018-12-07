import React, {Component} from 'react';
import {Segment, SwipeItem, Icon} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';

@withRouter
@inject('templates')
@observer
export default class TemplateManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealIndex: null,
      revealSide: null
    };
  }

  componentDidMount() {
    this.props.templates.loadTemplates();
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

  deleteTemplate = id => () => this.props.templates.deleteTemplate(id)

  renderHeader = () => (
    <div className={styles.header}>
      <div>Your Templates</div>
      <div className={styles.add} onClick={this.goToEditor}>Add</div>
    </div>
  )

  renderTemplate = (template, i) => (
    <SwipeItem
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
    const {templates} = this.props.templates;
    return (
      <div className={styles.container}>
        <Segment elementClassName={styles.element} title={this.renderHeader()}>
          {templates.map(this.renderTemplate)}
        </Segment>
      </div>
    );
  }
}
