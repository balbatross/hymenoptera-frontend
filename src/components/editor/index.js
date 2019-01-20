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
import Button from '@material-ui/core/Button';
import Options from '../options';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../actions/editorActions';
import { startFlow, stopFlow, saveFlow } from '../../flow-api';
import './index.css';

class Editor extends Component {
  constructor(props){
    super(props);

    this.state = {
      nodeSelection: {},
      selected: {},
      options: {},
      flow: {},
      active: {}
    }

    this.diagramEngine = new DiagramEngine()
    this.diagramEngine.installDefaultFactories()
    let model = new DiagramModel(); 
    this.diagramEngine.setDiagramModel(model);
  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }

    if(this.props.flow.id !== newProps.flow.id){
      if(newProps.flow.flow.diagram){
        let diagramModel = new DiagramModel();
        diagramModel.addListener({nodesUpdated: (event) => {
          if(event.isCreated){
           
            let id = event.node.id;
            event.node.addListener({selectionChanged: (s) => {
              
              this.nodeSelect(id, s)
              
            }})
          }
        }})
         
        diagramModel.deSerializeDiagram(newProps.flow.flow.diagram, this.diagramEngine)
        this.diagramEngine.setDiagramModel(diagramModel)
      }
    }
  }

  nodeSelect(node_id, selected){

    let _node = this.diagramEngine.getDiagramModel().getNode(node_id)
    let node = _node.extras;
    node.id = node_id
    //if selected selectNode
    //if node is selected unset selectedNode
    if(selected.isSelected){
      this.props.editorActions.selectNode(node, selected.isSelected)
    }

    if(node.id == this.props.selectedNode.id){
      this.props.editorActions.selectNode(node, selected.isSelected)
    }
  }

  getSelected(){
    let selectionState = this.state.nodeSelection;

    for(var k in selectionState){
      if(selectionState[k].selected == true){
        return selectionState[k].node
      }
    }
    return null;
  }

  addNode(node, pos){
    let name = node.label;
    let _node = new DefaultNodeModel(name, "rgb(195,255,0)")

    if(!_node.id){
      node.id = uuid.v4();
    }else{
      node.id = _node.id
    }

    let type = node.config.type
    console.log(node) 
    _node.extras = {config: node.config, module_name: node.module_name, delegator: node.delegator, opts: {}}
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
      this.nodeSelect(node, s)
    }})
    _node.x = pos.x
    _node.y = pos.y
     this.diagramEngine.getDiagramModel().addNode(_node)   
    if(this.props.onChange){
      this.props.onChange(this.diagramEngine.getDiagramModel().serializeDiagram())
    }

    this.forceUpdate()
  }

  _handleConnChange(id, conn){
    console.log(id, " ", conn)
    let node = this.diagramEngine.getDiagramModel().getNode(id)
    let extras = node.extras;
    this.diagramEngine.getDiagramModel().getNode(id).extras = {...extras, module_inst: conn}
    console.log(node)
  }

  _handleOptionChange(id, opts){
    let options = this.state.options
    options[id] = opts
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

  _getActiveFlow(){
    let chain = this._getFlow()
    if(this.props.flow.id){
      let flow = {
        id: this.props.flow.id,
        name: this.props.flow.name,
        flow: chain
      }
      return flow;
    }else{
      return null
    }
  }

  _getFlow(){
    let diagram = this.diagramEngine.getDiagramModel().serializeDiagram()
    
    let nodes = diagram.nodes.map((x) => {
        return {
          id: x.id,
          module_name: x.extras.module_name,
          module_inst: x.extras.module_inst,
          config: x.extras.config,
          opts: x.extras.opts,
          delegator: x.extras.delegator,
          ports: x.ports
        }
    });
    let links = diagram.links.map((x) => {
      return {
        id: x.id,
        src: x.source,
        dst: x.target,
        srcPort: x.sourcePort,
        dstPort: x.targetPort
      }
    })

    let flow = {
      diagram: diagram,
      nodes: nodes,
      links: links
    }
    return flow;
  }

  startFlow(){
      let flow = this._getActiveFlow()
      console.log(this.props.flow);
      startFlow(this.props.flow).then((result) => {
        let run_id = result.result
        let active = this.state.active;
        active[this.props.flow.id] = run_id
        this.setState({active: active})
      })
  }

  stopFlow(){
    stopFlow(this.state.active[this.props.flow.id]).then((r) => {
      console.log(r)
    })
  }
  
  _saveFlow(){
    let flow = this._getActiveFlow()
    if(flow){
      saveFlow(flow).then((r) => {
        console.log("SAVE", r)
      })
    }
  }

  render(){
    return (
      <div className="editor">

        <div className="editor-container" onDragOver={event => { 
          event.preventDefault()
        }} onDrop={event => {
          var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
          let point = this.diagramEngine.getRelativeMousePoint(event)

          this.addNode(data, point)

        }}>
          <DiagramWidget className="srd-demo-canvas" diagramEngine={this.diagramEngine} />

        </div>
        <div className="editor-toolbar" >
          <Button variant="contained" onClick={this._saveFlow.bind(this)} style={{marginRight: '10px'}}>
            Save
          </Button>
          <Button color="primary" variant="contained" onClick={this.startFlow.bind(this)} style={{marginRight: '10px'}}>
            RUN
          </Button>
          <Button color="primary" variant="contained" onClick={this.stopFlow.bind(this)}>
            Stop
          </Button>
        </div>
        <Options selected={this.state.selected} options={this.state.options[this.state.selected.id] || {}} onChange={this._handleOptionChange.bind(this)} onConnectionChange={this._handleConnChange.bind(this)}/>
      </div>
    );
  }
}

function mapStateToProps(state){
  console.log(state)
  return {
      flow: state.editor.flow,
      selectedNode: state.editor.selected
  }
}

function mapDispatchToProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
