<template>
  <div class="app-container">

    <el-input
      v-model="textarea"
      type="textarea"
      :rows="15"
      placeholder="请输入JSON"
      @blur="loadData"
    />

    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="label"
      highlight-current
      check-on-click-node="true"
      auto-expand-parent="false"
      :props="defaultProps"
    />

    <div class="buttons">
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
    </div>

  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import { messageConverterToTree } from '@/api/messageConverter'

const successCode = '00000000'
var vm = new Vue({
  
})
export default {
  directives: { waves },
  data() {
    return {
      textarea: '',
      data: [],
      checked: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    loadData() {
      var param = JSON.parse(this.textarea)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.data = json
        } else {
          this.$notify({
            title: '转换',
            message: '转换失败',
            type: 'failure',
            duration: 2000
          })
        }
      })
    },
    childrenHandle(children, checkedKeys, checkedParam) {
      for (var j in children) {
        if (children[j].children !== undefined) {
          // alert(JSON.stringify(children[j]))//{"label":"0","children":[{"label":"name:Google"},{"label":"url:http://www.google.com"}
          var next = checkedParam.children
          next.push({ label: children[j].label, children: [] })
          var result = this.childrenHandle(children[j].children, checkedKeys, next[j])
          checkedKeys = result.checkedKeys
          checkedParam.children.push(result.checkedParam)
          return { checkedKeys: checkedKeys, checkedParam: checkedParam }
        } else {
          var index = checkedKeys.indexOf(children[j].label)
          if (index > -1) {
            checkedParam.children.push({ label: checkedKeys[index] })
            checkedKeys.splice(index, 1)
          }
        }
      }
      return { checkedKeys: checkedKeys, checkedParam: checkedParam }
    },
    getCheckedNodes() {
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      var checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      alert(JSON.stringify(checkedNodes))
      var checkedParams = []
      if (checkedNodes.length !== 0) {
        for (var i in checkedNodes) {
          if (checkedNodes[i].children !== undefined) {
            var children = checkedNodes[i].children
            var checkedParam = {
              label: checkedNodes[i].label,
              children: []
            }
            var result = this.childrenHandle(children, checkedKeys, checkedParam)
            checkedKeys = result.checkedKeys
            checkedParams.push(result.checkedParam)
            alert(JSON.stringify(checkedParams))
          }
        }
        for (var i in checkedKeys) {
          checkedParams.push({ label: checkedKeys[i] })
        }
      }
      alert(JSON.stringify(checkedParams))
    }
    // getCheckedKey(data, checked) {
    //   // alert(data.label.split(":")[0])
    //  // alert(JSON.stringify(checked))
    //   var str ;
    //   var checkedKeys = checked.halfCheckedKeys
    //   for(var i in checkedKeys){
    //       if(isNaN(checkedKeys[i])){
    //           str = checkedKeys[i] + '.'
    //       }
    //   }
    //   var value;
    //   if(str){
    //     value = str.replace(',','.') + data.label.split(":")[0]
    //   }else{
    //     value = data.label.split(":")[0]
    //   }
    //   this.checked.push(value)
    // }
  }
}
</script>
