<template>
  <div class="IndexConfiguration-content layout">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部(1)" name="first">
        <el-main style="font-size: 12px;">
          <el-row>
            <el-col :span="7">
              <label>关键词：</label>
              <el-input style="width: 68%;" placeholder="请输入资产Code或指标名搜索" v-model="processName"></el-input>
            </el-col>
            <el-col :span="7">
              <label>主题域：</label>
              <el-select v-model="themeDomain" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="10">
              <label>统计维度：</label>
              <el-input style="width: 40%;" placeholder v-model="processName"></el-input>

              <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
              <el-button>重置</el-button>
              <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                <a>更多</a>
                <i class="el-icon-arrow-down"></i>
              </span>
              <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                <a>收起</a>
                <i class="el-icon-arrow-up"></i>
              </span>
            </el-col>
          </el-row>
          <el-row v-show="moreStatus=='up'" style="width: 100%; margin-top: 15px;">
            <el-col :span="7">
              <label>保障等级：</label>
              <el-select v-model="degradation" placeholder="请选择是否退化维" style="margin-right: 15px;">
                <el-option value="A1">A1</el-option>
                <el-option value="A2">A2</el-option>
                <el-option value="A3">A3</el-option>
                <el-option value="A4">A4</el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <label>更新频率:</label>
              <el-select v-model="degradation" placeholder="请选择是否退化维" style="margin-right: 15px;">
                <el-option value="分钟">分钟</el-option>
                <el-option value="小时">小时</el-option>
                <el-option value="天">天</el-option>
                <el-option value="周">周</el-option>
                <el-option value="月">月</el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <label>负责人：</label>
              <el-select v-model="charger" placeholder="请选择负责人"></el-select>
              <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
            </el-col>
          </el-row>

          <div class="table-content">
            <el-row>
              <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  prop="name"
                  label="资产CODE"
                  width="120"
                  header-align="left"
                  align="left"
                >
                  <template>
                    <el-button type="text" @click="$router.push('')">MAME34T66B</el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="subject"
                  label="显示名"
                  width="200"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="admin"
                  label="统计维度"
                  width="200"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="description"
                  label="主题域"
                  width="80"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userCount"
                  label="数据负责人"
                  width="100"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="director"
                  label="资产状态"
                  width="100"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column fixed="right" label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-popover placement="right" width="400" trigger="click">
                      <p class="head">版本信息</p>
                      <el-table :data="gridData">
                        <el-table-column property="version" label="版本号"></el-table-column>
                        <el-table-column property="creater" label="发起人"></el-table-column>
                        <el-table-column property="createTime" label="发起时间"></el-table-column>
                        <el-table-column property="type" label="类型"></el-table-column>
                        <el-table-column property="childState" label="子状态"></el-table-column>
                        <el-table-column property="operate" label="操作"></el-table-column>
                      </el-table>
                      <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="1"
                        style="float:right;margin-top:10px;"
                      ></el-pagination>
                      <el-button slot="reference" @click="handleClick(scope.row)">查看版本</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <br />
          </div>

          <div class="atomicword-button">
            <div>
              <span class="atomicword-box">
                <span class="atomicword-checkbox"></span>
                <span>
                  已选
                  <i class="atomicword-i">0</i>个
                </span>
              </span>
              <el-button type="info" plain>批量修改负责人</el-button>
              <el-button type="info" plain>批量上线</el-button>
              <el-button type="info" plain>批量下线</el-button>
              <el-button type="info" plain>批量删除</el-button>
              <!-- <el-dropdown trigger="click">
                <el-button type="info" trigger="click" class="more-button">
                  更多批量操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>批量操作</el-dropdown-item>
                  <el-dropdown-item>批量操作</el-dropdown-item>
                  <el-dropdown-item>批量操作</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
            </div>
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="20"
              layout="prev, pager, next,sizes"
              background
              :total="10"
            ></el-pagination>
            <!-- </el-row> -->
          </div>
        </el-main>
      </el-tab-pane>

      <el-tab-pane label="未生效(1)" name="second">
        <el-main style="font-size: 12px;">
          <el-row>
            <el-col :span="7">
              <label>关键词：</label>
              <el-input style="width: 68%;" placeholder="请输入资产Code或指标名搜索" v-model="processName"></el-input>
            </el-col>
            <el-col :span="7">
              <label>主题域：</label>
              <el-select v-model="themeDomain" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="10">
              <label>统计维度：</label>
              <el-input style="width: 40%;" placeholder v-model="processName"></el-input>

              <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
              <el-button>重置</el-button>
              <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                <a>更多</a>
                <i class="el-icon-arrow-down"></i>
              </span>
              <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                <a>收起</a>
                <i class="el-icon-arrow-up"></i>
              </span>
            </el-col>
          </el-row>
          <el-row v-show="moreStatus=='up'" style="width: 100%; margin-top: 15px;">
            <el-col :span="7">
              <label>保障等级：</label>
              <el-select v-model="degradation" placeholder="请选择是否退化维" style="margin-right: 15px;">
                <el-option value="A1">A1</el-option>
                <el-option value="A2">A2</el-option>
                <el-option value="A3">A3</el-option>
                <el-option value="A4">A4</el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <label>更新频率:</label>
              <el-select v-model="degradation" placeholder="请选择是否退化维" style="margin-right: 15px;">
                <el-option value="分钟">分钟</el-option>
                <el-option value="小时">小时</el-option>
                <el-option value="天">天</el-option>
                <el-option value="周">周</el-option>
                <el-option value="月">月</el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <label>负责人：</label>
              <el-select v-model="charger" placeholder="请选择负责人"></el-select>
              <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
            </el-col>
          </el-row>

          <div class="table-content">
            <el-row>
              <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  prop="name"
                  label="资产CODE"
                  width="120"
                  header-align="left"
                  align="left"
                >
                  <template>
                    <el-button type="text" @click="$router.push('')">MAME34T66B</el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="subject"
                  label="显示名"
                  width="200"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="admin"
                  label="统计维度"
                  width="200"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="description"
                  label="主题域"
                  width="80"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="userCount"
                  label="数据负责人"
                  width="100"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="director"
                  label="上线进度"
                  width="100"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column  label="操作">
                  <template slot-scope="scope">
                   <router-link to="/IndexAllocation"> <a class="operate" @click="handleClick(scope.row);">编辑</a></router-link>
                    <a  class="operate" @click="handleClick(scope.row)">上线</a>
                    <a  class="operate" @click="handleClick(scope.row)">删除</a>
                    <a  class="operate" @click="handleClick(scope.row)">查看版本</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <br />
          </div>

          <div class="atomicword-button">
            <div>
              <span class="atomicword-box">
                <span class="atomicword-checkbox"></span>
                <span>
                  已选
                  <i class="atomicword-i">0</i>个
                </span>
              </span>
              <el-button type="info" plain>批量修改负责人</el-button>
              <el-button type="info" plain>批量上线</el-button>
              <el-button type="info" plain>批量下线</el-button>
              <el-button type="info" plain>批量删除</el-button>
              <!-- <el-dropdown trigger="click">
                <el-button type="info" trigger="click" class="more-button">
                  更多批量操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>批量操作</el-dropdown-item>
                  <el-dropdown-item>批量操作</el-dropdown-item>
                  <el-dropdown-item>批量操作</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
            </div>
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="20"
              layout="prev, pager, next,sizes"
              background
              :total="10"
            ></el-pagination>
            <!-- </el-row> -->
          </div>
        </el-main>
          <!-- <el-col class="content">
            <img src="@/assets/img/empty.png" />
          </el-col> -->
      </el-tab-pane>
      <el-tab-pane label="已生效(0)" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="已失效(0)" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "IndexConfiguration",
  data() {
    return {
      degradation: "",
      activeName: "first",
      moreStatus: "down",
      gridData: [
        {
          version: "1",
          creater: "bigdate",
          createTime: "2020-0011",
          type: "修改",
          childState: "待上线",
          operate: "版本内容"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "主题一"
        },
        {
          value: "选项2",
          label: "主题二"
        }
      ],
      value: "",

      optionss: [
        {
          valuee: "选项1",
          label: "状态一"
        },
        {
          valuee: "选项2",
          label: "状态二"
        }
      ],
      valuee: "",

      principal: [
        {
          principalListe: "选项1",
          label: "负责人一"
        },
        {
          principalListe: "选项2",
          label: "负责人二"
        }
      ],
      //table表格
      tableData: [
        {
          name: "充值",
          subject: "近一周大额存单累计充值金额",
          description: "日",
          admin: "自然人/行为信息/金融产品行为(中间层)",
          director: "待上线",
          userCount: "bigdata"
        }
      ],
      wsSearchContent: "",
      currentPage: 1,

      multipleSelection: [],
      processName: "",
      themeDomain: "",
      status: "",
      charger: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: lightblue;color:#fff;font-weight: 500;";
      }
    },

    changeMoreStatus(status) {
      console.log(555);
      this.moreStatus = status;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }

    //弹窗
  },
  components: {},
  created() {
    this.$emit("showNavBars", true);
  }
};
</script>

