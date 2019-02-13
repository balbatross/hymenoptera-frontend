import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as editorActions from '../../../../actions/editorActions';
import Select from 'react-select/lib/Creatable';

class StringInput extends Component {
  constructor(props){
    super(props);
    this.state = { 
      ...props,
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }

    if(this.props.id !== newProps.id){
      this.setState({value: ''})
    }
  }

  handleChange(newValue){
    console.log(newValue)    
    this.props.editorActions.updateNodeOption(this.props.id, this.state.option.key, (newValue) ? newValue.value : null)
  }
 
  render(){
    console.log("SELECT", this.props.selected)
    let opts = this.props.selected.opts[this.state.option.key]
    return (
      <div style={{zIndex: 99}}>
        {this.state.option.key}
        <Select options={this.state.options} value={(opts) ? {value: opts, label: opts} : null} isClearable onChange={this.handleChange.bind(this)}/>
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
  console.log("STUFFFF", selected.opts)
  return {
    selected: selected
  }
}

function dispatchProps(dispatch){
  return {
    editorActions: bindActionCreators(editorActions, dispatch)
  }
}

export default connect(stateProps, dispatchProps)(StringInput) 
