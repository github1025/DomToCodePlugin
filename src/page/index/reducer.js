

const initialState = {
	curentTab: "basic",
	menuTabs: [
		{value : "basic", title: "配置"}
	],
	filter: {
		status: "",
		entryType:"ALL",
		taskType:""
	},
	rows: [
		{key:0, title: "化妆棉",title1:"美容院化妆棉"},
		{key:1, title: "化妆棉1",title1:"美容院化妆棉1"},
		{key:2, title: "化妆棉",title1:"美容院化妆棉"}
	],
	selectedRow: [],
	detail:{status:"INVALID"},
	displayDetail: false
}

const reducer = (state, action) => {
	switch (action.type) {
		case "ON_STATE_CHANGE": {
			return {...state, [action.key]: action.value}
		}
		case "ON_FILTER": { 
			return {...state, filter: {...state.filter, [action.key]: action.value}}
		}
		case "CREATE_DETAIL":{
			let tempDetial = {
				status:"INVALID"
			}
			return Object.assign({}, state, {
				detail: tempDetial
			})
		}
		default:
			return state
	}
}

export {initialState, reducer}