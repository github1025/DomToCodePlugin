/**
 * @author zhangyanbin
 * @date 2022年03月01日 7:46 下午
 * @describe
 */
import React, { useEffect, useState, useContext } from "react";
import { CtxDispatch, CtxContent } from "./index";


function onBasicChange(dispatch, state, key, value ){
	let tempDetail = Object.assign({...state.detail})
	tempDetail[key] = value
	dispatch({type: "ON_STATE_CHANGE", key: "detail", value: tempDetail})
}

export { onBasicChange }