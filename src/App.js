import React, { Component } from 'react';
import Editor from './components/editor';
import ProjectDialog from './components/project-dialog';
import NodeMenu from './components/menu';
import Options from './components/options';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Menu, {SubMenu, MenuItem} from 'rc-menu';
import SplitPane from 'react-split-pane';
import logo from './logo.svg';
import 'storm-react-diagrams/dist/style.min.css';
import 'rc-menu/assets/index.css';
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
        <Menu mode="horizontal">
          <SubMenu title="File">
            <MenuItem>New Project</MenuItem>
            <MenuItem>New Node</MenuItem>
            <MenuItem>Open Project</MenuItem>
          </SubMenu>
          <SubMenu title="Edit">
            <MenuItem>Undo</MenuItem>
          </SubMenu>
        </Menu>
        <ProjectDialog.Open />
        <div className="Main-App">
          <SplitPane split="vertical" minSize={220} style={{height: 'initial', position: 'initial'}} resizerStyle={{background: 'orange', width: '7px', cursor: 'col-resize'}}>
            <div style={{height: '100%', width: '100%', display: 'flex', background: 'white'}}>
              <NodeMenu model={this.state.diagram} />          
            </div>
            <div className="app-body">
              <Editor onSelect={(n) => this.setState({selectedNode: n})} onChange={(model) => this.setState({diagram: model})}/> 
            </div>
          </SplitPane>
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
