import React,{
  Component
} from 'react'
import './index.css'
  export default class DefaultNode extends Component {
    constructor(props){
      super(props);
      this.state = {
        ...props
      }
    }

    componentWillReceiveProps(newProps){
      if(this.props !== newProps){
        this.setState({
          ...newProps
        })  
      }
    }
render() {
      return(<div className='node default' draggable={true} onDragStart={event => {
  console.log("START")
    event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.state.node))
      }}>  
      <div className='node-title'>
        {this.state.node.title}
      </div>
      <div className="node-description">
        {this.state.node.description}
      </div>
      </div>)
      }
      
      
      
      
 }
