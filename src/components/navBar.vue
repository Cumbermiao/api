<template>
  <div id="bar" class="clearfix">
      <ul class="clearfix">
          <li>API配置</li>
          <li>API调用日志</li>
          <li>IP白名单</li>
          <li>网管地址配置</li>
      </ul>
      <strong class="Medium">数据共享接口</strong>
  </div>
</template>
<script>
export default {};
</script>
<style scoped lang='less'>
#bar {
  height: 60px;
  line-height: 60px;
  padding: 0 23px;
  ul {
    float: right;
  }
  li {
    float: left;
    margin-left: 50px;
    font-size:16px;
    &:hover {
      border-bottom: 2px solid #17D8C6 ;
      color:#17D8C6 ;
      font-family: Medium;
      cursor: pointer;
    }
  }
  strong {
    font-size: 22px;
  }
}
</style>
