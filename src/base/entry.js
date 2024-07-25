import React from 'react';
import ReactDOM from 'react-dom';
import init from "../../webpack_plugins/DomToCodeWebpackPlugin/init";
export default function baseEntry(App) {
	const initWindow=()=>{
		window.STATIC_PATH = process.env.staticPath
		let menus = process.env.menus || []
		let menuMap = {}
		let menuList = []
		menuList = menus.map(m => {
			let url = '/'+ m
			menuMap[url] = m
			return url
		})
		window.MENU_LIST = menuList
		window.MENU_LIST_MAP = menuMap
		console.log("window.MENU_LIST", window.MENU_LIST)
		console.log("window.MENU_LIST_MAP", window.MENU_LIST_MAP)
		render()
		init()
	}
	const render = ()=> {
		ReactDOM.render(
			<React.StrictMode>
				<App />
			</React.StrictMode>,
			document.getElementById('main')
		);
	}

	initWindow()
}


