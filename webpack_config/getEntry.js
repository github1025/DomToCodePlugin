/* eslint-env node */

 const getFilePath = require("./getFilepath");
 /**
  * 【获取entry文件入口】
  *
  * @param {String} path 引入根路径
  * @returns {Object} 返回的entry { "aoubt":"./src/about/about.js",...}
  */
 module.exports = function getEnty(path){
     let entry = {};
     getFilePath(path).map((item)=>{
         /**
          * 下面输出格式为{"about":"./src/aobout/index.js"}
          * 这样目的是为了将js打包到对应的文件夹下
          */
         entry[`${item}`] = `${path}/${item}/entry.js`;
     });
     return entry;
 };