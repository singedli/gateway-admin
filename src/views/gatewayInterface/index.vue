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

      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="handleClearQueryParams">清空</el-button>
      <el-form-item align="left">
        <el-button type="primary" align="left" @click="handleCreateGatewayInterface">新增接口配置</el-button>
      </el-form-item>
    </el-form>

    <el-table
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
      <el-table-column show-overflow-tooltip="true" label="后台系统和URL" width="150px" align="center" prop="backonUrl" />
      <el-table-column label="类型" width="150px" align="center">
        <template slot-scope="{row}">
          {{ row.type | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="前置拦截器" width="150px" align="center" prop="preInterceptors" />
      <el-table-column label="后置拦截器" width="150px" align="center" prop="postInterceptors" />
      <el-table-column show-overflow-tooltip="true" label="调用配置" width="150px" align="center" prop="invokeConfig" />
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
          <el-button type="text" size="medium" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="text" size="medium" @click="handleDelete(row.id)">删除</el-button>
          <el-button type="text" size="medium" @click="handleUpdateStatus(row)">{{ row.status?'失效':'生效' }}</el-button>
          <el-button type="text" size="medium" @click="arrangeService(row)">编排服务</el-button>

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
    <el-dialog title="网关接口" :visible.sync="dialogCreateVisible" class="form-inline">
      <el-form ref="updateForm" :model="updateForm" label-width="20%">
        <el-form-item label="接口名称:">
          <el-input v-model="updateForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="URL:">
          <el-input v-model="updateForm.url" autocomplete="off" label="url" />
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="updateForm.type" placeholder="请选择类型">
            <el-option label="透传" value="PASS" />
            <el-option label="并发" value="CONCURRENT" />
            <el-option label="复杂" value="COMPLICATE" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicBackonForm.domains"
          :key="domain.system"
          :label="'接口后台系统:'"
        >
          <el-select ref="selectedBackon" v-model="domain.system" class="filter-item" placeholder="请选择后台系统" @change="getBackonInterfaceList($event,domain)">
            <el-option
              v-for="item in backonData"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <span style="font-weight:500">后台URL:</span>
          <el-select v-model="domain.backonUrl" placeholder="请选择后台URL">
            <el-option
              v-for="item in backonUrlData"
              :key="item.url"
              :label="item.name"
              :value="item.url"
            />
          </el-select>
          <el-button @click.prevent="addDomain()">添加</el-button>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>

        <el-form-item label="前置拦截器:">
          <el-input v-model="updateForm.preInterceptors" autocomplete="off" label="前置拦截器" />
        </el-form-item>
        <el-form-item label="后置拦截器:">
          <el-input v-model="updateForm.postInterceptors" autocomplete="off" label="后置拦截器" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(flag)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getList, deleteById, updateGatewayInterface, createGatewayInterface } from '@/api/gatewayInterface'
import { getAllSystem } from '@/api/backon'
import { getBackonInterfacesBySystem } from '@/api/backonInterface'

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
      dynamicBackonForm: {
        domains: [{
          system: '',
          backonUrl: ''
        }]
      },
      backonUrlData: [],
      backonData: [],
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
      systemData: [],
      dataShow: '',
      dialogStatus: '',
      dialogDataVisible: false
    }
  },
  created() {
    this.getList()
    this.getSystem()
  },
  methods: {

    addDomain() {
      this.dynamicBackonForm.domains.push({
        system: '',
        backonUrl: ''
      })
      this.backonUrlData = []
    },
    removeDomain(item) {
      if (this.dynamicBackonForm.domains.length <= 1) {
        return
      }
      var index = this.dynamicBackonForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicBackonForm.domains.splice(index, 1)
      }
    },

    handleDialog: function(data, status) {
      this.dataShow = data
      this.dialogStatus = status
      this.dialogDataVisible = true
    },
    getList() {
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.records
      })
    },
    getSystem() {
      getAllSystem().then(response => {
        var systems = response.data
        for (var i in systems) {
          var system = systems[i]
          this.backonData.push({ key: system, display_name: system })
        }
      })
    },
    getBackonInterfaceList(event, domain) {
      domain.backonUrl = ''
      getBackonInterfacesBySystem({ 'system': event }).then(response => {
        if (response.code === '00000000') {
          this.backonUrlData = response.data
        }
      })
    },
    handleBackonUrlSelected(event, domain) {
      console.log(event)
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
      this.updateForm = gatewayInterface
      this.flag = 'update'
      var backonList = JSON.parse(gatewayInterface.backonUrl)
      for (var i = 0; i < backonList.length; i++) {
        var domain = backonList[i]
        // var domain = this.dynamicBackonForm.domains[i]
        // domain.system = backonList[i].system
        // this.getBackonInterfaceList(backonList[i].system, this.dynamicBackonForm.domains[i])
        // this.getBackonInterfaceList(domain.system, domain)
        getBackonInterfacesBySystem({ 'system': domain.system }).then(response => {
          if (response.code === '00000000') {
            this.backonUrlData = response.data
          }
        })
        // domain.backonUrl = backonList[i].backonUrl
        this.dynamicBackonForm.domains[i] = domain
      }
    },
    handleCreateGatewayInterface() {
      this.dialogCreateVisible = true
      this.updateForm = {}
      this.flag = 'create'
      this.dynamicBackonForm.domains = [{
        system: '',
        backonUrl: ''
      }]
    },
    submitForm(flag) {
      this.dialogCreateVisible = false
      this.updateForm.backonUrl = JSON.stringify(this.dynamicBackonForm.domains)
      if (flag === 'create') {
        createGatewayInterface(this.updateForm).then(res => {
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
        updateGatewayInterface(this.updateForm).then(res => {
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
    arrangeService(gatewayInterfaceparams) {
      console.log(gatewayInterfaceparams)
      this.getUrl('/workflow/index', gatewayInterfaceparams)
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    getUrl(url, params) {
      this.$router.push({ path: url, query: params })
    }
  }
}
</script>
