
```
<template>
    <ul :class="['sidebar-list', isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'pulldown-active': isCurrentTarget(currentTarget, item), 
          'pulldown-show': toggleShow(currentTarget, item)}]" @click="handleCurrentTarget">
          
            <component :is="item.children || !item.href? 'span': 'router-link' " :class="item.children ?
              'nav-list-title': 'nav-list-link'" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"> </span>
                <span :class="`nav-list-level-title-${deep}`">{{item.title}}</span>
            </component>
            
            <sidebar-dock v-if=item.children :items="item.children" :deep=deep+1></sidebar-dock>
        </li>
    </ul>
</template>
```




1. sidebar-items 是一个递归组件, 调用了自身
2. 数据结构
```
🚩 一级1  href
🚩 一级2 >
   二级A
   二级B >
      三级 B-1  href
      三级 B-2 href
---------- 分割线---------- 
一级3 
   二级C
   二级D
一级4 href

// 数据示例如下: 
const data = [ 
    [
        { icon: '🚩', title: '一级1', href: 'javascript(void: 0)' },
        { icon: '🚩', title: '一级2', children: [
            { title: '二级A' }, 
            { title: '二级B', children: [
                { title: '三级B-1', href: '/#' }, 
                { title: '三级B-2', href: '/#' }] }
            ]},
    ],
    [{ con: '🚩', title: '一级3', children: [{ title: '二级C' }, { title: '二级D' }] }]
]
```


### sidebar-dock.vue
     一级菜单鼠标点击--> 激活菜单--> 显示菜单--> 二级级以下菜单悬停显示
