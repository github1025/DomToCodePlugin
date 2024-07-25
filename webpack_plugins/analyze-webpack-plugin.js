class AnalyzeWebpackPlugin{
    apply(compiler){
        // 注册钩子，打包输出之前emit
        compiler.hooks.emit.tap('AnalyzeWebpackPlugin',(compilation)=>{
            this.analyze(compilation);
        })
    }


    analyze(compilation){
       // Object.entries 将对象转换成二维数组
        /*
        * {
        *   key1: value1,
        *   key2: value2
        * }
        * 转化为
        * [[key, value1],[key2, value2]
        * */
        const assets = Object.entries(compilation.assets);
        /*
        * md中表格语法
        * | 文件名 | 文件大小 |
        * | --- | --- |
        * | bundle.js | 1kb |
        * */
        let content = `| 文件名 | 文件大小 |\n| --- | --- |\n`;
        assets.forEach(([filename, statObj])=>{
            content += `\n| ${filename} | ${statObj.size()} |`;
        })

        // 生成一个md文件
        compilation.assets['analyze.md'] = {
            source(){
                return content;
            },
            size(){
                return content.length;
            }
        }
    }

}

module.exports = AnalyzeWebpackPlugin;