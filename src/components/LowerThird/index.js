import React, {Component} from 'react';
import {Input, Toggle, Button, Seperator} from '../../atoms';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('vlogEditor')
@observer
export default class LowerThird extends Component {

  render() {
    const {lowerThirdSide, toggleLowerThirdSide} = this.props.vlogEditor;
    return (
      <div className={styles.container}>
        <Input className={styles.input} fieldName="Name" nameTop />
        <Input className={styles.input} fieldName="Function" nameTop/>
        <Toggle label="Used second line"/>
        <Seperator/>
        <div>Lower Third Style</div>
        <div className={styles.row}>
          <Button highlight={lowerThirdSide === 'left'} onClick={toggleLowerThirdSide} text="Left"/>
          <Button highlight={lowerThirdSide === 'right'} onClick={toggleLowerThirdSide} text="Right"/>
        </div>
        <Toggle label="Use logo"/>
        <div className={styles.actions}>
          <Seperator/>
          <div className={styles.row}>
            <div className={styles.button}>Cancel</div>

            <div className={styles.button}>Next</div>
          </div>
        </div>

      </div>
    );
  }
}
