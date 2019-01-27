import React, {
  Component
} from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Connections from './connection';
import { getModules } from '../../flow-api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../actions/editorActions';
import './index.css';

class Options extends Component {
  constructor(props){
    super(props);
    this.state = {
      options: {},
      modules: {},
      ...props,
    }
  }


  componentDidMount(){
    getModules().then((modules) => {
      let mods = {}
      modules.map((x) => {
        mods[x.id] = x
      })
      this.setState({modules: mods})
    })
     document.getElementsByClassName('flow-options')[0].addEventListener('keyup', (e) => {
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
  }

  _handleOptionChange(id, opts){
    this.props.editorActions.updateNodeOptions(id, opts)
  }

  _handleConnectionChange(id, conn){
    this.props.editorActions.updateNodeConnection(id, conn)
  }

  _renderConnections(){
    if(this.props.selectedNode.config != null && this.props.selectedNode.config != {}){
      let module = this.state.modules[this.props.selectedNode.module_name]
      console.log("Mod", module)
      let opts = module.klass.opts;

      return (
        <Connections value={this.props.selectedNode.module_inst} module={module} onChange={(conn) => {
          this._handleConnectionChange(this.props.selectedNode.id, conn)
        }}/>
      )
    }
    return null;
  }

  _renderOptions(){
    if(this.props.selectedNode.config != null){
      let id = this.props.selectedNode.id;
      let options = Object.keys(this.props.selectedNode.config.params)
      let values = this.props.selectedNode.opts || {}
      if(Object.keys(values).length == 0){
        values = this.props.selectedNode.config.params
      }

      return (
        <div>
          <h4>{this.props.selectedNode.name}</h4>
          <JSONInput confirmGood={false} id='options' placeholder={values} onChange={(e) => this._handleOptionChange(id , e.jsObject)} locale={locale} height='250px' /> 
        </div>
      );
    }else{
      return null;
    }
  }

  render(){
    return (
      <div className="flow-options">
        {this._renderOptions()}
        {this._renderConnections()}
      </div>
    );
  }
}

function mapStateToProps(state){
  let selected = {};
  if(state.editor.activeTab > -1 && state.editor.selected){
    let tab = state.editor.tabs[state.editor.activeTab]
    if(tab.flow && tab.flow.nodes){
      let node = tab.flow.nodes.filter((a) => a.id == state.editor.selected.id)
      if(node.length > 0){
        selected = node[0]
      }
    }
  }
  return {
    selectedNode: selected 
  }
}

function mapDispatchToProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Options)
