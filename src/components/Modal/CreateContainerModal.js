import React, {Component} from 'react';
import folderImg from '../../images/folder-add.png';
import Button from '../Button';
import './CreateContainerModal.css';
import Modal from './index';


class CreateContainerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        hostPort: '',
        containerPort: '',
        hostDir: '',
        containerDir: '',
      }
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const returnValue = {};
    if (!!props.imageDetails && state.image !== props.imageDetails.Id) {
      returnValue.image = props.imageDetails.Id;
      returnValue.formData = {name: '', hostPort: '', containerPort: '', hostDir: '', containerDir: ''};
    }
    if (state.formData.containerDir === '' && props.imageDetails && props.imageDetails.Config) {
      const formData = {...state.formData};
      formData.containerDir = props.imageDetails.Config.WorkingDir || '/';
      returnValue.formData = formData;
    }
    return returnValue;
  }

  componentDidMount() {
    window.ipcRenderer.on('select-folder', (event, arg) => {
      const formData = {...this.state.formData};
      formData['hostDir'] = arg;
      this.setState({formData});
    });
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
          <h2>Create container with options</h2>
          <div className='name'>
            <div className='title'>Container Name</div>
            <input name='name' className='input' onChange={this.handleOnChange} value={this.state.formData.name}/>
          </div>
          <div className='ports'>
            <div className='title'>Publish Ports</div>
            <span>container: <input name='containerPort' className='input' onChange={this.handleOnChange}
                                    value={this.state.formData.containerPort}/></span>
            <span>host: <input name='hostPort' className='input' onChange={this.handleOnChange}
                               value={this.state.formData.hostPort}/></span>
          </div>
          <div className='mounts'>
            <div className='title'>Shared Volumes</div>
            container:
            <div>
              <input name='containerDir' className='input' onChange={this.handleOnChange}
                     value={this.state.formData.containerDir}/>
            </div>
            host:
            <div className='buttonGroup'>
              <input name='hostDir' className='input' onChange={this.handleOnChange}
                     value={this.state.formData.hostDir}/>
              <div className='inputButton' onClick={e => {
                window.ipcRenderer.send('select-folder');
              }}>
                <img alt='folder' src={folderImg}/>
              </div>
            </div>
          </div>
          <Button label='Create Container' onClick={e => this.props.createContainer(this.state.formData)}/>
        </div>
      </Modal>
    );
  }
}


export default CreateContainerModal;
