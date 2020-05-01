import React, {Component} from 'react';
import {stringMultiLine} from '../../lib/helpers';
import Button from '../Button';
import './ErrorModal.css';
import Modal from './index';

class ErrorModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      error: '',
    };
  }

  componentDidMount() {
    window.ipcRenderer.on('error', (event, arg) => {
      this.setState({
        visible: true,
        error: arg,
      });
    });
  }

  render() {
    return (
      <Modal visible={this.state.visible} closeModal={() => this.setState({visible: false})}>
        <div className='errorModal'>
          <h2>Error</h2>
          <div className='errorModalContent'>
            {stringMultiLine(this.state.error)}
          </div>
          <Button label='Ok' onClick={(e) => this.setState({visible: false})}/>
        </div>
      </Modal>
    );
  }
}


export default ErrorModal;
