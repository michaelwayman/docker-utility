import React, {Component} from 'react';

import './index.css';


export class Backdrop extends Component {
  render() {
    return (
      <div className='modalBackdrop' onClick={this.props.onClick}></div>
    );
  }
}


export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleBackdropClick(e) {
    e.preventDefault();
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.props.closeModal();
  }

  render() {
    let classes = '';
    if (this.props.visible) {
      classes += ' active';
    }
    return (
      <React.Fragment>
        {this.props.visible && <Backdrop onClick={this.handleBackdropClick}/>}
        <div className={'modal' + classes}>
          <div className='closeContainer' onClick={this.handleBackdropClick}>
            <div className='close'></div>
          </div>
          <div className='modalContent'>
            {this.props.children}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
