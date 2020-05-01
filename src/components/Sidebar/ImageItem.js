import React, {Component} from 'react';
import './ImageItem.css';


class ImageItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e, this.props);
  }

  render() {
    const itemClass = `item imageItem ${this.props.active ? 'active' : ''}`;
    return (
      <div className={itemClass} onClick={this.handleClick}>
        <div className='content'>
          <h3>{this.props.repository}</h3>
          <p>{this.props.tag}</p>
          <p>{this.props.id.slice(7, 19)}</p>
        </div>
      </div>
    );
  }
}


export default ImageItem;
