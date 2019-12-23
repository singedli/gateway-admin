<template>
  <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonIn"
              type="textarea"
              :rows="20"
              placeholder="请输入JSON"
              @blur="loadDataRight"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              v-model="result"
              type="textarea"
              :rows="20"
              placeholder=""
              @blur="loadDataLeft"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonOut"
              type="textarea"
              :rows="20"
              placeholder="请输入JSON"
              @blur="loadDataLeft"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <a>tree</a>
            <tree
                :setting="setting"
                :nodes="nodesIn"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <div class="buttons">
                <el-button @click="getCheckedNodes">通过 node 获取</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <div class="buttons">
                <el-button @click="getJson">通过 node 获取json</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <a>tree</a>
            <tree
                :setting="setting"
                :nodes="nodesOut"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
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
      draging: '',
      result: '',
      draged: [],
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
    loadDataRight() {
      var param = JSON.parse(this.jsonIn)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodesIn = json
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
    loadDataLeft() {
      var param = JSON.parse(this.jsonOut)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodesOut = json
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
      // alert(JSON.stringify(this.jsonOut))
      alert(JSON.stringify(this.draged))
    },
    handleDragParent(treeNode, pNode, pName) {
      if (pNode.parentTId == null) {
        var name = pName + '.' + treeNode.name.split(':')[0]
        this.draging = name
      } else {
        var parentNode = pNode.getParentNode()
        var parentName = ''
        console.log(parentNode.name)
        if (isNaN(pName)) {
          // alert(parentNode.name)
          parentName = parentNode.name + '.' + pName
        } else {
          parentName = parentNode.name
        }
        this.handleDragParent(treeNode, parentNode, parentName)
      }
    },
    handleTargetParent(treeNode, pNode, pName, targetName) {
      if (pNode.parentTId == null) {
        var name = pName + '.' + treeNode.name.split(':')[0]
        targetName = name
        return targetName
      } else {
        var parentNode = pNode.getParentNode()
        var parentName = ''
        if (isNaN(pName)) {
          // alert(parentNode.name)
          parentName = parentNode.name + '.' + pName
        } else {
          parentName = parentNode.name
        }
        return this.handleTargetParent(treeNode, parentNode, parentName, targetName)
      }
    },
    zTreeOnDrag(event, treeId, treeNodes) {
      var treeNode = treeNodes[0]
      if (treeNode.parentTId == null) {
        var name = treeNode.name.split(':')[0]
        this.draging = name
      } else {
        var pNode = treeNode.getParentNode()
        var pName = pNode.name
        this.handleDragParent(treeNode, pNode, pName)
      }
    },
    zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
      var targetName = ''
      if (targetNode.parentTId == null) {
        var name = targetNode.name.split(':')[0]
        targetName = name
      } else {
        var pNode = targetNode.getParentNode()
        var pName = pNode.name
        targetName = this.handleTargetParent(targetNode, pNode, pName, targetName)
      }

      if (moveType === 'inner') {
        if (targetNode != null) {
          this.$confirm('请选择覆盖或者新增！', '提示', {
            confirmButtonText: '覆盖',
            cancelButtonText: '新增',
            type: 'warning',
            center: true
          }).then(() => {
            console.log(targetNode.getParentNode())
            console.log(targetNode.getIndex())
            this.ztreeObj.addNodes(targetNode.getParentNode(), targetNode.getIndex(), treeNodes, false)
            this.ztreeObj.removeNode(targetNode)
            var node = this.draging + '=' + targetName
            this.draged.push(node)
            this.result = JSON.stringify(this.draged)
            this.$message({
              type: 'info',
              message: '覆盖成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '新增成功!'
            })
          })
        }
        console.log(treeNodes)
        console.log(targetNode)
      }
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
    onClick: function(evt, treeId, treeNode) {
      // 点击事件
      // console.log(treeNode)
      // console.log(treeNode.parentTId)
      // console.log(evt.type, treeNode)
    },
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
