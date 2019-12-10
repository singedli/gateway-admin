<template>
  <div class="app-container">
    <iframe id="stateMachineDesigner" src="stateMachineDesigner.html" scrolling="no" style="width: 100%;" frameborder="0" />
  </div>
</template>
<script>
export default {
  mounted() {
    const oIframe = document.getElementById('stateMachineDesigner')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = (Number(deviceWidth) - 220) + 'px' // 数字是页面布局宽度差值
    oIframe.style.height = (Number(deviceHeight) - 120) + 'px' // 数字是页面布局高度差
  }
}

</script>
