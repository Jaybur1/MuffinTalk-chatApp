import React, { Component } from 'react';
import Layout from './components/Layout';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'MuffinTalk'
    }
  }
  render() {
    return (
      <div>
        <Layout title={this.state.title} />
      </div>
    );
  }
}

export default App;
