<template>
  <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonIn"
              type="textarea"
              :rows="20"
              placeholder="请输入JSON"
              @blur="loadData"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonOut"
              type="textarea"
              :rows="20"
              placeholder="请输入JSON"
              @blur="loadData"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <tree
                :setting="setting"
                :nodes="nodesIn"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <tree
                :setting="setting"
                :nodes="nodesOut"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
          </div>
        </el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div class="buttons">
                <el-button @click="getCheckedNodes">通过 node 获取</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <div class="buttons">
                <el-button @click="getJson">通过 node 获取json</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
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
      jsonIn: '',
      jsonOut: '',
      showIndex: 0,
      ztreeObj: null,
      nodesIn: [],
      nodesOut: [],
      selected: [],
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
        edit: {
          enable: true,
          drag: {
            isMove: false,
            isCopy: true,
            prev: true,
            inner: true,
            next: true
          },
          removeTitle: '删除节点',
          renameTitle: '编辑节点名称',
          showRenameBtn: true,
          showRemoveBtn: true
        },
        view: {
          showIcon: true,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom
        },
        callback: {
          onDrag: this.zTreeOnDrag,
          onDrop: this.zTreeOnDrop
        }
      }
    }
  },
  methods: {
    loadData() {
      var param = JSON.parse(this.jsonIn)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodesIn = json
          this.nodesOut = [{}]
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
      alert(JSON.stringify(this.selected))
    },
    getJson() {
      this.jsonOut = JSON.stringify(this.nodesOut)
    },
    zTreeOnDrag(event, treeId, treeNodes) {
      alert(treeNodes.length)
    },
    zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
      alert(treeNodes.length + ',' + (targetNode ? (targetNode.tId + ',' + targetNode.name) : 'isRoot'))
    },
    handleParent(treeNode, pNode, pName) {
      if (pNode.parentTId == null) {
        var name = pName + '.' + treeNode.name.split(':')[0]
        if (treeNode.checked) {
          this.selected.push(name)
        } else {
          var index = this.selected.indexOf(name)
          if (index > -1) {
            this.selected.splice(index, 1)
          }
        }
      } else {
        var parentNode = pNode.getParentNode()
        var parentName = parentNode.name + '.' + pName
        this.handleParent(treeNode, parentNode, parentName)
      }
    },
    // onClick: function(evt, treeId, treeNode) {
    //   // 点击事件
    //   // console.log(treeNode)
    //   //console.log(treeNode.parentTId)
    //   alert(JSON.stringify(treeNode))
    //   // console.log(evt.type, treeNode)
    // },
    onCheck: function(evt, treeId, treeNode) {
      if (treeNode.parentTId == null) {
        var name = treeNode.name.split(':')[0]
        if (treeNode.checked) {
          this.selected.push(name)
        } else {
          var index = this.selected.indexOf(name)
          if (index > -1) {
            this.selected.splice(index, 1)
          }
        }
      } else {
        var pNode = treeNode.getParentNode()
        var pName = pNode.name
        this.handleParent(treeNode, pNode, pName)
      }
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
