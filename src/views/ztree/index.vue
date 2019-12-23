<template>
  <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonRight"
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
              readonly="true"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              v-model="jsonLeft"
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
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>树状图</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="grid-content bg-purple">
              <tree
                  :setting="settingRight"
                  :nodes="nodesRight"
                  @onCheck="onCheckRight"
                  @onCreated="handleCreatedRight"
                />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作按钮</span>
            </div>
            <div class="grid-content bg-purple">
              <el-button @click="getCheckedNodes">通过 node 获取</el-button>
              <el-button style="float: right" @click="getJson">通过 node 获取json</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>树状图</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="grid-content bg-purple">
              <tree
                  :setting="settingLeft"
                  :nodes="nodesLeft"
                  @onCheck="onCheckLeft"
                  @onCreated="handleCreatedLeft"
                />
            </div>
          </el-card>
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
      jsonRight: '',
      jsonLeft: '',
      ztreeObjRight: null,
      ztreeObjLeft: null,
      nodesRight: [],
      nodesLeft: [],
      selected: [],
      draging: '',
      result: '',
      draged: [],
      settingRight: {
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
        callback: {
          onDrag: this.zTreeOnDrag,
          onDrop: this.zTreeOnDropRight
        }
      },
      settingLeft: {
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
        callback: {
          onDrag: this.zTreeOnDrag,
          onDrop: this.zTreeOnDropLeft
        }
      }
    }
  },
  methods: {
    loadDataRight() {
      var param = JSON.parse(this.jsonRight)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodesRight = json
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
      var param = JSON.parse(this.jsonLeft)
      messageConverterToTree(param).then(response => {
        if (response.code === successCode) {
          var json = JSON.parse(response.data)
          this.nodesLeft = json
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
      alert(JSON.stringify(this.selected))
    },
    getJson() {
      alert(JSON.stringify(this.draged))
    },
    handleDragParent(treeNode, pNode, pName) {
      if (pNode.parentTId == null) {
        var name = pName + '.' + treeNode.name.split(':')[0]
        this.draging = name
      } else {
        var parentNode = pNode.getParentNode()
        var parentName = ''
        if (isNaN(pName)) {
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
    zTreeOnDropRight(event, treeId, treeNodes, targetNode, moveType) {
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
            this.ztreeObjLeft.addNodes(targetNode.getParentNode(), targetNode.getIndex(), treeNodes, false)
            this.ztreeObjLeft.removeNode(targetNode)
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
      }
    },
    zTreeOnDropLeft(event, treeId, treeNodes, targetNode, moveType) {
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
            this.ztreeObjRight.addNodes(targetNode.getParentNode(), targetNode.getIndex(), treeNodes, false)
            this.ztreeObjRight.removeNode(targetNode)
            var node = targetName + '=' + this.draging
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
    onCheckRight: function(evt, treeId, treeNode) {
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
    onCheckLeft: function(evt, treeId, treeNode) {
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
    handleCreatedRight: function(ztreeObj) {
      this.ztreeObjRight = ztreeObj
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleCreatedLeft: function(ztreeObj) {
      this.ztreeObjLeft = ztreeObj
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    }
  }
}
</script>
