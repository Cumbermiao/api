<template>
  <div id="gateWay">
    <el-row>
        <el-col :span='3'><label class="required">API注册地址：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="ApiRegisterUrls.value"  placeholder='API注册地址'></el-input>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">API服务名称：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="AppName.value"  placeholder='API服务名称'></el-input>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">API服务编码：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="AppCode.value"  placeholder='API服务编码'></el-input>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span='3'><label class="required">API服务地址：</label></el-col>
        <el-col :span='21'>
            <el-input style="width:418px;" type="text" v-model.trim="ServiceUrls.value"  placeholder='API服务地址'></el-input>
        </el-col>
    </el-row>
    <div class="dialog-footer">
        <el-row>
            <el-col :push='3' >
                <el-button type='primary' @click="certain">保存</el-button>
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
      }
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
      this.UPDATE_GATEWAY(param).then(() => {
          this.searchList()
          this.$notify({
              iconClass: "gIcon iconfont icon-success bIcon",
              type: "success",
              title: "修改成功！"
            });
      }).catch(()=>{
          this.$notify({
              iconClass: "gIcon el-icon-warning  bIcon",
              type: "warning ",
              title: '修改失败！'
            });
      });
    },
    validate() {
      let text = "";
      if (!this.ApiRegisterUrls.value) {
        text = "请填写API注册地址！";
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
}
</style>
