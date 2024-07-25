import moment from 'moment'
import { bindActionCreators } from 'redux'
import { validateNumberic, validatePositiveNumberic, validateMaxLength, validatePointNumberic } from './helperValidate'
import axios from "axios";

export function clearObj(obj) {
  let _obj = Object.assign({}, obj)
  Object.keys(_obj).forEach(o => {
    if (!obj[o] && typeof obj[o] != "boolean" && obj[o] !== 0) {
      delete _obj[o]
    }
  })
  return _obj
};

export function computedCoupon(Scopecoupons, filterCoupons, id) {
  if (id) {
    Scopecoupons = Scopecoupons.filter(c => { return (c.status === "VALID" && c.endDate > new Date().valueOf()) || filterCoupons.indexOf(c.number) != -1 })
  } else {
    Scopecoupons = Scopecoupons.filter(c => c.status === "VALID" && c.endDate > new Date().valueOf())
  }
  return Scopecoupons
}

export function formatNumber(value) {
  return parseInt(value) === value ? value : parseFloat(value.toFixed(2));
}
// def periodTime(dateFrom: Long,dateTo: Long) ={
//   val dateFormat = new SimpleDateFormat("yyyy-MM-dd")
//   val startDate  = dateFormat.format(dateFrom)
//   val endDate = dateFormat.format(dateTo)
//
//   val dateFiled = Calendar.DAY_OF_MONTH
//   var beginTime = dateFormat.parse(startDate)
//   val endTime = dateFormat.parse(endDate)
//   val calendar = Calendar.getInstance()
//   calendar.setTime(beginTime)
//   val dateArray: ArrayBuffer[String] = ArrayBuffer()
// while (beginTime.compareTo(endTime) <= 0) {
//   dateArray += dateFormat.format(beginTime)
//   calendar.add(dateFiled, 1)
//   beginTime = calendar.getTime
// }
// dateArray.toList
// }

/**
 * 获取时间段数组 以天为单位
 * @param dateFrom 开始时间 （时间戳）
 * @param dateTo 结束时间（时间戳）
 */
export function periodTime(dateFrom, dateTo) {
  let dateArray = [];
  var beginTime = dateFrom;
  while (beginTime < dateTo) {
    dateArray.push(moment(new Date(beginTime)).format("YYYY-MM-DD"))
    beginTime += 24 * 60 * 60 * 1000;
  }
  return dateArray
}
/**
 *根据数据条数与每页多少条数据计算页数
 * totalnum 数据条数
 * limit 每页多少条
 */
export function pageCount(totalnum, limit) {
  return totalnum > 0 ?
    ((totalnum < limit) ? 1
      : ((totalnum % limit) ? (parseInt(totalnum / limit) + 1)
        : (totalnum / limit))) : 0;
}

export function basicReduxSwitch(action, state) {

  switch (action.type) {
    case "EDIT_STATE_OVERWRITE": {
      let value = action.value;
      return Object.assign({}, state, value)
    }
    case "EDIT_STATE_CHANGE": {
      let _state = Object.assign({}, state);
      let get_value = null
      if (Object.prototype.toString.call(action.value) == '[object Array]') {// 判断是否为数组
        get_value = [...action.value]
      } else {
        get_value = action.value
      }
      _state[action.key] = get_value;
      return Object.assign({}, state, _state)
    }

    case "EDIT_STATE_NEST_CHANGE": {
      let res = Object.assign({}, state[action.key1])

      let get_value = null
      if (Object.prototype.toString.call(action.value) == '[object Array]') {// 判断是否为数组
        get_value = [...action.value]
      } else if (Object.prototype.toString.call(action.value) == '[object Object]') {
        get_value = Object.assign({}, action.value)
      } else {
        get_value = action.value
      }
      res[action.key2] = action.value;
      return Object.assign({}, state, { [action.key1]: res })
    }

    case "EDIT_STATE_NEST_NEST_CHANGE": {
      let res = Object.assign({}, state[action.key1])
      let res2 = Object.assign({}, res[action.key2])
      res2[action.key3] = action.value;
      res[action.key2] = res2
      state[action.key1] = res
      return Object.assign({}, state)
    }
    case "EDIT_STATE_NEST_NEST_NEST_CHANGE": {
      let res = Object.assign({}, state[action.key1])
      let res2 = Object.assign({}, res[action.key2])
      let res3 = Object.assign({}, res2[action.key3])
      res3[action.key4] = action.value;
      res2[action.key3] = res3
      res[action.key2] = res2
      state[action.key1] = res
      return Object.assign({}, state)
    }
    default:
      return ""
  }
}

