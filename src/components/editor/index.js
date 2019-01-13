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

import uuid from 'uuid';

import './index.css';

export default class Editor extends Component {
  constructor(props){
    super(props);

    this.state = {
      selected: null
    }

    this.diagramEngine = new DiagramEngine()
    this.diagramEngine.installDefaultFactories()
    let model = new DiagramModel(); 
    this.diagramEngine.setDiagramModel(model);
  }

  addNode(node, pos){
    let name = node.title;
    if(!node.id){
      node.id = uuid.v4();
    }
    let _node = new DefaultNodeModel(name, "rgb(195,255,0)")
    let type = node.config.type

    switch(type){
      case 'input':
        _node.addOutPort("Trigger")
        break;
      case 'output':
        _node.addInPort("Stream")
        break;
      case 'process':
        _node.addInPort("In")
        _node.addOutPort("Out")
    }
    _node.addListener({selectionChanged: (s) => {
      var selection = s.isSelected;

      if(selection){
        this.setState({selected: node})
        this.props.onSelect(node)
      } 
    }})
    _node.x = pos.x
    _node.y = pos.y
     this.diagramEngine.getDiagramModel().addNode(_node)   
    if(this.props.onChange){
      this.props.onChange(this.diagramEngine.getDiagramModel().serializeDiagram())
    }

    this.forceUpdate()
  }

  render(){
    return (

        <div className="editor-container" onDragOver={event => { 
          event.preventDefault()
        }} onDrop={event => {
          console.log("DROP")
          var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
          let point = this.diagramEngine.getRelativeMousePoint(event)

          this.addNode(data, point)

        }}>
          <DiagramWidget className="srd-demo-canvas" diagramEngine={this.diagramEngine} />

        </div>
    );
  }
}
