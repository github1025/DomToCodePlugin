import { createStore , combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import loadingReducer from './loading'



let finalCreateStore = compose(
    applyMiddleware(thunk)
)(createStore)

export default function configureStore(initialState = {}, viewreducer) {
    
    let reducerObj = {}
    if(typeof viewreducer === "object") {
        reducerObj = Object.assign({}, viewreducer)
    } else {
        reducerObj = {view: viewreducer}
    }
    reducerObj.loading = loadingReducer

    const reducer = combineReducers(reducerObj)
    return finalCreateStore(reducer, initialState)
}
