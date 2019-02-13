import React, {
  Component
} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Node from '../nodes'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as editorActions from '../../actions/editorActions';

import './index.css'

class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props,
      selectedOption: 0,
      menu: ["Nodes", "Flows"],
      modules: [],
      flows: [],
      creatingFlow: false
    }
  }

  componentDidMount(){
  
    this.getFlows().then((flows) => {
      this.setState({
        flows: flows
      })
    })
    this.props.editorActions.getMainModules()

  }

  componentWillReceiveProps(newProps){
    this.setState({
      ...newProps
    })  
  }

  getModules(){
    return fetch('http://localhost:8000/api/modules').then((r) => {
      return r.json()
    })
  }

  getFlows(){
    return fetch('http://localhost:8000/api/flows').then((r) => {
      return r.json()
    })
  }

  createFlow(name){
    return fetch('http://localhost:8000/api/flows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flow: {
          name: name
        }
      })
    }).then((r) => {
      return r.json()
    })
  }

  run(){

    let serial = this.state.model 

    let links = serial.links;
    let nodes = serial.nodes;
    let linked = []
    for(var i =0; i < links.length; i++){
      var link = links[i];

      let src = nodes.filter((a) => a.id == link.source)[0]
      let dst = nodes.filter((a) => a.id ==link.target)[0]
      linked.push({src: src, dst: dst})

    }
    console.log(linked)



  }

  _selectMenuOption(event, value){
    console.log(value)
    this.setState({selectedOption: value})
  }

  _renderMenu(){

    return (
        <TabList>
          {this.state.menu.map((x) => {
            return (
              <Tab style={{display: 'flex', alignItems: 'center'}}>
                <img style={{width: '20px', height: '20px', marginRight: '10px'}}  src={require(`../../assets/${x == 'Nodes' ? 'node' : 'flow'}.svg`)} />
                {x}
              </Tab>
            );
          })}
        </TabList>
              
    );
  }

  _renderNodes(m){
    return this._renderItems()
  }

  _createFlow(){
    this.createFlow(this.state.modalFlowName).then(() => {
      this.getFlows().then((r) => {
        this.setState({flows: r, creatingFlow: false})
      })
    })
    console.log(this.state.modalFlowName)
  }

  _selectFlow(flow){
    this.props.editorActions.editFlow(flow)
    console.log(flow)
  }

  _renderFlows(){
    let flows = this.state.flows.map((flow) => {
      return (
        <ListItem button onClick={this._selectFlow.bind(this, flow)}>
          {flow.name}
        </ListItem>
      );
    })
    return (
      <div className="flows-menu">
        <div className="flows-menu__flow">
          <List>
            {flows}
          </List>
        </div>
        <div className="flows-menu__add">
          <Button variant="contained" color="primary" onClick={() => this.setState({creatingFlow: true})}>
            Add
          </Button>
        </div>
        <Dialog open={this.state.creatingFlow}>
          <DialogTitle>Create new flow</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Flow name" type="text" fullWidth onChange={(e) => this.setState({modalFlowName: e.target.value})}/>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.setState({creatingFlow: false})}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" onClick={this._createFlow.bind(this)}>
              Create 
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  _renderItems(){

    let modules = []
    console.log(this.state.modules)
    this.props.modules.map((x) => {
      x.modules.map((mod) => {
        mod.package = x.id;
        modules.push(mod)
        console.log(mod)
      })
    })
//         <Node node={{title: m.package, description: m.key, config: m.config}} />
    return this.props.modules.map((m) => {
      return (
        <li>
          <div className="menu-module">
            <div className="menu-module__header">
              {m.name}
            </div>
            <div className="menu-module__nodes">
              {m.modules.map((x) => {
                return (
                  <div draggable={true}  onDragStart={event => {
                    let mod = {
                      module_name: m.id,
                      label: m.name + ": " + x.key,
                      delegator: x.key,
                      config: x.config
                    }
                    event.dataTransfer.setData('storm-diagram-node', JSON.stringify(mod))
                  }}>{x.key}</div>
                );
              })}
            </div>
         </div>
        </li>
      );
    })
  }

  render(){
    return(
      <div className="flow-menu">
        <Tabs>
          {this._renderMenu()}

        <TabPanel>
            <ul className="node-list">
              {this._renderItems()}
            </ul>
        </TabPanel>
        <TabPanel>
          {this._renderFlows()}
        </TabPanel>
        </Tabs>
      </div>
    );  
  }
}

function mapStateToProps(state){
  return {
    modules: state.editor.modules    
  }
}


function mapDispatchToProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Menu)