export function groupByType(arr, param) {
  var map = {},
    dest = [];
  for (var i = 0; i < arr.length; i++) {
    var ai = arr[i];
    if (ai[param] && !map[ai[param]]) {
      dest.push({
        name: ai[param],
        data: [ai]
      });
      map[ai[param]] = ai;
    } else {
      for (var j = 0; j < dest.length; j++) {
        var dj = dest[j];
        if (dj.name == ai[param]) {
          dj.data.push(ai);
          break;
        }
      }
    }
  }
  return dest;
}
export function toHHmmss(data) {
  var timeobj = {};
  var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
  //var seconds = (data % (1000 * 60)) / 1000;
  //s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
  timeobj.time = (hours < 0 ? "00" : hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes)
  timeobj.date = new Date(data - 28800000)
  return timeobj;
};

export function getFilterBranch(bIds, title) {
  if (!bIds.length) {
    return title || '请选择适用门店';
  }

  if (bIds.length === window.BRANCH_LIST.length) {
    return title || '所有门店适用';
  }

  var result = '适用门店：' + bIds.map(function (pId) {
    return window.BRANCH_MAP[pId];
  }).join('、');

  return result.length > 20 ? result.substring(0, 19) + '...' : result;
}

export function getCategoryProductText(productIds, categoryProductsMap) {
  let result = "";
  console.log("所有商品的数量", Object.keys(categoryProductsMap).length)
  console.log("已经选中商品的数量", productIds.length)
  if (productIds.length > 0 && (productIds.length < Object.keys(categoryProductsMap).length)) {
    result = productIds.map(b => categoryProductsMap[b]).join(",")
  } else if (Object.keys(categoryProductsMap).length == productIds.length) {
    result = "全部商品适用"
  } else {
    result = "全部商品适用"
  }
  return result;
}

export function getRetailCategoryProductText(productIds, categoryProductsMap) {
  let result = "";
  // console.log("所有商品",productIds)
  // console.log("所有商品名称",categoryProductsMap)
  if (productIds.length > 0) {
    result = productIds.map(b => categoryProductsMap[b]).join(",")
  } else {
    result = "全部商品适用"
  }
  return result;
}

export function getBranchText(branchIds, returnTxt) {
  if (branchIds && branchIds.length && BRANCH_LIST.length != branchIds.length) {
    let _txt = branchIds.map(b => BRANCH_MAP[b]).join(",")
    return _txt
  } else {
    return returnTxt || "全部门店适用"
  }
}

export function getGeneralFilterText(filterAry, filterMap, selectAllText) {
  if (filterAry.length === Object.keys(filterMap).length || !filterAry.length) {
    return selectAllText;
  } else {
    return filterAry.map(t => filterMap[t]).join(",")
  }
}
export function getFilterLevel(levels, LEVEL_MAP) {
  if (levels.length === Object.keys(LEVEL_MAP).length || !levels.length) {
    return "全部会员等级适用";
  } else {
    return levels.map(t => LEVEL_MAP[t]).join(",")
  }
}


export function formValidate(validateObj, form) {
  let validateList = Object.keys(validateObj);
  for (let i = 0; i < validateList.length; i++) {
    let key = validateList[i]
    key.split
    if (validateObj[key].types) {
      for (let j = 0; j < validateObj[key].types.length; j++) {
        let typeObj = validateObj[key].types[j]
        if (!validateData(typeObj, key, form)) {
          return false
        }
      }
    } else {
      let typeObj = validateObj[key]
      if (!validateData(typeObj, key, form)) {
        return false
      }
    }
  }
  return true;
}

export function validateData(typeObj, key, form) {
  switch (typeObj.type) {
    case "custom": {
      if (!typeObj.custom(form)) {
        return false
      }
      break
    }
    case "numberic": {
      if (typeObj.key1) {
        if (!validateNumberic(form[typeObj.key1][key])) {
          return false
        }
      } else {
        if (!validateNumberic(form[key])) {
          return false
        }
      }

      break
    }
    case "positiveNumberic": {
      if (typeObj.key1) {
        if (!validatePositiveNumberic(form[typeObj.key1][key])) {
          return false
        }
      } else {
        if (!validatePositiveNumberic(form[key])) {
          return false
        }
      }
      break
    }
    case "maxNumberic": {
      if (typeObj.key1) {
        if (!validateMaxLength(form[typeObj.key1][key])) {
          return false
        }
      } else {
        if (!validateMaxLength(form[key])) {
          return false
        }
      }
      break
    }
    case "pointNumberic": {
      if (typeObj.key1) {
        if (!validatePointNumberic(form[typeObj.key1][key])) {
          return false
        }
      } else {
        if (!validatePointNumberic(form[key])) {
          return false
        }
      }
      break
    }
    case "required": {
      if (typeObj.key1) {
        if (!form[typeObj.key1][key]) {
          return false
        }
      } else {
        if (!form[key]) {
          return false;
        }
      }
      break
    }
  }
  return true
}

