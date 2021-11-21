<template>
    <ul :class="['sidebar-list',isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'sidebar-nav-active': isDeepOne? currentNode===item.title : false},
          {'nav-sub-items-show': item.children  && currentTarget === item.title}]" @click="handleClick($event, item.title)" @mouseenter="handleSidebarActived($event, item.title)">

            <component :is="item.children || !item.href? 'span': 'router-link'" :class="[item.children ? 'nav-list-title': 'nav-list-link']" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"></span>
                <span :class="`nav-list-level-title-${deep}`"> {{item.title}} </span>
            </component>

            <sidebar-items v-if=item.children :items="item.children" :deep=deep+1 @isActived="isActived"></sidebar-items>
        </li>
    </ul>
</template>

<script>
    // 要达到的效果: 
    // 宽状态: 点击一级, 可以切换展示下一级, 同时其余菜单收缩, 用当前 和激活两个状态控制.
    //         同时, 点击下级菜单时不收缩, 也就是说不改变当前激活状态
    // 窄状态: 点击激活后可以
    import { findParentNode } from '../helpers'
    import { defineComponent, computed, onMounted, ref } from 'vue'
    export default defineComponent({
        name: 'sidebar-items',
        props: {
            deep: { type: Number, default: 1 },
            // items 是有父组件 sidebar-list 对 data 二维数组展开后得到的, 是一个一维数组
            items: { type: Array, default: () => [] },
            isNarrow: { type: Boolean, default: false },
            currentNode: { type: String, default: '' },
            isSidebarActived: { type: Boolean, default: false }, // 父组件上的 .sidebar-items 是不是激活的
        },
        setup(props, ctx) {
            // 没有图标时默认提供一个图标, 只给第1级菜单提供默认图标, 给出的是图标类名, 在scss中获取
            const defaultIcon = 'icon-all-fill'
            const offset = 10
            const isDeepOne = computed(() => props.deep && props.deep === 1)
            const currentTarget = ref()

            // const isShow = ref(false)
            const isActived = e => {
                // 这里的 e 是 handleClick 传过来的, 一直会传到 sidbar-footer 上
                console.log("监听---> ", e)
                ctx.emit('isActived', e)
            }

            const handleClick = (e, itemTitle) => {
                // console.log("currentTarget的区别---> ", e.currentTarget)
                // console.log("target的区别---> ", e.target)
                const clickedNodeClassName = e.target.parentNode.className
                // 正则表达式匹配数组
                const clickeNodeDeepNumber = clickedNodeClassName.match(/\d/g)
                const clickedDeep = clickeNodeDeepNumber ? clickeNodeDeepNumber['0'] : null
                // console.log("获取的数字", clickedNodeClassName, parseInt(clickedDeep) === props.deep)

                // e.stopPropagation() // 阻止事件传播(冒泡)
                // 点击时会让所点项目激活, 当 sidebar-nav-active 激活时, 
                currentTarget.value = itemTitle
                // 就显示其下的一级菜单
                // console.log("所点击的菜单---> ", e.target, itemTitle, props.deep)
                let el
                el = findParentNode(e.target, 'nav-list-title') // 如果找到 nav-list-title 类, 就是最后一级菜单
                // console.log("获取到的el---> ", el.lastElementChild.className)
                if (props.deep === 1 && el && el.lastElementChild.className === 'nav-list-level-title-1') {
                    // 判断点击的是不是第1级
                    ctx.emit('isActived', { deep: props.deep, itemTitle })
                } else {
                    if (el) {
                        // 如果el存在, 说明是中间的菜单, 点击时就进行显示切换
                        // 判断当前 currentTarget === itemTitle, 如果是, 说明是 show 状态, 要切换一下
                        // 中间状态也是冒泡的
                        // 如果 e.target 有 show 这个类, 就需要切换一下
                        // console.log("有没有 show 这个类---> ", e.target.parentNode)
                        // if (e.target.parentNode.className.includes('nav-sub-items-show')) {
                        //     console.log("此时的 currentTarget.value", currentTarget.value)
                        //     currentTarget.value = itemTitle
                        // } else {
                        //     // currentTarget.value = null
                        // }
                        // currentTarget.value = currentTarget === itemTitle ? false : currentTarget === itemTitle
                    }
                    if (!el) { // 如果el 不存在, 就说明是最后一级菜单, 这里修改了 !el 反而对了, 真是凑巧了, 不知道什么原因
                        // ctx.emit('isActived', { el, itemTitle }) // 发射这个事件后, 
                        // 设置一个标记为, 如果这个触发了, 标记就为真, 就不会再冒泡了
                        if(props.isNarrow){
                            ctx.emit('isActived', { el, itemTitle }) // 发射这个事件后,
                        }
                    }
                    // if (props.isNarrow) {
                    //     // 如果是在窄状态下
                    // } else {
                    //     // 就是在宽状态下

                    // }

                    if (e.target.parentNode.className.includes('nav-sub-items-show') && props.deep === parseInt(clickedDeep)) {
                        currentTarget.value = null
                    } else {
                        currentTarget.value = itemTitle
                    }
                }
            }
            const handleSidebarActived = (e, itemTitle) => {
                // 如果是激活状态, 鼠标进入切换才有效
                // if(props.isSidebarActived){
                //     handleClick(e, itemTitle)
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
                // 加载之后从 localStorge 中获取上次退出时保存的 当前打开的组件值
                currentTarget.value = localStorage.getItem('current_target')
                // isShow.value = localStorage.getItem('is_show')
            })
            // return { defaultIcon, isDeepOne, currentTarget, /* isShow, */ isCurrentTarget, /*  toggleShow,  */ /* handleCurrentTarget */ }
            return { defaultIcon, isDeepOne, currentTarget, handleClick, handleSidebarActived, isActived }
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
        //! 一级数组部分开始, 就是带有分割线的图标, 所有的图标
        width: 100%; // 数组的第一级, [[{}, {}], [{}, {}]], 表示里面的第1级数组
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
        }

        //! 一级数组部分结束
        // 开始时菜单都是收缩的, 点击到哪个菜单, 哪个菜单的下级才打开 
        .nav-items {

            .sub-list {
                width: 100%;
                //? 01. 刚开始时 nav-items 下的 sub-list 都是隐藏的
                visibility: visible; // 代替display 实现过渡效果
                overflow: hidden; // 代替display 实现过渡效果
                max-height: 0; // 代替display 实现过渡效果
                transition: all .2s linear; // 过渡效果

                .nav-sub-items {
                    font-size: $font-size-level-1 - 2px !important;

                    &:hover {
                        // border: 4px solid red;
                        background-color: rgba(255, 255, 255, .1); // 二级菜单以下的悬停底色
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

            //! 数组中的项目标题 悬停时左侧加上绿色显示, 所有等级的菜单
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

            // 控制 下级菜单显示与否
            &.sidebar-nav-active {
                &.nav-sub-items-show {
                    >.nav-list-title::after {
                        transform: rotate(315deg);
                    }

                    >.sub-list {
                        // display: block;
                        max-height: 200px; // 代替display 实现过渡效果
                    }
                }

                .nav-sub-items-show {
                    display: block;

                    >.nav-list-title::after {
                        transform: rotate(315deg);
                    }

                    >.sub-list {
                        visibility: visible;
                        overflow: auto;
                        max-height: 200px;
                        display: block;
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
                display: none; // 一级菜单文本文字
            }

            .nav-list-title:after {
                display: none; // > 向右符号
            }

            .sub-list {
                display: none; // 所有一级菜单后面的子菜单都是隐藏的
            }

            .nav-items {

                // &:hover, // 改悬停状态控制为按钮切换, 一级菜单按钮切换.
                // 鼠标悬停状态 mouseenter 状态控制, 鼠标进入哪个菜单, 那个菜单置为
                // 当前并激活状态
                &.sidebar-nav-active {

                    // 一级菜单的文字标题部分
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

                        // 一级菜单向左指向的小三角形
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

                    // 变窄时悬停显示第1级菜单后面的 ▶ 旋转三角符号
                    .nav-list-title:after {
                        display: block;
                        position: absolute;
                        left: $width-offset-right-level-1 + $width-level-1 - $font-size-level-1 - 8px; // 45px + 165px -16px -8px  
                    }

                    >.sub-list {
                        display: block; // 一级菜单下的sub-list
                        // visibility: visible;
                        // overflow: auto;
                        // max-height: 200px;
                        position: absolute;
                        background-color: $color-sub-list;
                        left: $width-offset-right-level-1; // 不能设置高度
                        width: $width-level-1; // 与下级的 .sub-list 宽度相等
                        border-radius: 0 0 1px 1px;

                        // 变窄时显示2级以后等菜单后面的 三角符号
                        .nav-list-title:after {
                            display: block;
                            position: absolute;
                            // left: 140px;
                            right: 7px; // 设置距离右边距离2px刚刚好, 不清楚怎么计算, 现在有要调整到 7px
                        }

                        // .nav-sub-items-show {
                        //     >.sub-list {
                        //         display: block;
                        //     }
                        // }
                    }

                }

                .sidebar-nav-active {
                    &.nav-sub-items-show {
                        // 如果不需要控制第1级, 把上面的 .sidebar-nav-active这层去掉, & 去掉就好了
                        display: block;

                        >.nav-list-title::after {
                            transform: rotate(315deg);
                        }

                        >.sub-list {
                            visibility: visible;
                            overflow: auto;
                            max-height: 200px;
                            display: block;
                        }
                    }
                }

            }

            //? ========================变窄时结束========================
        }
    }
</style>