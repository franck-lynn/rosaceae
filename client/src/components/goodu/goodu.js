import { isRef } from "vue";
const max = 15 // 最多存储的历史记录条数
// 从 localStorge 中获取数据 
const getList = (list) => {
    if (!isRef(list)) {
        throw new Error("需要响应式的数据")
    }
    const search_list = localStorage.getItem('search_list') || ''
    list.value = search_list ? JSON.parse(search_list) : []
}
// list 是响应式的数组
const setList = (list, value) => {
    if (!value) {
        return
    }
    if (!isRef(list)) {
        throw new Error("需要响应式的数据")
    }
    if (!Array.isArray(list.value) || list.value.length < 0) {
        throw new Error("需要响应式的数据是一个数组")
    }
    if (list.value.length > max) {
        // 先尾部弹出一个再加入
        list.value.pop()
        list.value.unshift(value)
    } else {
        // 在数组的头部加入
        list.value.unshift(value)
    }
    // list 去重复再转成字符串再保存, Set 总是认为2个对象不相等, 所以采用字符串基本类型, 
    // 这样可以判断是不是相等
    localStorage.setItem('search_list', JSON.stringify(Array.from(new Set(list.value))))
}
const saveList = (list) => {
    if (!isRef(list)) {
        throw new Error("需要响应式的数据")
    }
    localStorage.setItem('search_list', JSON.stringify(Array.from(new Set(list.value))))
}
export { getList, setList, saveList }