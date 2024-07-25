

export const onStateOverWrite  = (value) => {
    return { type: "EDIT_STATE_OVERWRITE", value}
  }
  
  export const onStateChange = (key, value) => { // 一层
    return {type: "EDIT_STATE_CHANGE", key, value}
  }
  
  export const onStateNestChange = (key1, key2, value) => { // 二层
    return {type: "EDIT_STATE_NEST_CHANGE", key1, key2, value}
  }
  
  export const onStateNestNestChange = (key1, key2, key3, value) => { // 三层
    return {type: "EDIT_STATE_NEST_NEST_CHANGE", key1, key2, key3, value}
  }
  
  export const onStateNestNestNestChange = (key1, key2, key3, key4, value) => { // 四层
    return {type: "EDIT_STATE_NEST_NEST_NEST_CHANGE", key1, key2, key3, key4, value}
  }
