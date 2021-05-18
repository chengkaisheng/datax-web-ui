<template>
  <div class="interlayer-content">
    <el-row>
      <el-col :span="7">
        显示名：
        <el-input style="width: 68%;" placeholder="请输入业务过程名称" v-model="processName"></el-input>
      </el-col>
      <el-col :span="7">
        <div class="block">
          <span class="demonstration">主题域：</span>
          <el-cascader :options="options" :props="props" clearable></el-cascader>
        </div>
      </el-col>

      <el-col :span="10">
        状态：
        <el-select v-model="status" placeholder="请选择状态">
          <el-option value="未上线">未上线</el-option>
          <el-option value="已上线">已上线</el-option>
          <el-option value="已下线">已下线</el-option>
          <el-option value="上线中">上线中</el-option>
          <el-option value="上线失败">上线失败</el-option>
        </el-select>
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
      <el-row v-show="moreStatus=='up'" style="width:40%;margin-top:15px">
        <br />
        <br />负责人：
        <el-select v-model="charger" placeholder="请选择负责人"></el-select>
        <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
      </el-row>
    </el-row>

    <div>
      <div class="table-button">
        <el-button type="primary" @click="information = true">+ 新建业务过程</el-button>
      </div>
      <!-- 新建业务过程弹窗 -->
      <el-dialog title="新建业务过程" :visible.sync="information" width="35%">
        <el-form :model="form" label-width="80px" style="width: 80%;">
          <el-form-item label="显示名：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
          </el-form-item>
          <el-form-item label="规则名称" :label-width="formLabelWidth">
            <!-- <el-select v-model="form.region" placeholder="请选择" style="width:100%">
              <el-option label="营销场景" value="list"></el-option>
              <el-option label="关系" value="dimension"></el-option>
              <el-option label="自然人" value="dimension"></el-option>
            </el-select>-->
            <el-cascader :options="options" :props="props" clearable style="width:100%"></el-cascader>
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
          <el-table-column prop="name" label="显示名" width="140" header-align="left" align="left"></el-table-column>
          <el-table-column
            prop="subject"
            label="主题域"
            width="220"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            width="220"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="admin"
            label="负责人"
            width="100"
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
              <el-button type="text" @click="modification = true">修改</el-button>&emsp;
              <el-popconfirm title="确认下载？" trigger="hover" placement="top">
                <el-button slot="reference" type="text">下线{{scope.row.showing}}</el-button>
              </el-popconfirm>&emsp;
              <el-button type="text" @click="businessProcesses = true">关联下游业务过程</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <br />
    </div>
    <!-- 关联下游业务过程弹窗 -->
    <el-dialog title="修改关联下游业务过程" :visible.sync="businessProcesses" width="35%">
      <el-form :model="form" label-width="80px" style="width: 80%;">
        <el-row style="font-size: 14px; margin-bottom:20px">
          <el-col :span="8" align="end">当前业务过程：</el-col>
          <el-col :span="3">充值</el-col>
        </el-row>
        <el-form-item label="添加关联" :label-width="formLabelWidth">
          <el-cascader
            :options="options"
            :props="props"
            clearable
            style="width:100%"
            placeholder="请选择主题域"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="已关联：" :label-width="formLabelWidth">
          <el-row class="el-row-style">
            <el-table :data="businessProcessesTable" :header-cell-style="{background:'#fafafa'}">
              <!-- <el-table-column type="selection"></el-table-column> -->
             <el-table-column
                prop="subject"
                label="主题域"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="业务过程"
                width="100"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" header-align="center" align="center">
                <template></template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="businessProcesses = false">取 消</el-button>
        <el-button type="primary" @click="businessProcesses = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建业务过程修改弹窗 -->
    <el-dialog title="修改业务过程" :visible.sync="modification" width="35%">
      <el-form :model="form" label-width="80px" style="width: 80%;">
        <el-form-item label="显示名：" :label-width="formLabelWidth" placeholder="充值">
          <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
        </el-form-item>
        <el-form-item label="规则名称" :label-width="formLabelWidth">
          <!-- <el-select v-model="form.region" placeholder="请选择" style="width:100%">
            <el-option label="营销场景" value="list"></el-option>
            <el-option label="关系" value="dimension"></el-option>
            <el-option label="自然人" value="dimension"></el-option>
          </el-select>-->
          <el-cascader :options="options" :props="props" clearable style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="数据域描述：" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            type="textarea"
            placeholder="金融账户充值事件，代表真实的金融交易"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modification = false">取 消</el-button>
        <el-button type="primary" @click="modification = false">确 定</el-button>
      </div>
    </el-dialog>
    <div class="atomicword-button">
      <div>
        <span class="atomicword-box">
          <span class="atomicword-checkbox"></span>
          <span>
            已选
            <i class="atomicword-i">0</i>个
          </span>
        </span>
        <el-button type="info" plain>批量上线</el-button>
        <el-button type="info" plain>批量下线</el-button>
        <el-dropdown trigger="click">
          <el-button type="info" trigger="click" class="more-button">
            更多批量操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>批量操作</el-dropdown-item>
            <el-dropdown-item>批量操作</el-dropdown-item>
            <el-dropdown-item>批量操作</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
  </div>
