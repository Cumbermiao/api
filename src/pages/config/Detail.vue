<template>
  <div class="apiDetail">
      <p style="margin-bottom:16px;"> <router-link tag="span" class="bread-span" to="/config">API配置</router-link> > {{isEdit?'API编辑':'API新增'}}</p>
      <div class="content">
        <div class="baseInfo">
          <p class="Medium">API基本信息</p>
          <el-row>
              <el-col :span='3'><label class="required">名称:</label></el-col>
              <el-col :span='8'>
                  <el-input v-model="name"></el-input>
              </el-col>
              <el-col :span='3' :push='1'><label class="required">中文名称:</label></el-col>
              <el-col :span='9' :push='1'>
                  <el-input v-model="nameCn"></el-input>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span='3'><label class="required">接口描述:</label></el-col>
              <el-col :span='21'>
                  <el-input v-model="desc"></el-input>
              </el-col>
          </el-row>
          <!-- <el-row>
              <el-col :span='3'><label class="required">接口地址:</label></el-col>
              <el-col :span='21'>
                  <el-input v-model="address"></el-input>
              </el-col>
          </el-row> -->

          <el-row>
              <el-col :span='3'><label class="required">数据源:</label></el-col>
              <el-col :span='8'>
                  <el-select v-model="dSourceWid" placeholder="请选择" >
                    <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
              </el-col>
              <el-col :span='3' :push='1'><label class="required">数据操作类型:</label></el-col>
              <el-col :span='9' :push='1'>
                  <el-radio v-model="operateType" label="Read">读取</el-radio>
                  <el-radio v-model="operateType" label="Write">写入</el-radio>
              </el-col>
          </el-row>

          <el-row>
              <el-col :span='3'><label class="required">逻辑类型:</label></el-col>
              <el-col :span='8'>
                  <el-radio v-model="logicType" label="SQL">SQL</el-radio>
                  <el-radio v-model="logicType" label="JavaScript">JavaScript</el-radio>
                  <!-- <el-radio v-model="logicType" label="Jar">Jar</el-radio> -->
              </el-col>
          </el-row>

          <el-row>
              <el-col :span='3' ><label class="required">逻辑内容:</label></el-col>
              <!-- sql -->
              <el-col :span='12' v-if="logicType=='SQL'">
                  <el-input type='textarea' :rows='10' v-model="sql"></el-input>

                  <el-row>
                      <el-button type="primary" @click="getInOutParam">参数解析</el-button>
                  </el-row>
                  
              </el-col>
              <el-col :span='9' v-if="logicType=='SQL'">
                  <div class="remark">
                      <big>SQL编写说明:</big>
                      <p>(1)参数格式为#{参数名}，例子 #{wid}。</p>
                      <p>(2)支持if条件,&lt;if test="条件表达式"&gt;sql子句&lt;/if&gt;,条件表达式中参数直接用参数名，如果if条件表达式为真,则最终sql包含子句否则不包含。</p>
                      <p>例如 &lt;if test="wid !=null and wid !=''"&gt;and t.wid = #{wid}&lt;/if&gt; 。</p>
                      <p>完整例子：<br> select * from t_test &lt;if test="wid != null"&gt;where wid = #{wid}&lt;/if&gt; 。</p>
                  </div>
              </el-col>
              <!-- JavaScript -->
              <el-col :span='12'  v-if="logicType=='JavaScript'">
                  <el-input type='textarea' :rows='10' v-model="sql"></el-input>
              </el-col>
              <el-col :span='9' v-if="logicType=='JavaScript'">
                  <div class="remark">
                      <big>JavaScript编写说明:</big>
                      <p>(1)JS上线文提供$doDBUtil数据库操作工具,可以读写数据源，支持的方法为： List&lt;Map&lt;String,Object&gt;&gt; queryList(String sql, Object... params) int update(String sql, Object... params) 。</p>
                      <p>(2)JS上线文提供 $dbConnection 数据库连接，对应为java中数据库连接，可以调用其中同名方法 。</p>
                      <p>(3)JS上下文提供$inputParam封装了输入参数。</p>
                      <p>(4)可以通过脚本最后一个函数执行的返回值,为接口返回内容。</p>
                      <p>完整例子:<pre>function example(){
return $doDBUtil.queryList('select * from t_test');
}
example();
                        </pre>
                      </p>
                  </div>
              </el-col>
              <!-- jar -->
              <el-col :span='12' v-if="logicType=='Jar'">
                  <el-row>
                      <el-upload ref="upload" :show-file-list='true' action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" :beforeRemove='beforeRemove'>
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                     </el-upload>
                  </el-row>
                  
              </el-col>
          </el-row>

                    
      </div>
      <hr>
      <div class="interface">
          <p class="Medium">API接口信息</p>
          <el-row style="line-height:36px;">
              <el-col :span='3'><label class="required">是否分页:</label></el-col>
              <el-col :span='5'>
                  <el-radio v-model="paging" :label="true">是</el-radio>
                  <el-radio v-model="paging" :label="false">否</el-radio>
              </el-col>
              <el-col v-if="!paging" :span='16'>
                  <label class="required">限制查询条数: </label>
                  <el-input style="width:300px;" v-model="max"></el-input>
                  <span> 不超过1000</span>
              </el-col>
              <el-col :span='8' v-else>
                  <label class="required">页码: </label>
                  <el-input style="width:200px;" v-model="pageNum"></el-input>
              </el-col>
              <el-col :span='8' v-if="paging">
                  <label class="required">每页条数: </label>
                  <el-input style="width:200px;" v-model="pageSize"></el-input>
              </el-col>
          </el-row>

          <!-- 入参 -->
          <el-row>
              <el-col :span='3'><label>入参属性：</label></el-col>
              <el-col :span='21'>
                  <p style="line-height:24px;">调用该方法需要填写的具体的入参属性， 样例如下:</p>
                  <el-table :data='inParam' id="inTable" v-if="inParam&&inParam.length>0" :max-height='300' :render-header="renderInParam">
                      <el-table-column prop='paramName' label='参数名称'>
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.paramName" class="table-input"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column prop='paramDesc' label='参数描述'>
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.paramDesc" class="table-input"></el-input>
                          </template>
                      </el-table-column>                      
                      <el-table-column prop='dataType' label='参数类型'>
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.dataType" placeholder="请选择" class="table-select">
                                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop='need' label='是否必填'>
                          <template slot-scope="scope">
                            <el-switch v-model="scope.row.need" active-text="是" inactive-text="否"></el-switch>
                          </template>
                      </el-table-column>
                      <el-table-column prop='regex' label='校验正则'>
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.regex" class="table-input"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column label="操作" :width='80' align='left' :render-header="renderInParam">
                          <template slot-scope="scope">
                              <div class="table-icon">
                                <!-- <img :src="add" alt="新增" @click="addParam(scope.row)"> -->
                                <img :src="remove" alt="删除" style="margin-left:20px" @click="removeParam(scope.row)">
                              </div>
                          </template>
                      </el-table-column>
                  </el-table>

                  <p  v-else><el-button type='primary' @click="addParam">新增</el-button></p>
              </el-col>
          </el-row>

          <!-- 出参 -->
          <el-row>
              <el-col :span='3'><label>出参属性：</label></el-col>
              <el-col :span='21'>
                  <p style="line-height:24px;">调用该方法需要填写的具体的出参属性， 样例如下:</p>
                  <el-table ref="outTable"  id="outTable"  v-if="outParam&&outParam.length>0" :data='outParam' class="table" :max-height='300'>
                      <el-table-column prop='paramName' label='参数名称'>
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.paramName" class="table-input"></el-input>
                          </template>
                      </el-table-column>
                      <el-table-column prop='paramDesc' label='参数描述'>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.paramDesc" class="table-input"></el-input>
                        </template>
                      </el-table-column>                      
                      <el-table-column prop='dataType' label='参数类型'>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.dataType" placeholder="请选择" class="table-select">
                                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column  :width='80' align='left' :render-header="renderOutParam">
                          <template slot-scope="scope">
                              <div class="table-icon">
                                <!-- <img :src="add" alt="新增" @click="addOutParam(scope.row)"> -->
                                <img :src="remove" alt="删除" style="margin-left:20px" @click="removeOutParam(scope.row)">
                              </div>
                          </template>
                      </el-table-column>
                  </el-table>
                   <p v-else><el-button type='primary' @click="addOutParam">新增</el-button></p>
              </el-col>
          </el-row>
      </div>
        <hr>
      <div class="test" v-if="isTest">
          <p class="Medium">API调试信息</p>
          <el-row>
              <el-col :span='3'><label>输入参数:</label></el-col>
              <el-col :span='12'>
                  <el-input type='textarea' v-model="inParamJson" :rows='5'></el-input>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span='3'><label>输出参数:</label></el-col>
              <el-col :span='12'>
                  <el-input type='textarea' readonly v-model="outParamJson" :rows='5'></el-input>
              </el-col>
          </el-row>
          <hr>
      </div>
        
      <div class="dialog-footer">
          
         <el-button v-if="!isTest" class="button-warn" @click="isTest=true">进入调试</el-button>
         <el-button v-else class="button-warn" @click="test">调试</el-button>
         <el-button type="primary" @click="certain">保存</el-button>
         <el-button type="default" @click="cancel">取消</el-button>
      </div>
      </div>
  </div>
