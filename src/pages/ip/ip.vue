<template>
  <div id="ip">
      <el-row>
          <el-button class="add" type='default' @click="addIP">+新增IP白名单</el-button> 
          <el-input style="width:485px;margin-left:8px;" type="text" prefix-icon="el-icon-search" clearable v-model.trim="keywords" @change="searchIP" placeholder='请输入控制对象、IP'></el-input>
      </el-row>
      <el-row>
          <el-table :data='tableData' height='450' @filter-change='filterChange'>
              <el-table-column label='IP地址' prop='configValue'></el-table-column>
              <el-table-column label='类型' prop='configType' filter-placement='bottom' column-key='type' min-width='40px'  :filters="typeList" :filter-multiple='false'>
                  <template slot-scope="scope">
                      <span>{{typeMap.get(scope.row.configType)}}</span>
                  </template>
              </el-table-column>
              <el-table-column label='控制对象' prop='configItems' >
                  <template slot-scope="scope">
                      <el-popover placement='top-start' width='300' trigger='hover' >
                          <span v-for="item in scope.row.configItem" :key="item.wid">{{item.name}}; </span>
                          <p slot="reference" class="popover-p">
                              <span v-for="item in scope.row.configItem" :key="item.wid">{{item.name}}; </span>
                          </p>
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label='操作' width='110px'>
                  <template slot-scope="scope">
                      <div class="table-operate">
                          <span @click="toEdit(scope.row)">编辑</span>
                          |
                          <span @click="remove(scope.row)">删除</span>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
      </el-row>
      <div v-if="total>0" style="margin-top:22px">
        <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change='searchIP' :current-page.sync='pageNum'></el-pagination>
      </div>

      <!-- dialog  v-if="ipDialog"-->
      <el-dialog :visible='ipDialog' width='572px' :title="isEdit?'编辑IP白名单':'新增IP白名单'" @close='closeDialog' @before-close='closeDialog'>
          <el-row>
              <el-col :span='4'><label class="required">类型：</label></el-col>
              <el-col :span='20'>
                  <el-radio v-model="type" :disabled='isEdit' label="AllApi">全局</el-radio>
                  <el-radio v-model="type" :disabled='isEdit' label="ApiCatalog">分类</el-radio>
                  <el-radio v-model="type" :disabled='isEdit' label="SingleApi">单一</el-radio>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span='4'><label class="required">控制对象：</label></el-col>
              <el-col :span='20'>
                  <el-select v-model="ctrObj" filterable placeholder="请选择"  multiple style="width:418px;">
                        <el-option v-for="item in options" :key="item.wid" :label="item.name" :value="item.wid">
                        </el-option>
                  </el-select>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span='4'><label class="required">IP：</label></el-col>
              <el-col :span='20'>
                  <el-input style="width:418px;" type="text" v-model.trim="ip"  placeholder='请输入IP'></el-input>
              </el-col>
          </el-row>
          <div class="dialog-footer">
              <el-button type='text' @click="cancel">取消</el-button>
              <el-button type='primary' @click="certain">确定</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
