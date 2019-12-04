<template>
  <div class="app-container">

    <el-form :inline="true" :model="listQuery" class="form-inline">
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
          <el-option label="无" value="" />
          <el-option label="生效" value="1" />
          <el-option label="失效" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="listQuery.type" placeholder="类型">
          <el-option label="无" value="" />
          <el-option label="透传" value="PASS" />
          <el-option label="并发" value="CONCURRENT" />
          <el-option label="复杂" value="COMPLICATE" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item align="right">
        <el-button type="primary">查询</el-button>
        <el-button type="primary">查询</el-button>
      </el-form-item> -->
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="handleClearQueryParams">清空</el-button>

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
      <el-table-column label="名字" width="150px" align="center" prop="name" />
      <el-table-column label="URL" width="150px" align="center" prop="url" />
      <el-table-column label="后台URL" width="150px" align="center" prop="backonUrl" />
      <el-table-column label="类型" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.type | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="系统" width="150px" align="center" prop="system" />
      <el-table-column label="前置拦截器" width="150px" align="center" prop="preInterceptors" />
      <el-table-column label="后置拦截器" width="150px" align="center" prop="postInterceptors" />
      <el-table-column label="调用配置" width="150px" align="center" prop="invokeConfig" />
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
        <!-- <template slot-scope="{row}"> -->
        <el-button type="primary" size="mini">编辑</el-button>
        <el-button type="primary" size="mini">删除</el-button>
        <el-button type="primary" size="mini">失效</el-button>

        <!-- </template> -->
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        align="center"
        background
        :current-page="1"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getList } from '@/api/gatewayInterface'

export default {
  name: 'ComplexTable',
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = {
        PASS: '透传',
        CONCURRENT: '并发',
        COMPLICATE: '复杂'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10

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
        console.log(response.data.records)
        console.log(response)
      })
    },
    handleClearQueryParams() {
      this.listQuery = {}
    },

    handleSizeChange() {

    },
    handleCurrentChange() {},
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {

    },
    handleDownload() {

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
    }
  }
}
</script>
