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
import Options from '../options';
import uuid from 'uuid';

import './index.css';

export default class Editor extends Component {
  constructor(props){
    super(props);

    this.state = {
      selected: {},
      options: {}
    }

    this.diagramEngine = new DiagramEngine()
    this.diagramEngine.installDefaultFactories()
    let model = new DiagramModel(); 
    this.diagramEngine.setDiagramModel(model);
  }

  addNode(node, pos){
    let name = node.title;
    let _node = new DefaultNodeModel(name, "rgb(195,255,0)")

    if(!_node.id){
      node.id = uuid.v4();
    }else{
      node.id = _node.id
    }
    let type = node.config.type
    _node.extras = {config: node.config, opts: {}}
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

  _handleOptionChange(id, opts){
    let options = this.state.options
    options[id] = opts;
    this.setState({options: options})


    let node = this.diagramEngine.getDiagramModel().getNode(id)
    let extras = node.extras;
    node.extras = {...extras, opts: opts}

//    node.extras = {opts: opts}
  }

  _getFlow(){
    let d = this.diagramEngine.getDiagramModel().serializeDiagram()
    let nodes = d.nodes.map((x) => {
        return {
          id: x.id,
          config: x.extras.config,
          opts: x.extras.opts,
          ports: x.ports
        }
    });
    let links = d.links.map((x) => {
      return {
        id: x.id,
        src: x.source,
        dst: x.target,
        srcPort: x.sourcePort,
        dstPort: x.targetPort
      }
    })
    console.log(nodes);
    console.log(links)
  }

  render(){
    return (
      <div className="editor">
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
        <div className="editor-toolbar" onClick={this._getFlow.bind(this)}>
          <div>RUN</div>
        </div>
        <Options selected={this.state.selected} options={this.state.options[this.state.selected.id] || {}} onChange={this._handleOptionChange.bind(this)}/>
      </div>
    );
  }
}
