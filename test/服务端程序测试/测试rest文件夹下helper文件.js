// import util from 'util' // node 打印完整 object
// 导入  gql 模式文件
import { typeDefs } from '../../server/graphql'
import { returnFields, getArgs, fieldString } from '../../server/rest/helper'
import { expect } from 'chai'
import { equals } from 'ramda'
const definitions = typeDefs.definitions
/* 
    //! 测试 definitions 下 函数字段 fields 下各函数返回值
    describe(' 测试 测试rest文件夹下helper文件 文件 ', function() {
        describe('测试 returnFields 函数 返回的值直到是基本类型', function() {
            it(' Resource 返回值应该 { _id  name } ', function() {
                expect(
                    equals(
                        returnFields(definitions, 'Resource'), 
                        '{ _id  name }'
                    )
                ).to.be.true
            })
            it(' Role 返回值应该 { _id  name } ', function() {
                expect(
                    equals(
                        returnFields(definitions, 'Role'), 
                        '{ _id  name }'
                    )
                ).to.be.true
            })
            it(' User 返回值应该 { _id  name  email  password }', function() {
                expect(
                    equals(
                        returnFields(definitions, 'User'), 
                        '{ _id  name  email  password }'
                    )
                ).to.be.true
            })
            it(' IsMutationSuccess 返回值应该 {  isMutationSuccess  msg }', function() {
                expect(
                    equals(
                        returnFields(definitions, 'IsMutationSuccess'),
                        '{  isMutationSuccess  msg }'
                    )
                ).to.be.true
            })
        })
    })
*/
/*
    console.log(
        '测试函数的返回值: ',
        returnFields(definitions, 'IsMutationSuccess')
    )
 */

/*
    // 测试 getArgs 函数, getArgs() 函数参数 field 是 查询 query 或 突变 mutation 
    // 元素下 函数字段里的 参数数组字段
    // 准备 getArgs() 函数参数 field
    const queryField = definitions.find(definition => definition.name.value === 'Query')
    const queryFns = queryField.fields

    for (let i = 0; i < queryFns.length; i++) {
        console.log(
            // 是 queryField 下的字段, 也就是每个函数下的参数字段
            getArgs(queryField.fields[i])
        )
    }

    const mutationField = definitions.find(definition => definition.name.value === 'Mutation')
    // mutation 下 fields 是函数字段, 第几个函数下 才有参数
    const mutationFns = mutationField.fields
    for (let i = 0; i < mutationFns.length; i++) {
        console.log(
            getArgs(mutationField.fields[i])
        )
    } 
*/

// fieldString() 函数测试, 这个函数返回的是 构造一个函数的字符串形式
// definitions 下 只找 Query 和 Mutation 元素, 只有包含这 2 个的元素才是增删改查
const operators = ['Query', 'Mutation']
let operator, fields
for (let i = 0; i < definitions.length; i++) {
    // 只对 操作符是 Query 和 Mutation 两种情况进行处理, 包含这两种操作符的图形形状提取出来
    if (definitions[i].name && operators.includes(definitions[i].name.value)) {
        // 操作符的首字母要小写的
        operator = definitions[i].name.value.toLowerCase()
        // console.log("2个操作符: ", operator)
        // Query 或者 Mutation 下字段是操作函数定义 fields
        fields = definitions[i].fields
        // console.log("操作下的函数字段: ", fields)
        fields.forEach((field, idx) => {
            // console.log("操作下的函数字段: ", field)
            const { path, fnBody, getVariable } = fieldString(field, definitions)
            // console.log(` ${idx + 1}. rest 请求路径形式: ${path}`)
            console.log(` ${idx + 1}. ${operator} 函数体字符串: ${fnBody}}`)
        })
    }
}

