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
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import './index.css';

export default class ProjectDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      types: ["React", "Node.js"],
      projects: [],
      name: '',
      id: '',
      type: 'react'
    }
  }

  componentDidMount(){
    this.getProjects().then((projects) => {
      this.setState({projects: projects})
    })
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

  _open(){

/*    this.createProject().then((r) => {
      this.setState({open: false, name: '', id: ''})
    })*/
  }

  getProjects(){
    return fetch('http://localhost:8000/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((r) => r.json())
  } 

  render(){
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>
          Open Project
        </DialogTitle>
          <DialogContent>
              <FormControl fullWidth>
            <List style={{width: '200px'}}>
          {this.state.projects.map((x) => {
            console.log(x);
            return (
                <ListItem button>
                  <ListItemText primary={x.name} secondary={x.project_id} />
                </ListItem>
            );
          })}
          </List>
            </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Cancel</Button>
          <Button color="primary" variant="contained" onClick={this._open.bind(this)}>Open</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
