import React, {Component} from 'react';

import computer from '../../images/computer.svg';
import Button, {DropdownItem} from '../Button';
import RenameContainerModal from '../Modal/RenameContainerModal';
import TabbedContainer from '../TabbedContainer';
import ContainerSummaryTab from '../TabbedContainer/ContainerSummaryTab';
import {ContainerEnvTab} from '../TabbedContainer/EnvTab';
import withIPCFeed from '../withIPCFeed';


const tabData = {
  'summary': ContainerSummaryTab,
  'env': ContainerEnvTab,
};

class ContainerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRenameModal: false,
    };

    this.renderPowerCommandDropdownItems = this.renderPowerCommandDropdownItems.bind(this);
    this.renderPauseOrResumeDropdownItems = this.renderPauseOrResumeDropdownItems.bind(this);
    this.handleCommandClick = this.handleCommandClick.bind(this);
    this.handleRenameContainerCommand = this.handleRenameContainerCommand.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const derivedState = {
      running: !!props.containerDetails && props.containerDetails.State.Running,
      paused: !!props.containerDetails && props.containerDetails.State.Paused,
    };
    return derivedState;
  }

  componentDidMount() {
    this.props.setSignalArg(this.props.container);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.signalArg !== this.props.container) {
      this.props.setSignalArg(this.props.container);
    }
  }

  handleCommandClick(e, {command}) {
    e.preventDefault();

    switch (command) {
      case 'launch-shell':
      case 'stop-container':
      case 'start-container':
      case 'restart-container':
      case 'pause-container':
      case 'kill-container':
      case 'resume-container':
      case 'remove-container':
        window.ipcRenderer.send(command, this.props.container);
        break;
      default:
        break;
    }
  }

  handleRenameContainerCommand({name}) {
    window.ipcRenderer.send('rename-container', [this.props.container, name]);
    this.setState({showRenameModal: false});
  }

  handleModalClose() {
    this.setState({showRenameModal: false});
  }

  renderPauseOrResumeDropdownItems() {
    if (this.state.paused) {
      return (
        <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'resume-container'})}>
          Resume Container
        </DropdownItem>
      );
    }
    return (
      <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'pause-container'})}>
        Pause Container
      </DropdownItem>
    );
  }

  renderPowerCommandDropdownItems() {
    if (this.state.running) {
      return (
        <React.Fragment>
          <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'stop-container'})}>
            Stop Container
          </DropdownItem>
          <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'restart-container'})}>
            Restart Container
          </DropdownItem>
          {this.renderPauseOrResumeDropdownItems()}
          <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'kill-container'})}>
            Kill Container
          </DropdownItem>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <DropdownItem onClick={e => this.handleCommandClick(e, {command: 'start-container'})}>
          Start Container
        </DropdownItem>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <RenameContainerModal visible={this.state.showRenameModal}
                              renameContainer={this.handleRenameContainerCommand}
                              close={this.handleModalClose}
                              containerDetails={this.props.containerDetails}/>
        <div className='topContentWrapper'>
          <div className='topContent'>
            <div className='computer'>
              <img alt='computer' src={computer}/>
            </div>
            <div className='commands'>
              <div className='inner'>
                <div className='commandContainer'>
                  <Button label='Power Commands'>
                    {this.renderPowerCommandDropdownItems()}
                  </Button>
                  {this.state.running &&
                  <Button label='Launch Shell' command='launch-shell' onClick={this.handleCommandClick}/>}
                  <Button label='Rename Container' onClick={e => this.setState({showRenameModal: true})}/>
                  <Button label='Delete Container' red command='remove-container' onClick={this.handleCommandClick}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bottomContentWrapper'>
          <div className='bottomContent'>
            {!!this.props.containerDetails && <TabbedContainer initial={'summary'} tabData={tabData} {...this.props} />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}


export default withIPCFeed(ContainerDetail, 'container-info', 2000, feedData => {
  return {
    containerDetails: feedData,
  };
});
