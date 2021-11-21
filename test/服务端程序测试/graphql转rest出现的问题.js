// graphql转rest api 出现 Error: "Upload" defined in resolvers, but not in schema
// 下面找原因

// import util from 'util' // node 打印完整 object
// 导入  gql 模式文件
import { typeDefs } from '../../server/graphql'
// console.log(util.inspect(typeDefs.definitions, { showHidden: false, depth: null }))

const definitions = typeDefs.definitions
// 在 definitions 下 Query 元素
const query = definitions.find(definition => definition.name.value === 'Query')
// console.log('query 元素---> ', query)
const queryFields = query.fields
// console.log('queryFields query下的函数字段', queryFields)
console.log('query 查询的字段有:')
queryFields.forEach((queryField, idx) => {
    console.log(`${idx + 1}, 函数名: ${queryField.name.value}`)
    console.log(`  该函数的参数是:`)
    queryField.arguments.forEach(arg => {
        console.log(`   ${arg.name.value}`)
    })
    const queryFieldReturnType = queryField.type && queryField.type.kind && queryField.type.kind === 'ListType' ? queryField.type.type.name.value : queryField.type.name.value
    console.log(`  该函数的返回值是: ${queryFieldReturnType}`)
    
})
// 获取 definitions 下的 mutation 元素
const mutation = definitions.find(definition => definition.name.value === 'Mutation')
// mutation 下的函数字段
const mutationFields = mutation.fields
console.log('------------------------------------------------------')
console.log('mutation 突变的字段有: ')
mutationFields.forEach((mutationField, idx) => {
    console.log(`${idx + 1}, 函数名: ${mutationField.name.value}`)
    console.log(`  该函数的参数是:`)
    mutationField.arguments.forEach(arg => {
        console.log(`   ${arg.name.value}`)
    })
    const mutationFieldReturnType = mutationField.type && mutationField.type.kind && mutationField.type.kind === 'ListType' ? mutationField.type.type.name.value : mutationField.type.name.value
    console.log(`  该函数的返回值是: ${mutationFieldReturnType}`)
})
/*
query 查询的字段有:
    1, 函数名: queryResources
该函数的参数是:
    该函数的返回值是: Resource
2, 函数名: queryRoles
该函数的参数是:
    该函数的返回值是: Role
3, 函数名: queryUsers
该函数的参数是:
    该函数的返回值是: User
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
mutation 突变的字段有:
    1, 函数名: addPolicy
该函数的参数是:
    roleName
resourceName
act
该函数的返回值是: IsMutationSuccess
2, 函数名: insertResources
该函数的参数是:
    该函数的返回值是: Resource
3, 函数名: removeAllResource
该函数的参数是:
    该函数的返回值是: String
4, 函数名: addRole
该函数的参数是:
    name
该函数的返回值是: IsMutationSuccess
5, 函数名: addUserRole
该函数的参数是:
    username
rolename
该函数的返回值是: IsMutationSuccess
*/


