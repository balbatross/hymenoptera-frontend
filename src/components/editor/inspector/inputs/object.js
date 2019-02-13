import React, {
  Component
} from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../../../actions/editorActions';

import 'brace/mode/javascript';
import 'brace/theme/github';

class ObjectInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }
  }

  dotToDollar(txt){
    let match = txt.match(/\{\{=it\.\S+\}\}/g)
    if(match && match.length > 0){
    let new_match = match.map((x) => {
      return x.replace(/\{\{=/g, '$').replace(/\}\}/g, '')
    })

        for(var i = 0 ; i < match.length; i++){
          txt = txt.replace(match[i], new_match[i])
        }
    }
        return txt;
  }
  onChange(val){
    let match = val.match(/\$it\.\S+/gm)
/*    if(match && match.length > 0){
    let new_match = match.map((x) => {
      return x.replace(/\$it/g, '{{=it') + '}}';
    })
    
    for(var i = 0; i < match.length; i++){
      val = val.replace(match[i], new_match[i])
    }
    }*/
    console.log(val)
    this.props.editorActions.updateNodeOption(this.props.id, this.state.option.key, val)
  }

  render(){
    let opt = this.props.selected.opts[this.state.option.key]
    if(typeof(opt) == 'object'){
      opt = JSON.stringify(opt, null, 2)
    }
    return (
      <div style={{zIndex: 0}}>
          {this.state.option.key}
          <AceEditor
            mode="javascript"
            theme="github"
            style={{height: '200px'}}
            onChange={this.onChange.bind(this)}
            value={opt} />

       </div>
    );
  }
}

function stateProps(state, ownProps){

  let selected;
  if(state.editor.activeTab > -1 && state.editor.selected){
    let tab = state.editor.tabs[state.editor.activeTab]
    if(tab.flow && tab.flow.nodes){
      let node = tab.flow.nodes.filter((a) => a.id == ownProps.id)
      if(node.length > 0){
        selected = node[0]
      }
    }
  }
  return {
    selected: selected  
  }
}

function dispatchProps(dispatch){ 
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(stateProps, dispatchProps)(ObjectInput)
