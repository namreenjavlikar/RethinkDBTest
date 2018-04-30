import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import db from './db'

class App extends Component {

  state = {
    items: []
  }

  async componentWillMount() {
    console.log("this.props.collection", 'users')
    db.setListener('users', this.handleItems)
    //const items = await db.collection('users').findAll()
    //console.log("items", items)
  }

  handleItems = (items) => {
    //let items = [];
    //items.push(item);
    this.setState({ items })
    console.log("items", items)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {/* {
          this.state.items.map(
            (item, i) => <p key={i}>{item.name}</p>
          )
        } */}
      </div>
    );
  }
}

export default App;
