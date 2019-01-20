import React, {
  Component
} from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Connections from './connection';
import { getModules } from '../../flow-api';
import { connect } from 'react-redux';
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
    if(this.props.onChange){
      this.props.onChange(id, opts);
    }
  }

  _handleConnectionChange(id, conn){
    if(this.props.onConnectionChange){
      this.props.onConnectionChange(id, conn);
    }
  }

  _renderConnections(){
    if(this.props.selectedNode.config != null && this.props.selectedNode.config != {}){
      let module = this.state.modules[this.props.selectedNode.module_name]
      let opts = module.base.opts;

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
  return {
    selectedNode: state.editor.selected
  }
}

export default connect(mapStateToProps)(Options)
