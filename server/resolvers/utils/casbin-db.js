import path from 'path'
import { newEnforcer } from 'casbin';
// https://github.com/node-casbin/typeorm-adapter
import TypeORMAdapter from 'typeorm-adapter'


// dbCasbin 代表从数据库中获取的模型和策略进行的判断
// casbin 数据库连接
const dbCasbin = (async () => {
    // 这里可以设置不同的数据库连接和密码
    const adapter = await TypeORMAdapter.newAdapter({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'test', // 是指数据库名称
        replicaSet: 'my_repl'
    })
    const model = path.resolve(__dirname, '../../casbin/conf/rbac_model.conf')
    
    return await newEnforcer(model, adapter)
})()

export default dbCasbin