/*
    {
        kind: 'Document',
        definitions: [
            {
                kind: 'DirectiveDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'isRole', loc: { start: 21, end: 27 } },
                arguments: [],
                repeatable: false,
                locations: [{
                    kind: 'Name',
                    value: 'FIELD_DEFINITION',
                    loc: { start: 31, end: 47 }
                }],
                loc: { start: 10, end: 47 }
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'Policy', loc: { start: 116, end: 122 } },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: '_id', loc: { start: 130, end: 133 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 135, end: 137 }
                                },
                                loc: { start: 135, end: 137 }
                            },
                            loc: { start: 135, end: 138 }
                        },
                        directives: [],
                        loc: { start: 130, end: 138 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'role_id',
                            loc: { start: 144, end: 151 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 153, end: 155 }
                                },
                                loc: { start: 153, end: 155 }
                            },
                            loc: { start: 153, end: 156 }
                        },
                        directives: [],
                        loc: { start: 144, end: 156 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'resource_id',
                            loc: { start: 162, end: 173 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 175, end: 177 }
                                },
                                loc: { start: 175, end: 177 }
                            },
                            loc: { start: 175, end: 178 }
                        },
                        directives: [],
                        loc: { start: 162, end: 178 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'act', loc: { start: 184, end: 187 } },
                        arguments: [],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'String',
                                loc: { start: 189, end: 195 }
                            },
                            loc: { start: 189, end: 195 }
                        },
                        directives: [],
                        loc: { start: 184, end: 195 }
                    }
                ],
                loc: { start: 111, end: 198 }
            },
            {
                name: { kind: 'Name', value: 'Mutation', loc: { start: 86, end: 94 } },
                description: undefined,
                kind: 'ObjectTypeDefinition',
                loc: { start: 81, end: 171 },
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'addPolicy',
                            loc: { start: 221, end: 230 }
                        },
                        arguments: [{
                                kind: 'InputValueDefinition',
                                description: undefined,
                                name: {
                                    kind: 'Name',
                                    value: 'roleName',
                                    loc: { start: 231, end: 239 }
                                },
                                type: {
                                    kind: 'NonNullType',
                                    type: {
                                        kind: 'NamedType',
                                        name: {
                                            kind: 'Name',
                                            value: 'String',
                                            loc: { start: 241, end: 247 }
                                        },
                                        loc: { start: 241, end: 247 }
                                    },
                                    loc: { start: 241, end: 248 }
                                },
                                defaultValue: undefined,
                                directives: [],
                                loc: { start: 231, end: 248 }
                            },
                            {
                                kind: 'InputValueDefinition',
                                description: undefined,
                                name: {
                                    kind: 'Name',
                                    value: 'resourceName',
                                    loc: { start: 250, end: 262 }
                                },
                                type: {
                                    kind: 'NonNullType',
                                    type: {
                                        kind: 'NamedType',
                                        name: {
                                            kind: 'Name',
                                            value: 'String',
                                            loc: { start: 264, end: 270 }
                                        },
                                        loc: { start: 264, end: 270 }
                                    },
                                    loc: { start: 264, end: 271 }
                                },
                                defaultValue: undefined,
                                directives: [],
                                loc: { start: 250, end: 271 }
                            },
                            {
                                kind: 'InputValueDefinition',
                                description: undefined,
                                name: {
                                    kind: 'Name',
                                    value: 'act',
                                    loc: { start: 273, end: 276 }
                                },
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'String',
                                        loc: { start: 278, end: 284 }
                                    },
                                    loc: { start: 278, end: 284 }
                                },
                                defaultValue: undefined,
                                directives: [],
                                loc: { start: 273, end: 284 }
                            }
                        ],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'IsMutationSuccess',
                                loc: { start: 287, end: 304 }
                            },
                            loc: { start: 287, end: 304 }
                        },
                        directives: [],
                        loc: { start: 221, end: 304 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'insertResources',
                            loc: { start: 159, end: 174 }
                        },
                        arguments: [],
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'Resource',
                                    loc: { start: 177, end: 185 }
                                },
                                loc: { start: 177, end: 185 }
                            },
                            loc: { start: 176, end: 186 }
                        },
                        directives: [],
                        loc: { start: 159, end: 186 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'removeAllResource',
                            loc: { start: 192, end: 209 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'String',
                                loc: { start: 211, end: 217 }
                            },
                            loc: { start: 211, end: 217 }
                        },
                        directives: [],
                        loc: { start: 192, end: 217 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'addRole',
                            loc: { start: 117, end: 124 }
                        },
                        arguments: [{
                            kind: 'InputValueDefinition',
                            description: undefined,
                            name: {
                                kind: 'Name',
                                value: 'name',
                                loc: { start: 125, end: 129 }
                            },
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'String',
                                        loc: { start: 131, end: 137 }
                                    },
                                    loc: { start: 131, end: 137 }
                                },
                                loc: { start: 131, end: 138 }
                            },
                            defaultValue: undefined,
                            directives: [],
                            loc: { start: 125, end: 138 }
                        }],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'IsMutationSuccess',
                                loc: { start: 141, end: 158 }
                            },
                            loc: { start: 141, end: 158 }
                        },
                        directives: [],
                        loc: { start: 117, end: 158 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'addUserRole',
                            loc: { start: 102, end: 113 }
                        },
                        arguments: [{
                                kind: 'InputValueDefinition',
                                description: undefined,
                                name: {
                                    kind: 'Name',
                                    value: 'username',
                                    loc: { start: 114, end: 122 }
                                },
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'String',
                                        loc: { start: 124, end: 130 }
                                    },
                                    loc: { start: 124, end: 130 }
                                },
                                defaultValue: undefined,
                                directives: [],
                                loc: { start: 114, end: 130 }
                            },
                            {
                                kind: 'InputValueDefinition',
                                description: undefined,
                                name: {
                                    kind: 'Name',
                                    value: 'rolename',
                                    loc: { start: 132, end: 140 }
                                },
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'String',
                                        loc: { start: 142, end: 148 }
                                    },
                                    loc: { start: 142, end: 148 }
                                },
                                defaultValue: undefined,
                                directives: [],
                                loc: { start: 132, end: 148 }
                            }
                        ],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'IsMutationSuccess',
                                loc: { start: 151, end: 168 }
                            },
                            loc: { start: 151, end: 168 }
                        },
                        directives: [],
                        loc: { start: 102, end: 168 }
                    }
                ],
                directives: [],
                interfaces: []
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'Resource', loc: { start: 42, end: 50 } },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: '_id', loc: { start: 58, end: 61 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 63, end: 65 }
                                },
                                loc: { start: 63, end: 65 }
                            },
                            loc: { start: 63, end: 66 }
                        },
                        directives: [],
                        loc: { start: 58, end: 66 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'name', loc: { start: 72, end: 76 } },
                        arguments: [],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'String',
                                loc: { start: 78, end: 84 }
                            },
                            loc: { start: 78, end: 84 }
                        },
                        directives: [],
                        loc: { start: 72, end: 84 }
                    }
                ],
                loc: { start: 37, end: 87 }
            },
            {
                name: { kind: 'Name', value: 'Query', loc: { start: 108, end: 113 } },
                description: undefined,
                kind: 'ObjectTypeDefinition',
                loc: { start: 103, end: 142 },
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'queryResources',
                            loc: { start: 107, end: 121 }
                        },
                        arguments: [],
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'Resource',
                                    loc: { start: 124, end: 132 }
                                },
                                loc: { start: 124, end: 132 }
                            },
                            loc: { start: 123, end: 133 }
                        },
                        directives: [],
                        loc: { start: 107, end: 133 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'queryRoles',
                            loc: { start: 71, end: 81 }
                        },
                        arguments: [],
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'Role',
                                    loc: { start: 84, end: 88 }
                                },
                                loc: { start: 84, end: 88 }
                            },
                            loc: { start: 83, end: 89 }
                        },
                        directives: [],
                        loc: { start: 71, end: 89 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'queryUsers',
                            loc: { start: 121, end: 131 }
                        },
                        arguments: [],
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'User',
                                    loc: { start: 134, end: 138 }
                                },
                                loc: { start: 134, end: 138 }
                            },
                            loc: { start: 133, end: 139 }
                        },
                        directives: [],
                        loc: { start: 121, end: 139 }
                    }
                ],
                directives: [],
                interfaces: []
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'Role', loc: { start: 7, end: 11 } },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: '_id', loc: { start: 19, end: 22 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 24, end: 26 }
                                },
                                loc: { start: 24, end: 26 }
                            },
                            loc: { start: 24, end: 27 }
                        },
                        directives: [],
                        loc: { start: 19, end: 27 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'name', loc: { start: 33, end: 37 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'String',
                                    loc: { start: 39, end: 45 }
                                },
                                loc: { start: 39, end: 45 }
                            },
                            loc: { start: 39, end: 46 }
                        },
                        directives: [],
                        loc: { start: 33, end: 46 }
                    }
                ],
                loc: { start: 2, end: 49 }
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: {
                    kind: 'Name',
                    value: 'IsMutationSuccess',
                    loc: { start: 27, end: 44 }
                },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'isMutationSuccess',
                            loc: { start: 52, end: 69 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'Boolean',
                                loc: { start: 71, end: 78 }
                            },
                            loc: { start: 71, end: 78 }
                        },
                        directives: [],
                        loc: { start: 52, end: 78 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'msg', loc: { start: 85, end: 88 } },
                        arguments: [],
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'String',
                                loc: { start: 90, end: 96 }
                            },
                            loc: { start: 90, end: 96 }
                        },
                        directives: [],
                        loc: { start: 85, end: 96 }
                    }
                ],
                loc: { start: 22, end: 99 }
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'UserRole', loc: { start: 14, end: 22 } },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: '_id', loc: { start: 30, end: 33 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 35, end: 37 }
                                },
                                loc: { start: 35, end: 37 }
                            },
                            loc: { start: 35, end: 38 }
                        },
                        directives: [],
                        loc: { start: 30, end: 38 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'user_id',
                            loc: { start: 44, end: 51 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 53, end: 55 }
                                },
                                loc: { start: 53, end: 55 }
                            },
                            loc: { start: 53, end: 56 }
                        },
                        directives: [],
                        loc: { start: 44, end: 56 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'role_id',
                            loc: { start: 62, end: 69 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 71, end: 73 }
                                },
                                loc: { start: 71, end: 73 }
                            },
                            loc: { start: 71, end: 74 }
                        },
                        directives: [],
                        loc: { start: 62, end: 74 }
                    }
                ],
                loc: { start: 9, end: 77 }
            },
            {
                kind: 'ObjectTypeDefinition',
                description: undefined,
                name: { kind: 'Name', value: 'User', loc: { start: 5, end: 9 } },
                interfaces: [],
                directives: [],
                fields: [{
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: '_id', loc: { start: 17, end: 20 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'ID',
                                    loc: { start: 22, end: 24 }
                                },
                                loc: { start: 22, end: 24 }
                            },
                            loc: { start: 22, end: 25 }
                        },
                        directives: [],
                        loc: { start: 17, end: 25 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'name', loc: { start: 31, end: 35 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'String',
                                    loc: { start: 37, end: 43 }
                                },
                                loc: { start: 37, end: 43 }
                            },
                            loc: { start: 37, end: 44 }
                        },
                        directives: [],
                        loc: { start: 31, end: 44 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: { kind: 'Name', value: 'email', loc: { start: 51, end: 56 } },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'String',
                                    loc: { start: 58, end: 64 }
                                },
                                loc: { start: 58, end: 64 }
                            },
                            loc: { start: 58, end: 65 }
                        },
                        directives: [{
                            kind: 'Directive',
                            name: {
                                kind: 'Name',
                                value: 'isRole',
                                loc: { start: 67, end: 73 }
                            },
                            arguments: [],
                            loc: { start: 66, end: 73 }
                        }],
                        loc: { start: 51, end: 73 }
                    },
                    {
                        kind: 'FieldDefinition',
                        description: undefined,
                        name: {
                            kind: 'Name',
                            value: 'password',
                            loc: { start: 79, end: 87 }
                        },
                        arguments: [],
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: {
                                    kind: 'Name',
                                    value: 'String',
                                    loc: { start: 89, end: 95 }
                                },
                                loc: { start: 89, end: 95 }
                            },
                            loc: { start: 89, end: 96 }
                        },
                        directives: [],
                        loc: { start: 79, end: 96 }
                    }
                ],
                loc: { start: 0, end: 99 }
            },
            {
                kind: 'SchemaDefinition',
                description: undefined,
                directives: [],
                operationTypes: [{
                        kind: 'OperationTypeDefinition',
                        operation: 'query',
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'Query',
                                loc: { start: 16, end: 21 }
                            },
                            loc: { start: 16, end: 21 }
                        },
                        loc: { start: 9, end: 21 }
                    },
                    {
                        kind: 'OperationTypeDefinition',
                        operation: 'mutation',
                        type: {
                            kind: 'NamedType',
                            name: {
                                kind: 'Name',
                                value: 'Mutation',
                                loc: { start: 32, end: 40 }
                            },
                            loc: { start: 32, end: 40 }
                        },
                        loc: { start: 22, end: 40 }
                    }
                ],
                loc: { start: 0, end: 42 }
            }
        ]
    }
*/