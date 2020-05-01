import React, {Component} from 'react';


export default function withIPCFeed(WrappedComponent, signal, refreshTimer, mapFeedToProps) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        feedData: null,
      };

      this.mapFeedToProps = mapFeedToProps || ((data) => {
        return {feedData: data};
      });

      this.setSignalArg = this.setSignalArg.bind(this);
      this.getFeedData = this.getFeedData.bind(this);
      this.getFeedDataLoop = this.getFeedDataLoop.bind(this);
      this.cancelLoop = false;
      this.feedData = null;
      this.signalArg = null;
    }

    componentDidMount() {
      window.ipcRenderer.on(signal, (event, feedData) => {
        if (this.cancelLoop) {
          return;
        }
        if (!feedData) {
          return;
        }
        this.setState({feedData});
      });
      this.getFeedData();
      this.getFeedDataLoop();
    }

    componentWillUnmount() {
      this.cancelLoop = true;
    }

    getFeedData() {
      window.ipcRenderer.send(signal, this.signalArg);
    }

    getFeedDataLoop() {
      setTimeout(() => {
        if (this.cancelLoop) {
          return;
        }
        this.getFeedData();
        this.getFeedDataLoop();
      }, refreshTimer);
    }

    setSignalArg(signalArg) {
      this.signalArg = signalArg;
      this.getFeedData();
    }

    render() {
      const props = this.mapFeedToProps(this.state.feedData);
      return <WrappedComponent {...props} {...this.props}
                               setSignalArg={this.setSignalArg}
                               signalArg={this.signalArg}/>;
    }
  };
}
