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
    console.log(node) 
    _node.extras = {config: node.config, type: node.package, key: node.description, opts: {}}
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

  testFlow(flow){
    return fetch('http://localhost:8000/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        flow: flow
      })
    }).then((r) => {
      return r.json()
    });
  }

  _getFlow(){
    let d = this.diagramEngine.getDiagramModel().serializeDiagram()
    let nodes = d.nodes.map((x) => {
        return {
          id: x.id,
          type: x.extras.type,
          config: x.extras.config,
          params: x.extras.opts,
          func: x.extras.key,
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

    let flow = {
      nodes: nodes,
      links: links
    }

    this.testFlow(flow)
    console.log(nodes);
    console.log(links)
  }

  stopFlow(){
    return fetch('http://localhost:8000/api/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((r) => {
      return r.json()
    })
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
        <div className="editor-toolbar" >
          <div className="run-action" onClick={this._getFlow.bind(this)}><img src={require('../../assets/running-man.svg')}/>RUN</div>
          <div className="stop-action" onClick={this.stopFlow.bind(this)}>Stop</div>
        </div>
        <Options selected={this.state.selected} options={this.state.options[this.state.selected.id] || {}} onChange={this._handleOptionChange.bind(this)}/>
      </div>
    );
  }
}
