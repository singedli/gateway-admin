<template>
  <div class="app-container">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      check-on-click-node="true"
      auto-expand-parent="false"
      :props="defaultProps"
    />

    <div class="buttons">
      <el-button @click="loadData">加载数据</el-button>
      <el-button @click="getCheckedNodes">通过 node 获取</el-button>
      <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      <el-button @click="setCheckedNodes">通过 node 设置</el-button>
      <el-button @click="setCheckedKeys">通过 key 设置</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>

  </div>
</template>
<script>
export default {

  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    loadData() {
      var dataStr = '[{"label":"address","children": [{"label":"country:中国"},{"label":"city:江苏苏州"},{"label":"street:科技园路."}]},{"label":"isNonProfit:true"},{"label":"name:BeJson"},{"label":"links","children": [{"label":"0","children":[{"label":"name:Google"},{"label":"url:http://www.google.com"}]},{"label":"1","children":[{"label":"name:Baidu"},{"label":"url:http://www.baidu.com"}]},{"label":"2","children":[{"label":"name:SoSo"},{"label":"url:http://www.SoSo.com"}]}]},{"label":"page:88"},{"label":"url:http://www.bejson.com"}]'
      var json = JSON.parse(dataStr)
      console.log(json)
      this.data = json
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
      console.log(this.$refs.tree.getHalfCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
