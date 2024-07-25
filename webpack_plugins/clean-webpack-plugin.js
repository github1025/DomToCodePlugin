class CleanWebpackPlugin{
    apply(compiler){
        // 获取打包的输出目录层
        const outputPath = compiler.options.output.path;
        const fs = compiler.inputFileSystem;

        // 注册钩子，打包输出之前emit
        compiler.hooks.emit.tap('CleanWebpackPlugin',()=>{
            this.removeFiles(fs, outputPath);
        })
    }

    removeFiles(fs, outputPath){
        // 想要删除打包输出目录下的所有资源，需要先将目录下的资源删除，才能删除这个目录
        // 1、读取当前目录下的所有资源
        const files = fs.readdirSync(outputPath);
        // 2、遍历一个个的删除
        files.forEach(file=>{
            const path = `${outputPath}/${file}`;
            const fileStat = fs.statSync(path)
            if(fileStat.isDirectory()){
                // 如果是文件夹，递归删除
                this.removeFiles(fs, path);
            }else{
                // 如果是文件，直接删除
                fs.unlinkSync(path);
            }
        })
    }


}

module.exports = CleanWebpackPlugin;