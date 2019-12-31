<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="form-inline">
      <el-form-item label="需验证请求key">
        <el-input v-model="listQuery.keyLimit" placeholder="需验证请求key" />
      </el-form-item>

      <el-form-item label="URL:">
        <el-input v-model="listQuery.url" placeholder="URL" />
      </el-form-item>

       <el-form-item label="最大请求数:">
        <el-input v-model="listQuery.maxCount" placeholder="最大请求数" />
      </el-form-item>

       <el-form-item label="单位时间:">
        <el-input v-model="listQuery.timeUnit" placeholder="单位时间" />
      </el-form-item>

      <el-form-item label="状态:">
        <el-select v-model="listQuery.status" placeholder="状态">
          <el-option label="无" value="" />
          <el-option label="生效" value="1" />
          <el-option label="失效" value="0" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="handleClearQueryParams">清空</el-button>
      <el-form-item align="left">
        <el-button type="primary" align="left" @click="handleCreateInterfaceConfig">新增接口配置</el-button>
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL" width="150px" align="center" prop="url" />
      <el-table-column label="需验证请求key" width="150px" align="center" prop="keyLimit" />
      <el-table-column label="最大请求次数" width="150px" align="center" prop="maxCount" />
      <el-table-column label="单位时间" width="150px" align="center" prop="timeUnit" />
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.status ? '生效' : '失效' }}
        </template>
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
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleDelete(row.id)">删除</el-button>
          <el-button type="primary" size="mini" @click="handleUpdateStatus(row)">{{ row.status?'失效':'生效' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <!-- <el-pagination
        align="center"
        background
        :current-page="1"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />  -->
      <pagination v-show="total>0"
        :total="total"
        :pageSizes="[10,20,30,40]"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList" />
    </div>

    <el-dialog title="网关接口防刷配置" :visible.sync="dialogCreateVisible" class="form-inline">
      <el-form :model="updateForm" label-width="20%">
        <el-form-item label="URL:">
          <el-input v-model="updateForm.url" autocomplete="off" label="url" />
        </el-form-item>
        <el-form-item label="需验证请求key">
          <el-input v-model="updateForm.keyLimit" autocomplete="off" label="需验证请求key" readonly="true"/>
          <el-button type="primary" icon="el-icon-edit" @click="handleDialogZtree()">需验证请求key</el-button>
        </el-form-item>
        <el-form-item label="单位时间">
          <el-select v-model="updateForm.timeUnit" placeholder="单位时间">
            <el-option label="时" value="H" />
            <el-option label="分" value="M" />
            <el-option label="秒" value="S" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大请求次数">
          <el-input v-model="updateForm.maxCount" autocomplete="off" label="最大请求次数" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
           <el-select v-model="updateForm.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(flag)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="需验证请求key"  width="70%" :visible.sync="dialogZtreeVisible">
      <template>
        <div class="app-container">
            <el-row :gutter="20">
              <el-col :span="16">
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
              <!-- <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-input
                    v-model="result"
                    type="textarea"
                    :rows="20"
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
              </el-col> -->
            </el-row>
            <el-row :gutter="20">
              <el-col :span="16">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>树状图</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    <!--    @onCheck="zTreeOnCheck" -->
                  </div>
                  <div class="grid-content bg-purple">
                    <tree
                        :setting="settingRight"
                        :nodes="nodesRight"
                        @onCreated="handleCreatedRight"
                        @onCheck="zTreeOnCheck"
                      />
                  </div>
                </el-card>
              </el-col>
              <!-- <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>树状图</span>
                    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                  </div>
                  <div class="grid-content bg-purple">
                    <tree
                        :setting="settingLeft"
                        :nodes="nodesLeft"
                        @onCheck="zTreeOnCheck"
                        @onCreated="handleCreatedLeft"
                      />
                  </div>
                </el-card>
              </el-col> -->
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogZtreeVisible = false">取消</el-button>
          <el-button type="primary" @click="handleZtreeCheckData">确认</el-button>
       </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import tree from 'vue-giant-tree'
import { parseTime } from '@/utils'
import { getList,updateInterfaceConfig,queryByCondition,deleteById,createInterfaceConfig} from '@/api/limit'
import Pagination from '@/components/Pagination'
import { messageConverterToTree } from '@/api/messageConverter'

const calendarTypeOptions = [
  { key: 1, display_name: '生效' },
  { key: 0, display_name: '失效' }
]

const successCode = '00000000'
export default {
  name: 'ComplexTable',
  directives: { waves },
  components: { Pagination, tree},
  filters: {

  },
 data() {
    return {
      dialogZtreeVisible: false,
      tableKey: 0,
      flag: '',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      },
      dialogCreateVisible: false,
      updateForm: {
        url: '',
        status: '',
        keylimit:'',
        maxCount:'',
        timeUnit:''
      },
      systemData: [],
       calendarTypeOptions,
       temp: {

      },
      limitKeys: [],
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
          onDrop: this.zTreeOnDropRight,
          beforeCheck: this.zTreeBeforeCheck,
          onCheck: this.zTreeOnCheck
        }
      }
      
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.records
        this.total = response.data.total
        this.pages = response.data.pages
        console.log(response.data.records)
        console.log(response)
      })
    },
    handleClearQueryParams() {
      this.listQuery = {}
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdateStatus(row) {
      row.status = !row.status
      updateInterfaceConfig(row).then(res => {
        if (res.code === '00000000') {
          this.$notify({
            title: 'Success',
            message: row.status ? '配置已生效' : '配置已失效',
            type: 'success',
            duration: 1000
          })
          this.getList(this.listQuery)
        }
      })
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
    handleCreateInterfaceConfig() {
      this.dialogCreateVisible = true
      this.updateForm = {}
      this.flag = 'create'
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    handleUpdate(interfaceConfig) {
      console.log(interfaceConfig.status);
      interfaceConfig.status = interfaceConfig.status?1:0
      this.dialogCreateVisible = true
      this.updateForm = interfaceConfig
      this.flag = 'update'
    },

    handleDelete(id) {
      deleteById({ 'ids': id }).then(res => {
        if (res.code === '00000000') {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList(this.listQuery)
        }
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
     submitForm(flag) {
      this.dialogCreateVisible = false
      if (flag === 'create') {
        createInterfaceConfig(this.updateForm).then(res => {
          if (res.code === '00000000') {
            this.$notify({
              title: 'Success',
              message: '新增配置成功',
              type: 'success',
              duration: 1000
            })
            this.getList(this.listQuery)
          }
        })
      }
      if (flag === 'update') {
        updateInterfaceConfig(this.updateForm).then(res => {
          if (res.code === '00000000') {
            this.$notify({
              title: 'Success',
              message: '修改配置成功',
              type: 'success',
              duration: 1000
            })
            this.getList(this.listQuery)
          }
        })
      }
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

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
    handleZtreeCheckData() {
      var config = ''
       var keyArr = this.limitKeys
      var length = keyArr.length - 1
      for (var i in keyArr) {
        if (i < length) {
          config += keyArr[i] + ','
        } else {
          config += keyArr[i]
        }
      }
      this.updateForm.keyLimit = config
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
    },
    handleDialogZtree() {
      this.dialogZtreeVisible = true
      this.jsonRight = ''
      this.jsonLeft = ''
      this.result = ''
      this.nodesRight = []
      this.nodesLeft = []
    },
    getFilePath(treeObj) {
        console.log(treeObj)
        if (treeObj == null) return "";
        var  filename=treeObj.name
        if(filename.indexOf(":") > -1){
          filename = treeObj.name.substring(0,treeObj.name.indexOf(':'))
        }
        let pNode = treeObj.getParentNode()
        if (pNode != null) {
            filename = this.getFilePath(pNode) + "." + filename
        }
        return filename
    },
    zTreeBeforeCheck(treeId, treeNode){
     if(treeNode.isParent){
        alert("请选择子节点进行添加")
         return false
      }
    },   
    zTreeOnCheck(event, treeId, treeNode) {
      var nodeFilename = this.getFilePath(treeNode)
      if(treeNode.checked){
          this.limitKeys.push(nodeFilename)
      }else {
        var index = this.limitKeys.indexOf(nodeFilename)
        if( index > -1){//则包含该元素
           this.limitKeys.splice(index, 1); 
        }
      }
    }  
  }
}
</script>
