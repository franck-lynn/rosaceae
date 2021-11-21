const baseTypes = [
    'Number', 'number', 'Int', 'int', 'Float', 'float',
    'Symbol', 'symbol', 'String', 'string', 'Boolean',
    'boolean', 'undefined', 'Undefined', 'null', 'Null',
    'ID', 'Id', 'id', '_ID', '_Id', '_id'
]
// 判断是不是基本数据类型
const isBaseType = (x) => baseTypes.includes(x)

// TODO: take 功能未实现
// TODO: 实现蹦床函数
// TODO: 图算法优化的实现
/**
 * 
 * @param {* } definitions typeDefs 对象下的 definitions 数组
 * @param {* } returnType 返回值的类型, 在 definitions 数组里有许多的返回值类型, 程序会根据需要自动搜索, 一般不需要手动给出
 * @param {*} take 未实现
 * @param {*} str 返回的字符串
 * @param {*} prev 上层递归值转到下层递归变量
 * @param {*} deep 递归层级记录
 */
const returnFields = (definitions, returnType, take, str = '', prev, deep = 0) => {
    //! 1-1. 传入 Chat 类型
    // definitions 是typeDefs.definitions 的整个数组, returnType 是指定的返回值类型
    if (isBaseType(returnType) && deep === 0) {
        // 如果是基本的数据类型, 就直接返回所需要的格式
        str = '{' + returnType + '}'
    } else { // 如果不是基本的数据类型, 就进入这个分支
        //不是基本数据类型, 就在 definitions 整个数组中查找这个自定义的对象(复杂,非基本)类型
        //! 1-2. 找到 Chat 类型所在的元素
        const theType = definitions.find(element => {
            if (element.name && element.name.value && !isBaseType(returnType)) {
                return element.name.value === returnType
            }
        })
        // 找到了这个类型, 并且这个自定义的对象类型下面有字段数组才处理.
        // 如果没有这个自定义的对象类型或者下面没有字段数组, 说明 graphql schema 定义不完全, 交给 graphql 去处理 
        if (theType && theType.fields) {
            // 下面分析函数返回值的字段类型, 直到每个都是基本类型
            for (let i = 0; i < theType.fields.length; i++) {
                // 循环体展开返回值自定义类型下面的所有字段, take 数组保持与 theType.fields 相同的结构
                let value = ' ' + theType.fields[i].name.value + ' ' // 保存这个字段的名称, 前后都加空格
                // console.log("字段名--> ", value)
                // theType.fields[i].type.value 是基本数据类型, 则这个属性有, 非基本数组类型是theType.fields[i].type.type.name.value
                if (theType.fields[i].type.name && isBaseType(theType.fields[i].type.name.value)) {
                    // 如果是基本数据类型
                    if (i === 0) { // 第1条数据
                        // 如果只有一条数据, 就用 右括号封闭.
                        value = i === theType.fields.length - 1 ? '{ ' + value + ' }' : '{ ' + value
                    } else if (i === theType.fields.length - 1) {
                        value = value + '}' // .repeat(deep + 1)
                    }
                    str = str + value
                    // value = null 
                } else {
                    prev = value
                    if (i === 0) {
                        str = str + '{' + prev + returnFields(definitions, theType.fields[i].type.type.name.value, take, str = '', prev, deep + 1)
                    } else if (i === theType.fields.length - 1) {
                        str = str + prev + returnFields(definitions, theType.fields[i].type.type.name.value, take, str = '', prev, deep + 1) + '}'
                    } else {
                        str = str + prev + returnFields(definitions, theType.fields[i].type.type.name.value, take, str = '', prev, deep + 1)
                    }
                }
            }
        }
    }
    return str
}


