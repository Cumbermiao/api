<template>
  <div id="log">
      <section class="treeList">
          <el-tree :data="tree" :highlight-current='true' style="height:calc(100vh - 200px)" :props="defaultProps" @node-click="nodeClick">
          </el-tree>
      </section><section class="log-main">
            <el-input type="text" style="width:256px;" prefix-icon="el-icon-search"  v-model="keywords" clearable @change="searchLog" placeholder='请输入中文名或者名称'>
            </el-input>
            <el-date-picker style="vertical-align:bottom;margin-left:8px;" v-model="dateRange" @change='dateChange' type="daterange" value-format='yyyy-MM-dd' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

            <el-table :data='tableData' style="margin-top:14px;" height='550'  @filter-change='filterChange'>
              <el-table-column label='中文名' prop='apiNameCn'></el-table-column>
              <el-table-column label='名称' prop='apiName'></el-table-column>
              <el-table-column label='数据操作类型' prop='operateType' :filters="operateTypeList" column-key='operateType' filter-placement='bottom' :filter-multiple='false'>
                <template slot-scope="scope">
                  <span>{{scope.row.operateType=='Read'?'读取':'写入'}}</span>
                </template>
              </el-table-column><!-- :filter-method="dataTypeFilter"   :filter-method="logicTypeFilter"-->
              <el-table-column label='逻辑类型' prop='intfLogicType' :filters="logicTypeList" column-key='logicType' filter-placement='bottom' :filter-multiple='false' ></el-table-column>
              <el-table-column label='总次数' prop='calls'>
                  <template slot-scope="scope">
                  <span class="underline bColor" @click="toDetail(null,scope.row)">{{scope.row.calls}}</span>
                </template>
              </el-table-column>
              <el-table-column label='成功次数' prop='successes' >
                <template slot-scope="scope">
                  <span class="underline bColor" @click="toDetail('1',scope.row)">{{scope.row.successes}}</span>
                </template>
              </el-table-column>
              <el-table-column label='失败次数' prop='errors'>
                <template slot-scope="scope">
                  <span class="underline yColor" @click="toDetail('0',scope.row)">{{scope.row.errors}}</span>
                </template>
              </el-table-column>
              <el-table-column label='行数' prop='userOrUpdateRate' width='140px'>
              <template slot-scope="scope">
                  <span >{{scope.row.useOrUpdateRows}}</span>
                </template>
              </el-table-column>
          </el-table>
          <div style="margin-top:22px" v-if="total>0">
              <el-pagination background layout="prev, pager, next" :current-page='pageNum' :page-size='10' :total="total"></el-pagination>
          </div>
      </section>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      keywords: "",
      dateRange: [],
      tableData: [],
      tree: null,
      currentId: null,//当前分类id
      pageNum: 1,
      pageSize: 10,
      total:0,
      currentApiId: null,
      //数据操作类型
      operateTypeList: [
        { text: "读取", value: "Read" },
        { text: "写入", value: "Write" }
      ],
      //逻辑类型
      logicTypeList: [
        { text: "SQL", value: "SQL" },
        { text: "JavaScript", value: "JavaScript" },
        // { text: "Jar", value: "Jar" }
      ],
      operateType:'All',
      logicType:'All'

    };
  },
  computed: {
    startTime() {
      return this.dateRange[0] ? (this.dateRange[0]+' 00:00:00') : "";
    },
    endTime() {
      return this.dateRange[1] ? (this.dateRange[1]+' 23:59:59'): "";
    }
  },
  methods: {
    ...mapActions(["FOR_TREE", "FOR_LOG_LIST"]),
    nodeClick(data, node) {
      this.currentId = data.id;
      this.$store.commit("SetCurrentCataId", data.id);
      if (!data.children) {
        this.searchLog();
      }
    },
    getTree() {
      this.FOR_TREE("Api").then(obj => {
        this.tree = obj.children;
      });
    },
    filterChange(obj) {
      if (obj.operateType && obj.operateType.length) {
        this.operateType = obj.operateType[0];
      } else if (obj.operateType && !obj.operateType.length) {
        this.operateType = "All";
      }
      if (obj.logicType && obj.logicType.length) {
        this.logicType = obj.logicType[0];
      } else if (obj.logicType && !obj.logicType.length) {
        this.logicType = "All";
      }

      this.searchLog();
    },
    searchLog() {
      if (!this.currentId) {
        this.$confirm("", "请选择呢API分类！", {
          type: "warning"
        });
      } else {
        let obj = {
          catalogWid: this.currentId,
          keyword: this.keywords,
          endTime: this.endTime,
          startTime: this.startTime,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          logicType:this.logicType,
          operateType:this.operateType
        };
        this.FOR_LOG_LIST(obj).then(obj => {
          this.tableData = obj.dataSet;
          this.total = obj.pageInfo.total-0
          this.pageNum = obj.pageInfo.pageNum-0
        });
      }
    },
    toDetail(status, obj) {
      this.$store.commit("setLogCurrentApi", obj);
      router.push({
        path: "/log/detail",
        query: {
          status,
          apiId: obj.apiWid,
          cataId:this.currentId,
          keyword: this.keywords,
          startTime: this.startTime,
          endTime: this.endTime
        }
      });
    },
    dateChange() {
      this.searchLog()
    }
  },
  created() {
    this.getTree();
  }
};
</script>
<style lang="less">
#log {
  section {
    height: calc(~"100vh - 100px");
    display: inline-block;
    background: #fff;
    vertical-align: top;
  }
  .treeList {
    width: 247px;
    .el-tree-node__content {
      height: 42px;
    }
  }
  .log-main {
    width: calc(~"100vw - 305px");
    margin-left: 8px;
    padding: 20px;
  }
  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
  .yColor {
    color: #f4c22b;
  }
  .bColor {
    color: #04a9f5;
  }
}
</style>
