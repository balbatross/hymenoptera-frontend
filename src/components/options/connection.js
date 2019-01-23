import React, {
  Component
} from 'react';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { addConnection, getConnectionsByModule } from '../../flow-api';
export default class Connection extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props,
      selectedConnection: props.value || '',
      connections: [],
      connection: {name: ''},
      editing: false
    }
  }

  componentDidMount(){
    if(this.props.module.id){
      getConnectionsByModule(this.props.module.id).then((connections) => {
        this.setState({connections: connections})
      })
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props.module.id !== newProps.module.id){
      getConnectionsByModule(newProps.module.id).then((connections) => {
        this.setState({module: newProps.module, connections: connections, selectConnection: newProps.value || ''})
      })
    }
    if(this.props.value !== newProps.value){
      this.setState({selectedConnection: newProps.value})
    }
  }

  openEditorModal(){
    this.setState({editing: true})
  }

  bindProtection(){
    document.getElementById('connection-dialog').addEventListener('keyup', (e) => {
      var code = e.keyCode || e.charCode;
      if(code == 8 || code == 46){
        e.stopPropagation();
      }
    })
  }

  _renderConnections(){
    return this.state.connections.map((x) => {
      return (
        <MenuItem value={x.id}>
          {x.name}
        </MenuItem>
      );
    })
  }

  _changeConnection(e){
    let val = e.target.value;
    this.setState({selectedConnection: val})

    if(this.props.onChange){
      this.props.onChange(val)
    }
  }

  _renderEditor(){
      return (
          <div className="connections-editor__controls">
            <FormControl fullWidth>
              <InputLabel htmlFor="connection">Connection</InputLabel>
              <Select
                onChange={this._changeConnection.bind(this)}
                value={this.state.selectedConnection}
                inputProps={{
                  name: 'connection',
                  id: 'connection'
                }}>
                {this._renderConnections()}
                <MenuItem value={"8c8496a2-929f-4c32-a530-ca2c61bb3b0d"}>User defined</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={this.openEditorModal.bind(this)} color="primary" variant="contained">
              +
            </Button>
          </div>
      );
    
  }

  onChange(key, val){
    let conn = this.state.connection;
    conn[key] = val;
    this.setState({
      connection: conn
    })
  }

  createConnection(){
    let conn = this.state.connection;
    addConnection(this.props.module.id, conn).then((r) => {
      this.setState({editing: false})
    })
  }

  closeModal(){
    this.setState({editing: false})
      getConnectionsByModule(this.props.module.id).then((connections) => {
        this.setState({connections: connections})
      })
  }

  render(){
    return ( 
        <div className="connections-editor">
          <h4>Connections</h4>
          {this._renderEditor()}
          <Dialog onEntered={this.bindProtection.bind(this)} open={this.state.editing} id="connection-dialog">
            <DialogTitle>Create new {this.props.module.name} Connection</DialogTitle>
            <DialogContent>
              <TextField value={this.state.connection.name} onChange={(e) => this.onChange('name', e.target.value)} fullWidth placeholder="Connection Name" />
              <JSONInput confirmGood={false} onChange={(e) => this.onChange('opts', e.jsObject)} locale={locale} placeholder={this.props.module.base.opts} height='250px' />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.closeModal.bind(this)}>
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={this.createConnection.bind(this)}>
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}
