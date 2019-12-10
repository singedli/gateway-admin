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
      :props="defaultProps"
      @check="getCheckedKey"
      @check-change="handleCheckChange"
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
    getCheckedNodes() {
      // var keys = this.$refs.tree.getCheckedKeys()
      // alert(JSON.stringify(keys))
      // var halfNodes = this.$refs.tree.getHalfCheckedNodes();
      // alert(JSON.stringify(halfNodes))
      // for(var i in halfNodes){
      //     var label = halfNodes[i].label
      //     var children = halfNodes[i].children
      //     for(var j in children){
      //         alert(JSON.stringify(children[j]))          
      //     }
      // }

      // var nodes = this.$refs.tree.getCheckedNodes();
      // alert(JSON.stringify(nodes))
      // for(var i in nodes){
      //     var label = nodes[i].label
      //     var key = label.split(':')[0]
      //     alert(key)
      // }
      //var node = this.$refs.tree.getNode()
      // alert(JSON.stringify(node.parent))
      //alert(this.checked)
       //var nodes = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()) 

      // const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      // const checkedParam = []
      // let index = -1
      // if(checkedNodes.length !== 0) {
      //    for(var i in checkedNodes){
      //       var item = checkedNodes[i]
      //       if (item.children !== undefined) {
      //            index ++;
      //            checkedParam[index] = {
      //                label: item.label,
      //                children: [],
      //            }
      //        } else {
      //            checkedParam[index].children.push(item.label)
      //        }
      //     }
      // }
      //  alert(JSON.stringify(checkedParam))
      var chkIds1 = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()) 
      alert(JSON.stringify(chkIds1))
    },
    getCheckedKey(data, checked) {
      // alert(data.label.split(":")[0])
     // alert(JSON.stringify(checked))
      var str ;
      var checkedKeys = checked.halfCheckedKeys
      for(var i in checkedKeys){
          if(isNaN(checkedKeys[i])){
              str = checkedKeys[i] + '.'
          }
      }
      var value;
      if(str){
        value = str.replace(',','.') + data.label.split(":")[0]
      }else{
        value = data.label.split(":")[0]
      }  
      this.checked.push(value)
    }
    // handleCheckChange(data, checked, indeterminate){
    //    alert(JSON.stringify(data))
    // }
  }
}
</script>