```
<template>
    <ul :class="['sidebar-list', isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'pulldown-active': isCurrentTarget(currentTarget, item), 
          'pulldown-show': toggleShow(currentTarget, item)}]" @click="handleCurrentTarget">
          
            <component :is="item.children || !item.href? 'span': 'router-link' " :class="item.children ?
              'nav-list-title': 'nav-list-link'" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"> </span>
                <span :class="`nav-list-level-title-${deep}`">{{item.title}}</span>
            </component>
            
            <sidebar-dock v-if=item.children :items="item.children" :deep=deep+1></sidebar-dock>
        </li>
    </ul>
</template>

<script>
    import { defineComponent, ref, watchEffect, computed, onMounted, onUnmounted } from 'vue'
    import { findParentNode } from '../helpers'
    export default defineComponent({
        name: 'sidebar-dock',
        props: {
            deep: { type: Number, default: 1 },
            items: { type: Array, default: () => [] },
            isNarrow: { type: Boolean, default: false }
        },
        setup(props) {
            const defaultIcon = 'icon-all-fill'
            const offset = 10
            const isDeepOne = computed(() => props.deep && props.deep === 1)
            const currentTarget = ref()
            const isShow = ref(false)
            //* 判断元素是否包含给定的类名
            const hasClassName = (element, className) => element.className.indexOf(className) !== -1
            //* 判断父元素 是否包含子元素.
            const hasChildName = (parent, childName) => {
                return parent.some((element) => hasClassName(element, childName))
            }
            //* 判断是不是当前点击的元素
            const isCurrentTarget = (currentTarget, item) => {
                return currentTarget ? currentTarget === item.title : false
            }
            //* 切换下拉菜单状态
            const toggleShow = (currentTarget, item) => {
                // 如果是激活菜单, 就获取 isShow 值, 否则为 ''
                return isCurrentTarget(currentTarget, item) ? isShow.value : ''
            }
            const handleCurrentTarget = (e) => {
                // e.stopPropagation() // 阻止事件传播
                // e.preventDefault()
                const currentNode = e.currentTarget.querySelector(`span[class^="nav-list-level-title-${props.deep}"]`)
                currentTarget.value = currentNode.innerHTML
                // 要判断 下面 有 sub-list 的时候才添加 show 类, 没有下拉菜单, 就不需要这个切换类 show
                // 子组件数组里面有 sub-list 类, 说明有下级菜单, 下面的判断是下来菜单展开与否
                // 但是 , active 类还是需要的, 表示当前的点击处于激活状态
                const currentChildrenArray = Array.from(e.currentTarget.children)
                const hasSublist = hasChildName(currentChildrenArray, 'sub-list')

                if (!hasSublist) {
                    // 没有 sub-list 类, 也就不需要 show 类, 但是要 active 类
                    isShow.value = false
                } else {
                    if(isCurrentTarget){
                        isShow.value = true
                    }
                }
                if(currentNode.className=== 'nav-list-level-title-1'){
                    console.log("当前点击的---> ", currentNode, currentTarget.value)
                    currentTarget.value = currentTarget.value ? null : currentTarget.value
                }
                
            }
            // 点击其他地方关闭菜单, 和 locale-changer.vue 里类似
            const cancleMenu = e => {
                // 点击其他地方关闭下拉菜单
                // e.stopPropagation() // 阻止事件传播(冒泡)
                // e.preventDefault() // 阻止默认行为, 例如, 链接不会打开
                const el = findParentNode(e.target, 'nav-list')
                if (!el || !el.className || !el.className.includes('nav-list')) {
                    currentTarget.value = null
                    isShow.value = null
                }
                // if (currentTarget.value || isShow.value) {
                //     currentTarget.value = null
                //     isShow.value = null
                // }
            }
            onMounted(() => {
                document.querySelectorAll('span[class^="nav-list-level-title"]').forEach(item => {
                    // 获取下面的每个子类, 从类名中获取数字, 这个数字代表的是层级
                    const level = parseInt(item.className.match(/\d+?$/)[0])
                    // 让每个层级的盒子里的元素偏移, 而不是设置盒子的边距, 这样, 盒子的大小始终是全部宽度不变
                    item.style.marginLeft = offset * level + 'px'
                    if (item.previousSibling.className) {
                        item.previousSibling.style.marginLeft = offset * level + 'px'
                    }
                })
                watchEffect(() => {
                    // 只有isShow为true 时才加入其他地方点击菜单消失的响应事件
                    if (isShow.value || currentTarget.value) {
                        document.addEventListener('click', cancleMenu)
                    } else {
                        // 否则, 移除这个click 响应事件
                        document.removeEventListener('click', cancleMenu)
                    }
                })
            })
            // 无论如何, 只要卸载了这个组件, 都要移除该组件的响应事件
            onUnmounted(() => document.removeEventListener('click', cancleMenu))

            return { defaultIcon, isDeepOne, currentTarget, isShow, isCurrentTarget, toggleShow, handleCurrentTarget }
        }
    })
</script>

<style lang="scss" scoped>
    $color-text: #fff;
    $color-level-1: #65CEA7;
    $font-size-level-1: 16px; // 一级菜单的字体大小
    $height-nav-list: 45px; // 图标, 链接, 标题的框高度
    $width-level-1: 165px;
    $color-sub-list: #414344; // 1级菜单的背景色
    $sidebar-min-width: 45px; // sidEbar-dock和item都没用到

    * {
        box-sizing: border-box;
    }

    .nav-list {
        -moz-user-select: none; // 设置不选中文字
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    a {
        text-decoration: none;
    }

    .nav-list {
        width: 100%; // 数组的第一级, [[{}, {}], [{}, {}]], 表示里面的第级数组
        padding: 0;
        margin: 0;
        color: $color-text;
        text-transform: capitalize; // 首字母大写
        display: flex;
        flex-direction: column;
        list-style-type: none;
        // visibility: visible;
        // overflow: hidden;
        // transition: all .2s ease-in-out;
        font-size: $font-size-level-1;

        .nav-items {

            //! 数组中的项目标题 悬停时左侧加上绿色显示
            .nav-list-link,
            .nav-list-title {
                display: flex;
                align-items: center;
                height: $height-nav-list; // 图标, 链接, 标题的框高度
                color: $color-text;
                cursor: pointer;
                border-left: 2px solid transparent;
                //! 这里设置一个过渡效果
                transition: all 0.2s ease-in-out;

                &:hover {
                    background-color: rgba(255, 255, 255, .1);
                    color: cyan;
                    border-left: 2px solid cyan;
                }
            }

            position: relative;

            //* 有下级菜单的 3列中 最后一列靠右显示, > 的箭头符号
            .nav-list-title::after {
                margin-left: auto;
                margin-right: 0.8rem;
                content: ""; // 有下级菜单, 添加右向符号
                height: 6px;
                width: 6px;
                border-left: 2px solid rgba(255, 255, 255, .5);
                border-bottom: 2px solid rgba(255, 255, 255, .5);
                transform: rotate(225deg);
                transition: all .2s;
            }

            .sub-list {
                width: 100%;
                // visibility: visible; // 代替display 实现过渡效果
                // overflow: hidden; // 代替display 实现过渡效果
                // max-height: 0; // 代替display 实现过渡效果
                display: none; // 是 nav-item 上的菜单
                transition: all .2s linear; // 代替display 实现过渡效果
            }

            &.pulldown-active,
            &.pulldown-show {

                // 激活或显示状态下菜单变灰
                .iconfont {
                    background-color: rgba(255, 255, 255, .1);
                    color: #a4a8a8;
                }
            }

            &.pulldown-show {
                position: relative;

                >.sub-list {
                    display: block;
                    position: absolute;
                    width: $width-level-1;
                    bottom: 10px;
                    right: 0;
                    background-color: $color-sub-list;
                    transform: translateX(100%);
                    box-shadow: 6px 6px 3px #888888; // 添加阴影效果
                    border-radius: 2px;

                    .nav-list-title::after {
                        // 除第1级后面的三角箭头不显示外, 下级的都显示
                        display: block;
                    }

                    >:hover {
                        // 下级菜单由按下显示改为悬停显示
                        position: relative;

                        >.sub-list {
                            display: block;
                            position: absolute;
                            width: $width-level-1;
                            bottom: 10px;
                            right: 0;
                            background-color: #353f4f;
                            transform: translateX(100%);
                            box-shadow: 6px 6px 3px #888888; // 添加阴影效果
                            border-radius: 2px;
                        }
                    }
                }

            }
        }

        // 变窄时
        &.narrow-to-region {

            // 当data-tip 没有内容的时候隐藏
            [data-tip=""]::before,
            [data-tip=""]::after {
                visibility: hidden !important;
            }

            [data-tip]::after {
                position: absolute; // 变窄时显示悬停的提示内容
                white-space: nowrap;
                bottom: 0;
                left: 36px;
                color: #353f4f;
                border: 1px solid #353f4f;
                border-radius: 2px;
                padding: 6px;
                bottom: 12px;
                font-size: 0.8rem;
                text-align: center;
                background: white;
                box-shadow: 3px 3px 6px rgba(0, 0, 0, .3);
            }

            // hover的时候显示提示的伪类
            [data-tip]:hover::after {
                content: attr(data-tip);
                visibility: visible;
                opacity: 1;
                -webkit-transition-delay: .15s;
                transition-delay: .15s;
            }

            .nav-list-title::after {
                // 变窄时的三角箭头符号也要隐藏
                display: none;
            }

            .nav-list-level-title-1 {
                display: none;
            }

            >.sub-list {
                display: none; // 所有一级菜单后面的子菜单都是隐藏的
            }
        }
    }
</style>

```
### 改进
```
<template>
    <ul :class="[isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'sidebar-nav-active': isDeepOne? currentTarget===item.title : false}]" @click="handleClick($event, currentTarget=item.title)">

            <component :is="item.children || !item.href? 'span': 'router-link' " :class="item.children ?
              'nav-list-title': 'nav-list-link'" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"> </span>
                <span :class="`nav-list-level-title-${deep}`">{{item.title}}</span>
            </component>

            <sidebar-dock v-if=item.children :items="item.children" :deep=deep+1></sidebar-dock>
        </li>
    </ul>
</template>
```

