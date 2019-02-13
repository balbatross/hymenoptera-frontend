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
import './index.css';
export default class ProjectDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: true,
      types: ["React", "Node.js"],
      name: '',
      id: '',
      type: 'react'
    }
  }

  _renderProjectTypes(){
    return this.state.types.map((x) => {
      return (
        <div className="project-type">
          <img src={require(`../../assets/${x.toLowerCase()}.svg`)} style={{width: '30px'}}/>
          <span>{x}</span>
        </div>
      );
    })
  }

  _create(){
    this.createProject().then((r) => {
      this.setState({open: false, name: '', id: ''})
    })
  }

  createProject(){
    return fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project: {
          id: this.state.id,
          name: this.state.name,
          type: this.state.type
        }
      })
    }).then((r) => r.json())
  } 

  render(){
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>
          Create new Project
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} placeholder="Project name" />
          </FormControl>
          <FormControl fullWidth>
            <TextField value={this.state.id} onChange={(e) => this.setState({id: e.target.value})} placeholder="Project ID" />
          </FormControl>
          <span>Target platform</span>
          <FormControl style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {this._renderProjectTypes()}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button color="primary" variant="contained" onClick={this._create.bind(this)}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
