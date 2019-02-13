import React, {
  Component
} from 'react';
import ExportDialog from './export-dialog';
import Button from '@material-ui/core/Button';
export default class ActionBar extends Component {
  constructor(props){
    super(props);
    //activeFlow
    this.state = {
      ...props,
      exporting: false
    }
  }

  componentWillReceiveProps(newProps){
    console.log(newProps);
    if(this.props !== newProps){
      this.setState({
        ...newProps
      })
    }
  }

  _exportFlow(){
    this.setState({exporting: true})
  }

  startFlow(){

  }

  stopFlow(){

  }

  render(){
    return ( 
        <div className="editor-toolbar" >
          <ExportDialog open={this.state.exporting} onClose={() => this.setState({exporting: false})} flow={this.state.flow}/>
          <Button variant="contained" onClick={this._exportFlow.bind(this)} style={{marginRight: '10px'}}>
            Export
          </Button>
          <Button color="primary" variant="contained" onClick={this.startFlow.bind(this)} style={{marginRight: '10px'}}>
            RUN
          </Button>
          <Button color="primary" variant="contained" onClick={this.stopFlow.bind(this)}>
            Stop
          </Button>
        </div>
    );
  }
}
