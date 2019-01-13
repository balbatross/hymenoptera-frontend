import React, {
  Component
} from 'react';
import Node from '../nodes'
import './index.css'

export default class Menu extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="flow-menu">
        <ul>
          <li>
            <Node node={{title: 'HTTP', description: 'GET'}}/>
          </li>
          <li>
          <Node node={{title:'Mongo', description:'Find'}}/>
          </li>
        </ul>
      </div>
    );  
  }
}
