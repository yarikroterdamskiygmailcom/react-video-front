import React, {Component} from 'react';
import styles from './styles.scss';
import {Segment, Carousel} from '../../atoms';
import {Overlay, Preview, StyleEditor} from '../../components';
import {inject, observer} from 'mobx-react';

@inject('assets')
@observer
export default class Customize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOpen: false,
      personalOpen: false,
      overlayOpen: false
    };
  }

  componentWillMount() {
    this.props.assets.loadAssets();
    this.props.assets.loadStyles();
  }

  openStyleEditor = () => this.setState({
    overlayOpen: true,
    overlayContent: <StyleEditor onClose={this.closeOverlay} onSave={() => null}/>
  })

    toggleSegment = type => () => this.setState({[`${type}Open`]: !this.state[`${type}Open`]})

    openPreview = (type, src) => () => {
      const content = (type => {
        switch (type) {
          case 'image': return <img className={styles.imagePreview} src={src}/>;
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
      <div className={styles.header} onClick={this.toggleSegment(type.toLowerCase())}>
        <div>{`${type} Assets`}</div>
        <div className={styles.upload} id={`${type.toLowerCase()}upload`}>Upload +</div>
      </div>
    )

    renderStyle = ({backgroundcolor, font, name, textcolor}) => (
      <div className={styles.style}>
        <div className={styles.styleGroup}>
          <div>{name}</div>
          <div>{font}</div>
        </div>
        <div className={styles.styleGroup}>
          <div className={styles.color} style={{background: textcolor}}/>
          <div className={styles.color} style={{background: backgroundcolor}}/>
        </div>
      </div>
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
        {styleList.map(this.renderStyle)}
      </div>
    );

    render() {
      const {assetList, styleList} = this.props.assets;
      const {overlayOpen, overlayContent, teamOpen, personalOpen} = this.state;
      console.log(this.props.assets.styleList);
      return (
        <div className={styles.container}>
          <Segment title={this.renderHeader('Team')}>
            <Carousel title="Team Videos" items={assetList.filter(asset => asset.type === 'video')} renderFunction={this.renderAsset}/>
            <Carousel title="Team Images" items={assetList.filter(asset => asset.type === 'image')} renderFunction={this.renderAsset}/>
            <Carousel title="Team Audio" items={assetList.filter(asset => asset.type === 'audio')} renderFunction={this.renderAsset}/>
            {this.renderStyles(styleList, 'Team')}
          </Segment>
          <Overlay active={overlayOpen} onClose={this.closeOverlay}>
            {overlayContent}
          </Overlay>
        </div>
      );
    }
}
