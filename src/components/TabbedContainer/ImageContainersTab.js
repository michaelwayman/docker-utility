import React, {Component} from 'react';
import withIPCFeed from '../withIPCFeed';


class ImageContainersTab extends Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.buildTableRows = this.buildTableRows.bind(this);
  }

  componentDidMount() {
    this.props.setSignalArg(this.props.image);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.signalArg !== this.props.image) {
      this.props.setSignalArg(this.props.image);
    }
  }

  buildTableRows() {
    if (!this.props.imageContainers) {
      return [];
    }

    return this.props.imageContainers.map((e, i) => {
      return <tr key={i}>
        <td className='title'>{e.id}</td>
        <td>{e.name}</td>
        <td>{e.status}</td>
      </tr>;
    });
  }

  render() {
    return (
      <table className='imageContainersTab'>
        <tbody>
        {this.buildTableRows()}
        </tbody>
      </table>
    );
  }
}


export default withIPCFeed(ImageContainersTab, 'get-image-containers', 2000, feedData => {
  return {
    imageContainers: feedData,
  };
});
