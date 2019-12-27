<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="名称:">
        <el-input v-model="listQuery.name" placeholder="名称" />
      </el-form-item>

      <el-form-item label="URL:">
        <el-input v-model="listQuery.url" placeholder="URL" />
      </el-form-item>

      <el-form-item label="后台接口URL:">
        <el-input v-model="listQuery.backonUrl" placeholder="后台接口URL" />
      </el-form-item>

      <el-form-item label="状态:">
        <el-select v-model="listQuery.status" placeholder="状态">
          <el-option label="生效" value="1" />
          <el-option label="失效" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >查询</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column v-if="showcheckedcol" label="选中" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleCheckedConverter(scope.row)">选中</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" width="150px" align="center" prop="name" />
      <el-table-column label="URL" width="150px" align="center" prop="url" />
      <el-table-column label="后台URL" width="150px" align="center" prop="backonUrl" />
      <el-table-column show-overflow-tooltip="true" label="请求报文配置" width="150px" align="center" prop="requestConfig">
        <template slot-scope="{row}">
          <span height="10px" @click="handleDialog(row.requestConfig,'requestConfig')">{{ row.requestConfig }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip="true" label="请求报文格式配置" width="150px" align="center" prop="requestStruct">
        <template slot-scope="{row}">
          <span height="150px" @click="handleDialog(row.requestStruct,'requestStruct')">{{ row.requestStruct }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column show-overflow-tooltip="true" label="响应报文配置" width="150px" align="center" prop="responseConfig">
        <template slot-scope="{row}">
          <span height="150px" @click="handleDialog(row.responseConfig,'responseConfig')">{{ row.responseConfig }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip="true" label="响应报文格式配置" width="150px" align="center" prop="responseStruct">
        <template slot-scope="{row}">
          <span height="10px" @click="handleDialog(row.responseStruct,'responseStruct')">{{ row.responseStruct }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="{row}">{{ row.status ? "生效" : "失效" }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="270"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" width="70%" :visible.sync="dialogDataVisible">
      <span>{{ dataShow }}</span>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[1,2,3,4]"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left:100px;"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="后台URL" prop="backonUrl">
          <el-input v-model="temp.backonUrl" />
        </el-form-item>
        <el-form-item label="请求报文配置" prop="requestConfig">
          <el-input v-model="temp.requestConfig" readonly="true"/>
          <el-button type="primary" icon="el-icon-edit" @click="handleDialogZtree('handleRequest')">请求报文配置</el-button>
        </el-form-item>
        <el-form-item label="请求报文格式配置" prop="requestStruct">
          <el-input v-model="temp.requestStruct" readonly="true"/>
        </el-form-item>
        <!-- <el-form-item label="响应报文配置" prop="responseConfig">
          <el-input v-model="temp.responseConfig" readonly="true"/>
          <el-button type="primary" icon="el-icon-edit" @click="handleDialogZtree('handleResponse')">响应报文配置</el-button>
        </el-form-item>
        <el-form-item label="响应报文格式配置" prop="responseStruct">
          <el-input v-model="temp.responseStruct" readonly="true"/>
        </el-form-item> -->
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogType]"  width="70%" :visible.sync="dialogZtreeVisible">
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
              <el-col :span="12">
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
              <el-col :span="12">
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogZtreeVisible = false">取消</el-button>
          <el-button type="primary" @click="handleZtreeToJson">确认</el-button>
       </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import tree from 'vue-giant-tree'
import {
  getMessageConverterList,
  deleteMessageConverter,
  createMessageConverter,
  messageConverterToTree,
  updateMessageConverter
} from '@/api/messageConverter'
import Pagination from '@/components/Pagination'

const statusOptions = [
  { key: 1, display_name: '生效' },
  { key: 0, display_name: '失效' }
]

const successCode = '00000000'

export default {
  name: 'MessageConverterTable',
  directives: { waves },
  components: { Pagination, tree },
  filters: {},
  props: ['showcheckedcol'],
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 2
      },
      dialogDataVisible: false,
      dialogFormVisible: false,
      dialogZtreeVisible: false,
      dialogStatus: '',
      dialogType: '',
      textMap: {
        update: '修改接口报文转换配置',
        create: '新增接口报文转换配置',
        requestConfig: '请求报文配置',
        responseConfig: '响应报文配置',
        requestStruct: '请求报文格式配置',
        responseStruct: '响应报文格式配置',
        handleRequest: '请求报文配置',
        handleResponse: '响应报文配置'
      },
      rules: {
        name: [{ required: true, message: '名字必填', trigger: 'blur' }],
        url: [{ required: true, message: 'url必填', trigger: 'blur' }],
        backonUrl: [
          { required: true, message: '后台URL必填', trigger: 'blur' }
        ],
        requestConfig: [
          { required: true, message: '请求报文配置必填', trigger: 'blur' }
        ],
        // responseConfig: [
        //   { required: true, message: '响应报文配置必填', trigger: 'blur' }
        // ],
        requestStruct: [
          { required: true, message: '请求报文格式配置必填', trigger: 'blur' }
        ]
        // responseStruct: [
        //   { required: true, message: '响应报文格式配置必填', trigger: 'blur' }
        // ]
      },
      statusOptions,
      dataShow: '',
      temp: {
        id: '',
        name: '',
        url: '',
        backonUrl: '',
        requestConfig: '',
        responseConfig: '',
        requestStruct: '',
        responseStruct: '',
        status: 1
      },
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMessageConverterList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.records
        this.total = response.data.total
        this.pages = response.data.pages
        console.log(response)
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        url: '',
        backonUrl: '',
        requestConfig: '',
        responseConfig: '',
        requestStruct: '',
        responseStruct: '',
        status: 1
      }
    },
    handleDialogZtree(dialogType) {
      this.dialogType = dialogType
      this.dialogZtreeVisible = true
      this.jsonRight = ''
      this.jsonLeft = ''
      this.result = ''
      this.nodesRight = []
      this.nodesLeft = []
    },
    handleZtreeToJson() {
      var config = ''
      var arr = this.draged
      var length = arr.length - 1
      for (var i in arr) {
        if (i < length) {
          config += arr[i] + ','
        } else {
          config += arr[i]
        }
      }
      if (this.dialogType === 'handleRequest') {
        this.temp.requestConfig = config
        this.temp.requestStruct = this.jsonRight
      } else if (this.dialogType === 'handleResponse') {
        this.temp.responseConfig = config
        this.temp.responseStruct = this.jsonRight
      }
      this.dialogZtreeVisible = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.temp)
          createMessageConverter(this.temp).then(response => {
            console.log(response)
            if (response.code === successCode) {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '新增失败',
                type: 'failure',
                duration: 2000
              })
            }
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row.id)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.status = this.temp.status ? 1 : 0
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.temp.responseBody)
          updateMessageConverter(this.temp).then(response => {
            console.log(response)
            if (response.code === successCode) {
              this.$notify({
                title: '修改',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '修改',
                message: '修改失败',
                type: 'failure',
                duration: 2000
              })
            }
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      console.log(row.id)
      deleteMessageConverter(row).then(response => {
        console.log(response)
        if (response.code === successCode) {
          this.$notify({
            title: '删除',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '删除',
            message: '删除失败',
            type: 'failure',
            duration: 2000
          })
        }
        this.getList()
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    },
    handleDialog: function(data, status) {
      this.dataShow = data
      this.dialogStatus = status
      this.dialogDataVisible = true
    },
    handleCheckedConverter(item) {
      this.$emit('selectedConverter', item)
    },
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

