import * as types from './actionTypes';

export function selectNode(node, selection){
  return dispatch => {
    let s = {node: node, selected: selection}
    return dispatch({type: types.SELECT_NODE, selection: s})
  }
}

export function editFlow(flow){
  return (dispatch) => {
    return dispatch({type: types.EDIT_FLOW, flow: flow})
  }
}
