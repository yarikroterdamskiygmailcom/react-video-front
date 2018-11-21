import React, {Component} from 'react';
import styles from './styles.scss';
import {Segment, Carousel, SwipeItem, Icon} from '../../atoms';
import {Overlay, Preview, StyleEditor, ConfirmationPrompt} from '../../components';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import trash from '../../../assets/trash.png';

@inject('assets')
@inject('session')
@observer
export default class Customize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOpen: false,
      personalOpen: false,
      overlayOpen: false,
      deleteMode: false,
      assetsToDelete: [],
      reveal: {
        personal: {},
        team: {}
      }
    };
  }

  componentWillMount() {
    this.props.assets.loadAssets();
    this.props.assets.loadStyles();
  }

  componentDidMount() {
    this.props.assets.initResumables(this.props.session.userType === 'teamManager');
  }

  deleteAsset = id => this.props.assets.deleteAsset(id)

  deleteAssets = () => isEmpty(this.state.assetsToDelete)
    ? this.toggleDeleteMode()
    : this.setState({
      overlayOpen: true,
      overlayContent: (
        <ConfirmationPrompt
          onCancel={() => {
            this.toggleDeleteMode();
            this.setState({assetsToDelete: []});
            this.closeOverlay();
          }}
          onProceed={() => {
            this.toggleDeleteMode();
            Promise.all(this.state.assetsToDelete.map(id => this.deleteAsset(id)))
            .then(this.props.assets.loadAssets);
            this.setState({assetsToDelete: []});
            this.closeOverlay();

          }}
          body={`Are you sure you want to delete ${this.state.assetsToDelete.length} assets? This can not be undone.`}
        />
      )
    })

  uploadStyle = group => style => this.props.assets.uploadStyle(group, style)
  .then(this.props.assets.loadStyles)

  openStyleEditor = group => () => this.setState({
    overlayOpen: true,
    overlayContent: <StyleEditor onClose={this.closeOverlay} onSave={this.uploadStyle(group)} />
  })

  toggleSegment = type => () => this.setState({[`${type}Open`]: !this.state[`${type}Open`]})

  openPreview = (type, src) => () => {
    const content = (type => {
      switch (type) {
        case 'image': return <img className={styles.imagePreview} src={src} />;
        case 'video': return <Preview src={src} />;
        default: throw new Error();
      }
    })(type);
    this.setState({overlayOpen: true, overlayContent: content});
  }

  closeOverlay = () => {
    this.setState({overlayOpen: false});
    setTimeout(() => this.setState({overlayContent: null}), 200);
  }

  scheduleAssetDeletion = id => () => this.setState({
    assetsToDelete: this.state.assetsToDelete.includes(id)
      ? this.state.assetsToDelete.filter(x => x !== id)
      : [...this.state.assetsToDelete, id]
  });

  renderThumb = ({id, thumb, type, src}) => (
    <div key={id} className={styles.asset}>
      <img className={styles.thumb} src={thumb} onClick={this.state.deleteMode ? this.scheduleAssetDeletion(id) : this.openPreview(type, src)} />
      <div className={classNames(styles.check, this.state.assetsToDelete.includes(id) && styles.active)}>
        <FontAwesome className={styles.icon} name="check" />
      </div>
    </div>
  )

  renderAsset = asset => {
    switch (asset.type) {
      case 'image': return this.renderThumb({...asset, thumb: asset.src});
      case 'video': return this.renderThumb(asset);
      // case 'audio': return this.renderThumb()
      default: throw new Error();
    }
  }

  renderPersonalHeader = () => (
    <div className={styles.header} onClick={this.toggleSegment('personal')}>
      <div>Personal Assets</div>
      <div className={styles.upload} id="personalupload">Upload +</div>
    </div>
  )

  renderTeamHeader = () => (
    <div className={styles.header} onClick={this.toggleSegment('team')}>
      <div>Team Assets</div>
      {this.props.session.userType === 'teamManager' && <div className={styles.upload} id="teamupload">Upload +</div>}
    </div>
  )

  reveal = (group, i) => side => () => this.setState({
    reveal: {
      ...this.state.reveal,
      [group]: {index: i, side}
    }
  })

  resetReveal = () => this.setState({
    reveal: {
      personal: {},
      team: {}
    }
  })

  deleteStyle = id => () => this.props.assets.deleteStyle(id)
  .then(this.props.assets.loadStyles)
  .then(this.resetReveal)

  toggleDeleteMode = () => this.setState({deleteMode: !this.state.deleteMode})

  getSwipeActions = id => ({
    left: [
      // {
      //   label: (
      //     <div className={styles.actionLabel}>
      //       <Icon className={styles.icon} name="trim" />
      //       <div>Edit</div>
      //     </div>
      //   ),
      //   func: () => null
      // }
    ],
    right: [
      {
        label: (
          <div className={styles.actionLabel}>
            <Icon className={styles.icon} name="trash" />
            <div>Delete</div>
          </div>
        ),
        func: this.deleteStyle(id)
      }
    ]
  })

  renderStyle = group => ({backgroundcolor, font, name, textcolor, id}, i) => (
    <SwipeItem
      key={`${name}-${i}`}
      className={styles.style}
      onSwipe={this.reveal(group, i)}
      reveal={this.state.reveal[group].index === i && this.state.reveal[group].side}
      actions={this.getSwipeActions(id)}
    >
      <div className={styles.styleGroup}>
        <div>{name}</div>
        <div>{font}</div>
      </div>
      <div className={styles.styleGroup}>
        <div className={styles.color} style={{background: textcolor}} />
        <div className={styles.color} style={{background: backgroundcolor}} />
      </div>
    </SwipeItem>
  )

  renderStyles = (styleList, group) => (
    <div className={styles.styleList}>
      <div className={styles.subHeader}>
        <div>{`${group} Styles`}</div>
        <div className={styles.upload} onClick={this.openStyleEditor(group)}>Add +</div>
      </div>
      {!isEmpty(styleList) && <div className={styles.style}>
        <div className={classNames(styles.styleGroup, styles.header)}>
          <div>NAME</div>
          <div>FONT</div>
        </div>
        <div className={classNames(styles.styleGroup, styles.header)}>
          <div>TEXT</div>
          <div>BACK</div>
        </div>
      </div>}
      {styleList.map(this.renderStyle(group))}
    </div>
  );

  render() {
    const {assetList, styleList} = this.props.assets;
    const {userType} = this.props.session;
    const {overlayOpen, overlayContent, teamOpen, personalOpen} = this.state;

    const personalAssets = assetList.filter(asset => asset.access === 'personal');
    const personalVideos = personalAssets.filter(asset => asset.type === 'video');
    const personalImages = personalAssets.filter(asset => asset.type === 'image');
    const personalAudio = personalAssets.filter(asset => asset.type === 'audio');
    const personalStyles = styleList.filter(style => style.access === 'personal');

    const teamAssets = assetList.filter(asset => asset.access === 'team');
    const teamVideos = teamAssets.filter(asset => asset.type === 'video');
    const teamImages = teamAssets.filter(asset => asset.type === 'image');
    const teamAudio = teamAssets.filter(asset => asset.type === 'audio');
    const teamStyles = styleList.filter(style => style.access === 'team');

    return (
      <div className={styles.container}>
        <Segment title={this.renderPersonalHeader()} hideChildren={!personalOpen}>
          <Carousel
            title="Personal Videos"
            items={personalVideos}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalVideos)}
          />
          <Carousel
            title="Personal Images"
            items={personalImages}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalImages)}
          />
          <Carousel
            title="Personal Audio"
            items={personalAudio}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalAudio)}
          />
          {this.renderStyles(personalStyles, 'personal')}
        </Segment>
        <Segment title={this.renderTeamHeader()} hideChildren={!teamOpen} condition={userType === 'teamManager'}>
          <Carousel
            title="Team Videos"
            items={teamVideos}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamVideos)}
          />
          <Carousel
            title="Team Images"
            items={teamImages}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamImages)}
          />
          <Carousel
            title="Team Audio"
            items={teamAudio}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamAudio)}
          />
          {this.renderStyles(teamStyles, 'team')}
        </Segment>
        <img
          className={classNames(styles.trash, this.state.deleteMode && styles.active)}
          onClick={this.state.deleteMode
            ? this.deleteAssets
            : this.toggleDeleteMode}
          src={trash}
        />
        <Overlay active={overlayOpen} onClose={this.closeOverlay}>
          {overlayContent}
        </Overlay>
      </div>
    );
  }
}
