import React, {
  Component
} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import brace from 'brace';
import AceEditor from 'react-ace';
import { addConnection } from '../../../flow-api';
import 'brace/mode/javascript';
import 'brace/theme/github';

export default class ConnectionDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      ...props,
      name: '',
      opts: null
    }
  }

  addConnection(){
    let conn = {
      name: this.state.name,
      opts: JSON.parse(this.state.opts)
    }
    addConnection(this.props.module.id, conn).then((r) => {
      this.setState({open: false, name: '', opts: null})
    })
  }

  render(){
    let opts = (this.state.opts == null) ? this.props.module.klass.opts : this.state.opts
    if(typeof(opts) == 'object'){
      opts = JSON.stringify(opts, null, 2)
    }
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>
          Create new connection
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField label="Connection Name" onChange={(e) => this.setState({name: e.target.value})} value={this.state.name}/>
            <AceEditor
              style={{height: '200px'}}
              mode="javascript"
              theme="github"
              name="code-editor"
              onChange={(newVal) => this.setState({opts: newVal})}
              value={opts}
              editorProps={{$blockScrolling: true}} />            
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => this.setState({open: false})}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={this.addConnection.bind(this)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