// 当前端调用如下接口时:
// http://localhost:3000/chat/2
// 设计一个函数, 参数是 typeDefs 里的 query 元素下的字段(函数)
const getArgs = field => {
    // console.log("函数所在的字段", field)
    const args = field ? field.arguments : null
    // console.log("函数参数", args)
    let fnArgs = '' // 函数的参数
    let fnArgsArr = [] // 函数参数的数组表示
    let variArgs = '' // 变量参数
    let pathArgs = '' // 路径参数
    if (args && args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            // 如果有函数参数, 则进行转化字符串工作
            if (args[i] && args[i].name && args[i].name.value) {
                fnArgs = fnArgs + args[i].name.value + ': ' + '$' + args[i].name.value + ' ' // 形如 chat(id: $id), 函数的参数
                // 有几个函数参数 fnArgs, 变量参数就有几个
                if (args[i].type && args[i].type.name && args[i].type.name.value) {
                    variArgs = variArgs + '$' + args[i].name.value + ': ' + args[i].type.name.value + ' ' // 形如 query($id: ID), 变量参数
                }
                // 还有一种情况, 如果参数有多个, 类型的判断是在 args[i].type.type.name.value
                if (args[i].type && args[i].type.type && args[i].type.type.name && args[i].type.type.name.value) {
                    variArgs = variArgs + '$' + args[i].name.value + ': ' + args[i].type.type.name.value + ' ' // 形如 query($id: ID), 变量参数
                }
                pathArgs = pathArgs + '/:' + args[i].name.value //  形如 path = '/chat/:id', 路径参数
                fnArgsArr.push(args[i].name.value) // 为变量参数赋值准备的参数数组
            }
        }
    }
    // console.log("函数参数字符串---> ", fnArgs)
    // console.log("给函数参数赋值的变量字符串---> ", variArgs)
    // console.log("路径字符串---> ", pathArgs)
    //  console.log("函数参数数组, 给 ctx 上下文用---> ", fnArgsArr)
    return { fnArgs, variArgs, pathArgs, fnArgsArr }
}

const fieldString = (field, definitions) => {
    const args = getArgs(field)
    let variArgs = args.variArgs
    // console.log(variArgs)
    let fnArgs = args.fnArgs
    let pathArgs = args.pathArgs
    let fnArgsArr = args.fnArgsArr
    // 函数的名称
    let fn
    if (field && field.name && field.name.value) {
        fn = field.name.value
        // TODO: 驼峰转连字符
    } else {
        throw new Error('您没有定义需要的函数')
    }
    let returnType
    if (field && field.type && field.type) {
        if (field.type.name && field.type.name.value) {
            returnType = field.type.name.value
        } else if (field.type.type.name && field.type.type.name.value) {

            returnType = field.type.type.name.value
            // console.log("返回值类型----> ", returnType)
        }
    } else {
        throw new Error('您没有定义返回值的类型')
    }
    let returnValue = returnFields(definitions, returnType)
    // 返回的值进行判断, 去掉前后 {}, 分割为数组, 如果数组长度 ===1, 且是基本数据类型, 就舍弃掉
    // console.log("返回的值: ", returnValue.match(/\w+/g))
    let returnValueArr = returnValue.match(/\w+/g)
    returnValue = returnValueArr.length === 1 && baseTypes.includes(returnValueArr[0]) ? '' : returnValue
    let fnBody
    if (variArgs && fnArgs) {
        fnBody = '(' + variArgs + ') {' + fn + '(' + fnArgs + ')' + returnValue + '}'
    } else {
        fnBody = '{' + fn + returnValue + '}'
    }
    const path = '/' + fn + pathArgs

    const getVariable = (ctx) => {
        let target = {}
        if (fnArgsArr && Array.isArray(fnArgsArr) && fnArgsArr.length > 0) {
            // 判断 ctx 是get请求还是post请求, 如何函数都没有参数, 没必要判断是 get post 请求
            const method = ctx.method
            let params
            if (method.toLowerCase() === 'get') {
                params = ctx.params
            } else {
                params = ctx.request.body
            }
            // 请求对象的 key 与 函数参数数组 fnArgsArr 数组对象要相等, 
            // 即请求的参数要与函数要求的参数一样.
            const isEquals = (arr1, arr2) => [...new Set(arr1)].length === [...new Set([...arr1, ...arr2])].length
            if (isEquals(Reflect.ownKeys(params), fnArgsArr)) {
                for (const item of fnArgsArr) {
                    Reflect.set(target, item, params[item])
                }
            }else{
                throw new Error('获取参数失败, 可能是没有定义或者与函数的变量参数要求的不一致')
            }
            return target
        } else {
            return null
        }
    }
    return { path, fnBody, getVariable }
}

// export { fieldString }
export { returnFields, getArgs, fieldString }