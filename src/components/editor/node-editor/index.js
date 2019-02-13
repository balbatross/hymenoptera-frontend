import React, {
  Component
} from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

export default class NodeEditor extends Component {
  render(){
    return (
      <AceEditor
        style={{flex: 1, height: 'auto', width: 'auto'}}
        mode="javascript"
        theme="github"
        name="code-editor"
        value={this.props.module}
        editorProps={{$blockScrolling: true}} />
    );
  }
}