</template>
<script>
import remove from "../../../static/icon/delete.png";
import add from "../../../static/icon/add.png";
import { mapState, mapActions } from "vuex";
import router from "@/router";
import { dateFormat } from "@/utils/Func";
export default {
  data() {
    return {
      wid: null,
      isEdit: false, //false:新增，true：修改
      name: "",
      nameCn: "",
      dSourceWid: "", //数据源
      operateType: "Read",
      logicType: "SQL",
      address: "",
      desc: "",
      max: 1000, //限制最大条数
      pageSize: 10,
      pageNum: 1,
      fileList: [],
      paging: true,
      remove,
      add,
      //数据类型
      options: [
        { name: "字符串", value: "String" },
        { name: "数字", value: "Number" },
        { name: "布尔型", value: "Boolean" },
        { name: "日期字符串", value: "DateStr" },
        { name: "数字字符串", value: "NumberStr" },
        { name: "字符串列表", value: "List<String>" },
        { name: "数字列表", value: "List<Number>" },
        { name: "布尔列表", value: "List<Boolean>" },
        { name: "日期字符串列表", value: "List<DateStr>" },
        { name: "数字字符串列表", value: "List<NumberStr>" }
      ],
      //
      sql: "", //sql
      oldSql: "", //记录logicType改变时，存储之前的sql,js不存储
      //入参
      inParam: [
        {
          dataType: "String",
          need: true,
          paramDesc: "参数描述",
          paramName: "参数名称",
          regex: null
        }
      ],
      //出参
      outParam: [
        {
          dataType: "String",
          paramDesc: "参数描述",
          paramName: "参数名称"
        }
      ],
      outParamJson: "",
      inParamJson: "",
      isTest: false,
      now: null,
      isCreated: false //是否created结束
    };
  },
  computed: {
    ...mapState({
      dataSourceList: state => {
        return state.config.dataSourceList;
      },
      currentCataId: state => state.config.currentCataId,
      currentApi: state => state.config.currentApi
    }),
    dataSource() {
      if (this.dataSourceList) {
        let arr = [];
        this.dataSourceList.forEach((item, idx) => {
          let obj = {
            label: item.zcxtzwm,
            value: item.wid
          };
          arr.push(obj);
        });
        return arr;
      }
    },
    mapDataType() {
      return new Map([
        ["String", "string"],
        ["Number", 0],
        ["Boolean", false],
        ["DateStr", this.now],
        ["NumberStr", "1234567890"],
        ["List<String>", ["string"]],
        ["List<Number>", [0]],
        ["List<Boolean>", [false]],
        ["List<DateStr>", [this.now]],
        ["List<NumberStr>", ["1234567890"]]
      ]);
    }
  },
  watch: {
    inParam: {
      handler: function(newVal) {
        let obj = {};
        if (newVal && newVal.length) {
          newVal.forEach(item => {
            this.$set(obj, item.paramName, this.mapDataType.get(item.dataType));
          });
        }
        this.inParamJson = JSON.stringify(obj);
      },
      deep: true
    },
    logicType(newV, oldV) {
      if (this.isCreated) {
        this.inParam = [];
        this.outParam = [];
        this.inParamJson = "";
        this.outParamJson = "";
        if (newV == "JavaScript") {
          this.oldSql = this.sql;
          this.sql = "";
        }
        if (newV == "SQL") {
          this.sql = this.oldSql;
        }
      }
    }
  },
  methods: {
    ...mapActions([
      "FOR_DATASOURCE",
      "FOR_INOUT_PARAM",
      "ADD_API",
      "UPDATE_API",
      "TEST_API"
    ]),
    renderInParam(h, { column, $index }) {
      return h("div", { style: { lineHeight: "20px", padding: 0 } }, [
        "操作",
        h("img", {
          style: {
            paddingLeft: "4px",
            verticalAlign: "middle",
            cursor: "pointer"
          },
          attrs: { src: this.add },
          on: { click: this.addParam }
        })
      ]);
    },
    renderOutParam(h, { column, $index }) {
      return h("div", { style: { lineHeight: "20px", padding: 0 } }, [
        "操作",
        h("img", {
          style: {
            paddingLeft: "4px",
            verticalAlign: "middle",
            cursor: "pointer"
          },
          attrs: { src: this.add },
          on: { click: this.addOutParam }
        })
      ]);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    addParam(obj) {
      this.inParam.push({
        paramName: "参数名称",
        paramDesc: "参数描述",
        dataType: "String",
        need: true,
        regex: ""
      });
      var body = document.querySelector("#inTable .el-table__body-wrapper");
      let content = document.querySelector("#inTable .el-table__body");
      this.$nextTick(() => {
        if (content.scrollHeight > 258) {
          body.scrollTop = content.scrollHeight - 258;
        }
      });
    },
    removeParam(obj) {
      for (var i = 0; i < this.inParam.length; i++) {
        if (obj == this.inParam[i]) {
          this.inParam.splice(i, 1);
          return;
        }
      }
    },
    addOutParam(obj) {
      this.outParam.push({
        paramName: "参数名称",
        paramDesc: "参数描述",
        dataType: "String"
      });
      var body = document.querySelector("#outTable .el-table__body-wrapper");
      let content = document.querySelector("#outTable .el-table__body");
      this.$nextTick(() => {
        if (content.scrollHeight > 258) {
          body.scrollTop = content.scrollHeight - 258;
        }
      });
    },
    removeOutParam(obj) {
      for (var i = 0; i < this.outParam.length; i++) {
        if (obj == this.outParam[i]) {
          this.outParam.splice(i, 1);
          return;
        }
      }
    },
    getInOutParam() {
      this.FOR_INOUT_PARAM({
        dataSourceWid: this.dSourceWid,
        sqlTemplate: this.sql
      })
        .then(obj => {
          if (obj && obj.inParams && obj.inParams != []) {
            this.inParam = obj.inParams;
            this.inParam.forEach(item => {
              if (item.need == "true") {
                item.need = true;
              } else {
                item.need = false;
              }
            });
          } else {
            this.inParam = [];
          }
          this.outParam = obj && obj.outParams ? obj.outParams : [];
        })
        .catch(msg => {
          this.$confirm(msg ? msg : "参数解析失败！", {
            showCancelButton: false
          });
        });
    },
    test() {
      let obj = {
        dataSourceWid: this.dSourceWid,
        inParams: JSON.parse(
          this.inParamJson.slice(0, this.inParamJson.length)
        ),
        inputParams: this.inParam,
        logicContent: this.sql,
        logicType: this.logicType,
        outputParams: this.outParam
      };
      obj.inParams.pageSize = this.paging ? this.pageSize - 0 : this.max - 0;
      obj.inParams.pageNum = this.paging ? this.pageNum - 0 : 1;
      this.TEST_API(obj)
        .then(str => {
          this.outParamJson = JSON.stringify(str, null, 2);
        })
        .catch(msg => {
          this.outParamJson = JSON.stringify(msg, null, 2);
        });
    },
    validate() {
      let text = "";
      if (!this.currentCataId) {
        text = "请选择API分类！";
      } else if (!this.name) {
        text = "请输入名称！";
      } else if (!this.nameCn) {
        text = "请输入中文名！";
      } else if (!this.desc) {
        text = "请输入接口描述！";
      } else if (!this.dSourceWid) {
        text = "请选择数据源！";
      } else if (!this.operateType) {
        text = "请选择数据操作类型！";
      } else if (!this.logicType) {
        text = "请选择逻辑类型！";
      } else if (!this.sql) {
        text = "请输入逻辑内容！";
      } else if (!this.operateType) {
        text = "请填写输入参数！";
      } else if (!this.operateType) {
        text = "请填写输出参数！";
      }

      return text;
    },
    certain() {
      let text = this.validate();
      if (text && text != "") {
        this.$confirm(text, "", {
          type: "warning",
          showCancelButton: false
        });
        return;
      }
      if (!this.isEdit) {
        this.ADD_API({
          catalogWid: this.currentCataId,
          intfDesc: this.desc,
          intfName: this.name,
          intfNameCn: this.nameCn,
          resourceWid: this.dSourceWid,
          operateType: this.operateType,
          intfLogicContent: this.sql,
          intfLogicType: this.logicType,
          intfInParams: JSON.stringify(this.inParam),
          intfOutParams: JSON.stringify(this.outParam)
        })
          .then(() => {
            this.$router.go(-1);
            this.$message({
              message: "创建成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message({
              message: "创建失败：" + err,
              type: "error"
            });
          });
      } else {
        //编辑
        this.UPDATE_API({
          catalogWid: this.currentCataId,
          intfDesc: this.desc,
          intfName: this.name,
          intfNameCn: this.nameCn,
          resourceWid: this.dSourceWid,
          operateType: this.operateType,
          intfLogicContent: this.sql,
          intfLogicType: this.logicType,
          intfInParams: JSON.stringify(this.inParam),
          intfOutParams: JSON.stringify(this.outParam),
          wid: this.wid
        })
          .then(() => {
            this.$router.push("/config");
            this.$message({
              message: "修改成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message({
              message: "修改失败" + err,
              type: "error"
            });
          });
      }
    },
    cancel() {
      this.isTest = false;
      this.$router.replace("/config");
    }
  },
  created() {
    //数据源下拉框
    Date.prototype.format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };
    this.now = new Date().format("yyyy-MM-dd hh:mm:ss");
    if (!this.dataSourceList) {
      this.FOR_DATASOURCE();
    }
    this.isCreated = false;
    if (this.$route.query.edit) {
      this.isEdit = true;
      this.name = this.currentApi.intfName ? this.currentApi.intfName : "";
      this.nameCn = this.currentApi.intfNameCn
        ? this.currentApi.intfNameCn
        : "";
      this.dSourceWid =
        this.currentApi.resourceWid || this.currentApi.resourceWid == 0
          ? this.currentApi.resourceWid + ""
          : "";
      this.operateType = this.currentApi.operateType
        ? this.currentApi.operateType
        : "";
      this.logicType = this.currentApi.intfLogicType
        ? this.currentApi.intfLogicType
        : "";
      this.desc = this.currentApi.intfDesc ? this.currentApi.intfDesc : "";
      this.sql = this.currentApi.intfLogicContent
        ? this.currentApi.intfLogicContent
        : "";
      this.outParam = this.currentApi.intfOutParams
        ? JSON.parse(this.currentApi.intfOutParams)
        : [];
      this.inParam = this.currentApi.intfInParams
        ? JSON.parse(this.currentApi.intfInParams)
        : [];
      this.address = this.currentApi.intfUrl ? this.currentApi.intfUrl : "";
      this.wid = this.currentApi.wid ? this.currentApi.wid : null;
    }
  },
  mounted() {
    let title;
    title = this.isEdit ? "请选择API!" : "请选择API分类！";
    if (!this.currentCataId) {
      this.$confirm("", {
        title,
        showCancelButton: false
      })
        .then(() => {
          this.$router.push("/config");
        })
        .catch(() => {});
    }
    let _this = this;
    setTimeout(() => {
      _this.isCreated = true;
    }, 500);

    // this.$nextTick(() => {
    //   var outTable = document.getElementById("outTable");
    //   // console.dir(outTable);
    //   var body = document.querySelector("#outTable .el-table__body-wrapper");
    //   let content =  document.querySelector("#outTable .el-table__body");
    //   console.dir(body);

    //   body.addEventListener("scroll", () => {
    //     console.dir(body,666);
    //     // this.$refs.outTable
    //     console.dir(content)

    //   });
    //   body.onscroll=function(){
    //     console.log('sss')
    //   }
    // });
  }
};
</script>
<style lang='less'>
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
      label {
        line-height: 36px;
      }
      .remark {
        padding-left: 20px;
        big {
          font-size: 14px;
        }
        p {
          margin: 5px 0;
          font-size: 13px;
        }
      }
    }
  }
  hr {
    background: #bbb;
  }
  .interface {
    padding: 36px 0;
    & > p {
      font-size: 20px;
    }
    .el-row {
      margin-top: 20px;
    }
    .el-table .el-input__inner {
      padding-left: 0;
    }
  }
  .test {
    padding: 36px 0;
    & > p {
      font-size: 20px;
    }
    .el-row {
      margin-top: 20px;
    }
  }
  .dialog-footer {
    padding: 36px 0;
    text-align: center;
    .button-warn {
      background: #f4c22b;
      border-color: #f4c22b;
      color: #fff;
    }
  }
  .table-input {
    min-width: 100px;
    max-width: 200px;
    .el-input__inner {
      border: none;
    }
  }
  .table-select {
    width: 150px;
    .el-input__inner {
      border: none;
    }
  }
  .table-icon img {
    cursor: pointer;
  }
}
</style>
