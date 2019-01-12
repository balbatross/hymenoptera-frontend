import React, {
  Component
} from 'react';

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
            HTTP IN
          </li>
          <li>
            Mongo find
          </li>
        </ul>
      </div>
    );  
  }
}
