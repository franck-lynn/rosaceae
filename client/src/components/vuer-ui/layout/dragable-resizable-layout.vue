<template>
    <div class="dr-container">
        <span class="edge edge-corner top-left"></span>
        <span class="edge horizontal  top"></span>
        <span class="edge edge-corner top-right"></span>
        <span class="edge vertical left"></span>


        <div class="main-content">
            <slot name="content-header"></slot>


            <!-- <div class="content-header"> 菜单栏</div>
            <div class="content-body">内容区域</div> -->
        </div>


        <span class="edge vertical right"></span>
        <span class="edge edge-corner bottom-left"></span>
        <span class="edge horizontal bottom"></span>
        <span class="edge edge-corner bottom-right"></span>


    </div>
</template>

<script>
    import { useModal } from '../helpers'
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'dragable-resizable-layout',
        props: {},
        setup() {
            useModal()
            return {}
        }
    })
</script>

<style lang="scss" scoped>
    // $width: 400px;
    // $height: 300px;
    $edge: 1px; // 拖放边缘宽度
    $width-corner: 3px; // 边缘角的方框宽度, 方便斜角拖放
    $color-content-header: #F3F3F3; // 边缘颜色, 含4个角
    $border-raidus: 2px;

    * {
        box-sizing: border-box;
        -moz-user-select: none; // 设置不选中文字
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }

    .dr-container {
        display: grid; // 最外层不设置边框, 在 内容区域的 div 设置边框即可
        // border: 1px solid violet;
        width: 600px; // 初始时设置的值
        height: 400px;
        margin-left: 140px;
        margin-top: 60px;
        grid-template-columns: $edge 1fr $edge;
        grid-template-rows: $edge 1fr $edge;
        background-color: #fff;
        border-radius: $border-raidus;

        .main-content {
            display: flex; // 内容区域设置边框, 
            flex-direction: column;

            // border: 1px solid blue;
            // 设置了向4边扩展, 范围与 不设置边框时外层大小相等, 
            // 但是4周边缘设置了透明, 透明覆盖了内容区域, 这样
            // 既可以拖放, 有不会有边框带来的鼠标位置1px的影响
            margin: -$edge;
            z-index: 120;

            // .header-menu {
            //     width: 100%; // 菜单栏宽度
            //     height: 45px; // 菜单栏高度
            //     margin-left: 20px;
            //     background-color: $color-content-header;
            //     border-radius: $border-raidus $border-raidus 0 0;
            // }
        }

        // ==================边缘布局开始===========================
        .edge {
            // background-color: greenyellow;
            background-color: transparent;
            z-index: 200;
            cursor: row-resize;

            &.vertical {
                cursor: col-resize;
            }

            &.edge-corner {
                width: $width-corner; // 4个边缘角的布局
                height: $width-corner;
                // 这个实际使用时采用与上层边缘一样的透明, 注释掉即可
                // background-color: blue;
                z-index: 201;

                cursor: se-resize;

                &.top-right {
                    cursor: sw-resize;
                    justify-self: end;
                }

                &.bottom-left {
                    cursor: sw-resize;
                    justify-self: start;
                    align-self: end;
                }

                &.bottom-right {
                    justify-self: end;
                    align-self: end;
                }
            }
        }




    }
</style>