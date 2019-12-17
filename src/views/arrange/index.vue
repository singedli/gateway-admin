<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-form :inline="true" class="demo-form-inline">
        <el-button type="primary" @click="addTask">添加服务</el-button>
        <el-button type="primary" @click="addConverter">添加转换器</el-button>
      </el-form>
    </el-row>
    <el-row :gutter="12">
      <div v-for="(task,index) in tasks" :key="task.id" @click="handleClick">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ task.type }}</span>
              <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
            </div>
            <div class="text item">
              <div>接口名:  {{ task.name }}</div>
              <div>接口url:  {{ task.url }}</div>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>

    <el-dialog ref="@/views/backonInterface/index" :visible.sync="showQueryBackonInterfaceDialog" width="80%">
      <backonInterface :showcheckedcol="true" @selectedInterface="dismissDialog" />
    </el-dialog>

    <el-dialog ref="@/views/jsonConverter/index" :visible.sync="showQueryJsonConverterDialog" width="80%">
      <jsonConverter :showcheckedcol="true" @selectedConverter="dismissConverterDialog" />
    </el-dialog>
  </div>
</template>
<script>
import backonInterface from '@/views/backonInterface/index'
import jsonConverter from '@/views/messageConverter/index'
export default {
  components: {
    backonInterface, jsonConverter
  },
  data() {
    return {
      routerParams: {},
      taskForm: {},
      tasks: [],
      showQueryBackonInterfaceDialog: false,
      showQueryJsonConverterDialog: false,
      stateMachineJson: {}
    }
  },
  created() {
    this.getRouterParams()
  },
  methods: {
    getRouterParams() {
      console.log(this.$route)
      this.routerParams = this.$route.query
      this.stateMachineJson = {
        Name: this.routerParams.url + 'StateMachine',
        Comment: this.routerParams.name + '的状态机',
        StartState: '',
        Version: '0.0.2',
        States: {},
        Succeed: {
          Type: 'Succeed'
        }
      }
      console.log(this.stateMachineJson)
    },
    addTask() {
      this.showQueryBackonInterfaceDialog = true
    },
    addConverter() {
      this.showQueryJsonConverterDialog = true
    },
    handleClick() {
    },
    dismissDialog(item) {
      item.type = 'task'
      this.tasks.push(item)
      this.showQueryBackonInterfaceDialog = false
      // 遍历列表判断当前元素在数组中是否已经存在
      console.log(this.tasks)
      console.log(JSON.stringify(this.tasks))
      console.log(JSON.stringify(this.routerParams))
    },
    dismissConverterDialog(item) {
      item.type = 'converter'
      console.log(item)
      this.tasks.push(item)
      this.showQueryJsonConverterDialog = false
      console.log(JSON.stringify(this.tasks))
      console.log(JSON.stringify(this.routerParams))
    }
  }
}
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 320px;
    height:200px;
  }
</style>