```
<template>
    <ul :class="[isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'sidebar-nav-active': isDeepOne? currentTarget===item.title : false}]" @click="handleClick($event, currentTag=currentTarget, item.title)">

            <component :is="item.children || !item.href? 'span': 'router-link' " :class="item.children ?
              'nav-list-title': 'nav-list-link'" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"> </span>
                <span :class="`nav-list-level-title-${deep}`">{{item.title}}</span>
            </component>

            <sidebar-dock v-if=item.children :items="item.children" :deep=deep+1 @click="handleClick"></sidebar-dock>
        </li>
    </ul>
</template>


```

### sidebar-items.vue

```
<template>
    <ul :class="[isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items', 
              `nav-list__level-${deep}`, {'pulldown-active': isCurrentTarget(currentTarget, item),
              'pulldown-show': toggleShow(currentTarget, item)}]" @click="handleCurrentTarget">
              
            <component :is="item.children || !item.href? 'span': 'router-link'" :class="item.children ? 
                  'nav-list-title': 'nav-list-link'" :to="item.href">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"></span>
                <span :class="`nav-list-level-title-${deep}`"> {{item.title}} </span>
            </component>
            
            <sidebar-items v-if=item.children :items="item.children" :deep=deep+1></sidebar-items>
        </li>
    </ul>
</template>

<script>
    // 
    import { defineComponent, computed, onMounted, ref } from 'vue'
    export default defineComponent({
        name: 'sidebar-items',
        props: {
            deep: { type: Number, default: 1 },
            // items 是有父组件 sidebar-list 对 data 二维数组展开后得到的, 是一个一维数组
            items: { type: Array, default: () => [] },
            isNarrow: { type: Boolean, default: false }
        },
        setup(props) {
            // 没有图标时默认提供一个图标, 只给第1级菜单提供默认图标, 给出的是图标类名, 在scss中获取
            const defaultIcon = 'icon-all-fill'
            const offset = 10
            const isDeepOne = computed(() => props.deep && props.deep === 1)
            const currentTarget = ref()
            const isShow = ref(false)

            //* 判断元素是否包含给定的类名
            const hasClassName = (element, className) => element.className.indexOf(className) !== -1
            //* 判断父元素 是否包含子元素.
            const hasChildName = (parent, childName) => {
                return parent.some((element) => hasClassName(element, childName))
            }
            //* 判断是不是当前点击的元素
            const isCurrentTarget = (currentTarget, item) => {
                // 当击点的元素, 添加 pulldown-active 类, 当当前菜单为另外数组时, 样式中并没有起作用?
                // 由于是递归嵌套, 下级菜单相当于点击了另外一个组件.离开时这个当前组件并没有被改变
                // 因为是另外的一个组件了, 对于下级组件也是一样的, 下级组件相当于另外一个组件., 已经激活
                // 的组件并没有被切换, 所以 .pulldown-active 类也就不会发生改变
                return currentTarget ? currentTarget === item.title : false
            }
            //* 切换下拉菜单状态
            const toggleShow = (currentTarget, item) => {
                // 如果是激活菜单, 就获取 isShow 值, 否则为 ''
                return isCurrentTarget(currentTarget, item) ? isShow.value : ''
            }
            const handleCurrentTarget = (e) => {
                e.stopPropagation() // 阻止事件传播
                e.preventDefault()
                currentTarget.value = e.currentTarget.querySelector(`span[class^="nav-list-level-title-${props.deep}"]`).innerHTML
                // 要判断 下面 有 sub-list 的时候才添加 show 类, 没有下拉菜单, 就不需要这个切换类 show
                // 子组件数组里面有 sub-list 类, 说明有下级菜单, 下面的判断是下来菜单展开与否
                // 但是 , active 类还是需要的, 表示当前的点击处于激活状态
                const currentChildrenArray = Array.from(e.currentTarget.children)
                const hasSublist = hasChildName(currentChildrenArray, 'sub-list')
                if (!hasSublist) {
                    // 没有 sub-list 类, 也就不需要 show 类, 但是要 active 类
                    isShow.value = false
                } else {
                    isShow.value = !isShow.value
                }
                // 鼠标点击时保存状态
                localStorage.setItem('current_target', currentTarget.value)
                localStorage.setItem('is_show', isShow.value)
            }
            onMounted(() => {
                document.querySelectorAll('span[class^="nav-list-level-title"]').forEach(item => {
                    // 获取下面的每个子类, 从类名中获取数字, 这个数字代表的是层级
                    const level = parseInt(item.className.match(/\d+?$/)[0])
                    // 让每个层级的盒子里的元素偏移, 而不是设置盒子的边距, 这样, 盒子的大小始终是全部宽度不变
                    item.style.marginLeft = offset * level + 'px'
                    if (item.previousSibling.className) {
                        item.previousSibling.style.marginLeft = offset * level + 'px'
                    }
                })
                // 加载之后从 localStorge 中获取上次退出时保存的 当前打开的组件值
                currentTarget.value = localStorage.getItem('current_target')
                isShow.value = localStorage.getItem('is_show')
            })
            return { defaultIcon, isDeepOne, currentTarget, isShow, isCurrentTarget, toggleShow, handleCurrentTarget }
        }
    })
</script>

<style lang="scss" scoped>
    $color-text: #fff;
    $color-level-1: #65CEA7;
    $font-size-level-1: 16px; // 一级菜单的字体大小
    $color-separator-line: #aaa9a9;
    $height-nav-list: 45px; // 图标, 链接, 标题的框高度
    $width-level-1: 165px;
    $width-offset-right-level-1: 45px; // 一级菜单绝对定位时向右偏移的距离
    $width-little-triangle: 5px;
    $offset-left-little-triangle: 10px;
    $color-sub-list: #353f4f;
    $sidebar-min-width: 45px;

    * {
        box-sizing: border-box;
    }

    .nav-list {
        -moz-user-select: none; // 设置不选中文字
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    a {
        text-decoration: none;
    }

    .nav-list {
        //! 一级数组部分开始
        width: 100%; // 数组的第一级, [[{}, {}], [{}, {}]], 表示里面的第级数组
        padding: 0;
        margin: 0;
        color: $color-text;
        text-transform: capitalize; // 首字母大写
        display: flex;
        flex-direction: column;
        list-style-type: none;
        visibility: visible;
        overflow: hidden;
        transition: all .2s ease-in-out;
        font-size: $font-size-level-1;

        &+.nav-list::before {
            content: ''; //* 分割线, 按照数组分割的线, 在第1级的两个数组中间进行分割
            display: block;
            width: 90%;
            border-bottom: 1px solid $color-separator-line;
            align-self: center;
            // margin-left: 4px;
        }

        // 开始时菜单都是收缩的, 点击到哪个菜单, 哪个菜单的下级才打开
        //! 一级数组部分结束
        .nav-items {
            .sub-list {
                width: 100%;
                //? 01. 刚开始时 nav-items 下的 sub-list 都是隐藏的
                visibility: visible; // 代替display 实现过渡效果
                overflow: hidden; // 代替display 实现过渡效果
                max-height: 0; // 代替display 实现过渡效果
                // display: none; // 是 nav-item 上的菜单
                transition: all .2s linear; // 代替display 实现过渡效果

                .nav-sub-items {
                    font-size: $font-size-level-1 - 2px !important;

                    &:hover {
                        background-color: rgba(255, 255, 255, .1);
                    }
                }
            }

            //* 有下级菜单的 3列中 最后一列靠右显示, > 的箭头符号
            .nav-list-title::after {
                margin-left: auto;
                margin-right: 0.8rem;
                content: ""; // 有下级菜单, 添加右向符号
                height: 6px;
                width: 6px;
                border-left: 2px solid rgba(255, 255, 255, .5);
                border-bottom: 2px solid rgba(255, 255, 255, .5);
                transform: rotate(225deg);
                transition: all .2s;
            }

            //! 数组中的项目标题 悬停时左侧加上绿色显示
            .nav-list-link,
            .nav-list-title {
                display: flex;
                align-items: center;
                height: $height-nav-list; // 图标, 链接, 标题的框高度
                color: $color-text;
                cursor: pointer;
                border-left: 2px solid transparent;
                //! 这里设置一个过渡效果
                transition: all 0.2s ease-in-out;

                &:hover {
                    background-color: rgba(255, 255, 255, .1);
                    color: cyan;
                    border-left: 2px solid cyan;
                }
            }

            &.pulldown-show {
                >.nav-list-title::after {
                    transform: rotate(315deg);
                }

                >.sub-list {
                    // display: block;
                    max-height: 200px; // 代替display 实现过渡效果
                }

                .pulldown-show {
                    >.nav-list-title::after {
                        transform: rotate(315deg);
                    }

                    >.sub-list {
                        max-height: 200px; // 代替display 实现过渡效果
                        // display: block;
                    }
                }
            }

            //? ============================================================
        }

        //? ========================变窄时开始========================
        // 当 nav-list 同级的, 也就是一级菜单 存在 narrow-to-region 时, 也就是左侧边栏变窄了
        // 还要满足 数组处于激活状态.
        &.narrow-to-region {
            .nav-list-level-title-1 {
                display: none;
            }

            .nav-list-title:after {
                display: none;
            }

            .sub-list {
                display: none; // 所有一级菜单后面的子菜单都是隐藏的
            }

            .nav-items {
                &:hover {
                    .nav-list-level-title-1 {
                        position: absolute;
                        background-color: $color-level-1;
                        border-radius: 1px 1px 0 0;
                        display: flex;
                        align-items: center;
                        left: $width-offset-right-level-1;
                        height: $height-nav-list;
                        width: $width-level-1; // 与下级的 .sub-list 宽度相等
                        transition: all 0.2s ease-in-out;
                        margin-left: 0 !important;
                        padding-left: $offset-left-little-triangle;

                        &::before {
                            content: '';
                            width: 0;
                            height: 0;
                            font-size: 0;
                            line-height: 0;
                            border-width: $width-little-triangle;
                            border-style: dashed solid dashed dashed;
                            border-color: transparent $color-level-1 transparent transparent;
                            position: absolute;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            // top: 10px;
                            left: -$offset-left-little-triangle;
                        }
                    }

                    .nav-list-title:after {
                        // 变窄时悬停显示第1级菜单后面的 三角符号
                        display: block;
                        // visibility: visible;
                        position: absolute;
                        // 45px + 165px -16px  -8px = 
                        left: $width-offset-right-level-1 + $width-level-1 - $font-size-level-1 - 8px;
                    }

                    >.sub-list {
                        display: block;
                        // visibility: visible;
                        position: absolute;
                        background-color: $color-sub-list;
                        left: $width-offset-right-level-1; // 不能设置高度
                        width: $width-level-1; // 与下级的 .sub-list 宽度相等
                        border-radius: 0 0 1px 1px;

                        .nav-list-title:after {
                            // 变窄时悬停显示2级以后等菜单后面的 三角符号
                            display: block;
                            position: absolute;
                            // left: 140px;
                            right: 2px; // 设置距离右边距离2px刚刚好, 不清楚怎么计算
                        }

                        .pulldown-show {
                            >.sub-list {
                                display: block;
                            }
                        }
                    }
                }
            }

            //? ========================变窄时结束========================
        }
    }
</style>


```

