import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import {Arranger, Overlay, Toolbar} from '../../components';
import classNames from 'classnames';
import styles from './styles.scss';
import {ProgressBar} from '../../atoms';

@withRouter
@inject('vlogEditor')
@observer
export default class VlogEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false
    };
  }

  componentWillMount() {
    if (this.props.fromScratch) {
      this.setState({pending: true});
      this.props.vlogEditor.initBlankVlog().then(() => {
        this.setState({pending: false});
      });
    }
  }

  componentDidMount() {
    this.props.vlogEditor.initResumable();
  }

  getActions = () => [
    {
      icon: 'camera',
      render: <div className={styles.vidinput} id="input">Video</div>,
      fn: () => null
    },
    {
      icon: 'crossfade',
      render: <div>Crossfade</div>,
      fn: this.props.vlogEditor.addCrossfade
    },
    {
      icon: 'title',
      render: <div>Title</div>,
      fn: this.props.vlogEditor.openAddTitle
    },
    {
      icon: 'branding',
      render: <div>Branding</div>,
      fn: this.props.vlogEditor.openAddBrandingElement
    }
  ]

  nextStep = () => this.props.history.push('/configure-vlog')

  render() {
    const {uploading, progress, media, overlayActive, overlayContent, closeOverlay} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress}/>
        <div className={styles.header}>Videos & Media</div>
        <Arranger/>
        <Toolbar
          className={styles.toolbar}
          actions={this.getActions()}
          allowNext={media.filter(m => m.mediatype === 'video').length > 0}
          next={this.nextStep}
        />
        <Overlay className={styles.overlay} active={overlayActive} content={overlayContent} onClose={closeOverlay}/>
      </div>
    );
  }
}
