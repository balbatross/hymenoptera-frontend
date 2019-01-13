import React, {
  Component
} from 'react';
import Node from '../nodes'
import './index.css'

export default class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      ...newProps
    })  
  }

  run(){

  let serial = this.state.model 

  let links = serial.links;
  let nodes = serial.nodes;
  let linked = []
  for(var i =0; i < links.length; i++){
    var link = links[i];

    let src = nodes.filter((a) => a.id == link.source)[0]
    let dst = nodes.filter((a) => a.id ==link.target)[0]
    linked.push({src: src, dst: dst})

  }
  console.log(linked)



  }

  render(){
    return(
      <div className="flow-menu">
        <div onClick={this.run.bind(this)}>Run</div>
        <ul>
          <li>
            <Node node={{title: 'HTTP', description: 'GET', config: {type: 'input', params: {route: "string", method: "string"} }}}/>
          </li>
          <li>
          <Node node={{title:'Mongo', description:'Find', config: {type: 'process', params: {coll: "string", query: "object"}} }}/>
          </li>
        </ul>
      </div>
    );  
  }
}
