<template>
  <div>
    <div id="container" ref="container" style="height: calc(100vh - 100px)"></div>
  </div>
</template>
<script>
    import { editor } from 'monaco-editor';
    export default {
        props:{
            codes:{
                type:String,
                default:function(){
                    return '<div>请输入html内容</div>'
                }
            },
            language:{
                type:String,
                default:function(){
                    return 'html'
                }
            },
            editorOptions:{
                type:Object,
                default:function(){
                    return {
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,        // 只读
                        cursorStyle: 'line',        //光标样式
                        lineNumbers: "on",
                        automaticLayout: false, //自动布局
                        glyphMargin: true,  //字形边缘
                        useTabStops: false,
                        fontSize: 28,       //字体大小
                        autoIndent:true,//自动布局
                        minimap: {
                            enabled: !1
                        }
                    }
                }
            }
        },
        data(){
            return{
                codesCopy:null,//内容备份
            }
        },
        mounted(){
            this.initEditor();
        },
        methods:{
            initEditor(){
                let self = this;
                self.$refs.container.innerHTML = '';
                self.monacoEditor = editor.create(self.$refs.container, {
                    value:self.codesCopy || self.codes,
                    language: self.language,
                    theme: 'vs', //vs, hc-black, or vs-dark
                    editorOptions:self.editorOptions,
                });
                self.monacoEditor.onDidChangeModelContent(function(event){//编辑器内容changge事件
                    self.codesCopy = self.monacoEditor.getValue();
                    self.$emit('onCodeChange',self.monacoEditor.getValue(),event);
                });
                //编辑器随窗口自适应
                window.addEventListener('resize',function(){
                    self.initEditor();
                })
            }
        }
    }
</script>
<style scoped>
  #container{
    height:100%;
    text-align: left;
  }
</style>
