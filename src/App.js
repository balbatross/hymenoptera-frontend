import React, { Component } from 'react';
import Editor from './components/editor';
import Menu from './components/menu';
import Options from './components/options';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
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
        <AppBar style={{height: '64px'}} position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Hymenoptera
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="Main-App">
          <Menu model={this.state.diagram} />          
          <div className="app-body">
            <Editor onSelect={(n) => this.setState({selectedNode: n})} onChange={(model) => this.setState({diagram: model})}/> 
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state){
console.log("HEYYYY", state)
  return {

  }
}

export default connect(mapState)(App);
