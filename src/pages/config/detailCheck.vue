<template>
  <div class="apiDetail">
    <p style="margin-bottom:16px;"> <router-link tag="span" class="bread-span" to="/config">API配置</router-link> > API详情</p>
      <div class="content">
          <div class="baseInfo">
            <p class="Medium">API基本信息
                <el-button type='primary' style="float:right" @click="toEdit">编辑模式</el-button>
            </p>
            <el-row>
                <el-col :span='3'><label class="apiDetail-title">名称：</label></el-col>
                <span class="desc">{{currentApi.intfName}}</span>
            </el-row>

            <el-row>
                <el-col :span='3'><label class="apiDetail-title">接口地址：</label></el-col>
                <span class="desc">{{currentApi.intfUrl?currentApi.intfUrl:''}}</span>
            </el-row>
            <el-row>
                <el-col :span='3'><label class="apiDetail-title">数据源：</label></el-col>
                <span class="desc">{{mapDataSourceList.get(currentApi.resourceWid+'')}}</span>
            </el-row>   
            <el-row>
                <el-col :span='3'><label class="apiDetail-title">逻辑类型：</label></el-col>
                <span class="desc">{{currentApi.intfLogicType}}</span>
            </el-row>
            <el-row>
                <el-col :span='3'><label class="apiDetail-title">数据操作类型：</label></el-col>
                <span class="desc">{{currentApi.operateType=='Read'?'读取':'写入'}}</span>
            </el-row>
            <el-row>
                <el-col :span='3'><label class="apiDetail-title">逻辑内容：</label></el-col>
                <el-col :span='21'><span class="desc">{{currentApi.intfLogicContent}}</span></el-col>
            </el-row>  
          </div>
          <hr>
          <div class="baseInfo"> 
              <p class="Medium">API基本信息</p>
              <el-row>
                  <p class="api-info-title"> 具体入参属性:</p>
                  <!-- :data='JSON.parse(currentApi.intfInParams)' -->
                  <el-table  max-height='300' :data='JSON.parse(currentApi.intfInParams)' style="margin-top:19px;">
                      <el-table-column prop='paramName' label='参数名称'></el-table-column>
                      <el-table-column prop='paramDesc' label='参数描述'></el-table-column>                      
                      <el-table-column prop='dataType' label='参数类型'></el-table-column>
                      <el-table-column prop='need' label='是否必填'></el-table-column>
                      <el-table-column prop='regex' label='校验正则'> </el-table-column>
                  </el-table>
              </el-row>
              <el-row style="margin-top:35px">
                  <p class="api-info-title"> 具体出参属性:</p>
                  <el-table :data='JSON.parse(currentApi.intfOutParams)' style="margin-top:19px;" max-height='500'>
                      <el-table-column prop='paramName' label='参数名称'></el-table-column>
                      <el-table-column prop='paramDesc' label='参数描述'></el-table-column>                      
                      <el-table-column prop='dataType' label='参数类型'></el-table-column>
                  </el-table>
              </el-row>
          </div>
      </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import router from '@/router'
export default {
  data() {
    return {
      table: [
        {
          paramName: "cs1",
          paramDesc: "cs1desc",
          dataType: "String",
          need: true,
          regex: "regex"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      currentApi: state => state.config.currentApi,
      dataSourceList: state => state.config.dataSourceList
    }),
    mapDataSourceList() {
      let map = new Map();
      if (this.dataSourceList) {
        this.dataSourceList.forEach(item => {
          map.set(item.wid, item.zcxtzwm);
        });
      }
      return map;
    }
  },
  methods: {
    ...mapActions(["FOR_DATASOURCE"]),
    toEdit() {
      router.push({path:'/config/detail',query:{edit:'edit'}});
    }
  },
  created() {
    if (!this.dataSourceList) {
      this.FOR_DATASOURCE();
    }
  },
  mounted() {
    if (!this.currentApi) {
      this.$confirm("", {
        title: "请选择API！",
        showCancelButton: false
      }).then(() => {
        this.$router.push("/config");
      });
    }
  }
};
</script>
<style scoped lang='less'>
.apiDetail {
  .content {
    padding: 36px;
    background: #fff;
  }

  .baseInfo {
    padding-bottom: 36px;
    & > p {
      font-size: 20px;
    }
    .el-row {
      margin-top: 20px;
    }
  }
  .api-info-title {
    font-size: 16px;
    &::before {
      content: "";
      display: inline-block;
      width: 2px;
      height: 20px;
      background: #35dbc4;
      position: relative;
      left: -10px;
      vertical-align: middle;
    }
  }
  .desc,.apiDetail-title{
    line-height: 16px;
  }
  p + p {
    margin-top: 12px;
  }
}
</style>
