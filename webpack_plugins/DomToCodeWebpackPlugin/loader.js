const { parseSync, traverse, types: t } = require('@babel/core')
const generate = require('@babel/generator').default;
const crypto = require('crypto')

// @babel/parser : 将 js 代码 ------->>> AST 抽象语法树；
// @babel/traverse 对 AST 节点进行递归遍历；
// @babel/types 对具体的 AST 节点进行进行修改；

module.exports = function(source) {

    let { resourcePath, _compilation } = this

    if (!_compilation?.codeMap) {
        _compilation.codeMap = {};
    }

    // console.log("看看source", source)

    // console.log("loader的this对象", this)
    // 这是 Babel 提供的同步解析器方法，用于将源代码解析成抽象语法树（AST）。
    // AST 是代码在内存中的一种结构化表示，它是代码的抽象表示，可以让程序分析和修改源代码
    const ast = parseSync(source, {
        configFile: false,
        filename:resourcePath,
        ast: true,
        presets: ['@babel/preset-react']
    })

    // 这是 Babel 提供的 AST 遍历工具，用于遍历和修改 AST 中的节点。
    traverse(ast, {
        enter({ node }) {
            //进修改jsx标签
            if( node.type == 'JSXElement' ) {
                // console.log("看看node", node)
                // Invalid prop `dtc` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props
                if (node?.openingElement?.name?.object?.name === 'React') return

                const { column, line } = node?.loc?.start

                if( resourcePath && column && line ){
                    const hash = crypto.createHash('sha256');
                    const value = `${resourcePath}:${line}:${column}`
                    const hashValue = hash.update(value).digest('hex')
                    _compilation.codeMap[hashValue] = value

                    // source = source.replace(/<[^/][^>]*>[^<]*<\/[^>]+>/g, match => {
                    //     return match.replace('>', ' dtc="'+ hashValue +'">');
                    // });
                    // types  这是 Babel 提供的用于创建和操作 AST 节点的工具集。通过 types，可以方便地创建新的 AST 节点，或者操作现有的 AST 节点
                    const dtcAttribute = t.jSXAttribute(t.jSXIdentifier('dtc'), t.stringLiteral(hashValue));
                    node?.openingElement?.attributes?.push(dtcAttribute);
                }

            }
        },
    })

    const { code } = generate(ast);
    return code;
};


