<template>
  <div id="config">
      <section class="treeList">
          <div class="tree-search">
              <el-input class="cus-input" type="text" prefix-icon="el-icon-search" v-model.trim="keyapi" style="width:192px;" clearable placeholder='请输入接口分类'></el-input>
              <img :src="add2" alt="新增" @click="addRootCata">
          </div>
          <el-tree accordion :data="tree" ref="tree" :default-expanded-keys="currentCataId?[currentCataId]:[]" node-key='id' :highlight-current='true' style="overflow:auto;height:calc(100vh - 200px)"  :filter-node-method="filterNode" :props="defaultProps" @node-click="nodeClick" :render-content='renderContent'>    
          </el-tree>
      </section><keep-alive><section>
          <el-input class="cus-input" type="text" style="width:360px;" prefix-icon="el-icon-search" clearable v-model.trim="keywords" placeholder='请输入搜索关键词' @change='searchApi'></el-input><el-button type='primary' style="margin-left:12px;height:30px;line-height:30px;padding:0 15px" @click="searchApi">搜索</el-button>
          <input type="text" id="copyInput">
          <el-row style="margin:20px 0">
              <el-button type='primary' @click="addApi">新增API</el-button><el-button type='default' @click="importFile" style="margin-left:12px;">
            导入</el-button><a :href='`${href}${currentId}`' ><el-button type='default' style="margin-left:12px;">导出</el-button></a>
          </el-row>
            
          <el-table :data='tableData' height='600' @filter-change='filterChange'>
              <el-table-column label='操作' width='110px'>
                  <template slot-scope="scope">
                      <div class="table-operate">
                          <img :src="check" alt="查看" @click="checkApi(scope.row)">
                          <img :src="edit" alt="编辑" @click="editApi(scope.row)">
                          <img :src="remove" alt="删除" @click="removeApi(scope.row.wid)">  
                      </div>
                  </template>
              </el-table-column>
              <el-table-column label='中文名' prop='intfNameCn'></el-table-column>
              <el-table-column label='名称' prop='intfName'></el-table-column>
              <el-table-column label='接口地址' prop='intfUrl'>
                <template slot-scope="scope">
                  <el-popover placement='top-start' width='400' trigger='hover' >
                      <p slot="reference" class="popover-p">{{scope.row.intfUrl}}</p>
                      <p style="cursor:pointer;" @click="copy(scope.row.intfUrl)"> {{scope.row.intfUrl}}<br>
                      <span style="color:#17d8c6">点击复制</span></p>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label='数据操作类型' prop='operateType' :filters="operateTypeList" column-key='operateType' filter-placement='bottom' :filter-multiple='false'>
                <template slot-scope="scope">
                  <span>{{scope.row.operateType=='Read'?'读取':'写入'}}</span>
                </template>
              </el-table-column>
              <el-table-column label='逻辑类型' prop='intfLogicType' :filters="logicTypeList" column-key='logicType' filter-placement='bottom' :filter-multiple='false' ></el-table-column>
              <el-table-column label='配置状态' prop='enable' width='140px'>
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.enable" active-text="启动" inactive-text="停止" @change='changeEnable(scope.row)'></el-switch>
                </template>
              </el-table-column>
              <el-table-column label='注册状态' >
                <template slot-scope="scope">
                    <div v-if="scope.row.status=='Registered'">
                      <span style="color:#5ed7bc">已注册</span>
                      <p style="color:red;text-decoration:underline;cursor:pointer;" @click="unRegister(scope.row.wid)">去注销</p>
                    </div>
                    <div v-else>未注册
                      <p><span style="color:#04A9F5;text-decoration:underline;cursor:pointer;" @click="register(scope.row.wid)">去注册</span></p>
                    </div>
                </template>
              </el-table-column>
          </el-table>
          <div v-if="total>0" style="margin-top:22px">
              <el-pagination background layout="prev, pager, next" :page-size='10' :total="total" @current-change='numChange' :current-page='pageNum'></el-pagination>
          </div>
      </section></keep-alive>
    
    <!-- 分类 Dialog -->
      <el-dialog id="cataDialog" :visible.sync='showDialog' width='572px' :title="isAddCata?'新增API分类':'编辑API分类'">
          <el-row v-if="flBread">
              <el-col :span='5'><label class="required">所属分类</label></el-col>
              <el-col :span='19'><label>{{flBread}}</label></el-col>
          </el-row>
          <el-row>
              <el-col :span='5'><label class="required">名称：</label></el-col>
              <el-col :span='19'><el-input type='text' v-model.trim="catagory.name" ></el-input></el-col>
          </el-row>
          <el-row>
              <el-col :span='5'><label>描述：</label></el-col>
              <el-col :span='19'><el-input type='text'  v-model.trim="catagory.desc" ></el-input></el-col>
          </el-row>
          <el-row>
              <el-col :span='5'><label>备注：</label></el-col>
              <el-col :span='19'><el-input type='text'  v-model.trim="catagory.remark" ></el-input></el-col>
          </el-row>
            <el-row  v-if="!isAddCata">
                <el-col :span='5'><label class="required">最后修改人：</label></el-col>
                <el-col :span='19'><el-input type='text' disabled  v-model.trim="catagory.lastAuthor" ></el-input></el-col>
            </el-row>
            <el-row  v-if="!isAddCata">
                <el-col :span='5'><label class="required">最后修改时间：</label></el-col>
                <el-col :span='19'><el-input type='text' disabled  v-model.trim="catagory.lastTime" ></el-input></el-col>
            </el-row>

          <div class="dialog-footer">
             <el-button type='text' @click="cancel">取消</el-button>
             <el-button type='primary' @click.native="certain">确认</el-button>
          </div>
      </el-dialog>
    
    <!-- API Dialog -->
      <el-dialog id="apiDialog" :visible.sync='apiDialog' :width='uploadSuccess?"877px":"407px"' :title="importResult?'导入结果':'导入API'" @close='closeApiDialog'  @before-close='closeApiDialog'>
          <p style="text-align:center;" v-if="!uploadSuccess">
            <input ref="files" type="file" @change="fileChange" style="width:80px;height:36px;position:relative;left:40px;opacity:0;cursor:pointer">
            <el-button type="primary" @click="upload" style="margin-left:-40px;">+上传文件</el-button>
          </p>

          <div v-if='uploadSuccess&&!importResult' >
            <el-table :data='uploadTable' :max-height='400'>
              <el-table-column label='中文名' prop='intfNameCn'></el-table-column>
              <el-table-column label='名称' prop='intfName'></el-table-column>
              <el-table-column label='类别' prop='type'></el-table-column>
              <el-table-column label='是否忽略' prop='ignore'>
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.ignore" active-text="是" inactive-text="否"></el-switch>
                </template>
              </el-table-column>
            </el-table>
            <div class="dialog-footer" v-if="!importResult">
              <el-button type="primary" @click="importApi">批量导入</el-button>
              <el-button type="default" @click="closeApiDialog">取消</el-button>
            </div>
            <div class="dialog-footer" v-else>
              <el-button type="primary" @click="closeApiDialog">确定</el-button>
            </div>
          </div>
          
          <div v-show="importResult">
            <el-table :data='resultTable' :max-height='400'>
              <el-table-column label='中文名' prop='intfNameCn'></el-table-column>
              <el-table-column label='名称' prop='intfName'></el-table-column>
              <el-table-column label='类别' prop='type'></el-table-column>
              <el-table-column label='结果描述' prop='reuslt'>
              </el-table-column>
            </el-table>
            <div class="dialog-footer" >
              <el-button type="primary" @click="closeApiDialog">确定</el-button>
            </div>
          </div>

      </el-dialog>
  </div>
