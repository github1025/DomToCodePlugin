import axios from 'axios'
import {clearObj} from '../../util/helper'
import { global } from '../../base/config'
export const getNames = (obj) => async dispatch => {
  let response = await axios.get(`${global.ApiUrl}/process_get`,{
    params:obj
  })
  dispatch({type: "LIST",  list: response.data.data}) 
  return response;
}