<style scoped>
.IndexConfiguration-content {
  margin-left: 20px;
  margin-right: 20px;
}
label {
  width: 65px;
  display: inline-block;
}
.content{
  width:100%;
  display:flex;
  justify-content:center;
  margin-top:80px;
}
.head {
  height: 30px;
  width: 100%;
  font-size: 12px;
  border-bottom: 1px #e8e8e8 solid;
}
.operate{
  color:#1890ff;
  margin-right:5px;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.frome-input {
  margin-left: 20px;
  /* border-left: 1px solid #e6e6e6; */
  width: 100%;
}
.frome-span {
  display: inline-block;
  font-size: 12px;
  width: 300px;
  height: 20px;
}
.el-popper {
  padding-top: 0px;
}
.frome-text {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.frome-button {
  margin-right: 10px;
}
.table-content {
  margin-top: 25px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.table-button {
  margin: 25px 0;
}
.more {
  margin-left: 15px;
}
.more a,
.more i {
  color: #1890ff;
  font-size: 12px;
  cursor: pointer;
}
.forme-size {
  font-size: 12px;
}
.el-col-6 {
  width: 400px;
  margin-top: 20px;
}
.blue {
  margin-left: 10px;
  color: #1890ff;
}

.interlayer-content {
  margin-left: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-right: 20px;
}

.atomicword-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.atomicword-box {
  margin-right: 20px;
}
.atomicword-checkbox {
  margin-left: 14px;
  margin-right: 15px;
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #fff;
  z-index: 1;
}
.atomicword-i {
  font-style: normal;
  color: #1890ff;
}
.more-button {
  margin-left: 10px;
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}
</style>
