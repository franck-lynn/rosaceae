<template>
    <ul :class="['sidebar-list', isDeepOne ? 'nav-list' : 'sub-list', {'narrow-to-region': isNarrow}]">
        <li v-for="(item, index) in items" :key="index" :class="[isDeepOne? 'nav-items': 'nav-sub-items',
          `nav-list__level-${deep}`, {'sidebar-nav-active': isDeepOne? currentNode===item.title : false}]" @click="handleClick($event, item.title)">

            <component :is="item.children || !item.href? 'span': 'router-link' " :class="item.children ?
              'nav-list-title': 'nav-list-link'" :to="item.href" :title="[isDeepOne? item.title: null]">
                <span v-if="item.icon || isDeepOne" :class="['iconfont', item.icon ? item.icon: isDeepOne? defaultIcon: '']"> </span>
                <span :class="`nav-list-level-title-${deep}`">{{item.title}}</span>
            </component>

            <sidebar-dock v-if=item.children :items="item.children" :deep=deep+1 @isActived="isActived"></sidebar-dock>
        </li>
    </ul>
</template>

<script>
    // <sidebar-dock v-if=item.children :items="item.children" ...></sidebar-dock> 相当于一个父组件
    // 子组件发射数据, 父组件上监听
    import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
    import { findParentNode } from '../helpers'

    export default defineComponent({
        name: 'sidebar-dock',
        props: {
            deep: { type: Number, default: 1 },
            items: { type: Array, default: () => [] },
            isNarrow: { type: Boolean, default: false },
            currentNode: { type: String, default: '' },
        },
        setup(props, ctx) {
            const defaultIcon = 'icon-all-fill'
            const offset = 10
            const isDeepOne = computed(() => props.deep && props.deep === 1)

            const currentTarget = ref()

            const isActived = e => {
                // 这里的 e 是 handleClick 传过来的, 一直会传到 sidbar-footer 上
                ctx.emit('isActived', e)
            }
            const handleClick = (e, itemTitle) => {
                // e.stopPropagation() // 阻止事件传播(冒泡)
                // emit 里的参数会传给 isActived()
                let el
                if (props.deep === 1) {
                    ctx.emit('isActived', { deep: props.deep, itemTitle })

                } else {
                    el = findParentNode(e.target, 'nav-list-title') // 如果找到 nav-list-title 类, 就是最后一级菜单
                    
                    if (el) { // 如果el 不存在, 就说明是最后一级菜单, 这里修改了 !el 反而对了, 真是凑巧了, 不知道什么原因
                        ctx.emit('isActived', el)
                    }
                }
            }

            // 点击其他地方关闭菜单, 和 locale-changer.vue 里类似
            const cancleMenu = e => {

                // 点击其他地方关闭下拉菜单
                const el = findParentNode(e.target, 'sidebar-list')
                if (!el || !el.className || !el.className.includes('sidebar-list')) {
                    ctx.emit('isActived', { el })
                }
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
                document.addEventListener('click', cancleMenu)
            })
            // 无论如何, 只要卸载了这个组件, 都要移除该组件的响应事件
            onUnmounted(() => document.removeEventListener('click', cancleMenu))

            return { defaultIcon, isDeepOne, currentTarget, handleClick, isActived }
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

            &.sidebar-nav-active {

                // 激活或显示状态下菜单变灰
                .iconfont {
                    background-color: rgba(255, 255, 255, .1);
                    color: #a4a8a8;
                }
            }

            &.sidebar-nav-active {
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