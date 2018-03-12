/**
 * html预处理器，完成公共代码的合并
 * 
 * @example
 * 1.设置页面标题
 * <title><%=title %></title>
 * 
 * 2.引入公用代码片段(path为相对路径)
 * <%import=path %>
 */
class autoInjectHtmlLoader{
    
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data, cb) => {
                    console.log('\n')
                    let matches = data.html.match(/<%(.+)%>/g)
                    if (matches) {
                        matches.forEach(element => {
                            let code = element.substring(2, element.length - 2).trim()
                            console.log(code)
                            if (code[0] == '=') {
                                console.log(this.options)
                                console.log(code.replace('=', ''))
                                let replace = this.options[code.replace('=','')]
                                data.html = data.html.replace(element, replace)
                            }else if (code.substring(0, 6) == 'import') {
                                let path = code.substring(7)
                                data.html = data.html.replace(element, path)
                            }
                        });
                    }
                    cb(null, data)
                }
            )
        })
    }
}

module.exports = autoInjectHtmlLoader