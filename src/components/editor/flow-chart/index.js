import React, {
  Component
} from 'react';

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
  DefaultLinkModel,
  DefaultLinkFactory
} from 'storm-react-diagrams';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../../actions/editorActions';
import uuid from 'uuid';
import './index.css';
const style = {
  node: 'rgb(195,255,0)'
}

class FlowChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
   
    this.initEngine();
    this.initModel();
  }

  componentDidMount(){
    if(this.props.flow && this.props.flow.diagram){
      this.initModel(this.props.flow.diagram)
    }
  }

  initEngine(){
    this.diagramEngine = new DiagramEngine()
    this.diagramEngine.installDefaultFactories()
  }

  initModel(serialized){
    let model = new DiagramModel();

    if(serialized){
      model.addListener({nodesUpdated: (event) => {
        if(event.isCreated){
          let id = event.node.id;
          event.node.addListener({selectionChanged: (s) => {
            this.selectNode(id, s)
          }})
        }
      }})
      model.deSerializeDiagram(serialized, this.diagramEngine)
    }

    model.addListener({
      nodesUpdated: (event) => {
        this.onChange()
      },
      linksUpdated: (event) => {
        if(event.isCreated){
          event.link.addListener({sourcePortChanged: this.onChange.bind(this), targetPortChanged: this.onChange.bind(this)})
        }
        this.onChange()
      }
    })

    this.diagramEngine.setDiagramModel(model)
  }

  onChange(){
    if(this.props.onChange){
      this.props.onChange(this.diagramEngine.getDiagramModel().serializeDiagram())
    } 
  }

  selectNode(node_id, selected){
    console.log(node_id)
    console.log(this.diagramEngine.getDiagramModel().getNodes())
    let _node = this.diagramEngine.getDiagramModel().getNode(node_id)
    let node = _node.extras;
    node.id = node_id

    if(selected.isSelected){
      this.props.editorActions.selectNode(node, selected.isSelected)
    }

    if(node.id == this.props.selectedNode.id){
      this.props.editorActions.selectNode(node, selected.isSelected)
    }
  }

  addNode(node, pos){
    let name = node.label;
    let _node = new DefaultNodeModel(name, style.node)
    
    if(!_node.id){
      node.id = uuid.v4()
    }else{
      node.id = _node.id
    }

    _node.extras = {
      config: node.config,
      module_name: node.module_name,
      delegator: node.delegator,
      opts: {}
    }
    
    _node.addOutPort("Out")
    _node.addInPort("In")

    _node.addListener({selectionChanged: (s) => {
      this.selectNode(node.id, s)
    }})

    _node.x = pos.x;
    _node.y = pos.y

    this.diagramEngine.getDiagramModel().addNode(_node)
    this.forceUpdate()
    this.onChange()
  }

  onDrop(event){
    let data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'))
    let point = this.diagramEngine.getRelativeMousePoint(event)
    this.addNode(data, point)
  }

  render(){
    return (
      <div className="flow-chart-container" onDragOver={event => event.preventDefault()} onDrop={this.onDrop.bind(this)}>
        <DiagramWidget className="hymen-flow-chart" diagramEngine={this.diagramEngine} />
      </div>
    )
  }
} 

function mapStateToProps(state){
  return {
    selectedNode: state.editor.selected
  }
}

function mapDispatchToProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowChart)
