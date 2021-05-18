<template>
  <div class="interlayer-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="域列表" name="first">
        <div class="interlayer-forme">
          <span class="interlayer-search">
            搜索主题域：
            <el-input style="width: 15%;" placeholder="请输入主题域名搜索" v-model="processName"></el-input>
          </span>
          <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
          <el-button>重置</el-button>
        </div>

        <div>
          <div class="table-button">
            <el-button type="primary" @click="information = true">+新建一级主题域</el-button>
          </div>
          <!--一级主题域弹窗 -->
          <el-dialog title="编辑基础信息" :visible.sync="information" width="35%">
            <el-form :model="form" label-width="80px" style="width: 80%;">
              <el-row style="font-size: 14px; margin-bottom:20px">
                <el-col :span="5" align="end">域类型：</el-col>
                <el-col :span="6">中间层</el-col>
              </el-row>
              <el-row style="font-size: 14px; margin-bottom:20px">
                <el-col :span="5" align="end">主题域层级：</el-col>
                <el-col :span="6">一级主题域</el-col>
              </el-row>
              <el-row style="font-size: 14px; margin-bottom:20px">
                <el-col :span="5" align="end">上级主题域：</el-col>
                <el-col :span="6">无</el-col>
              </el-row>
              <el-form-item label="域名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入主题域名称"></el-input>
              </el-form-item>
              <el-form-item label="英文简写：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入主题域英文简写"></el-input>
              </el-form-item>
              <el-form-item label="数据负责人：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
              </el-form-item>
              <el-form-item label="业务负责人：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
              </el-form-item>
              <el-form-item label="数据域描述：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" type="textarea" placeholder></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="information = false">取 消</el-button>
              <el-button type="primary" @click="information = false">确 定</el-button>
            </div>
          </el-dialog>
          <el-row class="el-row-style">
            <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="name" label="主题域" width="140" header-align="left" align="left"></el-table-column>
              <el-table-column
                prop="subject"
                label="英文简写"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="数据负责人"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="admin"
                label="业务负责人"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="describe"
                label="描述"
                width="200"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="userCount"
                label="状态"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>

              <el-table-column fixed="right" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="$router.push('/di/property/ad/domainManagement')"
                  >管理</el-button>
                  <i class="wire"></i>
                  <el-button type="text" @click="$router.push('')">新增子域</el-button>
                  <i class="wire"></i>
                  <el-button type="text" @click="$router.push('')">删除</el-button>
                  <i class="wire"></i>
                  <!-- <el-button type="text">查看权限</el-button> -->
                  <el-popover placement="top-start" width="200" fixed="right" trigger="click">
                    <el-table :data="gridData">
                      <el-table-column width="70" property="date" label="权限名称"></el-table-column>
                      <el-table-column width="50" property="name" label="状态"></el-table-column>
                      <el-table-column width="50" property="address" label="操作"></el-table-column>
                    </el-table>
                    <el-button slot="reference" type="text">查看权限{{scope.row.gridData}}</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <br />

          <el-row type="flex" justify="end" class="el-row-style">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="20"
              layout="prev, pager, next,sizes"
              background
              :total="10"
            ></el-pagination>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="域规范" name="second">
        <div class="interlayer-forme">
          <span class="interlayer-search">
            规范类型：
            <!-- <el-input style="width: 15%;" placeholder="请输入主题域名搜索" v-model="processName"></el-input> -->
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
          <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
          <el-button>重置</el-button>
        </div>

        <div>
          <div class="table-button">
            <!-- <el-button type="primary">+新建一级主题域</el-button> -->
            <el-dropdown>
              <el-dropdown>
                <el-button type="primary" size="small">
                  + 新建规范
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>新建资产准入规范</el-dropdown-item>
                  <el-dropdown-item>新建资产设计规范</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="admittance = true">新建资产准入规范</el-dropdown-item>
                <el-dropdown-item @click.native="design = true">新建资产设计规范</el-dropdown-item>
                <el-dropdown-item @click.native="depend = true">新建资产依赖规范</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 新建资产准入规范 -->
            <el-dialog title="新增资产准入规范" :visible.sync="admittance" width="35%">
              <el-form :model="form" label-width="80px" style="width: 80%;">
                <el-row style="font-size: 14px; margin-bottom:20px">
                  <el-col :span="5" align="end">适用域：</el-col>
                  <el-col :span="6">中间层</el-col>
                </el-row>
                <el-form-item label="规则名称" :label-width="formLabelWidth">
                  <el-select v-model="form.region" placeholder="请选择" style="width:100%">
                    <el-option label="域不准入模型约定" value="list"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="admittance = false">取 消</el-button>
                <el-button type="primary" @click="admittance = false">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 新建资产设计规范 -->
            <el-dialog title="新增资产设计规范" :visible.sync="design" width="35%">
              <el-form :model="form" label-width="80px" style="width: 80%;">
                <el-row style="font-size: 14px; margin-bottom:20px">
                  <el-col :span="5" align="end">适用域：</el-col>
                  <el-col :span="6">中间层</el-col>
                </el-row>
                <el-form-item label="规则名称" :label-width="formLabelWidth">
                  <el-select v-model="form.region" placeholder="请选择" style="width:100%">
                    <el-option label="明细表必须绑定业务过程" value="list"></el-option>
                    <el-option label="维度表必须绑定维度实体" value="dimension"></el-option>
                    <el-option label="汇总表必须绑定汇总维度" value="summary"></el-option>
                    <el-option label="资产所属主题域层级约定" value="property"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="design = false">取 消</el-button>
                <el-button type="primary" @click="design = false">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 新建资产依赖规范 -->
            <el-dialog title="新增资产依赖规范" :visible.sync="depend" width="35%">
              <el-form :model="form" label-width="80px" style="width: 80%;">
                <el-row style="font-size: 14px; margin-bottom:20px">
                  <el-col :span="5" align="end">适用域：</el-col>
                  <el-col :span="6">中间层</el-col>
                </el-row>
                <el-form-item label="规则名称" :label-width="formLabelWidth">
                  <el-select v-model="form.region" placeholder="请选择" style="width:100%">
                    <el-option label="下游消费限制约定：" value="list"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="depend = false">取 消</el-button>
                <el-button type="primary" @click="depend = false">确 定</el-button>
              </div>
            </el-dialog>
          </div>
          <el-row class="el-row-style">
            <el-table :header-cell-style="{background:'#fafafa'}">
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                prop="name"
                label="规范类型"
                width="140"
                header-align="left"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="subject"
                label="约束规则"
                width="200"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="规则描述"
                width="200"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="admin"
                label="最近一次修改人"
                width="200"
                header-align="center"
                align="center"
              ></el-table-column>

              <el-table-column fixed="right" label="操作" header-align="center" align="center"></el-table-column>
            </el-table>
          </el-row>
          <br />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Interlayer",
  components: {},
  data() {
    return {
      activeName: "first",
      processName: "",
      //   下拉框
      options: [
        {
          value: "选项1",
          label: "全部"
        },
        {
          value: "选项2",
          label: "资产准入规范"
        },
        {
          value: "选项3",
          label: "资产设计规范"
        },
        {
          value: "选项4",
          label: "资产依赖规范"
        }
      ],
      value: "",
      //   弹窗
      admittance: false,
      design: false,
      depend: false,
      information: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      //查看权限器气泡
      gridData: [
        //      {
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-04',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-01',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }, {
        //   date: '2016-05-03',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }
      ],
      //table表格
      tableData: [
        {
          name: "关系",
          subject: "rsm",
          description: "blgdala",
          admin: "bigata",
          describe: "关系是指两个实体之间的联...",
          userCount: "已有权限"
        },
        {
          name: "关系",
          subject: "rsm",
          description: "blgdala",
          admin: "bigata",
          describe: "关系是指两个实体之间的联...",
          userCount: "已有权限"
        }
      ],
      wsSearchContent: "",
      currentPage: 1
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style  scoped>
.interlayer-content {
  width: 100%;
  margin-left: 20px;
}
.interlayer-forme {
  margin-top: 10px;
  margin-bottom: 20px;
}
.interlayer-search {
  font-size: 14px;
}
.table-button {
  margin-bottom: 20px;
}
.wire {
  height: 2px;
  margin: 0 7px;
  border: 0.5px solid #ccc;
  /* color: #ccc; */
}
</style>