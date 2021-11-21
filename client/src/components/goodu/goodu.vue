<template>

    <form @submit.prevent="onSubmit" class="r1-form">
        <div :class="['vuer-search-box',  {'vuer-search-box-active': isActive}]">
            <div class="vuer-search-sug">
                <vuer-input v-if="flag" clearable :class="{'has-sug': hasSugList()}" name="search-input" :placeholder="placeholder" v-model="goodu" @input="handleChange" @focus="handleFocus" autocomplete="off"></vuer-input>

                <div v-if="hasSugList()" :class="['vuer-sug', {'vuer-sug-active': isActive}]">
                    <ul>
                        <li class="sug-store sug-overflow" v-for="(item, index) in sugList" :key="index">
                            <span class="sug-title" @click="handleSugClick">{{item}} </span>
                            <span class="iconfont icon-cancel" @click="deleteHistory($event, index)"></span>
                        </li>
                    </ul>
                    <div class="setup_store-sug" @click="visible=true">关闭历史</div>
                </div>
            </div>
            <vuer-button plain>谷度一下</vuer-button>
        </div>
    </form>
    <!-- <vuer-dialog width="40%" top="50px" v-model="visible"></vuer-dialog> -->
    <!-- 模态框 -->
    <dragabel-resizable-modal v-model="visible" title="模态框"></dragabel-resizable-modal>
</template>

<script>
    //! https://blog.csdn.net/m0_49989338/article/details/110475323 列表中的ref
    // 关于关闭 chrome 历史记录的方法: 设置--> 自动填充--> 地址和其他信息 --> 保存并填写地址 --> 关闭
    // input 框中设置 autocomplete="off"
    // 谷度搜索
    import { getList, setList, saveList } from './goodu';
    import { useField, useForm } from "vee-validate";
    import { defineComponent, onMounted, ref } from "vue";
    export default defineComponent({
        name: "goodu",
        props: {},
        setup() {
            const flag = ref(false);
            const sugList = ref([]);
            const visible = ref(false) // 控制模态框显示
            const { form, handleSubmit } = useForm();
            const isActive = ref();
            const placeholder = "请输入搜索内容";
            const { value: goodu } = useField("goodu", undefined, { form });
            goodu.value = "谷度输入框";
            const onSubmit = handleSubmit(async (values) => {
                //! 先把提示框关闭
                isActive.value = false
                // 提交前把数据 goodu.value 存储到 localStorge, 判断是否重复, 最新的放在前面, 入栈式操作
                // 增加项目操作
                setList(sugList, values.goodu)
                alert(JSON.stringify(values, null, 2));
            });

            const handleChange = () => {
                isActive.value = true;
                getList(sugList)
            };
            const handleFocus = () => {
                isActive.value = true;
                getList(sugList)
            };
            const hasSugList = () =>
                sugList.value && Array.isArray(sugList.value) && sugList.value.length > 0;

            const handleSugClick = async (e) => {
                e.stopPropagation();
                e.preventDefault();
                // 处理sug列表的点击
                goodu.value = e.currentTarget.innerHTML;
                isActive.value = false;
                await onSubmit()
            };
            const deleteHistory = (e) => {
                e.stopPropagation();
                e.preventDefault();
                // console.log("删除之前, 先要找到上一个兄弟节点", e.currentTarget.previousSibling.innerHTML)
                // 删除数组中的对应项
                const element = e.currentTarget.previousSibling.innerHTML
                sugList.value.splice(sugList.value.findIndex(item => item.title === element), 1)
                saveList(sugList)
            }

            onMounted(() => {
                flag.value = true;
                // 文件加载时从 localStorge 中取出数据给 sugList.value
                getList(sugList)
                // 点击其他地方时, 提示框消失
                const cancelSug = (e) => {
                    let targetClass = e.target.className
                    if ((typeof targetClass) !== 'string') {
                        return // 只有字符串才有 includes 方法
                    }
                    if (!targetClass.match(/vuer-input_inner/)) {
                        isActive.value = false;
                    }
                }
                document.documentElement.addEventListener('click', cancelSug)
            });



            return {
                flag,
                placeholder,
                visible,
                isActive,
                hasSugList,
                goodu,
                handleChange,
                // handleBlur,
                handleFocus,
                sugList,
                handleSugClick,
                deleteHistory,
                onSubmit,
            };
        },
    });
</script>

