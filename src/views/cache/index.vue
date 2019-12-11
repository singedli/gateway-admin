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

      <el-form-item label="最大缓存条目:">
        <el-input v-model="listQuery.resultNum" placeholder="最大缓存条目" />
      </el-form-item>

      <el-form-item label="过期时间:">
        <el-input v-model="listQuery.expireTime" placeholder="过期时间" />
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
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="globalRefresh">全部刷新</el-button>
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
      <el-table-column label="后台URL" width="150px" align="center" prop="backonUrl" />
      <el-table-column label="请求体配置" width="150px" align="center" prop="requestBody" />
      <el-table-column label="响应体配置" width="150px" align="center" prop="responseBody" />
      <el-table-column label="最大缓存条目" width="150px" align="center" prop="resultNum" />
      <el-table-column label="过期时间" width="150px" align="center" prop="expireTime" />
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
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="apiRefresh(row)">刷新</el-button>
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
        <el-form-item label="后台URL" prop="backonUrl">
          <el-input v-model="temp.backonUrl" />
        </el-form-item>
        <el-form-item label="请求体" prop="requestBody">
          <el-input v-model="temp.requestBody" />
        </el-form-item>
        <el-form-item label="响应体" prop="responseBody">
          <el-input v-model="temp.responseBody" />
        </el-form-item>
        <el-form-item label="最大缓存条目" prop="resultNum">
          <el-input v-model="temp.resultNum" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-input v-model="temp.expireTime" />
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
  getGatewayCacheList,
  deleteGatewayCache,
  createGatewayCache,
  globalRefreshCache,
  apiRefreshCache,
  updateGatewayCache
} from '@/api/cache'
import Pagination from '@/components/Pagination'

const statusOptions = [
  { key: 1, display_name: '生效' },
  { key: 0, display_name: '失效' }
]

const successCode = '00000000'

export default {
  name: 'GatewayCacheTable',
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
        update: '修改接口缓存配置',
        create: '新增接口缓存配置'
      },
      rules: {
        name: [{ required: true, message: '名字必填', trigger: 'blur' }],
        url: [{ required: true, message: 'url必填', trigger: 'blur' }],
        backonUrl: [
          { required: true, message: '后台URL必填', trigger: 'blur' }
        ],
        requestBody: [
          { required: true, message: '请求体必填', trigger: 'blur' }
        ]
      },
      statusOptions,
      temp: {
        id: '',
        name: '',
        url: '',
        backonUrl: '',
        requestBodyd: '',
        responseBody: '',
        resultNum: '',
        status: 1,
        expireTime: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getGatewayCacheList(this.listQuery).then(response => {
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
        requestBodyd: '',
        responseBody: '',
        resultNum: '',
        status: 1,
        expireTime: ''
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
          createGatewayCache(this.temp).then(response => {
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
          updateGatewayCache(this.temp).then(response => {
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
      deleteGatewayCache(row).then(response => {
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
    globalRefresh() {
      globalRefreshCache().then(response => {
        if (response.code === successCode) {
          this.$notify({
            title: '刷新全部',
            message: '刷新全部成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '刷新全部',
            message: '刷新全部失败',
            type: 'failure',
            duration: 2000
          })
        }
      })
    },
    apiRefresh(row) {
      console.log(row.url)
      apiRefreshCache(row).then(response => {
        if (response.code === successCode) {
          this.$notify({
            title: '刷新',
            message: '刷新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '刷新',
            message: '刷新失败',
            type: 'failure',
            duration: 2000
          })
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    }
  }
}
</script>
