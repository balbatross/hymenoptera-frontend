import React, { Component } from 'react';
import Editor from './components/editor';
import Menu from './components/menu';
import Options from './components/options';
import logo from './logo.svg';
import 'storm-react-diagrams/dist/style.min.css';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedNode: {},
      diagram: {}
    }
  }
  render() {
    return (
      <div className="App">
        <Menu model={this.state.diagram} />          
        <div className="app-body">
          <Editor onSelect={(n) => this.setState({selectedNode: n})} onChange={(model) => this.setState({diagram: model})}/> 
        </div>
      </div>
    );
  }
}

export default App;
