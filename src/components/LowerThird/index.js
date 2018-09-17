import React, {Component} from 'react';
import {Input, Toggle, Button, Seperator, RadioButton} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';

@inject('vlogEditor')
@observer
export default class LowerThird extends Component {

  renderButton = value => {
    const {lowerThirdSide, toggleLowerThirdSide} = this.props.vlogEditor;
    return (
      <div className={classNames(styles.button, value.toLowerCase() === lowerThirdSide && styles.active)} onClick={toggleLowerThirdSide}>
        {value}
      </div>
    );
  }

  render() {
    const {lowerThirdSecondLine, toggleLowerThirdSecondLine} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Input className={styles.input} fieldName="Name" nameTop />
          <Input className={styles.input} fieldName="Function" nameTop/>
          <Toggle label="Used second line" desc="Use it for function or company name" value={lowerThirdSecondLine} onChange={toggleLowerThirdSecondLine}/>
        </div>
        <Seperator/>
        <div className={styles.content}>
          <div>Lower Third Style</div>
          <div className={styles.switcherRow}>
            {this.renderButton('Left')}
            {this.renderButton('Right')}
          </div>
          <Toggle label="Use logo" desc="Use it for function or company name"/>
        </div>
        <div className={styles.actions}>
          <Seperator className={styles.seperator}/>
          <div className={styles.confirmRow}>
            <div className={styles.button}>Cancel</div>
            <div className={styles.button}>Next</div>
          </div>
        </div>

      </div>
    );
  }
}