export default {
  data() {
    return {
      keywords: "",
      typeMap: new Map([
        ["AllApi", "全局"],
        ["ApiCatalog", "分类"],
        ["SingleApi", "单一"]
      ]),
      typeList: [
        { text: "全局", value: "AllApi" },
        { text: "分类", value: "ApiCatalog" },
        { text: "单一", value: "SingleApi" }
      ],
      tableData: [],
      total: 12,
      pageNum: 1,
      pageSize: 10,
      ipDialog: false,
      isEdit: false,
      type: "AllApi",
      options: [],
      ctrObj: [],
      ctrMap: null,
      currentIP: null,
      ip: "",
      filterType: "", //表格类型过滤的值
    };
  },
  watch: {
    type() {
      if (!this.isEdit) {
        this.ctrObj = [];
      }
      this.searchCtrl();
    }
  },
  methods: {
    ...mapActions([
      "FOR_CONTROL_LIST",
      "ADD_WHITE_IP",
      "FOR_IP_LIST",
      "REMOVE_WHITE_IP",
      "UPDATE_WHITE_IP"
    ]),
    searchIP() {
      this.FOR_IP_LIST({
        configName: "WhiteIp",
        keyword: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        configType: this.filterType
      }).then(obj => {
        this.tableData = obj.dataSet;
        this.tableData.forEach((item)=>{
          item.configItem = JSON.parse(item.configItem)
        })
        this.pageNum = obj.pageInfo.pageNum;
        this.total = obj.pageInfo.total;
      });
    },
    filterChange(obj) {
      this.filterType = obj.type[0];
      this.searchIP();
    },
    addIP() {
      this.ipDialog = true;
      this.isEdit = false;
      this.type = "AllApi";
      this.ctrObj = [];
      this.ip = "";
    },
    toEdit(obj) {
      this.currentIP = obj;
      let controls =obj.configItem;
      this.type = obj.configType;
      this.ctrObj = [];
      controls.forEach(item => {
        this.ctrObj.push(item.wid - 0);
      });
      this.ip = obj.configValue;
      this.isEdit = true;
      this.ipDialog = true;
    },
    //删除白名单
    remove(obj) {
      this.REMOVE_WHITE_IP([obj.wid])
        .then(() => {
          this.searchIP();
          this.$notify({
            iconClass: "gIcon iconfont icon-success bIcon",
            type: "success",
            title: "删除成功!"
          });
        })
        .catch(msg => {
          this.$notify({
            iconClass: "gIcon el-icon-warning bIcon",
            type: "warning",
            title: "删除失败!"
          });
        });
    },
    cancel() {
      this.closeDialog();
    },
    certain() {
      let param = [];
      let configItem = [];
      this.ctrObj.forEach(item => {
        configItem.push({
          wid: item,
          name: this.ctrMap.get(item)
        });
      });
      param = {
        configName: "WhiteIp",
        configType: this.type,
        configValue: this.ip,
        configItem: JSON.stringify(configItem),
        wid: this.isEdit ? this.currentIP.wid : ""
      };
      let successText = !this.isEdit ? "新增成功!" : "修改成功!";
      let failText = !this.isEdit ? "新增失败!" : "修改失败!";
      if (!this.isEdit) {
        this.ADD_WHITE_IP(param)
          .then(() => {
            this.closeDialog();
            this.searchIP();
            this.$notify({
              iconClass: "gIcon iconfont icon-success bIcon",
              type: "success",
              title: successText
            });
          })
          .catch(msg => {
            this.$notify({
              iconClass: "yIcon el-icon-warning bIcon",
              type: "warning",
              title: failText
            });
          });
      } else {
        this.UPDATE_WHITE_IP([param])
          .then(() => {
            this.closeDialog();
            this.searchIP();
            this.$notify({
              iconClass: "gIcon iconfont icon-success bIcon",
              type: "success",
              title: successText
            });
          })
          .catch(msg => {
            this.$notify({
              iconClass: "yIcon el-icon-warning bIcon",
              type: "warning",
              title: failText
            });
          });
      }
    },
    searchCtrl() {
      this.FOR_CONTROL_LIST({ type: this.type }).then(arr => {
        this.options = arr;
        this.ctrMap = new Map();
        this.options.forEach(item => {
          this.ctrMap.set(item.wid, item.name);
        });
      });
    },
    closeDialog() {
      this.ipDialog = false;
      this.isEdit = false;
      this.currentIP = null;
    }
  },
  created() {
    this.searchCtrl();
    this.searchIP();
  }
};
</script>
<style lang="less" scoped>
#ip {
  padding: 32px 18px;
  background: #fff;
  height: calc(~"100vh - 100px");
  .add {
    width: 110px;
    color: #35dbc4;
    border-color: #35dbc4;
  }
  .table-operate {
    color: #04a9f5;
    span {
      cursor: pointer;
    }
  }
  .el-row + .el-row {
    margin-top: 17px;
  }
  label {
    line-height: 36px;
  }
}
</style>
