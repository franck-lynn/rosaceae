<template>
    <ul class="vuer-dropdown-menus">
        <li v-for="(item, index) in items" :key="index">
            <component :is="item" :isActive=isActive :name=item :class="{'dropdown-current': currentTag === item}" @mouseenter="handleCurrentTag" @isActived=handleActived @infoItemClick=handleInfoItemClick></component>
        </li>
    </ul>

</template>

<script>
    import path from 'path'
    import { defineComponent,  onMounted, onUnmounted, ref, watchEffect } from "vue";
    import { findParentNode } from '../helpers';
    export default defineComponent({
        name: "dropdown-menus",
        props: {},
        setup() {
            //  const flag = ref(false)
            //  const flagSymbol = Symbol.for('flag')
            // 自动组装组件菜单
            let items = ref([])
            const currentTag = ref()
            const files = require.context('@/components/dropdown/dropdown-components', true, /\.vue$/)
            files.keys().forEach(key => {
                //TODO: 这里可以通过后端来读取前端的文件夹, 来确定需要加载的组件, 施加拦截器
                //TODO: 在各组件中, 数据需要从后端获取, 这样就可以实施拦截
                items.value = items.value.concat(path.basename(key, path.extname(key)))
            })

            const isActive = ref()
            
            const handleActived = (e) => {
                isActive.value = e.actived
                currentTag.value = e.name
            }


            const handleCurrentTag = e => {
                // 处理鼠标进入时的事件, 由于鼠标进入时从边缘开始, 进入的
                // 一般就是 dropdown-layout.vue 里的根节点, 所以就不用再向上级查找了
                currentTag.value = e.target.getAttribute('name')
            }
            const cancelMenu = e => {
                const el = findParentNode(e.target, 'dropdown-menu-root')
                // console.log("dropdown-menus.vue当前点击的菜单是: ---> ", e.target)
                //! 这个步骤的目的是点击其他地方, 让菜单消失
                if(!el || !el.className || !el.className.includes('dropdown-menu-root')){
                    isActive.value = false
                }
            }
            const handleInfoItemClick = e => {
                // console.log("接受子组件dropdown-profile等传过来的点击事件", e)
                //! 这个步骤的目的是在点击对应的子级菜单后消失, 因为已经执行了链接, 
                //! 不再需要显示了, 与子组件是关联的, 子组件是: dropdown-profile.vue 等
                isActive.value  = e
            }
            onMounted(() => {
                // flag.value = inject(flagSymbol) //!!! 要等主程序加载后才加载这个组件
                watchEffect(() => {
                    // 只有isShow为true 时才加入其他地方点击菜单消失的响应事件
                    if (isActive.value) {
                        document.addEventListener('click', cancelMenu)
                    } else {
                        // 否则, 移除这个click 响应事件
                        document.removeEventListener('click', cancelMenu)
                    }
                })
            })
            // 无论如何, 只要卸载了这个组件, 都要移除该组件的响应事件
            onUnmounted(() => document.removeEventListener('click', cancelMenu))
            return {
                // flag,
                isActive,
                handleActived,
                currentTag,
                handleInfoItemClick, 
                handleCurrentTag,
                items
            }
        },
    });
</script>

<style lang="scss" scoped>
    $height-icon-btn: 45px; // 水平导航条高度

    .#{$prefix}dropdown-menus {
        display: flex;
        height: $height-icon-btn;
        justify-content: center;
        align-items: center;
    }
</style>