export function ArrayObjSort(prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}
export function reNameWeek(num) {
  let week = ""
  switch (num) {
    case 1:
      week = "周一"
      break;
    case 2:
      week = "周二"
      break;
    case 3:
      week = "周三"
      break;
    case 4:
      week = "周四"
      break;
    case 5:
      week = "周五"
      break;
    case 6:
      week = "周六"
      break;
    case 7:
      week = "周日"
      break;
  }
  return week
}
export function EchartLegendName(str) {
  let name = ""
  if (str == "dateTo") {
    name = "今天"
  } else if (str == "yesterday") {
    name = "昨天"
  } else if (str == "lastWeek") {
    name = "上周"
  } else if (str == "lastMonth") {
    name = "上月"
  } else if (str == "lastYear") {
    name = "上年"
  } else if (str == "thisYear") {
    name = "今年"
  } else if (str == "thisMonth") {
    name = "本月"
  } else if (str == "lastMonthWeek") {
    name = "月同比"
  } else if (str == "lastYearWeek") {
    name = "年同比"
  } else if (str == "thisWeek") {
    name = "本周"
  }
  return name
}
export function dayLimitIsAllDay(dayLimit, originalDayLimitMap) {
  let flag = true;
  if (dayLimit.length) {
    for (let i = 0; i < dayLimit.length; i++) {
      let d = dayLimit[i];
      if (originalDayLimitMap[d.day].startTime != d.startTime || originalDayLimitMap[d.day].endTime != d.endTime) {
        flag = false;
        break;
      }
    }
  }
  return flag;
}
export function getPrevMonthLast() { // 获取上个月的最后一天
  var date = new Date();
  var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  var enddate = new Date(date.getFullYear(), date.getMonth() - 1, day);
  return enddate;
}

export function compMonthScope(param) {
  /*var myDate = new Date();
  var month = myDate.getMonth()+1
  let daynum = ''
  if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
    daynum = 31
  }else{
    daynum = 30
  }*/
  var dateFrom = ""
  var dateTo = ""
  if (param == 'today') { // 今天
    dateFrom = new Date(moment().format("YYYY-MM-DDT00:00:00"));
    dateTo = new Date(moment().format("YYYY-MM-DDT23:59:59"));
  } else if (param == 'yestoday') { // 昨天
    dateFrom = new Date(moment().subtract(1, "days").format("YYYY-MM-DDT00:00:00")); //当前时间的前1天时间
    dateTo = new Date(moment().subtract(1, "days").format("YYYY-MM-DDT23:59:59"));
  } else if (param == 'month') { // 本月从当月第一天，截止到本日
    dateFrom = new Date(moment().format("YYYY-MM-01T00:00:00"));
    dateTo = new Date(moment().format("YYYY-MM-DDT23:59:59"));

  } else if (param == 'prevmonth') { // 上一个月
    dateFrom = new Date(moment().subtract(1, "month").format("YYYY-MM-01T00:00:00"));   // getPrevMonthLast();
    dateTo = new Date(moment().subtract(1, "month").endOf("month").format("YYYY-MM-DDT23:59:59"));
  }
  return { dateTo: dateTo, dateFrom: dateFrom }
}

export const getRequestParam = function (name) {
  var result = location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'));
  if (result === null || result === undefined || result.length < 1) {
    return null;
  }
  return decodeURIComponent(result[1]);
}


export const getReportParameters = function (filter) {
  return Object.getOwnPropertyNames(filter).filter(function (k) {
    return filter[k] != null;
  }).map(function (k) {
    return { name: k, value: filter[k].toString() };
  });
}

export const removeEditorWrong = function (desc) {
  if (desc) {
    desc = desc.replace(/<xml>[\s\S]*?<\/xml>/g, '')
    desc = desc.replace(/<style>[\s\S]*?<\/style>/g, '')
    desc = desc.replace(/<section/g, '<div')
    desc = desc.replace(/section>/g, 'div>')
  }
  return desc
}

export const createSearchUrl = function (url, filter) {
  if (!filter) {
    return url;
  }
  var keys = Object.getOwnPropertyNames(filter);
  if (keys.length === 0) {
    return url;
  }
  url += (url.indexOf('?') === -1 ? '?' : '&');
  for (var i in keys) {
    var key = keys[i];
    var value = filter[key];
    if (value !== null && value !== undefined) {
      url += key + '=';
      if (value instanceof Array) {
        value.forEach(function (v, j) {
          url += encodeURIComponent(v);
          if (j < value.length - 1) {
            url += ',';
          }
        });
      } else {
        url += encodeURIComponent(value);
      }
      url += '&';
    }
  }
  return url.substring(0, url.length - 1);
}

/**
 * 不用请求接口的异步方法
 */
export async function unRequest() {
  return {
    data: {
      code: "0",
      message: "OK",
    }
  }
}