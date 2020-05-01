import React, {Component} from 'react';
import './app.css';
import ContainerPage from './components/ContainerPage';
import ImagePage from './components/ImagePage';
import ErrorModal from './components/Modal/ErrorModal';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 'containers',
    };
  }

  render() {
    return (
      <div className="app">
        <ErrorModal/>
        <header className="appHeader">
          <ul>
            <li onClick={(e) => this.setState({page: 'containers'})}
                className={(this.state.page === 'containers') ? 'active' : ''}>
              Containers
            </li>
            <li onClick={(e) => this.setState({page: 'images'})}
                className={(this.state.page === 'images') ? 'active' : ''}>
              Images
            </li>
            <li onClick={(e) => this.setState({page: 'commands'})}
                className={(this.state.page === 'commands') ? 'active' : ''}>
              Commands
            </li>
          </ul>
        </header>
        <section className='appContent'>
          {this.state.page === 'containers' && <ContainerPage/>}
          {this.state.page === 'images' && <ImagePage/>}
        </section>
      </div>
    );
  }
}

export default App;
