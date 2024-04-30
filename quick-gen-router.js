
//安装 fs和path模块
let fs = require('fs');
const path = require('path');
let root = path.resolve(__dirname, 'src/views')
console.log('开始配置>>>>>>>>>>>>>>>>>>\n')
// 读取文件信息，并生成路由
function readFileInfo(pathName, dirName) {
    let routes = [];
    let dirDetails = fs.readdirSync(pathName);
    let exclude = null;//排除的文件，不生成路由
    let excludeDir = null;//排除的目录，不遍历目录
    let childList = null;//子路由
    if (dirDetails.length == 0) {
        return []
    }
    if (dirDetails.includes('config.json')) {
        // 读取json数据
        const json = JSON.parse(fs.readFileSync(path.resolve(pathName, 'config.json')))
        // 判断是否有exclude属性
        const excludeList = json.exclude || [];
        const child = json.children || [];
        const excludeDirList = json.excludeDir || [];
        if (child && child.length > 0) {
            // 有配置子路由项
            childList = ObjArrDuplicate(child).map((element) => {
                if (!element.parent) {
                    throw new Error('parent属性不能为空 ' + path.resolve(pathName, 'config.json'))
                }
                const parent = suffixVue([], element.parent)
                const list = ArrayDuplicate(suffixVue(element.list));
                ArrayDuplicate(list)
                // 判断文件是否存在
                checkFileExis(list, pathName, 'list属性');
                checkFileExis([parent], pathName, 'parent属性');
                return {
                    parent,
                    list
                }
            });
        }
        // 排除的vue文件
        if (excludeList && excludeList.length > 0) {
            exclude = ArrayDuplicate(suffixVue(excludeList));
            checkFileExis(exclude, pathName, 'exclude属性');
        }
        // 判断排除目录
        if (excludeDirList && excludeDirList.length > 0) {
            excludeDir = ArrayDuplicate(excludeDirList);
            excludeDir.forEach((dir) => {
                if (!dirDetails.includes(dir)) {
                    throw new Error('没有找到目录 ' + path.resolve(pathName, dir) + '，请正确配置exclude属性值')
                }
            })
        }
 
    }
    if (exclude && exclude.length != 0) {
        // 打印
        exclude.forEach((item) => {
            console.log('排除生成的路由文件>>>>>>>>>>>>>>>>>>\n', [path.resolve(pathName, item)], '\n')
        })
    }
    // 遍历文件生成对应的路由规则
    dirDetails.forEach((item) => {
        let is = fs.statSync(path.resolve(pathName, item))
        if (is.isFile()) {
            if (exclude && exclude.includes(item)) {
                // 有排除文件就停止生成路由规则
                return
            }
            const fileInfo = path.parse(item);
            let fileName = fileInfo.name;
            let suffix = fileInfo.ext;
            if (suffix == '.vue') {
                const routeName = dirName.split('/').join('-');
                let parentName; //fuluyou
                // 配置子路由
                if (childList && childList.length > 0) {
                    childList.forEach((child) => {
                        if (child.parent == item) {
                            parentName = item;
                            const { list } = child
                            const result = list.map(ele => {
                                // let name = ele.split('.')[0];
                                let name = ele.substring(0, ele.lastIndexOf('.'));
                                let hasindex = null;
                                if (name.includes('./')) {
                                    // 判断是否为路径，只能当前目录下的文件，不能在上一级
                                    name = name.substring(2);
                                }
                                if (name[0] == '/') {
                                    throw new Error("请正确设置相对路径 './'或者 ''," + name)
                                }
                                const nameInfo = path.parse(name);
                                if (nameInfo.name == 'index') {
                                    // hasindex = name.substring(0, name.length - 6)
                                    hasindex = nameInfo.dir;
                                }
                                return `
                                {
                                    name:'${routeName ? routeName + '-' : ''}${name.split('/').join('-')}',
                                    path:'${dirName ? '/' + dirName : ''}/${name}',
                                    component:() => import('@/views${dirName ? '/' + dirName : ''}/${hasindex ? hasindex : name + ".vue"}')
                                }`
                            })
                            routes.push(`
                            {
                                name:'${routeName ? routeName + '-' : ''}${fileName}',
                                path:'${dirName ? '/' + dirName : ''}/${fileName}',
                                component:() => import('@/views${dirName ? '/' + dirName : ''}${fileName != 'index' ? '/' + fileName + '.vue' : ''}'),
                                children:[${result.join(',')}]
                            }`)
                        }
                    })
                    // return
                }
                if (item == parentName) return;
                routes.push(`
                {
                    name:'${routeName ? routeName + '-' : ''}${fileName}',
                    path:'${dirName ? '/' + dirName : ''}/${fileName}',
                    component:() => import('@/views${dirName ? '/' + dirName : ''}${fileName != 'index' ? '/' + fileName + '.vue' : ''}')
                }`)
            }
        } else {
            // 递归遍历
            if (excludeDir && excludeDir.includes(item)) {
                // 有排除目录就停止生成路由规则
                console.log('排除目录>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n', [path.resolve(pathName, item)], '\n')
                return
            }
            // let childDir = readFileInfo(path.resolve(pathName, item), `${dirName ? dirName + '/' : ''}` + item)
            let childDir = readFileInfo(path.resolve(pathName, item), `${dirName ? dirName + '/' : ''}` + item)
            routes = [].concat(routes, childDir);
        }
    })
    return routes
}
// 加后缀
function suffixVue(list, string) {
    if (string) {
        let result = (string || '').split('.');
        // 安全判断
        if (result[result.length - 1] != 'vue') {
            // 无文件名后缀 + .vue
            return string + '.vue'
        } else {
            // 有文件名后缀
            return string
        }
    }
    return (list || []).map((item) => {
        let result = item.split('.');
        // 安全判断
        if (result[result.length - 1] != 'vue') {
            // 无文件名后缀 + .vue
            return item + '.vue'
        } else {
            // 有文件名后缀
            return item
        }
    })
}
// 检查文件是否存在
function checkFileExis(list, pathName, string) {
    list.forEach((item) => {
        const is = fs.existsSync(path.resolve(pathName, item))
        if (!is) {
            throw new Error("文件不存在" + path.resolve(pathName, item) + "，请正确配置" + string + "值")
        }
    })
}
// 数组去重
function ArrayDuplicate(array) {
    let arr = [...new Set(array)]
    return arr;
}
// 对象数组去重
function ObjArrDuplicate(array) {
    let list = ArrayDuplicate(array.map(item => JSON.stringify(item))).map(item => JSON.parse(item));
    // 判断属性是否唯一
    checkAttr(list)
    return list
}
// 判断属性是否唯一
function checkAttr(list) {
    let length = list.length;
    // parent属性
    for (let i = 0; i < length - 1; i++) {
        for (let k = i + 1; k < length; k++) {
            if (list[i].parent == list[k].parent) {
                throw new Error('children中parent属性不能相同,' + list[i].parent)
            }
            // list值 
            list[k].list.forEach(item => {
                if (list[i].list.includes(item)) {
                    throw new Error('children中list列表值不能相同,' + item)
                }
            })
        }
    }
    // list
}
// 转化为字符串
function toStringFormat(value) {
    return `export let Routes = [${value.join(",")}];`
}
// 生成文件
fs.writeFile('./src/router/config.js', toStringFormat(readFileInfo(root, '')), (err) => {
	if (err) return
	console.log('配置成功 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n')
})