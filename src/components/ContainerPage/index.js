import React, {Component} from 'react';

import Sidebar from '../Sidebar';
import ContainerItem from '../Sidebar/ContainerItem';
import withIPCFeed from '../withIPCFeed';
import ContainerDetail from './ContainerDetail';


class ContainerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: '',
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.container === '' && this.props.feedData.length > 0) {
      this.setState({container: this.props.feedData[0].id});
    }
  }

  handleListItemClick(e, itemData) {
    e.preventDefault();
    if (itemData.id !== this.state.container) {
      this.setState({container: itemData.id});
    }
  }

  render() {
    return (
      <div className='sidebarPage'>
        {!!this.props.feedData &&
        <Sidebar items={this.props.feedData} Item={ContainerItem} itemClick={this.handleListItemClick}
                 active={this.state.container}/>}
        <div className='contentWrapper'>
          <div className='content'>
            {!!this.state.container && <ContainerDetail container={this.state.container}/>}
          </div>
        </div>
      </div>
    );
  }
}


export default withIPCFeed(ContainerPage, 'get-containers', 2000);
