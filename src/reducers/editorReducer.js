import { UPDATE_NODE_OPTS, UPDATE_NODE_CONN, SAVED_FLOW, UPDATE_FLOW_DIAGRAM, SET_TAB, SELECT_NODE, EDIT_FLOW } from '../actions/actionTypes';
import initialState from './initialState';

export default function editor(state = initialState.editor, action){
  let newState;
  let tabs = state.tabs;
  let tab; 

  switch(action.type){
    case SAVED_FLOW:
      for(var i = 0; i < tabs.length; i++){
        if(tabs[i].id == action.flow.id){
            tabs[i].edited = false
            return {...state, tabs: tabs}
        }
      }
    case UPDATE_NODE_OPTS:
      tab = tabs[state.activeTab]
      console.log(tab, state.activeTab)
      for(var i = 0; i < tab.flow.nodes.length; i++){
        if(tab.flow.nodes[i].id == action.id){
          tab.flow.nodes[i].opts = action.options
          tab.edited = true
          break
        }
      }
      tabs[state.activeTab] = tab
      newState = {...state, tabs: tabs}
      return newState;
    case UPDATE_NODE_CONN:
      tab = tabs[state.activeTab]
      for(var i = 0; i < tab.flow.nodes.length; i++){
        if(tab.flow.nodes[i].id == action.id){
          tab.flow.nodes[i]['module_inst'] = action.connection
          tab.edited = true
          break
        }
      }
      tabs[state.activeTab] = tab
      newState = {...state, tabs: tabs}
      return newState;
    case UPDATE_FLOW_DIAGRAM:
      for(var i = 0; i < tabs.length; i++){
        if(tabs[i].id == action.id){
          console.log("HIT UPDATE") 
          //Add nodes and links changes to reduced values
          let nodes = action.diagram.nodes.map((x) => {
              let node = tabs[i].flow.nodes.filter((a) => a.id == x.id)
              if(node.length > 0){
                return node[0]
              }else{
                return {
                  id: x.id,
                  module_name: x.extras.module_name,
                  config: x.extras.config,
                  opts: x.extras.opts,
                  delegator: x.extras.delegator,
                  ports: x.ports
                }
              }
          })

          let links = action.diagram.links.map((x) => {
            let link = tabs[i].flow.links.filter((a) => a.id == x.id)
            console.log(x)
            if(link.length > 0){
              return {...link[0], src: x.source, dst: x.target, srcPort: x.sourcePort, dstPort: x.targetPort}
            }else{
              return {id: x.id, src: x.source, dst: x.target, srcPort: x.sourcePort, dstPort: x.targetPort}
            }
          })

          tabs[i].flow = {...tabs[i].flow, links: links, nodes: nodes, diagram: action.diagram}
          tabs[i].edited = true
          newState = {...state, tabs: tabs}
          return newState 
        }
      }

      return newState
    case SET_TAB:
      newState = {...state, activeTab: action.tab}
      return newState
    case EDIT_FLOW:
      let flow = action.flow
      
      let found = -1;

      tabs.map((a, ix) => {
        if(a.id == flow.id){
          found = ix
        }
      })
      if(found > -1){
        newState = {...state, activeTab: found}
      }else{
        tabs.push(flow)
        newState = {...state, tabs: tabs, activeTab: tabs.length - 1}
      }
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
