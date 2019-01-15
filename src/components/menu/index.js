import React, {
  Component
} from 'react';
import Node from '../nodes'
import './index.css'

export default class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...props,
      modules: []
    }
  }

  componentDidMount(){
    this.getModules().then((modules) => {
      this.setState({
        modules: modules
      })
    })
  }

  componentWillReceiveProps(newProps){
    this.setState({
      ...newProps
    })  
  }

  getModules(){
    return fetch('http://localhost:8000/api/modules').then((r) => {
      return r.json()
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
  
  _renderItems(){

    let modules = []
    console.log(this.state.modules)
    this.state.modules.map((x) => {
      x.modules.map((mod) => {
        mod.package = x.id;
        modules.push(mod)
        console.log(mod)
      })
    })

    return modules.map((m) => {
      return (
        <li>
          <Node node={{title: m.package, description: m.key, config: m.config}} />
        </li>
      );
    })
  }

  render(){
    return(
      <div className="flow-menu">
        <div onClick={this.run.bind(this)}> |> Run</div>
        <ul>
          {this._renderItems()}
        </ul>
      </div>
    );  
  }
}