</template>
<script>
import add1 from "../../../static/icon/add.png";
import add2 from "../../../static/icon/add2.png";
import edit from "../../../static/icon/edit.png";
import remove from "../../../static/icon/delete.png";
import check from "../../../static/icon/watch.png";
import { mapActions, mapState } from "vuex";
import axios from "axios";
import { isArray } from "@/utils/Func";
export default {
  data() {
    return {
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      add1,
      add2,
      edit,
      remove,
      check,
      showDialog: false,
      isAddCata: false, //区别分类新增还是编辑
      //   isAddApi:false,//api 新增与编辑
      catagory: {
        name: "",
        desc: "",
        remark: "",
        lastTime: "",
        lastAuthor: ""
      },
      currentId: 0, //当前分类id
      flBread: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
      logicType: "All", //SQL：SQL，JavaScript：JavaScript，Jar：Jar
      operateType: "All", //读取：Read，写入：Write
      keywords: "", //关键字搜索
      keyapi: "", //api搜索
      tableData: [], //表格数据
      //数据类型
      dataTypeList: [
        { text: "字符串", value: "String" },
        { text: "数字", value: "Number" },
        { text: "布尔型", value: "Boolean" },
        { text: "日期字符串", value: "DateStr" },
        { text: "数字字符串", value: "NumberStr" },
        { text: "字符串列表", value: "List<String>" },
        { text: "数字列表", value: "List<Number>" },
        { text: "布尔列表", value: "List<Boolean>" },
        { text: "日期字符串列表", value: "List<DateStr>" },
        { text: "数字字符串列表", value: "List<NumberStr>" }
      ],
      //数据操作类型
      operateTypeList: [
        { text: "读取", value: "Read" },
        { text: "写入", value: "Write" }
      ],
      //逻辑类型
      logicTypeList: [
        { text: "SQL", value: "SQL" },
        { text: "JavaScript", value: "JavaScript" }
        // { text: "Jar", value: "Jar" }
      ],
      apiDialog: false,
      fileList: [], //上传文件列表
      uploadSuccess: false,
      uploadTable: null,
      recordWid: null,
      importResult: false,
      resultTable: null,
      firstNode: [], //默认点击第一个节点
      href: "/do/api/export?catalogWid=",
      isParentAdd: false, //新增根节点分类
      timer: null,
      light: null
    };
  },
  watch: {
    keyapi(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    ...mapState({
      currentCataId: state => state.config.currentCataId
    })
  },
  methods: {
    ...mapActions([
      "FOR_TREE",
      "ADD_CATAGORY",
      "REMOVE_CATAGORY",
      "UPDATE_CATAGORY",
      "FOR_CATAGORY_DETAIL",
      "FOR_API",
      "UPLOAD_API",
      "REMOVE_API",
      "CHANGE_ENABLE",
      "REGISTER",
      "IMPORT_API",
      "UNREGISTER"
    ]),
    nodeClick(data, node) {
      this.currentId = data && data.id ? data.id : this.currentCataId;
      if (this.light && node) this.light.classList.remove("is-current");
      this.$store.commit("SetCurrentCataId", this.currentId);
      this.searchApi();
    },
    numChange(val) {
      this.pageNum = val;
      this.searchApi();
    },
    searchApi() {
      let obj = {
        catalogWid: this.currentId,
        keyword: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        logicType: this.logicType,
        operateType: this.operateType
      };
      this.FOR_API(obj).then(obj => {
        this.tableData = obj.dataSet;
        this.total = obj.pageInfo.total;
        this.tableData.forEach(item => {
          if (item.enable == "true") {
            item.enable = true;
          } else {
            item.enable = false;
          }
        });
      });
    },
    renderContent(h, { node, data, store }) {
      return h(
        "div",
        { class: { "tree-content": true }, attrs: { id: data.id } },
        [
          h("div", { class: "operate" }, [
            h("i", {
              class: "el-icon-circle-plus",
              style: { fontSize: "12px", color: "#28b6f7" },
              on: {
                click: event => {
                  this.addCata(event, node, data);
                }
              }
            }),
            h("img", {
              attrs: { src: this.edit },
              on: {
                click: event => {
                  this.editCata(event, node, data);
                }
              }
            }),
            h("img", {
              attrs: { src: this.remove },
              on: {
                click: event => {
                  this.removeCata(event, node, data);
                }
              }
            })
          ]),
          h("span", { style: { lineHeight: "42px" } }, node.label)
        ]
      );
    },
    filterNode(value, data) {
      return data.label.indexOf(value) !== -1;
    },
    addCata(event, node, data) {
      this.isAddCata = true;
      this.showDialog = true;
      this.currentId = data ? data.id : this.currentId;
      if (data) {
        this.$store.commit("SetCurrentCataId", data.id);
      }
      this.flBread = "";
      this.getBread(node);
      this.flBread = this.flBread.slice(0, -1);
    },
    addRootCata() {
      this.isParentAdd = true;
      this.addCata();
    },
    getBread(obj) {
      if (!obj || !obj.parent || isArray(obj.parent.data)) {
        return;
      } else {
        this.flBread = obj.data.label + ">" + this.flBread;
        this.getBread(obj.parent);
      }
    },
    editCata(event, node, data) {
      this.$store.commit("SetCurrentCataId", data.id);
      this.FOR_CATAGORY_DETAIL(data.id).then(obj => {
        this.isAddCata = false;
        this.flBread = "";
        this.getBread(node);
        this.flBread = this.flBread.slice(0, -1);
        this.showDialog = true;
        this.catagory.name = obj.catalogName;
        this.catagory.desc = obj.catalogDesc;
        this.catagory.remark = obj.bak;
        this.catagory.lastTime = obj.lastModifiedTime;
        this.catagory.lastAuthor = obj.lastModifiedOperator;
      });
    },
    removeCata(event, node, data) {
      this.$confirm("", "确认删除此分类吗？").then(() => {
        this.currentId = node.parent.data.id;
        this.$store.commit("SetCurrentCataId", node.parent.data.id);
        this.REMOVE_CATAGORY(data.id)
          .then(() => {
            this.getTree();
            this.tableData = [];
            this.$notify({
              iconClass: "gIcon iconfont icon-success bIcon",
              type: "success",
              title: "删除成功"
            });
          })
          .catch(msg => {
            this.$notify({
              iconClass: "yIcon el-icon-warning bIcon",
              type: "warning",
              title: msg ? msg : "删除失败!"
            });
          });
        event.stopPropagation();
      }).catch(()=>{

      })
    },
    exportApi() {
      this.EXPORT_API(this.currentId + "").then(() => {});
    },
    removeApi(id) {
      let _this = this;
      this.$confirm("", "确认删除此API吗？", {
        type: "warning",
        callback: function(action) {
          if (action == "confirm") {
            _this
              .REMOVE_API(id)
              .then(() => {
                _this.$notify({
                  iconClass: "gIcon iconfont icon-success bIcon",
                  type: "success",
                  title: "删除成功",
                  callback: () => {}
                });
                _this.searchApi();
              })
              .catch(msg => {
                _this.$notify({
                  iconClass: "yIcon el-icon-warning bIcon",
                  type: "warning",
                  title: msg ? msg : "删除失败!"
                });
              });
          }
        }
      });
    },
    editApi(obj) {
      this.$store.commit("setCurrentAPI", obj);
      this.$router.push("/config/detail?edit=edit");
    },
    checkApi(obj) {
      this.$store.commit("setCurrentAPI", obj);
      this.$router.push("/config/check");
    },
    close() {
      this.showDialog = false;
      this.currentId = 0;
      this.catagory = {
        name: "",
        desc: "",
        remark: "",
        lastTime: "",
        lastAuthor: ""
      };
      this.isAddCata = false;
      this.flBread = "";
      this.uploadSuccess = false;
      this.isParentAdd = false;
    },
    cancel() {
      const h = this.$createElement;
      this.$msgbox({
        title: null,
        message: h("p", { style: { padding: "20px 20px 20px 40px" } }, [
          h("p", { style: { fontSize: "20px", paddingBottom: "20px" } }, [
            h("i", {
              class: "yIcon el-icon-warning bIcon",
              style: { float: "left", marginLeft: "-30px" }
            }),
            this.isAddCata
              ? "确认取消新增此API分类？"
              : "确认取消编辑此API分类？"
          ]),
          h(
            "span",
            { style: { color: "red" } },
            "此操作将无法保留你刚刚的所有操作,"
          ),
          h("span", null, "还要继续么？")
        ]),
        showCancelButton: true,
        cancelButtonClass: "el-button"
      })
        .then(() => {
          this.close();
        })
        .catch(() => {});
    },
    certain(event) {
      if (this.catagory.name) {
        let obj = {
          catalogName: this.catagory.name,
          catalogDesc: this.catagory.desc,
          bak: this.catagory.remark,
          parentCatalogWid: this.isParentAdd ? 0 : this.currentId,
          catalogObj: "Api"
        };

        if (this.isAddCata) {
          this.ADD_CATAGORY(obj)
            .then(obj => {
              this.getTree();
              this.close();
              this.$notify({
                type: "success",
                title: "新增成功",
                iconClass: "gIcon iconfont icon-success bIcon"
              });
            })
            .catch(msg => {
              this.close();
              this.$notify({
                iconClass: "yIcon el-icon-warning bIcon",
                type: "warning",
                title: msg ? msg : "新增失败！"
              });
            });
        } else {
          let obj = {
            catalogName: this.catagory.name,
            catalogDesc: this.catagory.desc,
            bak: this.catagory.remark,
            wid: this.currentId,
            catalogObj: "Api"
          };
          this.UPDATE_CATAGORY(obj)
            .then(() => {
              this.getTree();
              this.close();
              this.$notify({
                type: "success",
                title: "修改成功",
                iconClass: "gIcon iconfont icon-success bIcon"
              });
            })
            .catch(msg => {
              let text = "修改失败！";
              if (msg) {
                text = msg;
                this.$notify({
                  iconClass: "yIcon el-icon-warning bIcon",
                  type: "warning",
                  title: text
                });
              }
            });
        }
      } else {
        this.$notify({
          iconClass: "yIcon el-icon-warning bIcon",
          type: "warning",
          title: "请填写分类名！"
        });
      }
    },
    getTree() {
      this.close();
      this.FOR_TREE("Api").then(obj => {
        // this.tree = obj
        this.tree = obj.children ? obj.children : [];
        if (this.tree && this.tree.length) {
          let _this = this;
          let firstObj;
          getFirstNode(obj, _this);
          function getFirstNode(obj, _this) {
            if (obj.children && obj.children.length) {
              getFirstNode(obj.children[0], _this);
              _this.firstNode.push(obj.id);
            } else {
              firstObj = obj;
            }
          }
        }
        // this.nodeClick(firstObj);
      });
    },
    addApi() {
      if (this.currentId) {
        this.$router.push("/config/detail");
      } else {
        this.$confirm("请选择API分类！", { showCancelButton: false });
      }
    },

    logicTypeFilter(value, row, column) {
      this.logicType = value;
      this.searchApi();
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

      this.searchApi();
    },
    changeEnable(obj) {
      this.CHANGE_ENABLE({
        apiWid: obj.wid,
        enable: obj.enable
      });
    },

    register(id) {
      this.REGISTER([id])
        .then(() => {
          this.searchApi();
          this.$notify({
            iconClass: "gIcon iconfont icon-success bIcon",
            type: "success",
            title: "注册成功"
          });
        })
        .catch(msg => {
          let text = "注册失败";
          if (msg) text = msg;
          this.$notify({
            iconClass: "yIcon el-icon-warning bIcon",
            type: "warning",
            title: text
          });
        });
    },
    unRegister(id) {
      this.UNREGISTER([id])
        .then(() => {
          this.searchApi();
          this.$notify({
            iconClass: "gIcon iconfont icon-success bIcon",
            type: "success",
            title: "注销成功"
          });
        })
        .catch(msg => {
          let text = "注销失败";
          if (msg) text = msg;
          this.$notify({
            iconClass: "yIcon el-icon-warning bIcon",
            type: "warning",
            title: text
          });
        });
    },
    importFile() {
      if (this.currentId) {
        this.apiDialog = true;
      } else {
        this.$confirm("请选择API分类！", { showCancelButton: false });
      }
    },
    upload() {
      let form = new FormData();
      let size = this.$refs.files.files[0].size / 1024;
      if (size > 10000) {
        this.$confirm("文件不能超过10M！", { showCancelButton: false });
        return;
      }
      form.append("file", this.$refs.files.files[0]);
      this.UPLOAD_API({
        catalogWid: this.currentId,
        file: form
      })
        .then(obj => {
          this.uploadSuccess = true;
          if (obj) {
            this.uploadTable = obj.list;
            this.recordWid = obj.recordWid;
            this.uploadTable.forEach(item => {
              if (item.ignore == "true") {
                item.ignore = true;
              } else {
                item.ignore = false;
              }
            });
          }
        })
        .catch(msg => {
          this.$refs.files.value = "";
          if (msg) {
            this.$notify({
              iconClass: "yIcon el-icon-warning bIcon",
              type: "warning",
              title: msg
            });
          }
        });
    },
    fileChange(event, file) {
      this.upload();
    },
    importApi() {
      let arr = [];
      this.uploadTable.forEach(item => {
        if (!item.ignore) {
          arr.push(item.intfName);
        }
      });
      this.importResult = true;
      this.IMPORT_API({
        catalogWid: this.currentId,
        intfNames: arr,
        recordWid: this.recordWid
      }).then(arr => {
        this.resultTable = arr;
        this.$notify({
          iconClass: "gIcon iconfont icon-success bIcon",
          type: "success",
          title: "导入成功"
        });
      });
    },
    closeApiDialog() {
      this.uploadSuccess = false;
      this.apiDialog = false;
      this.recordWid = null;
      this.importResult = false;
      this.resultTable = null;
      if (this.$refs.files) {
        this.$refs.files.value = "";
      }
      this.nodeClick();
    },
    copy(val){
      console.log(val)
      var input = document.getElementById('copyInput')
      input.value = val
      input.select()
      document.execCommand("copy");
    }
  },
  created() {
    this.getTree();
  },
  mounted() {
    if (this.currentCataId) {
      this.$refs.tree.setCurrentNode(this.currentCataId);
      let _this = this;
      setTimeout(() => {
        _this.light = document.getElementById(
          _this.currentCataId
        ).parentNode.parentNode;
        _this.light.classList.add("is-current");
        _this.nodeClick();
      }, 500);
    }
  }
};
</script>
<style>
#copyInput{
  width:1px;
  height:0;
  border:none;
}
#config section {
  min-height: calc(100vh - 100px);
  background: #fff;
  display: inline-block;
  vertical-align: top;
}
#config .treeList {
  width: 247px;
  overflow: auto;
}
#config section:nth-child(2) {
  width: calc(100% - 315px);
  margin-left: 8px;
  padding: 20px;
}
#config .tree-search {
  padding: 20px 15px;
}

