<template>
  <div style="display: flex">
    <el-tabs v-model="activeName" type="border-card" style="flex: 1">
      <el-tab-pane name="html" :lazy="true">
        <span slot="label">HTML</span>
        <MyEditor
                :language="'html'"
                :codes="htmlCodes"
                @onCodeChange="htmlOnCodeChange" />
      </el-tab-pane>
      <el-tab-pane name="js" label="Javascript" :lazy="true">
        <MyEditor
                :language="'javascript'"
                :codes="javascriptCodes"
                @onCodeChange="javascriptOnCodeChange" />
      </el-tab-pane>
      <el-tab-pane name="css" label="CSS" :lazy="true">
        <MyEditor
                :language="'css'"
                :codes="cssCodes"
                @onCodeChange="cssOnCodeChange" />
      </el-tab-pane>
      <el-tab-pane disabled>
        <span slot="label" @click="runCode"><i class="el-icon-s-promotion"></i>运行</span>
      </el-tab-pane>
    </el-tabs>
    <div style="height: 100vh;flex: 1" id="result"></div>
  </div>
</template>

<script>
    import MyEditor from '../components/editor'
    import axios from 'axios'
    export default {
        components:{
            MyEditor
        },
        data () {
            return {
                activeName: 'html',
                htmlCodes:'<div>Hello world</div>',
                javascriptCodes:'console.log("Hello world")',
                cssCodes:'body{ background: #f5f5f5 }',
                htmlEditor:null,
                jsEditor:null,
                cssEditor:null,
            }
        },
        created() {
            if (this.$route.query.i) {
                this.initCode(this.$route.query.i)
            }
        },
        mounted() {

            this.runCode()

        },
        methods:{
            initCode(id) {
                axios.get('http://localhost:3000/api/code/' + id)
                    .then((res) => {
                      if (res.data.error === 0) {
                          this.htmlCodes = res.data.code.html
                          this.javascriptCodes = res.data.code.js
                          this.cssCodes = res.data.code.css
                          this.$forceUpdate()
                      }
                    })
            },
            runCode() {
                let t = "<html><head><style type='text/css'>" + this.cssCodes + "</style></head><body>" + this.htmlCodes + "</body><script type='text/javascript'>"+ this.javascriptCodes+ '<\/script></html>'
                let result = document.getElementById('result')
                result.innerHTML = ''
                let iframe = document.createElement('iframe');
                iframe.name = 'result'
                iframe.id = 'resultIframe'
                iframe.sandbox = 'allow-forms allow-popups allow-scripts allow-same-origin allow-modals'
                iframe.frameBorder = '0'
                iframe.style.width = '100%'
                iframe.style.height = '100%'
                result.append(iframe);

                let r = document.getElementById('resultIframe')
                    r.contentDocument.write(t),
                    r.contentDocument.close()
            },
            htmlOnCodeChange(value){
                this.htmlCodes = value;
            },
            javascriptOnCodeChange(value){
                this.javascriptCodes = value;
            },
            cssOnCodeChange(value){
                this.cssCodes = value;
            },
        }
    }
</script>
<style scoped>
/deep/ .el-tabs__nav .is-disabled{
  cursor: pointer;
}
</style>
