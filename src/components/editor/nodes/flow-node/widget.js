import * as React from 'react';
import { FlowNodeModel } from './model';
import { PortWidget } from 'storm-react-diagrams';

export default class FlowNodeWidget extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      size: 150,
      node: null,
      ...props
    }
  }
}
