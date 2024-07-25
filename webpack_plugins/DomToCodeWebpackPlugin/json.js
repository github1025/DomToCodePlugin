const path = require('path')
const fs = require("fs")
const filePath = path.join(__dirname, '../../node_modules/.cache/dtc/dtc.json');


const before = (cb)=>{
    const cache = process.env.cache
    fs.access(filePath, fs.constants.F_OK, (err)=>{
        if (err) {
            // 目录不存在需要创建
            console.error(`${filePath} file or directory does not exist`);
            createJsonFile()
            return
        }else{ // 目录存在
            if(cache == 'false'){
                console.log("[dtc]删除")
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(unlinkErr);
                    } else {
                        console.log("[dtc]删除后，重新创建")
                        createJsonFile();
                    }
                });
            }
        }
    })

    const createJsonFile = ()=>{
        const directoryPath = path.dirname(filePath);
        // 如果目录不存在，则创建目录
        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.log("目录不存在")
                console.error('Error creating directory:', err);
                return;
            }
            console.log("目录存在")
            // 使用 fs.writeFile 创建文件
            fs.writeFile(filePath, '{}', 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('JSON file has been saved.');
            });
            console.log(`Directory '${filePath}' created successfully`);
        });
    }
}


const set = (codeMap, cb) =>{
    console.log("看看路径", filePath)
    // 读取JSON文件
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            console.log("json读取到的数据", jsonData); // 处理获取到的 JSON 数据
            let newJsonData = Object.assign({}, jsonData, codeMap)
            let newJsonString = JSON.stringify(newJsonData, null, 2)
            fs.writeFile(filePath, newJsonString, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                cb()
                console.log('JSON file has been saved.');
            });

        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
}

const get=(key,cb)=>{
    console.log("读取文件是否存在", key)
    // 读取JSON文件
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('[dtc] Error reading JSON file:', err);
        } else {
            const jsonData = JSON.parse(data);
            cb(jsonData[key])
        }
    });
}

/**
 * 获取当前项目根目录是否有
 * .vscode .ws .idea文件夹
 * 来判断当前打开的工具是什么
 * @returns {string|null}
 */
const getToolType=()=>{
    const rootPath = path.join(__dirname, '../../')
    const vscodeFolderPath = path.join(rootPath, '.vscode');
    const wsFolderPath = path.join(rootPath, '.ws');
    const idesFolderPath = path.join(rootPath, '.idea');

    if ( fs.existsSync(vscodeFolderPath) ) {
        return "vscode"
    } else if( fs.existsSync(wsFolderPath) ) {
        return "webstorm"
    }else if( fs.existsSync(idesFolderPath) ){
        return "idea"
    }
    return null;
}


module.exports = { before, set, get, getToolType }