#config img {
  cursor: pointer;
}

#config .tree-search img {
  margin-left: 2px;
  vertical-align: middle;
}
#config .operate {
  /* background: #fff; */
  position: absolute;
  right: 0;
  top: 0;
  padding-right: 12px;
  display: none;
  opacity: 0;
  transition: all 0.2s;
}
#config .operate i,
#config .operate img {
  color: #04a9f5;
  line-height: 42px;
  margin-right: 10px;
  vertical-align: middle;
}
#config .operate img:last-child {
  margin: 0;
}
#config .el-tree-node__content:hover .operate {
  display: inline-block;
  opacity: 1;
}
#config .el-tree-node:focus > .el-tree-node__content .operate,
#config .el-tree-node__content:hover .tree-content div,
#config .el-tree-node:focus > .el-tree-node__content .tree-content {
  background: #f5f7fa !important;
}
#config .el-tree-node__content {
  height: 42px;
  width: 100%;
}

.el-tree-node {
  position: relative;
}

#cataDialog label {
  line-height: 36px;
}
#cataDialog .el-row {
  margin-top: 13px;
}
#cataDialog .el-row:nth-child(1) {
  margin-top: 0;
}

.selected {
  background: #f5f7fa;
}
.table-operate img + img {
  margin-left: 8px;
}
</style>
