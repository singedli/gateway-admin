<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { memory} from '@/api/echartTest'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      initFlag:true
    }
  },
  mounted() {
    this.$nextTick(() => {
      memory().then(res => {
          this.initChart(res)
       })
    }),
    // this.timer = setInterval(function(){
		// //执行内容
	  // }, 60000);
    setInterval(() => {
      memory().then(res => {
         this.initChart(res)
       })
    }, 30000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(res) {
      if(this.initFlag){
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['已使用内存', '未使用内存']
          },
          series: [
            {
              name: 'WEEKLY WRITE ARTICLES',
              type: 'pie',
              // roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: res.data.usedMemory, name: '已使用内存' },
                { value: res.data.freeMemory, name: '未使用内存' }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
        this.initFlag = false;res
      }else{
         this.chart.setOption({
           series: [
             {
              data: [
                { value: res.data.usedMemory, name: '已使用内存' },
                { value: res.data.freeMemory, name: '未使用内存' }
              ]
             }
           ]
         })
      }
    }
  }
}
</script>
