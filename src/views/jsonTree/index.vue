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
      node-key="id"
      highlight-current
      :props="defaultProps"
    />

    <!-- <div class="buttons">
      <el-button @click="loadData">加载数据</el-button>
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div> -->

  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import { messageConverterToTree } from '@/api/messageConverter'

export default {
  directives: { waves },
  data() {
    return {
      textarea: '',
      data: [],
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
        var json = JSON.parse(response.data)
        this.data = json
      })
    }
    // getCheckedNodes() {
    //   console.log(this.$refs.tree.getCheckedNodes())
    // },
    // getCheckedKeys() {
    //   console.log(this.$refs.tree.getCheckedKeys())
    // },
    // setCheckedNodes() {
    //   this.$refs.tree.setCheckedNodes([{
    //     id: 5,
    //     label: '二级 2-1'
    //   }, {
    //     id: 9,
    //     label: '三级 1-1-1'
    //   }])
    // },
    // setCheckedKeys() {
    //   this.$refs.tree.setCheckedKeys([3])
    // },
    // resetChecked() {
    //   this.$refs.tree.setCheckedKeys([])
    // }
  }
}
</script>
