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
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
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
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleDelete(row.id)">删除</el-button>
          <el-button type="primary" size="mini" @click="handleUpdateStatus(row)">{{ row.status?'失效':'生效' }}</el-button>
        </template>
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
    <el-dialog title="网关接口" :visible.sync="dialogCreateVisible" center="true">
      <el-form :model="updateForm" label-width="20%">
        <el-form-item label="接口名称:">
          <el-input v-model="updateForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="URL:">
          <el-input v-model="updateForm.url" autocomplete="off" label="url" />
        </el-form-item>
        <el-form-item label="后台URL:">
          <el-input v-model="updateForm.backonUrl" autocomplete="off" label="backonUrl" />
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="updateForm.type" placeholder="请选择类型">
            <el-option label="透传" value="PASS" />
            <el-option label="并发" value="CONCURRENT" />
            <el-option label="复杂" value="COMPLICATE" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统:">
          <el-input v-model="updateForm.system" autocomplete="off" label="系统" />
        </el-form-item>
        <el-form-item label="前置拦截器:">
          <el-input v-model="updateForm.preInterceptors" autocomplete="off" label="前置拦截器" />
        </el-form-item>
        <el-form-item label="后置拦截器:">
          <el-input v-model="updateForm.postInterceptors" autocomplete="off" label="后置拦截器" />
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="updateForm.status" placeholder="请选择状态">
            <el-option label="true" value="生效" />
            <el-option label="false" value="失效" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import { getList, deleteById, updateGatewayInterface } from '@/api/gatewayInterface'

export default {
  name: 'ComplexTable',
  directives: { waves },
  inject: ['reload'],
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      },
      dialogCreateVisible: false,
      updateForm: {
        name: '',
        url: '',
        backonUrl: '',
        type: '',
        status: '',
        system: '',
        preInterceptors: '',
        postInterceptors: '',
        invokeConfig: ''
      },
      systemData: []
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
      })
    },
    handleClearQueryParams() {
      this.listQuery = {}
    },

    handleDelete(id) {
      deleteById({ 'id': id }).then(res => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdateStatus(gatewayInterface) {
      gatewayInterface.status = !gatewayInterface.status
      updateGatewayInterface(gatewayInterface).then(res => {
        if (res.code === '00000000') {
          this.$notify({
            title: 'Success',
            message: gatewayInterface.status ? '配置已生效' : '配置已失效',
            type: 'success',
            duration: 1000
          })
          this.getList(this.listQuery)
        }
      })
    },
    handleUpdate(gatewayInterface) {
      this.dialogCreateVisible = true
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    getUrl(url) {
      this.$router.push({ path: url })
    }
  }
}
</script>
