import React, {Component} from 'react';
import Button from '../Button';
import './CreateContainerModal.css';
import Modal from './index';


class RenameContainerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      container: '',
      formData: {
        name: '',
      },
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const returnValue = {};
    if (!!props.containerDetails && state.container !== props.containerDetails.Id) {
      returnValue.container = props.containerDetails.Id;
      const name = props.containerDetails.Name;
      returnValue.formData = {name: props.containerDetails.Name.slice(1, name.length)};
    }
    return returnValue;
  }

  handleOnChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const formData = {...this.state.formData};
    formData[name] = value;

    this.setState({
      formData,
    });
  }

  render() {
    return (
      <Modal visible={this.props.visible} closeModal={this.props.close}>
        <div className='createContainerModal'>
          <h2>Rename container</h2>
          <div className='name'>
            <div className='title'>Container Name</div>
            <input name='name' className='input' onChange={this.handleOnChange} value={this.state.formData.name}/>
          </div>
          <Button label='Rename Container' onClick={e => this.props.renameContainer(this.state.formData)}/>
        </div>
      </Modal>
    );
  }
}


export default RenameContainerModal;
