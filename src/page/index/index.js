import React, {createContext, useEffect, useReducer, useState, useContext} from 'react';
import {initialState, reducer} from './reducer'
import { Cascader, Button, Space, Toast } from 'antd-mobile'
export const CtxContent = createContext("")
export const CtxDispatch = createContext(null)
import { options, longOptions } from './data'
import { observable, action, autorun } from "mobx";

function SeedHook() {
	const [state, dispatch] = useReducer(reducer, initialState);

	var todoStore = observable({
		todos:[],
		get completedCount(){
			return this.todos.filter(todo => todo.completed).length;
		}
	})

	autorun(()=>{
		console.log("Completed %d of %d items",
			todoStore.completedCount,
			todoStore.todos.length
		);
	})

	todoStore.todos[0] = {
		title: "Take a walk",
		completed: false
	};

	todoStore.todos[0].completed = true;

	function BasicDemo() {
		const [visible, setVisible] = useState(false)
		const [value, setValue] = useState(['浙江', '杭州', '西湖区'])
		let [count, setCount] = useState(0)
		let [number, setNumber] = useState(2)

		function add(){
			setCount(count + 1)
			setCount(count + 2)
			setNumber(number * 2)
			setNumber(number * 3)
		}
		return (
			<>
				<div>加法：{count}</div>
				<div>乘法：{number}</div>
				<Button onClick={()=> add()}>点击6</Button>
			</>
		)
	}


	return <CtxDispatch.Provider value={dispatch}>
		<CtxContent.Provider value={state}>
      <div className='h-100 relative components-dialog'>
        <div className='h-100 w-100 d-flex-column px-40 pb-20 overflow-hidden '>
          <div className={"d-flex-column flex-1"} style={{height:'calc(100% - 51px)'}}>
						<BasicDemo />
          </div>
        </div>
      </div>
		</CtxContent.Provider>
	</CtxDispatch.Provider>
}


export default SeedHook;