
export default function reducer(state = {
    loadingDisplay: false
  }, action={}) {
    switch (action.type) {    
      case "TOGGLE_LOADING" : {
        return Object.assign({}, state, {
          loadingDisplay: action.bool
        })
        break;
      }
      default: 
        return state
    }
  }
  