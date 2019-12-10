<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="名称:">
        <el-input v-model="listQuery.name" placeholder="名称" />
      </el-form-item>

      <el-form-item label="URL:">
        <el-input v-model="listQuery.url" placeholder="URL" />
      </el-form-item>

      <el-form-item label="所属系统:">
        <el-input v-model="listQuery.system" placeholder="所属系统" />
      </el-form-item>

      <el-form-item label="状态:">
        <el-select v-model="listQuery.status" placeholder="状态">
          <el-option label="生效" value="1" />
          <el-option label="失效" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="请求类型:">
        <el-select v-model="listQuery.httpMethod" placeholder="请求类型">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
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
      <el-table-column label="所属系统" width="150px" align="center" prop="system" />
      <el-table-column label="请求类型" width="150px" align="center" prop="httpMethod" />
      <el-table-column label="版本" width="150px" align="center" prop="version" />
      <el-table-column label="头信息" width="150px" align="center" prop="httpHeader" />
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
        <el-form-item label="所属系统" prop="system">
          <el-input v-model="temp.system" />
        </el-form-item>
        <el-form-item label="请求类型" prop="httpMethod">
          <el-select v-model="temp.httpMethod" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in httpMethodOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头信息" prop="httpHeader">
          <el-input v-model="temp.httpHeader" />
        </el-form-item>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import {
  getBackonInterfaceList,
  deleteBackonInterface,
  createBackonInterface,
  updateBackonInterface
} from '@/api/backonInterface'
import Pagination from '@/components/Pagination'

const httpMethodOptions = [
  { key: 'GET', display_name: 'GET' },
  { key: 'POST', display_name: 'POST' }
]

const statusOptions = [
  { key: 1, display_name: '生效' },
  { key: 0, display_name: '失效' }
]

const successCode = '00000000'

export default {
  name: 'BackonInterfaceTable',
  directives: { waves },
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 2
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改后台接口配置',
        create: '新增后台接口配置'
      },
      rules: {
        name: [{ required: true, message: '名字必填', trigger: 'blur' }],
        url: [{ required: true, message: 'url必填', trigger: 'blur' }],
        system: [
          { required: true, message: '所属系统必填', trigger: 'blur' }
        ],
        httpHeader: [
          { required: true, message: '头信息必填', trigger: 'blur' }
        ],
        httpMethod: [
          { required: true, message: '请求类型必填', trigger: 'blur' }
        ]
      },
      statusOptions,
      httpMethodOptions,
      temp: {
        id: '',
        name: '',
        url: '',
        system: '',
        httpMethod: '',
        httpHeader: '',
        status: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getBackonInterfaceList(this.listQuery).then(response => {
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
        system: '',
        httpMethod: '',
        httpHeader: '',
        status: 1
      }
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
          createBackonInterface(this.temp).then(response => {
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
          updateBackonInterface(this.temp).then(response => {
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
      deleteBackonInterface(row).then(response => {
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
    }
  }
}
</script>
