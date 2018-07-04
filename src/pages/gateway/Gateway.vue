<template>
  <div id="gateWay">
    <el-row>
        <el-col :span='3'><label class="required">ESOP管理控制台地址：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="ApiRegisterUrls.value"  placeholder='ESOP管理控制台地址'></el-input>
            <span class="desc">
              ESOP管理控制台的根地址，形如：http://ip:port/esop_manager_name
            </span>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">服务名称：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="AppName.value"  placeholder='API服务名称'></el-input>
            <span class="desc">
             在ESOP中显示的服务名称，例如：主数据API即为主数据。
            </span>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">服务编码：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="AppCode.value"  placeholder='API服务编码'></el-input>
            <span class="desc">
              在ESOP中的服务编码，例如：主数据为ZSJ
            </span>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">服务地址：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="ServiceUrls.value"  placeholder='API服务地址，多个地址以逗号隔开'></el-input>
            <span class="desc">
              主数据API的服务地址，即API所在服务的根地址，形如：http://ip:port/server_name
            </span>
        </el-col>
    </el-row>
    <div class="dialog-footer">
        <el-row>
            <el-col :push='3' :span='21' >
                <el-button type='primary' @click="certain" :disabled='isDisabled'>保存</el-button>
            </el-col>
        </el-row>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      ApiRegisterUrls: {
        value: "",
        wid: "ApiRegisterUrls",
        configWid: ""
      },
      AppName: {
        value: "",
        wid: "AppName",
        configWid: ""
      },
      AppCode: {
        value: "",
        wid: "AppCode",
        configWid: ""
      },
      ServiceUrls: {
        value: "",
        wid: "ServiceUrls",
        configWid: ""
      },
      timer: null,
      isDisabled: false
    };
  },
  methods: {
    ...mapActions(["FOR_GATEWAY", "UPDATE_GATEWAY"]),
    searchList() {
      this.FOR_GATEWAY({ configName: "EsopRegister" }).then(arr => {
        arr.forEach(item => {
          switch (item.configItem) {
            case "ApiRegisterUrls":
              this.ApiRegisterUrls.value = item.configValue;
              this.ApiRegisterUrls.configWid = item.wid;
              break;
            case "AppName":
              this.AppName.value = item.configValue;
              this.AppName.configWid = item.wid;
              break;
            case "AppCode":
              this.AppCode.value = item.configValue;
              this.AppCode.configWid = item.wid;
              break;
            case "ServiceUrls":
              this.ServiceUrls.value = item.configValue;
              this.ServiceUrls.configWid = item.wid;
              break;
          }
        });
      });
    },
    certain() {
      let text = this.validate();
      if (text) {
        this.$confirm(text, "", {
          type: "warning",
          showCancelButton: false
        });
        return;
      }
      let param = [
        {
          // configName:'EsopRegister',
          configValue: this.ApiRegisterUrls.value,
          wid: this.ApiRegisterUrls.configWid
        },
        {
          // configName:'EsopRegister',
          configValue: this.AppName.value,
          wid: this.AppName.configWid
        },
        {
          // configName:'EsopRegister',
          configValue: this.AppCode.value,
          wid: this.AppCode.configWid
        },
        {
          // configName:'EsopRegister',
          configValue: this.ServiceUrls.value,
          wid: this.ServiceUrls.configWid
        }
      ];
      this.UPDATE_GATEWAY(param)
        .then(() => {
          this.searchList();
          this.$notify({
            iconClass: "gIcon iconfont icon-success bIcon",
            type: "success",
            title: "修改成功！",
            duration: 2000
          });
        })
        .catch(() => {
          this.$notify({
            iconClass: "gIcon el-icon-warning  bIcon",
            type: "warning ",
            title: "修改失败！",
            duration: 2000
          });
        });
      this.isDisabled = true;
      this.timer = setTimeout(() => {
        this.isDisabled = false;
        clearTimeout(this.timer);
      }, 2000);
    },
    validate() {
      let text = "";
      if (!this.ApiRegisterUrls.value) {
        text = "请填写API网关地址！";
      } else if (!this.AppName.value) {
        text = "请填写API服务名称！";
      } else if (!this.AppCode.value) {
        text = "请填写API服务编码！";
      } else if (!this.ServiceUrls.value) {
        text = "请填写API服务地址！";
      }
      return text;
    }
  },
  created() {
    this.searchList();
  }
};
</script>
<style lang='less' scoped>
#gateWay {
  height: calc(~"100vh - 100px");
  padding: 32px 18px;
  background: #fff;
  .el-row + .el-row {
    margin-top: 17px;
  }
  label {
    line-height: 36px;
  }
  .dialog-footer {
    text-align: left;
  }
  .desc{
    font-size: 13px;
    color:#bbb;
  }
}
</style>
