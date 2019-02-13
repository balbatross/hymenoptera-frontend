import React, {
  Component
} from 'react';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import brace from 'brace';
import AceEditor from 'react-ace';
import OptionSelect from 'react-select/lib/Creatable';
import EditorInputs from './inputs';
import ConnectionDialog from './connection-dialog';
import { getConnectionsByModule } from '../../../flow-api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../../actions/editorActions';
import 'brace/mode/javascript';
import 'brace/theme/github';


class Inspector extends Component {
  constructor(props){
    super(props);
    this.state = {
      parent: [],
      connections: [],
      ...props
    }
  }

  componentDidMount(){

    getConnectionsByModule(this.props.module.id).then((connections) => {
      this.setState({connections: connections})
    })
     document.getElementsByClassName('flow-chart-inspector')[0].addEventListener('keyup', (e) => {
          var code = e.keyCode || e.charCode;
          if(code == 8 || code == 46){
              e.stopPropagation();
          }
      });

  }

  componentWillReceiveProps(newProps){

    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }

    if(this.props.selectedNode.id !== newProps.selectedNode.id){
      getConnectionsByModule(newProps.module.id).then((connections) => {
        this.setState({connections: connections})
      })
    }
  }

  _outputChanged(newValue){
    let j;
    try{
      j = JSON.parse(newValue)
    }catch{
      console.log("Err json")
    }
    console.log(newValue)
     this.props.editorActions.updateNodeOutput(this.props.selectedNode.id, newValue)
  }

  _connectionChanged(e){
    let val = e.target.value;
    this.props.editorActions.updateNodeConnection(this.props.selectedNode.id, val)
  }

  _renderOutputFormat(){
    let output = this.props.selectedNode.config.output;
    if(typeof(output) == 'object'){
      output = JSON.stringify(output, null, 2)
    }
    return (
      <div>
        Output format
        <AceEditor
          mode="javascript"
          theme="github"
          style={{height: '200px'}}
          onChange={this._outputChanged.bind(this)}
          value={output} />
     </div> 
    );
  }

  _renderConnectionSelector(){
    console.log(this.props.selectedNode)
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor="connection-select">Connection</InputLabel>
        <Select onChange={this._connectionChanged.bind(this)} value={this.props.selectedNode.module_inst} inputProps={{
            id: 'connection',
            name: 'connection'
        }}>
          {this.state.connections.map((x) => {
            return(
              <MenuItem value={x.id}>
                {x.name}
              </MenuItem>
            );
          })}
          <MenuItem value={'8c8496a2-929f-4c32-a530-ca2c61bb3b0d'}>User defined</MenuItem>
        </Select>
        <Button color="primary" variant="contained">+</Button>
      </FormControl>
    );
  }

  _parseTypes(model){
    let types = []
    let keys = Object.keys(model)
    for(var i = 0; i < keys.length; i++){
      console.log("Parse", typeof(model[keys[i]]), model)
        let type = model[keys[i]];
        switch(type){
          case 'string':
            types.push({type: type, key: keys[i]})
            break;
          case 'object':
            types.push({type: type, key: keys[i]})
            break;
          default:
            break;
        }
      
    }
    return types;
  }

  traverse(x){
    return this.traverseObject(`$it`, x)  
  }

  traverseObject(pre, obj){
    let objects = []
    for(var k in obj){
      objects.push(`${pre}.${k}`)
      if(typeof(obj[k]) == 'object' && Object.keys(obj[k]).length > 0){
        objects = objects.concat(this.traverseObject(`${pre}.${k}`, obj[k]))
      }
    }
    return objects;
  }

  isArray(o){
    return Object.prototype.toString.call(o) == '[object Array]'
  }

  _renderInputOptions(){
    let outputs = []
    this.props.parentNode.map((x) => {
      let out = x.config.output;
      if(typeof(out) == 'string'){
        out = JSON.parse(out)
      }
      out = this.traverse(out)
      outputs = out.concat(outputs)
       
    })
    return this._parseTypes(this.getNodeParams(this.props.module, this.state.node.delegator).params).map((x) => {
          console.log(x)
      switch(x.type){
        case 'string':
            return (
              <EditorInputs.StringInput id={this.state.node.id} option={x} options={outputs.map(x => ({label: x, value: x}))}/>
            );
        case 'object':
            return (
              <EditorInputs.ObjectInput id={this.state.node.id} option={x} />
            )
        case 'selector':
          console.log("SELECT", x)
            return (
              <div>
                {x.key}

              </div>
            );
        default:
          return null;
      }
    })
  }

  getNodeParams(mod, key){
    let modules = mod.modules;
   return modules.filter((a) => a.key == key)[0].config
   
  }

  render(){
    console.log(this.props.module)
    return (
      <div className="flow-chart-inspector">
        <ConnectionDialog module={this.props.module} />
        <div className="flow-chart-inspector__node-info">
          <div className="module-name">{this.props.module.name}</div>
          <div className="node-name">{this.state.node.delegator}</div>
        </div>
        <div className="flow-chart-inspector__node-conf">
          <Card>
            <CardContent>
          {this._renderConnectionSelector()}
          {this._renderOutputFormat()}
            </CardContent>
          </Card>
          <Card style={{marginTop: '10px'}}>
            <CardContent style={{ display: 'flex', flexDirection: 'column'}}>
          {this._renderInputOptions()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps){
  let selected; 
  let parents = [];
  if(state.editor.activeTab > -1 && state.editor.selected){
    let tab = state.editor.tabs[state.editor.activeTab]
    if(tab.flow && tab.flow.nodes){
      let node = tab.flow.nodes.filter((a) => a.id == state.editor.selected.id)
      ownProps.parent.map((x) => {
        console.log(x)
        let parent_node = tab.flow.nodes.filter((a) => a.id == x.id)[0]
        parents.push(parent_node)
      })
      if(node.length > 0){
        selected = node[0]
      }
    }
  }
  return {
    selectedNode: selected,
    parentNode: parents,
    module: state.editor.modules.filter((a) => a.id == selected.module_name)[0]
  }
}

function mapDispatchToProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inspector)
