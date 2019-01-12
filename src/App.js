import React, { Component } from 'react';
import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  LinkModel,
  DefaultPortModel,
  DiagramWidget,
  LinkWidget,
  LinkProps,
  DefaultLinkWidget,
  DefaultLinKModel,
  DefaultLinkFactory
} from 'storm-react-diagrams';

import Menu from './components/menu';
import Options from './components/options';
import logo from './logo.svg';
import 'storm-react-diagrams/dist/style.min.css';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.diagramEngine = new DiagramEngine()
    this.diagramEngine.installDefaultFactories()
    
    let node1 = new DefaultNodeModel("Source", "rgb(0, 195, 255)")
    let port1 = node1.addPort(new DefaultPortModel(false, "out-2", "Out default"));
    node1.setPosition(100, 100);

    let node2 = new DefaultNodeModel("Output", "rgb(0, 195, 255)")
    let port2 = node2.addInPort("In Port")

    let model = new DiagramModel();

    model.addAll(node1, port1, node2, port2)
    this.diagramEngine.setDiagramModel(model);
  }
  render() {
    return (
      <div className="App">
        <Menu />          
        <div className="app-body">
          <DiagramWidget className="srd-demo-canvas" diagramEngine={this.diagramEngine} />
          <Options />
        </div>
      </div>
    );
  }
}

export default App;
