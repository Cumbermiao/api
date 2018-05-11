<template>
  <div id="bar" class="clearfix">
      <ul class="clearfix">
          <li v-for="(item,index) in list" :key="index"  >
            <keep-alive><router-link tag="div" :to="item.path" v-text="item.name"></router-link></keep-alive>
          </li>
      </ul>
      <strong class="Medium">数据共享接口</strong>
  </div>
</template>
<script>
import router from '@/router'
export default {
  data() {
    return {
      list: [
        { name: "API配置", path: "/config" },
        { name: "API调用日志", path: "/log" },
        { name: "IP白名单", path: "/ip" },
        { name: "网关地址配置", path: "/gateway" },
      ]
    };
  },
};
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
    font-size: 16px;
    &:hover {
      cursor: pointer;
    }
    &.active {
      border-bottom: 2px solid #17d8c6;
      color: #17d8c6;
    }
  }

  strong {
    font-size: 22px;
  }
}
</style>
