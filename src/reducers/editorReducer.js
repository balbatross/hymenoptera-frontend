import { SELECT_NODE, EDIT_FLOW } from '../actions/actionTypes';
import initialState from './initialState';

export default function editor(state = initialState.editor, action){
  let newState;
  switch(action.type){
    case EDIT_FLOW:
      newState = {...state, flow: action.flow}
      return newState
    case SELECT_NODE:
      if(action.selection.selected){
        newState = {...state, selected: action.selection.node}
      }else{
        newState = {...state, selected: {}}
      }
      console.log(newState.selected)
      return newState
    default:
      return state
  }
}
