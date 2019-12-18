<template>
  <el-container>
    <el-header>
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="addStart">添加开始节点</el-button>
          <el-button @click="openAddStartDialog">添加接口调用任务</el-button>
          <el-button @click="openAddConverterDialog">添加参数转换任务</el-button>
          <el-button @click="addEnd">添加结束节点</el-button>
          <el-button @click="save">保存配置</el-button>
        </el-form-item>
      </el-form>

    </el-header>
    <el-main>
      <v-g-editor ref="vgEditor">
        <flow :data="data" :graph="{width: 1440}" />
      </v-g-editor>
    </el-main>
    <el-dialog ref="@/views/backonInterface/index" :visible.sync="showQueryBackonInterfaceDialog" width="80%">
      <backonInterface :showcheckedcol="true" @selectedInterface="dismissDialog" />
    </el-dialog>

    <el-dialog ref="@/views/jsonConverter/index" :visible.sync="showQueryJsonConverterDialog" width="80%">
      <jsonConverter :showcheckedcol="true" @selectedConverter="dismissConverterDialog" />
    </el-dialog>
  </el-container>

</template>
<script>
import VGEditor, { Flow } from 'vg-editor'
import backonInterface from '@/views/backonInterface/index'
import jsonConverter from '@/views/messageConverter/index'
import { addServiceArrange } from '@/api/serviceArrange'
// import { getGatewayInterfaceById } from '@/api/gatewayInterface'

const successCode = '00000000'
export default {
  inject: ['reload'],
  components: { VGEditor, Flow, backonInterface, jsonConverter },
  data() {
    return {
      routerParams: {},
      showQueryBackonInterfaceDialog: false,
      showQueryJsonConverterDialog: false,
      stateMachineJson: {},
      data: {
        index: 0,
        nodes: [
          {
            type: 'node',
            size: '80*80',
            shape: 'flow-circle',
            color: '#FA8C16',
            label: '开始节点',
            x: 648,
            y: 55,
            id: '0000000000',
            index: 0
          }
        ],
        edges: []
      }
    }
  },
  created() {
    var flowConfig = JSON.parse(this.$route.query.flowConfig)
    this.data.nodes = flowConfig.nodes
    this.data.edges = flowConfig.edges
  },
  methods: {
    openAddStartDialog() {
      this.showQueryBackonInterfaceDialog = true
    },
    openAddConverterDialog() {
      this.showQueryJsonConverterDialog = true
    },
    addStart() {
      if (this.$refs.vgEditor.propsAPI.find('0000000000')) {
        this.$message.error('已存在开始节点，不能重复添加！')
        return
      }
      var node = {
        type: 'node',
        size: '80*80',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '开始节点',
        x: 648,
        y: this.getNewNodeYAxis(),
        id: '0000000000',
        index: ++this.index
      }
      this.$refs.vgEditor.propsAPI.add('node', node)
    },
    addEnd() {
      if (this.$refs.vgEditor.propsAPI.find('1111111111')) {
        this.$message.error('已存在结束节点，不能重复添加！')
        return
      }
      var node = {
        type: 'node',
        size: '80*80',
        shape: 'flow-circle',
        color: '#67C23A',
        label: '结束节点',
        x: 100,
        y: this.getNewNodeYAxis(),
        id: '1111111111',
        index: ++this.index
      }
      this.$refs.vgEditor.propsAPI.add('node', node)
    },
    // addTask() {
    //   var node = {
    //     type: 'node',
    //     size: '180*80',
    //     shape: 'flow-rect',
    //     color: '#FA8C16',
    //     label: '起止节点',
    //     x: 100,
    //     y: this.getNewNodeYAxis(),
    //     id: this.uuid(),
    //     index: ++this.index
    //   }
    //   this.$refs.vgEditor.propsAPI.add('node', node)
    // },
    // addConverter() {
    //   var node = {
    //     type: 'node',
    //     size: '180*80',
    //     shape: 'flow-rect',
    //     color: '#409EFF',
    //     label: '结束节点',
    //     x: 100,
    //     y: this.getNewNodeYAxis(),
    //     id: this.uuid(),
    //     index: ++this.index
    //   }
    //   this.$refs.vgEditor.propsAPI.add('node', node)
    // },
    save() {
      var saveParams = {
        nodes: this.getDataNodes(),
        edges: this.$refs.vgEditor.propsAPI.save().edges,
        gatewayInterface: this.$route.query
      }
      console.log(JSON.stringify(saveParams))
      addServiceArrange(saveParams).then((response) => {
        if (response.code === successCode) {
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    uuid() {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      var uuid = []
      var radix = 64 || chars.length
      for (var i = 0; i < 10; i++) uuid[i] = chars[0 | Math.random() * radix]

      return uuid.join('')
    },
    getDataNodes() {
      return this.$refs.vgEditor.propsAPI.save().nodes
    },
    getNewNodeYAxis() {
      return this.getDataNodes()[this.getDataNodes().length - 1].y
    },
    getRouterParams() {
      this.routerParams = this.$route.query
    },
    dismissDialog(item) {
      item.type = 'task'
      this.showQueryBackonInterfaceDialog = false

      var node = {
        type: 'node',
        size: '200*80',
        shape: 'flow-rect',
        color: '#FA8C16',
        label: '调用' + item.system + '系统的\n' + item.url + '接口',
        x: 120,
        y: this.getNewNodeYAxis(),
        id: item.id,
        index: ++this.index,
        stateType: 'task'
      }

      this.$refs.vgEditor.propsAPI.add('node', node)
    },
    dismissConverterDialog(item) {
      item.type = 'converter'
      this.showQueryJsonConverterDialog = false
      console.log(item)
      var node = {
        type: 'node',
        size: '200*80',
        shape: 'flow-rect',
        color: '#FA8C16',
        label: item.name,
        x: 120,
        y: this.getNewNodeYAxis(),
        id: item.id,
        index: ++this.index,
        stateType: 'converter'
      }
      this.$refs.vgEditor.propsAPI.add('node', node)
    }

  }
}
</script>
<style>
.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height:800px;
  }

  .el-header {
     background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height:1;
  }
</style>
