import * as types from './actionTypes';
import { createFlow, saveFlow } from '../flow-api';

export function saveActiveFlow(){
  return (dispatch, getState) => {
    let state = getState().editor;
    let tab = state.tabs[state.activeTab]
    if(tab){
      if(tab.id){
        saveFlow(tab).then((r) => {
          return dispatch({type: types.SAVED_FLOW, flow: tab})
        })
      }else{
        createFlow(tab).then((r) => {
          //Put id on flow and mark as saved
        })
      }
    }
  }
}

export function selectNode(node, selection){
  return dispatch => {
    let s = {node: node, selected: selection}
    return dispatch({type: types.SELECT_NODE, selection: s})
  }
}

export function setActiveTab(ix){
  return dispatch => {
    return dispatch({type: types.SET_TAB, tab: ix})
  }
}

// Add flow to tabs if not already
// Change active tab to flow
export function editFlow(flow){
  return (dispatch) => {
    return dispatch({type: types.EDIT_FLOW, flow: flow})
  }
}

export function updateNodeOptions(id, options){
  return dispatch => {
    return dispatch({type: types.UPDATE_NODE_OPTS, options: options, id: id})
  }
}

export function updateNodeConnection(id, connection){
  return dispatch => {
    return dispatch({type: types.UPDATE_NODE_CONN, connection: connection, id: id})
  }
}

export function updateFlowDiagram(id, diagram){
  return dispatch => {
    return dispatch({type: types.UPDATE_FLOW_DIAGRAM, diagram: diagram, id: id})
  }
}
