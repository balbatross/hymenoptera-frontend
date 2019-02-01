import React, { Component } from 'react';
import "./tab.css"
export default class Tab extends Component {
    constructor (props){
        super (props)
        this.state={
            ...props
        }
    }
    render  (){
        return (
            <div className="editor-tab">
                <div className="editor-tab__name">
                    {this.state.name}
                </div>
                <div className="editor-tab__indicator">
                </div>
            </div>
        )
    }
}