import React, {Component} from 'react';
import './ContainerItem.css';


class ContainerItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e, this.props);
  }

  render() {
    const itemClass = `item containerItem ${this.props.active ? 'active' : ''}`;
    const iconClass = `icon ${this.props.running ? 'running' : ''}`;
    return (
      <div className={itemClass} onClick={this.handleClick}>
        <div className='iconWrapper'>
          <div className={iconClass}></div>
        </div>
        <div className='content'>
          <h3>{this.props.name}</h3>
          <p>{this.props.image}</p>
          <p>{this.props.id.slice(0, 13)}</p>
        </div>
      </div>
    );
  }
}


export default ContainerItem;
