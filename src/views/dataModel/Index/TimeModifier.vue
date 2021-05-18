<template>
  <div class="interlayer-content">
    <el-row>
      <el-col :span="5">
        显示名：
        <el-input style="width: 68%;" placeholder="请输入关键词" v-model="processName"></el-input>
      </el-col>
      <!-- <el-col :span="7">
             主题域：
               <el-select v-model="themeDomain" placeholder="请选择">
                 <el-option
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
                 ></el-option>
               </el-select>
      </el-col>-->

      <el-col :span="7">
        状态：
        <el-select v-model="status" placeholder="请选择状态">
          <el-option value="未上线">未上线</el-option>
          <el-option value="已上线">已上线</el-option>
          <el-option value="已下线">已下线</el-option>
          <el-option value="上线中">上线中</el-option>
          <el-option value="上线失败">上线失败</el-option>
        </el-select>

        <!-- <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                   <a>更多</a>
                   <i class="el-icon-arrow-down"></i>
                 </span>
                 <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                   <a>收起</a>
                   <i class="el-icon-arrow-up"></i>
        </span>-->
      </el-col>
      <el-col :span="8">
        负责人：
        <el-select v-model="charger" placeholder="请选择负责人"></el-select>
        <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
        <el-button>重置</el-button>
      </el-col>
    </el-row>
    <!-- 新建时间修饰词弹窗 -->
    <el-dialog title="新建时间修饰词" :visible.sync="NewTimeModifier" width="35%">
      <el-form :model="form" label-width="80px" style="width: 90%;">
        <el-form-item label="显示名：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder></el-input>
        </el-form-item>
        <el-form-item label="计算公式：" :label-width="formLabelWidth">
          <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
        </el-form-item>

        <el-form-item label="业务口经" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            type="textarea"
            placeholder="请输入统计时间范围描述，列如，最近3天的描述：统计时间范围=[业务日期-2，业务日期]"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="NewTimeModifier = false">取 消</el-button>
        <el-button type="primary" @click="NewTimeModifier = false">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <div class="table-button">
        <el-button type="primary" @click="NewTimeModifier= true">+ 新建时间修饰词</el-button>
      </div>
      <el-row class="el-row-style">
        <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" label="显示名" width="120" header-align="left" align="left"></el-table-column>

          <el-table-column prop="code" label="编码" width="120" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="formula"
            label="计算公式"
            width="120"
            header-align="center"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="description"
            label="描述"
            width="300"
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
            prop="status"
            label="状态"
            width="100"
            header-align="center"
            align="center"
          ></el-table-column>

          <el-table-column label="操作" header-align="center" align="center">
            <template>
              <el-button type="text" @click="modificationTime= true">修改</el-button>
              <el-button type="text" @click="$router.push('')">下线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <br />
    </div>
    <!-- 修改弹窗 -->
    <el-dialog title="编辑时间修饰词" :visible.sync="modificationTime" width="35%">
      <el-form :model="form" label-width="80px" style="width: 90%;">
        <el-form-item label="显示名：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="近一周"></el-input>
        </el-form-item>
        <el-form-item label="计算公式：" :label-width="formLabelWidth">
          <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="窗口长读：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="7"></el-input>
        </el-form-item>
        <el-form-item label="业务口经" :label-width="formLabelWidth">
          <el-input
            v-model="form.name"
            autocomplete="off"
            type="textarea"
            placeholder="近一周：不含当前业务日期当天的近一周"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modificationTime = false">取 消</el-button>
        <el-button type="primary" @click="modificationTime = false">确 定</el-button>
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
export default {
  name: "AtomicWord",
  data() {
    return {
      //   弹窗
      NewTimeModifier: false,
      modificationTime: false,
      form: {
        name: "",
        describe: "",
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
      value: [],
      options: [
        {
          value: "zhinan",
          label: "固窗函数(含当天)",
          children: [
            {
              value: "miaoshu1",
              label: "描述：最近N天，含业务日期"
            },
            {
              value: "miaoshu2",
              label: "描述：最近N自然月，含业务日期所在月份"
            },
            {
              value: "miaoshu3",
              label: "描述：最近N自然周，含业务日期所在月周"
            },
            {
              value: "miaoshu4",
              label: "描述：最近N个自然年，含业务日期所在月年"
            },
            {
              value: "miaoshu5",
              label: "描述：最近N季度，含业务日期所在月季度"
            },
            {
              value: "miaoshu6",
              label: "描述：最近N小时，含当前小时"
            },
            {
              value: "miaoshu7",
              label: "描述：最近N分钟，含当前分钟"
            }
          ]
        },

        {
          value: "zhinan",
          label: "固窗函数(不含当天)",
          children: [
            {
              value: "miaoshu8",
              label: "描述：前N天，不含业务日期"
            },
            {
              value: "miaoshu9",
              label: "描述：前N自然月，不含业务日期所在月份"
            },
            {
              value: "miaoshu10",
              label: "描述：前N自然周，不含业务日期所在月周"
            },
            {
              value: "miaoshu11",
              label: "描述：前N个自然年，不含业务日期所在月年"
            },
            {
              value: "miaoshu12",
              label: "描述：前N季度，不含业务日期所在月季度"
            },
            {
              value: "miaoshu13",
              label: "描述：前N小时，不含当前小时"
            },
            {
              value: "miaoshu14",
              label: "描述：前N分钟，不含当前分钟"
            }
          ]
        },

        {
          value: "zhinan",
          label: "滑窗函数",
          children: [
            {
              value: "miaoshu15",
              label: "描述：周初至当前业务日期"
            },
            {
              value: "miaoshu16",
              label: "描述：月初至当前业务日期"
            },
            {
              value: "miaoshu17",
              label: "描述：年初至当前业务日期"
            },
            {
              value: "miaoshu18",
              label: "描述：财初至当前业务日期"
            },
            {
              value: "miaoshu19",
              label: "描述：季初至当前业务日期"
            },
            {
              value: "miaoshu20",
              label: "描述：历史至当前业务日期"
            }
          ]
        }
      ],

      moreStatus: "down",
      // options: [
      //   {
      //     value: "选项1",
      //     label: "主题一"
      //   },
      //   {
      //     value: "选项2",
      //     label: "主题二"
      //   }
      // ],
      // value: "",

      businessListe: [
        {
          liste: "选项1",
          label: "业务过程一"
        },
        {
          liste: "选项2",
          label: "业务过程二"
        }
      ],
      liste: "",

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
          name: "近一周",
          code: "pre7DAY",
          formula: "pre{N}DA/N=7",
          description: "近一周：不含当前业务日期当天的近一周",
          admin: "bigdata",
          status: "已上线"
        }
      ],
      wsSearchContent: "",
      currentPage: 1,

      multipleSelection: [],
      processName: "",
      themeDomain: "",
      business: "",
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
    // 按钮
    handleClick() {
      alert("button click");
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

<style scoped>
.el-table--scrollable-x .el-table__body-wrapper {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
}
.scroll {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
}
.atomicword-box {
  margin-right: 20px;
}
.atomicword-i {
  font-style: normal;
  color: #1890ff;
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
.more-button {
  margin-left: 10px;
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}
.el-dropdown {
  vertical-align: bottom;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
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
.atomicword-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.interlayer-content {
  margin-left: 20px;
  font-size: 12px;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
