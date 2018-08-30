import React, {Component} from 'react';
import {isEmpty} from 'lodash-es';
import classNames from 'classnames';
import {Button} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@inject('assets')
@inject('session')
@observer
export default class AddBrandingElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentAsset: null
    };
  }

  componentWillMount() {
    this.props.assets.loadAssets(this.props.session.sessionId);
  }

  componentDidMount() {
    !isEmpty(this.props.assets.assetList) && this.selectAsset(0);
  }

  selectAsset = i => {
    this.setState({currentAsset: i});
  }

  renderAsset = ({id, thumb, title, type}, i) => (
    <div key={id} className={classNames(styles.asset, this.state.currentAsset === i && styles.selected)} onClick={() => this.selectAsset(i)}>
      <div className={styles.thumb} style={{background: `url(${thumb})`}} />
      <div className={styles.assetData}>
        <div className={styles.assetTitle}>{title}</div>
        <div className={styles.assetType}>{type}</div>
      </div>
    </div>
  )

  addAsset = () => this.props.vlogEditor.AddBrandingElement(this.props.assets.assetList[this.state.currentAsset])

  render() {
    const {assetList} = this.props.assets;
    const {closeOverlay} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        {assetList.map(this.renderAsset)}
        <div className={styles.actions}>
          <Button text="Cancel" onClick={closeOverlay} />
          <Button text="Confirm" onClick={this.addAsset} />
        </div>
      </div>
    );
  }
}