</template>

<script>
// import SideNavBar from '../SideNavBar.vue'
export default {
  name: "BusinessProcess",
  data() {
    return {
      // 级联选择器
      props: { multiple: true },
      options: [
        {
          value: 1,
          label: "营销场景(应用层)",
          children: [
            {
              value: 2,
              label: "行为信息(中间层)",
              children: [
                { value: 3, label: "金融产品行为(中间层)" },
                { value: 4, label: "社会行为(中间层)" }
              ]
            },
            {
              value: 7,
              label: "江苏",
              children: [
                { value: 8, label: "南京" },
                { value: 9, label: "苏州" },
                { value: 10, label: "无锡" }
              ]
            },
            {
              value: 12,
              label: "浙江",
              children: [
                { value: 13, label: "杭州" },
                { value: 14, label: "宁波" },
                { value: 15, label: "嘉兴" }
              ]
            }
          ]
        },
        {
          value: 17,
          label: "关系(中间层)",
          children: [
            {
              value: 18,
              label: "陕西",
              children: [
                { value: 19, label: "西安" },
                { value: 20, label: "延安" }
              ]
            },
            {
              value: 21,
              label: "新疆维吾尔族自治区",
              children: [
                { value: 22, label: "乌鲁木齐" },
                { value: 23, label: "克拉玛依" }
              ]
            }
          ]
        },
        {
          value: 24,
          label: "关系(中间层)",
          children: [
            {
              value: 25,
              label: "陕西",
              children: [
                { value: 26, label: "西安" },
                { value: 27, label: "延安" }
              ]
            },
            {
              value: 28,
              label: "行为信息(中间层)",
              children: [
                { value: 29, label: "金融" },
                { value: 30, label: "社会" }
              ]
            }
          ]
        }
      ],

      //   弹窗
      information: false,
      modification: false,
      businessProcesses: false,
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

      moreStatus: "down",

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
      // 关联下游业务过程table数据
      businessProcessesTable:[],
      //table表格
      tableData: [
        {
          showing: "",
          name: "充值",
          subject: "自然人行为信息/金融产品为(中间层)",
          description: "金融账户充值事件，代表真...",
          admin: "bigata",
          userCount: "已上线"
        },
        {
          showing: "",
          name: "一谈户开户",
          subject: "自然人行为信息/金融产品为(中间层)",
          description: "在银行开具一类户时发生的...",
          admin: "bigata",
          userCount: "已上线"
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
    }

    //弹窗
  },
  components: {
    // 'prop-side-nav-bar': SideNavBar
  },
  created() {
    this.$emit("showNavBars", true);
  }
};
</script>

<style lang="scss" scoped>
.el-popconfirm__action {
  text-align: right;
  margin: 0;
  margin-top: 10px;
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
  width: 100%;
  margin-left: 20px;
  font-size: 12px;
  margin-top: 20px;
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

.interlayer-content {
  margin-left: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
