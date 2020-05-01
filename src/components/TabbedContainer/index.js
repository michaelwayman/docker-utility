import React, {Component} from 'react';

import './index.css';


class TabbedContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.initial,
    };

    this.renderTabBar = this.renderTabBar.bind(this);
    this.renderTabContent = this.renderTabContent.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.getTabClasses = this.getTabClasses.bind(this);
  }

  handleTabClick(e, tab) {
    e.preventDefault();
    this.setState({activeTab: tab});
  }

  getTabClasses(tab) {
    if (tab === this.state.activeTab) {
      return 'tab active';
    }
    return 'tab';
  }

  renderTabBar() {
    const tabs = [];
    for (let key in this.props.tabData) {
      if (this.props.tabData.hasOwnProperty(key)) {
        tabs.push(key);
      }
    }
    return tabs.map((t, i) => {
      return (
        <div key={i} className={this.getTabClasses(t)} onClick={e => {
          this.handleTabClick(e, t);
        }}>
          {t}
        </div>
      );
    });
  }

  renderTabContent() {
    const TabContent = this.props.tabData[this.state.activeTab];
    return <TabContent {...this.props} />;
  }

  render() {
    return (
      <div className='tabsContainer'>
        <div className='tabs'>
          {!!this.props.tabData && this.renderTabBar()}
        </div>
        <div className='tabContentWrapper'>
          <div className='tabContent'>
            {this.renderTabContent()}
          </div>
        </div>
      </div>
    );
  }
}


export default TabbedContainer;
