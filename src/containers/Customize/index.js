import React, {Component} from 'react';
import styles from './styles.scss';
import {Segment, Carousel, SwipeItem, Icon} from '../../atoms';
import {Overlay, Preview, StyleEditor} from '../../components';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {isEmpty} from 'lodash-es';

@inject('assets')
@observer
export default class Customize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOpen: false,
      personalOpen: false,
      overlayOpen: false,
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
    this.props.assets.initResumable();
  }

  deleteAsset = id => () => this.props.assets.deleteAsset(id).then(this.closeOverlay)

  openStyleEditor = () => this.setState({
    overlayOpen: true,
    overlayContent: <StyleEditor onClose={this.closeOverlay} onSave={this.props.assets.uploadStyle} />
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

  closeOverlay = () => this.setState({overlayOpen: false})

  renderThumb = ({type, thumb, src}) => <img className={styles.thumb} src={thumb} onClick={this.openPreview(type, src)} />

  renderAsset = asset => {
    switch (asset.type) {
      case 'image': return this.renderThumb({...asset, thumb: asset.src});
      case 'video': return this.renderThumb(asset);
      // case 'audio': return this.renderThumb()
      default: throw new Error();
    }
  }

  renderHeader = type => (
    <div className={styles.header} onClick={this.toggleSegment(type)}>
      <div>{`${type} Assets`}</div>
      <div className={styles.upload} id={`${type.toLowerCase()}upload`}>Upload +</div>
    </div>
  )

  reveal = (group, i) => side => () => this.setState({
    reveal: {
      ...this.state.reveal,
      [group]: {index: i, side}
    }
  })

  deleteStyle = id => () => this.props.assets.deleteStyle(id)

  getSwipeActions = id => ({
    left: [
      {
        label: (
          <div className={styles.actionLabel}>
            <Icon className={styles.icon} name="trim"/>
            <div>Edit</div>
          </div>
        ),
        func: () => null
      }
    ],
    right: [
      {
        label: (
          <div className={styles.actionLabel}>
            <Icon className={styles.icon} name="trash"/>
            <div>Delete</div>
          </div>
        ),
        func: this.deleteStyle(id)
      }
    ]
  })

  renderStyle = group => ({backgroundcolor, font, name, textcolor, id}, i) => (
    <SwipeItem
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
        <div className={styles.upload} onClick={this.openStyleEditor}>Add +</div>
      </div>
      <div className={styles.style}>
        <div className={styles.styleGroup}>
          <div>NAME</div>
          <div>FONT</div>
        </div>
        <div className={styles.styleGroup}>
          <div>TEXT</div>
          <div>BACK</div>
        </div>
      </div>
      {styleList.map(this.renderStyle(group))}
    </div>
  );

  render() {
    const {assetList, styleList} = this.props.assets;
    const {overlayOpen, overlayContent, teamOpen, personalOpen} = this.state;

    const personalAssets = assetList.filter(asset => asset.access === 'personal');
    const personalVideos = personalAssets.filter(asset => asset.type = 'video');
    const personalImages = personalAssets.filter(asset => asset.type = 'image');
    const personalAudio = personalAssets.filter(asset => asset.type = 'audio');

    const teamAssets = assetList.filter(asset => asset.access === 'team');
    const teamVideos = teamAssets.filter(asset => asset.type === 'video');
    const teamImages = teamAssets.filter(asset => asset.type === 'image');
    const teamAudio = teamAssets.filter(asset => asset.type === 'audio');

    return (
      <div className={styles.container}>
        <Segment title={this.renderHeader('personal')} hideChildren={!personalOpen}>
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
          {this.renderStyles(styleList, 'personal')}
        </Segment>
        <Segment title={this.renderHeader('team')} hideChildren={!teamOpen}>
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
          {this.renderStyles(styleList, 'team')}
        </Segment>
        <Overlay active={overlayOpen} onClose={this.closeOverlay}>
          {overlayContent}
        </Overlay>
      </div>
    );
  }
}