<style lang="scss" scoped>
    $height-goodu: 32px; // 调整goodu 搜索框的高度
    $height-goodu-font: 14px; // 搜索按钮的字体
    $padding-button-tb: ($height-goodu - $height-goodu-font - 2px) / 2; // button 上下的padding
    $border-radius: 6px;
    $margin-left-goodu: 10px;
    $width-button: 100px;
    $color-normal: #a7aab5;
    $color-active: #4e6ef2;
    $color-hover: #4662d9;
    $border-width: 2px;
    $font-size-input: 14px; // 谷度 input 框字体大小
    $font-size-suggest: 14px; //搜索框历史框的字体和取消键字体大小
    $min-width-input: 360px; // 搜索输入框最小宽度
    .r1-form {
        display: flex; //! root 级
        height: 45px;
        // width: 100%;

        .#{$prefix}search-box {
            width: 100%; // vuer-search-box 搜索框的根节点,
            display: flex; // vuer-search-box 容器下有2个元素, 布局采用 flex
            align-items: center;
            margin-left: 10px; // 整个搜索框带按钮偏离左边的距离

            .#{$prefix}search-sug {
                width: 100%; // search-sug 包括2部分, 其中建议框是绝对定位
                display: flex;
                align-items: center;
                position: relative;

                ::v-deep(.#{$prefix}input) {
                    width: 100%; // 覆盖 input 框的宽度
                    // min-width: $min-width-input;
                    .#{$prefix}input_inner {
                        height: $height-goodu + 2px; // vuer-input 封装时包含了边线1px, 所以要加上这个边线
                        // 激活时分2种情况, 一种是有 sug, 一种是没有sug, 没有 sug 的时候
                        border-color: $color-normal;
                        border-width: $border-width;
                        border-right-color: $color-active;
                        border-radius: $border-radius 0 0 $border-radius;
                        flex-grow: 1;
                        font-size: $font-size-input;

                        &:hover,
                        &:focus {
                            border-color: $color-hover;
                        }
                    }

                    .#{$prefix}input_suffix {
                        height: $height-goodu; // 设置 取消符号 x 的居中显示
                        line-height: $height-goodu;
                    }
                }
            }

            ::v-deep(.vuer-button) {
                // 按钮框
                background-color: $color-active;
                color: #ffffff;
                padding: $padding-button-tb 8px; // button文字的上下, 左右内边距
                font-size: $height-goodu-font;
                border-left: 0;
                width: $width-button;
                border-radius: 0 $border-radius $border-radius 0;
                border-color: $color-active;
                margin-left: -$border-width; //! 完美解决线帽问题
                border-width: $border-width;
                z-index: 4;

                &:hover,
                &:focus {
                    background-color: $color-hover; // 与$color-active比稍微加深了点颜色
                    border-color: $color-hover;
                }
            }
        }

        // sug 框在激活时的变化
        .#{$prefix}sug {
            position: absolute; // 智能提示框, div 容器
            top: $height-goodu;
            border: $border-width solid $color-normal;
            background-color: #fff;
            display: none;
        }

        .#{$prefix}sug-active {
            display: flex; // 智能提示激活时的列表
            width: 100%;
            flex-direction: column;
            border-top: 0;
            border-radius: 0 0 $border-radius $border-radius;
            border-color: $color-active;
            font-size: $font-size-suggest;
            z-index: 10;

            ul {
                margin: 0 10px;
            }

            .sug-store {
                display: flex; // li 的列表框样式
                justify-content: space-between;
                align-items: center;
                margin-top: 6px; // 智能框列表的上外边距

                // font-size: 16px;
                // cursor: pointer;
                .sug-title {
                    // border: 1px solid red;
                    flex-grow: 1;
                }

                .icon-cancel {
                    font-size: $font-size-suggest;
                    opacity: 0.5;
                    cursor: pointer;
                }

                // &::after { // 伪类元素不能添加事件, 还是改由图标实现
                //     // 伪类图标引入 svg 需要加上字体文件
                //     font-family: "iconfont" !important;
                //     content: "\e624";
                //     font-size: 10px; // 伪类图标大小
                //     opacity: 0.5; // 加上透明度
                // }
            }

            .setup_store-sug {
                margin-right: 16px; // 关闭历史
                margin-bottom: 6px;
                margin-top: 10px;
                font-size: 0.85rem;
                align-self: flex-end;
                cursor: pointer;
            }
        }

        // input 框在激活且有sug 时变化
        .#{$prefix}search-box-active {

            // 激活时输入框的变化
            .#{$prefix}search-sug {
                ::v-deep(.#{$prefix}input) {
                    &.has-sug {

                        // 有sug 时
                        .#{$prefix}input_inner {
                            // 智能提示激活时的输入框样式
                            border-right: $border-width solid $color-active;
                            border-radius: $border-radius 0 0 0;
                            border-color: $color-hover;
                        }
                    }
                }
            }
        }
    }
</style>