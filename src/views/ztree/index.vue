<template>
  <div class="app-container">

       <el-input
          v-model="textarea"
          type="textarea"
          :rows="15"
          placeholder="请输入JSON"
          @blur="loadData"
        />

      <tree
        :setting="setting"
        :nodes="nodes"
        @onClick="onClick"
        @onCheck="onCheck"
        @onCreated="handleCreated"
      />
  </div>
</template>
<script>
import tree from 'vue-giant-tree'
import waves from '@/directive/waves' // waves directive
import { messageConverterToTree } from '@/api/messageConverter'

const successCode = '00000000'

var simpleData = []
  // [{ 'name': 'address', 'children': [{ 'name': 'country:中国' }, { 'name': 'city:江苏苏州' }, { 'name': 'street:科技园路.' }] }, { 'name': 'isNonProfit:true' }, { 'name': 'name:BeJson' }, { 'name': 'links', 'children': [{ 'name': '0', 'children': [{ 'name': 'name:Google' }, { 'name': 'url:http://www.google.com' }] }, { 'name': '1', 'children': [{ 'name': 'name:Baidu' }, { 'name': 'url:http://www.baidu.com' }] }, { 'name': '2', 'children': [{ 'name': 'name:SoSo' }, { 'name': 'url:http://www.SoSo.com' }] }] }, { 'name': 'page:88' }, { 'name': 'url:http://www.bejson.com' }]

const dataQueue = [simpleData]
export default {
  name: 'App',
  components: {
    tree
  },
  data() {
    return {
      textarea: '',
      showIndex: 0,
      ztreeObj: null,
      setting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        },
        view: {
          showIcon: false,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom
        }
      }
    }
  },
  computed: {
    nodes: function() {
      return dataQueue[this.showIndex]
    }
  },
  methods: {
    loadData() {
      var param = JSON.parse(this.textarea)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          // var json = JSON.parse(response.data)
          // this.data = json
          alert(JSON.stringify(response.data))
          this.data.simpleData = response.data
          
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
    addHoverDom(treeid, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`)
      if (item && !item.querySelector('.tree_extra_btn')) {
        const btn = document.createElement('sapn')
        btn.id = `${treeid}_${treeNode.id}_btn`
        btn.classList.add('tree_extra_btn')
        btn.innerText = '删除'
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          this.clickRemove(treeNode)
        })
        item.appendChild(btn)
      }
    },
    removeHoverDom(treeid, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`)
      if (item) {
        const btn = item.querySelector('.tree_extra_btn')
        if (btn) {
          item.removeChild(btn)
        }
      }
    },
    clickRemove(treeNode) {
      console.log('remove', treeNode)
      this.ztreeObj && this.ztreeObj.removeNode(treeNode)
    },
    onClick: function(evt, treeId, treeNode) {
      // 点击事件
      // console.log(treeNode)
      console.log(treeNode.parentTId)
      // console.log(evt.type, treeNode)
    },
    onCheck: function(evt, treeId, treeNode) {
      // 选中事件
      console.log(evt.type, treeNode)
      var pNode = treeNode.getParentNode()
      console.log(pNode)
    },
    handleCreated: function(ztreeObj) {
      this.ztreeObj = ztreeObj
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    update: function() {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    }
  }
}
</script>
