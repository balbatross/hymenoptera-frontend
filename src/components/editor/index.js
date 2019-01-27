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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Options from '../options';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../actions/editorActions';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FlowChart from './flow-chart';

import { exportFlow, startFlow, stopFlow, saveFlow } from '../../flow-api';
import './index.css';
import 'react-tabs/style/react-tabs.css';

class Editor extends Component {
  constructor(props){
    super(props);

    this.state = {
      newType: '',
      newName: '',
      showModal: false,
      nodeSelection: {},
      selected: {},
      options: {},
      flow: {},
      flows: [{name: "Flow 1", flow: {}}, {name: "Flow 2", flow: {}}],
      active: {}
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }

  }

  handleKeyDown(event){
    let charCode = String.fromCharCode(event.which).toLowerCase()
    let ctrlKey = event.ctrlKey || event.metaKey

    if(ctrlKey && charCode == 's'){
      event.preventDefault()
      this.saveActiveFlow()
    }
  }

  saveActiveFlow(){
    this.props.editorActions.saveActiveFlow();
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
  
  getActiveFlow(){
    let active = this.props.activeTab;
    let tab = this.props.tabs[active]
    return tab
  }


  startFlow(){
      let flow = this.getActiveFlow()
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

  handleTypeChange(evt){
      this.setState({newType: evt.target.value})
  }

  createNew(){
    let type = this.state.newType;
    if(type && type != ''){
      let flow = {name: this.state.newName, flow: {nodes: [], links: []}}
      this.props.editorActions.editFlow(flow)
      this.setState({newName: '', newType: '',  showModal: false})
    }
  }

  _exportFlow(){
    //Export endpoint
    this.props.editorActions.exportActiveFlow();
    /*  let flow = this._getActiveFlow()
    if(flow){
      exportFlow(flow).then((r) => {
        console.log("Export result", r)
      })
    }*/
  }

  _renderCreationDialog(){
    return (
      <Dialog open={this.state.showModal}>
        <DialogTitle>Create new item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField placeholder="Name" onChange={(e) => this.setState({newName: e.target.value})} value={this.state.newName}/>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor='new-type'>Type</InputLabel>
            <Select
              value={this.state.newType}
              onChange={this.handleTypeChange.bind(this)}
              inputProps={{
                name: 'new-type',
                id: 'new-type'
              }}>
              <MenuItem value="flow">
                Flow 
              </MenuItem>
              <MenuItem value="collection">
                Collection
              </MenuItem>
              <MenuItem value="node">
                Node
              </MenuItem> 
            </Select>
          </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.setState({showModal: false})}>Cancel</Button>

          <Button color="primary" variant="contained" onClick={this.createNew.bind(this)}>Create</Button>
        </DialogActions>
      </Dialog>
    )
  }

  render(){
    return (
      <div className="editor">
        {this._renderCreationDialog()}
        <div className="editor-container" >
          <Tabs selectedIndex={this.props.activeTab} onSelect={(index) => {this.props.editorActions.setActiveTab(index)}}>
            <TabList>
              {this.props.tabs.map((flow) => {
                return (<Tab>{flow.name} {(flow.edited) ? '!' : null}</Tab>)
              })}
              <div className="editor-tabs__new" onClick={() => this.setState({showModal: true})}>+</div>
            </TabList>
            {this.props.tabs.map((flow, index) => {
              console.log(flow)
              return (
                <TabPanel>
                  <FlowChart flow={flow.flow} onChange={(model) => {
                    this.props.editorActions.updateFlowDiagram(flow.id, model)
                  }}/>
                </TabPanel>
              );
            })}
          </Tabs>

        </div>
        <div className="editor-toolbar" >
          <Button variant="contained" onClick={this._exportFlow.bind(this)} style={{marginRight: '10px'}}>
            Export
          </Button>
          <Button color="primary" variant="contained" onClick={this.startFlow.bind(this)} style={{marginRight: '10px'}}>
            RUN
          </Button>
          <Button color="primary" variant="contained" onClick={this.stopFlow.bind(this)}>
            Stop
          </Button>
        </div>
        <Options />
      </div>
    );
  }
}

function mapStateToProps(state){
  console.log(state)
  return {
      tabs: state.editor.tabs,
      activeTab: state.editor.activeTab,
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
