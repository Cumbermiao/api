<template>
  <div id="logDetail">
      <p><router-link tag="span" to="/log" class="bread-span" >API调用日志</router-link>  >  API名称（{{statusText}}）</p>
        <div class="content">
            <el-input type="text" style="width:256px;" prefix-icon="el-icon-search" clearable v-model="keywords" @change="searchLogDetail" placeholder='请输入调用者、调用IP、入参信息'>
            </el-input><el-date-picker style="vertical-align:bottom;margin-left:8px;" value-format='yyyy-MM-dd' v-model="dateRange" @change='dateChange' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-table :data='tableData' style="margin-top:14px;">
              <el-table-column label='调用者' prop='caller'></el-table-column>
              <el-table-column label='调用时间' prop='logDate' ></el-table-column>
              <el-table-column label='调用IP' prop='clientIp'>
                  <template slot-scope="scope">
                  <span class="underline bColor">{{scope.row.clientIp}}</span>
                </template>
              </el-table-column>
              <el-table-column label='结果描述' prop='resultDesc' >
                <template slot-scope="scope">
                  <el-popover placement='top-start' width='300' trigger='hover' :content='scope.row.resultDesc'>
                      <p slot="reference" class="popover-p" v-text="scope.row.resultDesc"></p>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label='输入参数' prop='inputParam'>
                <template slot-scope="scope">
                  <el-popover placement='top-start'  trigger='hover' :content='scope.row.inputParam'>
                      <p slot="reference" class="popover-p" v-text="scope.row.inputParam"></p>
                  </el-popover>
                </template>
              </el-table-column>
                <el-table-column label='执行逻辑' prop='intfLogicContent'>
                <template slot-scope="scope">
                  <el-popover placement='top-start'  trigger='hover' :content='scope.row.intfLogicContent'>
                      <p slot="reference" class="popover-p" v-text="scope.row.intfLogicContent"></p>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- <el-table-column label='下载' prop='' width='50px'>
              </el-table-column> -->
          </el-table>
          <div style="margin-top:22px" v-if="total>0">
              <el-pagination background layout="prev, pager, next" :current-page.sync='pageNum' :page-size='10' :total="total" @current-change='searchLogDetail'></el-pagination>
          </div>
        </div>
  </div>
</template>
<script>
import router from "@/router";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      keywords: "",
      dateRange: [],
      tableData: [],
      status: "",
      currentApiId: null,
      currentCataId: null,
      pageSize: 10,
      pageNum: 1,
      total: 10,
      statusText: ""
    };
  },
  computed: {
    startTime() {
      return this.dateRange[0] ? this.dateRange[0] + " 00:00:00" : null;
    },
    endTime() {
      return this.dateRange[1] ? this.dateRange[1] + " 23:59:59" : null;
    }
  },
  methods: {
    ...mapActions(["FOR_LOG_DETAIL"]),
    dateChange() {
      this.searchLogDetail();
    },
    searchLogDetail() {
      this.FOR_LOG_DETAIL({
        catalogWid: this.currentCataId,
        apiWid: this.currentApiId,
        keyword: this.keywords,
        endTime: this.endTime,
        startTime: this.startTime,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        resultCode: this.status
      }).then(obj => {
        this.tableData = obj.dataSet;
        this.total = obj.pageInfo.total - 0;
        this.pageNum = obj.pageInfo.pageNum - 0;
      });
    }
  },

  created() {
    switch (this.$route.query.status) {
      case null:
        this.statusText = "总次数";
        this.status = null
        break;
      case "1":
        this.statusText = "成功次数";
        this.status = '1'
        break;
      case "0":
        this.statusText = "失败次数";
        this.status = '0'        
        break;
    }
    if (!this.$route.query.apiId) {
      this.$confirm("", "请选择API", {
        type: "warning"
      });
      router.push("/log");
    } else {
      this.keywords = this.$route.query.keyword;
      this.currentCataId = this.$route.query.cataId;
      this.currentApiId = this.$route.query.apiId;
      this.dateRange.push(
        this.$route.query.startTime.length > 0
          ? this.$route.query.startTime.slice(0, 10)
          : ""
      );
      this.dateRange.push(
        this.$route.query.endTime.length > 0
          ? this.$route.query.endTime.slice(0, 10)
          : ""
      );
      if(this.dateRange[0]==""&&this.dateRange[1]==""){
        this.dateRange = []
      }
      this.searchLogDetail();
    }
  }
};
</script>
<style lang='less' scoped>
#logDetail {
  & > p {
    padding-bottom: 14px;
    span {
      cursor: pointer;
    }
  }
  .content {
    padding: 36px;
    background: #fff;
  }
}
</style>
