import React, {Component} from 'react';

import Sidebar from '../Sidebar';
import ImageItem from '../Sidebar/ImageItem';
import withIPCFeed from '../withIPCFeed';
import ImageDetail from './ImageDetail';
import './index.css';


class ImagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.image === '' && this.props.feedData.length > 0) {
      this.setState({image: this.props.feedData[0].id});
    }
  }

  handleListItemClick(e, itemData) {
    e.preventDefault();
    if (itemData.id !== this.state.image) {
      this.setState({image: itemData.id});
    }
  }

  render() {
    return (
      <div className='sidebarPage'>
        <Sidebar items={this.props.feedData} Item={ImageItem} itemClick={this.handleListItemClick}
                 active={this.state.image}/>
        <div className='contentWrapper'>
          <div className='content'>
            {!!this.state.image && <ImageDetail image={this.state.image}/>}
          </div>
        </div>
      </div>
    );
  }
}


export default withIPCFeed(ImagePage, 'get-images', 2000);
