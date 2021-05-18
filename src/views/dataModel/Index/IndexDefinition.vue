<template>
  <div class="interlayer-content">
    <el-row>
      <el-col :span="7">
        显示名：
        <el-input style="width: 68%;" placeholder="请输入关键词" v-model="processName"></el-input>
      </el-col>
      <el-col :span="7">
        <span class="demonstration">主题域：</span>
        <el-cascader :options="options" :props="props" clearable></el-cascader>
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
    </el-row>
    <el-row v-show="moreStatus=='up'" style="width: 40%; margin-top: 15px;">
      负责人：
      <el-select v-model="charger" placeholder="请选择负责人"></el-select>
      <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
    </el-row>

    <div>
      <div class="table-button">
        <el-button type="primary" @click="newDerived = true">+ 新建派生指标</el-button>
      </div>
      <!-- 新建派生指标弹窗 -->
      <el-dialog title="新建派生指标" :visible.sync="newDerived" width="35%">
        <el-form :model="form" label-width="80px" style="width: 90%;">
          <el-form-item label="主题域" :label-width="formLabelWidth">
            <el-cascader :options="options" :props="props" clearable style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="时间修饰：" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请搜索" style="width:100%">
              <el-option label="近一周" value="list"></el-option>
            </el-select>
          </el-form-item>
          <span class="form-text-span">若找不到需要的时间修饰，请联系超域管理员bigdata添加</span>
          <el-form-item label="业务修饰：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
          </el-form-item>
          <el-form-item label="原子词：" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请搜索" style="width:100%;">
              <el-option label="+新增原子词" value="list"></el-option>
              <el-option label="累计充值金额" value="dimension"></el-option>
              <el-option label="主题域：营销场景" value="dimension"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示名：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="近一周大额存单累计充值金额"></el-input>
          </el-form-item>
          <el-form-item label="度量单位：" :label-width="formLabelWidth">
            <el-select
              v-model="form.region"
              placeholder
              style="width:48%;margin-right:10px"
              class="box"
            >
              <i slot="prefix" class="select-box">类型</i>
              <el-option label="比例" value="list"></el-option>
              <el-option label="计数" value="dimension"></el-option>
              <el-option label="金额" value="dimension"></el-option>
            </el-select>
            <el-select v-model="form.region" placeholder style="width:48%;" class="box">
              <i slot="prefix" class="select-box">单位</i>
              <el-option label="万元(人民币)" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否公开口径：" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="1">备选项</el-radio>
            <el-radio v-model="radio" label="2">备选项</el-radio>
          </el-form-item>
          <el-form-item label="业务口" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" type="textarea" placeholder></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newDerived = false">取 消</el-button>
          <el-button type="primary" @click="newDerived = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 显示名弹窗 -->
      <el-dialog title="新建维度" :visible.sync="information" width="35%">
        <el-form :model="form" label-width="80px" style="width: 80%;">
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">是否全域共享：</el-col>
            <el-col :span="3">否</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">原子词：</el-col>
            <el-col :span="10">累计充值金额</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">时间周期：</el-col>
            <el-col :span="7">近一周</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">修饰词：</el-col>
            <el-col :span="10">大额存单</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">显示名：</el-col>
            <el-col :span="12">近一周大额存单累计充值金额</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">主题域：</el-col>
            <el-col :span="16">自然人/行为信息/金融产品行为</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">负责人：</el-col>
            <el-col :span="8">bigdata</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">状态：</el-col>
            <el-col :span="5">已上线</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">度量单位：</el-col>
            <el-col :span="10">金额万元(人民币)</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">是否公开口径：</el-col>
            <el-col :span="3">是</el-col>
          </el-row>
          <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
            <el-col :span="7" align="end">业务口径：</el-col>
            <el-col :span="23" class="text">时间修饰词：近一周：不含当前业务日期当天的最近一周业务修饰词1：大额存单业务原子词：累计充值金额</el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="information = false">取 消</el-button>
          <el-button type="primary" @click="information = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-row class="el-row-style">
        <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" label="显示名" width="200" header-align="left" align="left">
            <template>
              <el-button type="text" @click="information = true">近一周大额存单累计充值金额</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="subject"
            label="主题域"
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
            prop="description"
            label="已关联资产"
            width="220"
            header-align="center"
            align="center"
          >
            <template>
              <el-button type="text" @click="model = true">模型0</el-button>
              <el-button type="text" @click="NewDerived = true">关联资产1</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userCount"
            label="状态"
            width="100"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" header-align="center" align="center">
            <template>
              <el-button type="text" @click="$router.push('')">修改</el-button>
              <el-button type="text" @click="clone= true">克隆</el-button>
              <el-button type="text" @click="$router.push('')">下线</el-button>
              <!-- <el-button type="text">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 新建派生指标克隆弹窗 -->
      <el-dialog title="新建派生指标" :visible.sync="clone" width="35%">
        <div class="clone-box">
          <span class="el-icon-info"></span>
          <span class="clone-text">请至少修改"原子词"、"时间周期"、"修饰词"、中的一项，才能通过不同名校验证完成指标的克隆</span>
        </div>
        <el-form :model="form" label-width="80px" style="width: 90%;">
          <el-form-item label="主题域" :label-width="formLabelWidth">
            <el-cascader :options="options" :props="props" clearable style="width:100%"></el-cascader>
          </el-form-item>
          <el-form-item label="时间修饰：" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请搜索" style="width:100%">
              <el-option label="近一周" value="list"></el-option>
            </el-select>
          </el-form-item>
          <span class="form-text-span">若找不到需要的时间修饰，请联系超域管理员bigdata添加</span>
          <el-form-item label="业务修饰：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
          </el-form-item>
          <el-form-item label="原子词：" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请搜索" style="width:100%;">
              <el-option label="+新增原子词" value="list"></el-option>
              <el-option label="累计充值金额" value="dimension"></el-option>
              <el-option label="主题域：营销场景" value="dimension"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示名：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="近一周大额存单累计充值金额"></el-input>
          </el-form-item>
          <el-form-item label="度量单位：" :label-width="formLabelWidth">
            <el-select
              v-model="form.region"
              placeholder
              style="width:48%;margin-right:10px"
              class="box"
            >
              <i slot="prefix" class="select-box">类型</i>
              <el-option label="比例" value="list"></el-option>
              <el-option label="计数" value="dimension"></el-option>
              <el-option label="金额" value="dimension"></el-option>
            </el-select>
            <el-select v-model="form.region" placeholder style="width:48%;" class="box">
              <i slot="prefix" class="select-box">单位</i>
              <el-option label="万元(人民币)" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否公开口径：" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
          </el-form-item>
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clone = false">取 消</el-button>
          <el-button type="primary" @click="clone = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 模型0弹窗 -->
      <el-dialog title="已关联模型" :visible.sync="model" width="35%">
        <el-row class="el-row-style">
          <el-table :data="modelTable" :header-cell-style="{background:'#fafafa'}">
            <el-table-column
              prop="property"
              label="模型名称"
              width="120"
              header-align="left"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="statistics"
              label="负责人"
              width="100"
              header-align="center"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="principal"
              label="状态"
              width="100"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <!-- <template>
                    <el-button type="text" @click="$router.push('')">去管理</el-button>
              </template>-->
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="model = false">取 消</el-button>
          <el-button type="primary" @click="model = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 已关联指标资产弹窗 -->
      <el-dialog title="已关联指标资产" :visible.sync="NewDerived" width="35%">
        <el-button type="primary" style="margin-bottom:15px">+ 新建派生指标</el-button>
        <el-row class="el-row-style">
          <el-table :data="newIndicators" :header-cell-style="{background:'#fafafa'}">
            <el-table-column
              prop="property"
              label="资产code"
              width="120"
              header-align="left"
              align="left"
            ></el-table-column>
            <el-table-column
              prop="statistics"
              label="统计维度"
              width="100"
              header-align="center"
              align="center"
            ></el-table-column>

            <el-table-column
              prop="principal"
              label="负责人"
              width="100"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="100"
              header-align="center"
              align="center"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" header-align="center" align="center">
              <template>
                <el-button type="text" @click="$router.push('')">去管理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="NewDerived = false">取 消</el-button>
          <el-button type="primary" @click="NewDerived = false">确 定</el-button>
        </div>
      </el-dialog>
      <br />
      <el-row></el-row>
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
export default {
  name: "IndexDefinition",
  data() {
    return {
      // 单选按钮
      radio: "1",
      //   弹窗
      information: false,
      NewDerived: false,
      model: false,
      newDerived: false,
      clone:false,
      form: {
        name: "",
        describe: "",
        region: "",
        sceneOne: "",
        sceneTow: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
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

      moreStatus: "down",
      optionsOne: [
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
      // 新增指标资产table弹窗
      newIndicators: [
        {
          property: "MAME34T66B",
          statistics: "日",
          principal: "bigdata",
          state: "未上线"
        }
      ],
      //table表格
      tableData: [
        {
          name: "充值",
          subject: "自然人行为信息/金融产品为(中间层)",
          description: "金融账户充值事件，代表真...",
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
  },
  components: {},
  created() {
    this.$emit("showNavBars", true);
  }
};
</script>

<style lang="scss" scoped>
.el-col-23 {
  width: 63.83333%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.el-row--flex.is-justify-end {
  display: flex;
  justify-content: "space-between";
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

.interlayer-content {
  margin-left: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-right: 20px;
}
.select-box {
  width: 50px;
  height: 30px;
  margin-left: -4px;
  margin-top: 2px;
  display: inline-block;
  font-style: normal;
  background-color: #fafafa;
}
/deep/ .box .el-input--small .el-input__inner {
  padding-left: 70px;
}
.form-text-span {
  margin-left: 102px;
  display: inline-block;
  margin-bottom: 10px;
  color: #a6a6a6;
}

.clone-box{
  width: 100%;
  height: 58px;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
  background-color: #e7f7ff;
  border: 1px solid #bbe5f5;
}

.clone-text{
   font-size:12px;
  color: #767b79;
}
.el-icon-info{
  margin-right: 10px;
  color: #1b8ffc;
}
</style>
