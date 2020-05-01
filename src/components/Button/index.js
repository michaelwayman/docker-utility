import React, {Component} from 'react';

import './index.css';


export class DropdownItem extends Component {
  render() {
    return (
      <li onClick={this.props.onClick}>{this.props.children}</li>
    );
  }
}

class Button extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      hasDropdown: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const returnValue = {
      hasDropdown: false,
    };

    if (props.children && !props.children.hasOwnProperty('toLowerCase')) {
      returnValue['hasDropdown'] = true;
    }

    return returnValue;
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(e, this.props);
    }
    if (this.state.hasDropdown) {
      const showDropdown = !this.state.showDropdown;
      this.setState({showDropdown});
    }
  }

  render() {
    let classes = ['button', ...(this.props.className || [])];
    if (this.props.red) {
      classes.push('red');
    }
    if (this.state.hasDropdown && this.state.showDropdown) {
      classes.push('open');
    }

    const Carrot = this.state.hasDropdown ? <span> &#9660;</span> : '';

    return (
      <div className={classes.join(' ')} onClick={this.handleClick}>
        <span>{this.props.label} {Carrot}</span>
        {this.state.hasDropdown &&
        <div className='dropdown'>
          <ul>{this.props.children}</ul>
        </div>}
      </div>
    );
  }
}


export default Button;
