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

       <div class="buttons">
          <el-button @click="getCheckedNodes">通过 node 获取</el-button>
       </div>
  </div>
</template>
<script>
import tree from 'vue-giant-tree'
import { messageConverterToTree } from '@/api/messageConverter'

const successCode = '00000000'

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
      nodes: [],
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
  methods: {
    loadData() {
      var param = JSON.parse(this.textarea)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodes = json
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
    getCheckedNodes() {
       alert(JSON.stringify(this.ztreeObj))
       var selected = this.ztreeObj.getSelectedNodes()
       alert(JSON.stringify(selected))
    },
    // onClick: function(evt, treeId, treeNode) {
    //   // 点击事件
    //   // console.log(treeNode)
    //   //console.log(treeNode.parentTId)
    //   alert(JSON.stringify(treeNode))
    //   // console.log(evt.type, treeNode)
    // },
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
