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
          <!-- 新建一级主题域弹窗 -->

          <el-dialog title="新建主题域" :visible.sync="information" width="35%">
            <el-form :model="form" label-width="80px" style="width: 80%;">
              <el-row style="font-size: 14px; margin-bottom:20px">
                <el-col :span="5" align="end">域类型：</el-col>
                <el-col :span="6">应用层</el-col>
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
                    @click="$router.push('/di/property/ad/MarketingScenario')"
                  >管理</el-button>
                  <i class="wire"></i>
                  <el-button type="text" @click="$router.push('')">新增子域</el-button>
                  <i class="wire"></i>
                  <el-button type="text" @click="$router.push('')">删除</el-button>
                  <i class="wire"></i>
                  <!-- <el-button type="text">查看权限 {{scope.row.jurisdiction}}</el-button> -->
                  <el-popover
                    placement="top-start"
                    width="270"
                    fixed="right"
                    trigger="click"
                    style="font-size:12px"
                  >
                    <el-table :data="jurisdiction">
                      <el-table-column width="90" property="name" label="权限名称"></el-table-column>
                      <el-table-column width="80" property="state" label="状态"></el-table-column>
                      <el-table-column width="50" property="address" label="操作"></el-table-column>
                    </el-table>
                    <el-button slot="reference" type="text">查看权限{{scope.row.jurisdiction}}</el-button>
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
            搜索主题域：
            <el-input style="width: 15%;" placeholder="请输入主题域名搜索" v-model="processName"></el-input>
          </span>
          <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
          <el-button>重置</el-button>
        </div>

        <div>
          <div class="table-button">
            <!-- <el-button type="primary">+新建规范</el-button> -->
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
  name: "Application",
  components: {},
  data() {
    return {
      activeName: "first",
      processName: "",

      //   弹窗
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
      // 查看权限
      jurisdiction: [
        {
          name: "维度管理",
          state: "已有权限"
        },
        {
          name: "模型管理",
          state: "已有权限"
        },
        {
          name: "业务过程管理",
          state: "已有权限"
        },
        {
          name: "指标管理",
          state: "已有权限"
        }
      ],
      //table表格
      tableData: [
        {
          name: "营销场景",
          subject: "mkt",
          description: "blgdala",
          admin: "bigata",
          describe: "交叉运营和营销所需的数据...",
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

<style scoped>
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