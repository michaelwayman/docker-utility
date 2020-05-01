import React, {Component} from 'react';

import computer from '../../images/computer.svg';
import Button, {DropdownItem} from '../Button';
import CreateContainerModal from '../Modal/CreateContainerModal';
import TabbedContainer from '../TabbedContainer';
import {ImageEnvTab} from '../TabbedContainer/EnvTab';
import ImageContainersTab from '../TabbedContainer/ImageContainersTab';
import ImageSummaryTab from '../TabbedContainer/ImageSummaryTab';
import withIPCFeed from '../withIPCFeed';


const tabData = {
  'summary': ImageSummaryTab,
  'env': ImageEnvTab,
  'containers': ImageContainersTab,
};


class ImageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
    };
    this.handleCommandClick = this.handleCommandClick.bind(this);
    this.handleCreateContainerCommand = this.handleCreateContainerCommand.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentDidMount() {
    this.props.setSignalArg(this.props.image);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.image !== this.props.image) {
      this.props.setSignalArg(this.props.image);
    }
  }

  handleCommandClick(e, {command}) {
    e.preventDefault();

    switch (command) {
      case 'remove-image':
      case 'remove-all-image-containers':
      case 'remove-stopped-image-containers':
        window.ipcRenderer.send(command, this.props.image);
        break;
      default:
        break;
    }

  }

  handleCreateContainerCommand(containerOptions) {
    const data = {...containerOptions};
    data['image'] = this.props.imageDetails.RepoTags[0].split(':')[0];
    window.ipcRenderer.send('create-container', data);
    this.setState({showCreateModal: false});
  }

  handleModalClose() {
    this.setState({showCreateModal: false});
  }

  render() {
    return (
      <React.Fragment>
        <CreateContainerModal visible={this.state.showCreateModal}
                              createContainer={this.handleCreateContainerCommand}
                              close={this.handleModalClose}
                              imageDetails={this.props.imageDetails}/>
        <div className='topContentWrapper'>
          <div className='topContent'>
            <div className='computer'>
              <img alt='computer' src={computer}/>
            </div>
            <div className='commands'>
              <div className='inner'>
                <div className='commandContainer'>
                  <Button label='Create Container' onClick={e => this.setState({showCreateModal: true})}/>
                  <Button red command='remove-image' label='Delete Image' onClick={this.handleCommandClick}/>
                  <Button red label='Delete Containers'>
                    <DropdownItem
                      onClick={e => this.handleCommandClick(e, {command: 'remove-stopped-image-containers'})}>
                      Delete Stopped Containers
                    </DropdownItem>
                    <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'remove-all-image-containers'})}>
                      Delete All Containers
                    </DropdownItem>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bottomContentWrapper'>
          <div className='bottomContent'>
            {!!this.props.imageDetails && <TabbedContainer initial={'summary'} tabData={tabData} {...this.props} />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default withIPCFeed(ImageDetail, 'image-info', 5000, feedData => {
  return {
    imageDetails: feedData,
  };
});
