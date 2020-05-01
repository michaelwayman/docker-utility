import React, {Component} from 'react';

import './index.css';


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderListItems = this.renderListItems.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e, data) {
    this.props.itemClick(e, data);
  }

  renderListItems() {
    if (!this.props.items) {
      return [];
    }
    const Item = this.props.Item;
    return this.props.items.map((e, i) => {
      return <Item key={i} {...e} active={this.props.active === e.id} onClick={this.handleItemClick}/>;
    });
  }

  render() {
    return (
      <div className='sidebar'>
        {this.renderListItems()}
      </div>
    );
  }
}


export default Sidebar;
