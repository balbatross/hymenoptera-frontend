import React, {
  Component
} from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import './index.css';
export default class Options extends Component {
  constructor(props){
    super(props);
    this.state = {
      options: {},
      ...props,
    }
  }


  componentDidMount(){

     document.getElementsByClassName('flow-options')[0].addEventListener('keyup', (e) => {
          var code = e.keyCode || e.charCode;
          if(code == 8 || code == 46){
              e.stopPropagation();
          }
      });

  }

  componentWillReceiveProps(newProps){
    if(this.props !== newProps){
      console.log(newProps.selected.id)
      this.setState({
        ...newProps
      })
    }
  }

  _handleOptionChange(id, opts){
    if(this.props.onChange){
      this.props.onChange(id, opts);
    }
  }

  _renderOptions(){
    if(this.state.selected.config != null){
      let id = this.state.selected.id;
      let options = Object.keys(this.state.selected.config.params)
      let values = this.state.options
      if(Object.keys(values) == 0){
        values = this.state.selected.config.params
      }

      return (
        <div>
          <h4>{this.state.selected.title}</h4>
          <JSONInput id='options' placeholder={values} onChange={(e) => this._handleOptionChange(id, e.jsObject)} locale={locale} height='250px' /> 
        </div>
      );
    }else{
      return null;
    }
  }

  render(){
    return (
      <div className="flow-options">
        {this._renderOptions()}
      </div>
    );
  }
}
