<template>
    <div :class="['dropdown-menu-root', {'dropdown-menu-active': isActive} ]" :name=name>
        <div :class="['dropdown-menu-layout']" @click="handleClick">
            <button :class="['dropdown-button', username? 'profile-button': 'icon-button']">
                <img v-if="src" class="dropdown-img" :src=src alt="background-image">
                <span v-if="icon"  :class="['iconfont', icon]"></span>
                <span v-if="!!badge" class="badge"> {{badge}} </span>
                <span v-if="username" class="username"> {{username}} </span>
            </button>
        </div>

        <div :class="['dropdown-list', username ? 'dropdown-list-profile' :'dropdown-list-item']">
            <slot name="dropdown-header"></slot>
            <slot name="dropdown-body"></slot>
            <slot name="dropdown-footer"></slot>
        </div>
    </div>

</template>

<script>
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        name: 'dropdown-layout',
        props: {
            icon: { type: String, default: '' },
            src: { type: String, default: '' },
            badge: { type: Number },
            username: { type: String, default: '' },
            isActive: { type: Boolean, default: false },
            name: { type: String, default: '' },
        },
        setup(props, ctx) {
            const isShow = ref()

            const handleClick = () => {
                let actived = props.isActive ? false : true
                let name = props.name
                ctx.emit('isActived', { actived, name })
            }

            return { isShow, handleClick, }
        }
    })
</script>

<style lang="scss" scoped>
    $icon-font-size: 25px; // 水平导航条图标的宽高字体尺寸
    $height-icon-btn: 45px; // 水平导航条高度
    $width-dropdown-menu: 200px; // 下来菜单的宽度
    $offset-right-icon-btn: 0px; // icon-btn 距离右侧宽度
    // $height-dropdown-list: 180px;
    $background-color-badge: #FF6C60; // 数字信息小圆圈底色
    $color-dropdown-button: #65cea7; // 图标悬停或者是当前状态时的字体颜色
    $background-color-current-button: #424f63; // 图标悬停或者是当前状态时的底色
    $width-list-profile: 180px; // 用户信息下拉菜单的宽度

    .dropdown-menu-root {
        .dropdown-menu-layout {
            .dropdown-button {
                &:hover {
                    background-color: $background-color-current-button; // buton 悬停状态时的底色
                    color: $color-dropdown-button; // buton 悬停状态时的字体颜色

                    .username::after {
                        // 悬停状态时 用户信息图标后面的小三角形颜色
                        border-color: $color-dropdown-button transparent transparent transparent;
                    }
                }
            }
        }

        &.dropdown-menu-active {

            // 菜单 root div元素 --> 菜单 root div元素 当前 --> 图标根 --> 图标
            &.dropdown-current {
                .dropdown-menu-layout {
                    .dropdown-button {
                        background-color: $background-color-current-button; // buton 当前状态时的底色
                        color: $color-dropdown-button; // button 当前状态时的字体颜色 

                        &.profile-button {
                            .username::after {
                                // 当前状态时 用户信息图标后面的小三角形颜色
                                border-color: $color-dropdown-button transparent transparent transparent;
                            }
                        }
                    }
                }


                .dropdown-list-item {
                    display: block; // 激活状态下当前状态下显示出下拉菜单
                }

                .dropdown-list-profile {
                    // 激活状态下当前状态下显示出用户信息下拉菜单
                    visibility: visible; // 用户菜单带动画效果
                    background-color: $color-dropdown-button;
                    box-shadow: 8px 8px 4px #888888; // 添加阴影效果
                    border-radius: 2px;
                }
            }
        }
    }

    .dropdown-menu-root {

        // ======================按钮部分开始=================================
        .dropdown-menu-layout {
            .dropdown-button {
                width: $height-icon-btn;
                height: $height-icon-btn;
                border: none;
                outline: none;
                display: flex;
                justify-content: center;
                align-items: center;
                // cursor: pointer;
                margin-right: $offset-right-icon-btn;



                &.profile-button {
                    width: 100%;
                    // width: 120px; // 用户信息按钮
                    // justify-content: space-between;
                   
                    img {
                        flex: 0 1 auto;
                        width: $icon-font-size + 8px;
                        height: $icon-font-size + 8px;
                        // margin-left: 8px;
                    }
                    
                }
                .username{
                    margin-left: 8px;
                }
                .username::after {
                    $little-triangle-width: 6px; //用户信息按钮旁边的小三角
                    content: '';
                    width: 0;
                    height: 0;
                    font-size: 0;
                    line-height: 0;
                    border-width: $little-triangle-width;
                    border-style: solid dashed dashed dashed;
                    border-color: $background-color-current-button transparent transparent transparent;
                    margin-left: 8px;
                }

                .iconfont {
                    font-size: $icon-font-size; // 图标大小
                }

                .badge {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 0.8 * $icon-font-size;
                    height: 0.8 * $icon-font-size;
                    border-radius: 50%;
                    color: #fff;
                    background-color: $background-color-badge;
                    font-size: 12px;
                    left: 50%;
                    top: 15%;
                }
            }

        }

        // ======================按钮部分结束=================================
        // ======================下拉部分开始=================================
        position: relative;

        .dropdown-list {
            position: absolute; // 下拉菜单 
            background-color: #fff; // 不加底色是透明的
            top: $height-icon-btn; // 下来菜单紧贴水平导航条.
            right: $offset-right-icon-btn; // 与 icon-btn 右对齐
            width: $width-dropdown-menu;

            &::before {
                $little-triangle-width: 6px;
                content: ''; // 下拉菜单的向上小三角符号
                width: 0;
                height: 0;
                font-size: 0;
                line-height: 0;
                border-width: $little-triangle-width;
                border-style: dashed dashed solid dashed;
                border-color: transparent transparent $color-dropdown-button transparent;
                position: absolute;
                top: - 2 * $little-triangle-width;
                right: $height-icon-btn / 2 - $little-triangle-width;
            }

            &.dropdown-list-item {
                display: none;
            }

            &.dropdown-list-profile {
                // 下拉的菜单
                // display: none;
                width: $width-list-profile;
                visibility: hidden; // 代替display 实现过渡效果
                // max-height: 200px; // 代替display 实现过渡效果
                transition: all .2s linear; // 代替display 实现过渡效果

                &::before {
                    // right: $height-icon-btn / 2 + $little-triangle-width;
                    right: 6px; // 上下三角形箭头差不多对齐了
                }
            }

        }

        // ======================下拉部分结束=================================

    }
</style>