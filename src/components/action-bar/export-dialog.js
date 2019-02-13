import React, {
  Component
} from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';

import './export-dialog.css';
export default class ExportDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props.flow,
      flow: props.flow || {name: 'Collection API', version: '0.0.18'},
    
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      this.setState({...newProps})
    }
  }

  onClose(){
    if(this.props.onClose){
      this.props.onClose();
      this.setState({
        exported_result: null
      })
    }
  }

  _export(){
    this.setState({exporting: true})
    this._exportFlow().then((r) => {
      this.setState({
        exporting: false,
        exported_result: r
      })
    })
  } 

  _exportFlow(){
    return fetch('http://localhost:8000/api/flows/' + this.state.flow.id + '/package', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: this.state.flow.version
      })
    }).then((r) => {
      return r.json();
    })
  }

  _versionChange(e){
    let flow = this.state.flow;
    flow.version = e.target.value;
    this.setState({flow: flow})
  }

  _renderExportOptions(error){
    return (
        <DialogContent>
          <FormControl fullWidth>
            <TextField label="Module name" value={this.state.flow.name.toLowerCase().replace(/ /, '-')} readonly disabled/>
          </FormControl>
          <FormControl fullWidth>
            <TextField error={error && error.code == "EPUBLISHCONFLICT"} label={error && error.code == "EPUBLISHCONFLICT" ? "Version already exists" : "Module version"} value={this.state.flow.version} onChange={this._versionChange.bind(this)} />
          </FormControl>
      </DialogContent>
    );
  }

  _renderExportInstall(){
    return (
      <DialogContent>
        <div className="install-helper">npm set registry http://localhost:4873 </div>
        <div className="install-helper">npm i --save {this.state.flow.name.toLowerCase().replace(/ /, '-')}@{this.state.flow.version}</div>
        <div className="install-helper">npm set registry https://registry.npmjs.org</div>
      </DialogContent>
    );
  }

  _renderPane(){
    if(this.state.exported_result && !this.state.exported_result.error){
      return this._renderExportInstall();
    }else if(this.state.exported_result && this.state.exported_result.error){
      return this._renderExportOptions(this.state.exported_result.error)
    }else{
      return this._renderExportOptions();
    }
  }

  render(){
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>Export flow</DialogTitle>
        <DialogContent>
          {this._renderPane()}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose.bind(this)}>Cancel</Button>
          <Button color="primary" variant="container" onClick={this._export.bind(this)}>{this.state.exporting ? (<CircularProgress  style={{height: '20px', width: '20px'}}/> ) : 'Export'}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
