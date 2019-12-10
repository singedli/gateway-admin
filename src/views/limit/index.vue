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
          <el-input v-model="updateForm.keyLimit" autocomplete="off" label="需验证请求key" />
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

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getList,updateInterfaceConfig,queryByCondition,deleteById,createInterfaceConfig} from '@/api/limit'
import Pagination from '@/components/Pagination'

const calendarTypeOptions = [
  { key: 1, display_name: '生效' },
  { key: 0, display_name: '失效' }
]

export default {
  name: 'ComplexTable',
  directives: { waves },
  components: { Pagination },
  filters: {

  },
 data() {
    return {
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
    getUrl(url) {
      this.$router.push({ path: url })
    }
  }
}
</script>
