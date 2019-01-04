import React, {Component} from 'react';
import {isEmpty} from 'lodash-es';
import classNames from 'classnames';
import {Modal} from '../';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@inject('assets')
@observer
export default class SelectAsset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      currentAsset: null
    };
  }

  save = () => {
    this.props.onSave(this.props.assets.assetList[this.state.currentAsset]);
    this.props.onClose();
  }

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Save',
      func: this.save
    }
  ]

  componentWillMount() {
    this.props.assets.loadAssets()
    .then(() => this.setState({pending: false}));
  }

  componentDidMount() {
    !isEmpty(this.props.assets.assetList) && this.selectAsset(0);
  }

  selectAsset = i => {
    this.setState({currentAsset: i});
  }

  renderAsset = ({id, thumb, title, type}, i) => (
    <div key={id} className={classNames(styles.asset, this.state.currentAsset === i && styles.selected)} onClick={() => this.selectAsset(i)}>
      <img className={styles.thumb} src={thumb} />
      <div className={styles.assetData}>
        <div className={styles.assetTitle}>{title}</div>
        <div className={styles.assetType}>{type}</div>
      </div>
    </div>
  )

  render() {
    const {pending} = this.state;
    const {assetList} = this.props.assets;
    return (
      <Modal actions={this.modalActions} className={styles.modal}>
        {assetList.map(this.renderAsset)}
        {isEmpty(assetList)
          && (pending
            ? (
              <div className={styles.empty}>
                <div>Loading your assets...</div>
              </div>
            )

            : (
              <div className={styles.empty}>
                <div>No assets found.</div>
                <div>Add assets easily through the "Customize" panel!</div>
              </div>
            )
          )
        }
      </Modal>
    );
  }
}
