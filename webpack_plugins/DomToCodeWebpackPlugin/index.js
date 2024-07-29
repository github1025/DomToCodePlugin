const path = require("path");
const {exec} = require("child_process");
const { before, set, get, getToolType  } = require('./json');
class DomToCodeWebpackPlugin{
    static defaultOptions = {
        outputFile: 'assets.md',
    };
    // 需要传入自定义插件构造函数的任意选项
    //（这是自定义插件的公开API）
    constructor(options = {}) {
        console.log("执行constructor")
        // 在应用默认选项前，先应用用户指定选项
        // 合并后的选项暴露给插件方法
        // 记得在这里校验所有选项
        this.options = { ...DomToCodeWebpackPlugin.defaultOptions, ...options };
        before()
    }

    apply(compiler) {
        compiler.options.module.rules.push({
            test: /\.js$/,
            include: /src/,
            use: [
                {
                    loader: path.join(__dirname, './loader'),
                    options:{
                        presets: ['@babel/preset-react'],
                        cache: false
                    }
                },
            ],
        })

    // afterEmit: 文件写入输出目录之后执行的钩子。
        compiler.hooks.afterEmit.tapAsync('MyPlugin', (compilation, callback) => {
            const codeMap = compilation.codeMap || {}
            if( codeMap ){
                set(codeMap,()=>callback() )
            }else{
                callback()
            }

        });
    }

}
function goCode(data,callback){
    if( data?.dtc && data.dtc ){
        console.log("data.dtc", data.dtc)
        get(data.dtc,(goUrl)=>{
            if( !goUrl ) {
                callback(`未找到:${data.dtc}`)
                return
            }

            console.log(`找到了:${data.dtc}`)

            const regex = /^(.*):(\d+):(\d+)$/;
            const match = goUrl.match(regex);

            const filePath = match[1];
            const line = match[2];
            const column = match[3];

            // console.log(`跳转代码:${filePath}:${line}:${column}`)

            const ide = getToolType()

            console.log(`工具类型:${ide}`)
            const script =
                ide == 'webstorm' ?
                    `webstorm --line ${line} --column ${column} ${filePath}` :
                    ide == 'idea' ? `idea --line ${line} --column ${column} ${filePath}` :
                        ide == 'vscode' ? `code -g ${goUrl}` :  null

            console.log(`脚本:${script}`)
            if( script ){
                exec(script, (error, stdout, stderr) => {
                    if (error) {
                        console.log("失败了", error)
                        return;
                    }
                });
                callback(`跳转代码:${filePath}:${line}:${column}`)
            }

        })

    }
}
module.exports = {
    DomToCodeWebpackPlugin,
    goCode
}