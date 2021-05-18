<template>
  <div class="interlayer-content">
    <el-row>
      <el-col :span="7">
        显示名：
        <el-input style="width: 68%;" placeholder="请输入关键词" v-model="processName"></el-input>
      </el-col>
      <el-col :span="7">
        主题域：
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
    <el-row v-show="moreStatus=='up'" style="width: 100%; margin-top: 15px;">
      负责人：
      <el-select v-model="charger" placeholder="请选择负责人"></el-select>
      <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
    </el-row>
    <!-- 新建业务修饰词弹窗 -->
    <el-dialog title="新建业务修饰词" :visible.sync="newBusinessModifier" width="35%">
      <el-form :model="form" label-width="80px" style="width: 90%;">
        <el-form-item label="主题域：" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择" style="width:100%;">
            <el-option label="+新增原子词" value="list"></el-option>
            <el-option label="累计充值金额" value="dimension"></el-option>
            <el-option label="主题域：营销场景" value="dimension"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示名：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="原子词的中文名称"></el-input>
        </el-form-item>
        <el-form-item label="业务口经" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" type="textarea" placeholder></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newBusinessModifier = false">取 消</el-button>
        <el-button type="primary" @click="newBusinessModifier = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示名弹窗 -->
    <el-dialog title="新建维度" :visible.sync="information" width="35%">
      <el-form :model="form" label-width="80px" style="width: 80%;">
        <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
          <el-col :span="7" align="end">显示名：</el-col>
          <el-col :span="7">大额存单</el-col>
        </el-row>
        <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
          <el-col :span="7" align="end">主题域：</el-col>
          <el-col :span="10">营销场景</el-col>
        </el-row>
        <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
          <el-col :span="7" align="end">状态：</el-col>
          <el-col :span="7">已上线</el-col>
        </el-row>
        <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
          <el-col :span="7" align="end">负责人：</el-col>
          <el-col :span="10">bigdata</el-col>
        </el-row>
        <el-row style="font-size: 14px; margin-bottom:20px" :label-width="formLabelWidth">
          <el-col :span="7" align="end">业务口径：</el-col>
          <el-col :span="12">大额存单业务</el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="information = false">取 消</el-button>
        <el-button type="primary" @click="information = false">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <div class="table-button">
        <el-button type="primary" @click="newBusinessModifier= true">+ 新建业务修饰词</el-button>
      </div>

      <el-row class="el-row-style">
        <el-table :data="tableData" :header-cell-style="{background:'#fafafa'}">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name" label="显示名" width="200" header-align="left" align="left">
            <template>
              <el-button type="text" @click="information = true">大额存单</el-button>
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
            prop="process"
            label="业务口径"
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
            prop="status"
            label="状态"
            width="100"
            header-align="center"
            align="center"
          ></el-table-column>

          <el-table-column fixed="right" label="操作" header-align="center" align="center">
            <template>
              <el-button type="text" @click="modification= true">修改</el-button>
              <el-button type="text" @click="$router.push('')">下线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <br />
      <!-- 修改弹窗 -->
      <el-dialog title="新建业务修饰词" :visible.sync="modification" width="35%">
        <el-form :model="form" label-width="80px" style="width: 90%;">
          <el-form-item label="主题域：" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择" style="width:100%;">
              <el-option label="主题域：营销场景" value="dimension">营销场景</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示名：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" placeholder="大额存单"></el-input>
          </el-form-item>
          <el-form-item label="业务口经" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" type="textarea" placeholder="大额存单业务"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modification = false">取 消</el-button>
          <el-button type="primary" @click="modification = false">确 定</el-button>
        </div>
      </el-dialog>
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
        :page-size="10"
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
  name: "BusinessModifier",
  data() {
    return {
      //   弹窗
      information: false,
      newBusinessModifier: false,
      modification: false,
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

      moreStatus: "down",
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
          name: "充值",
          subject: "营销场景(应用层)",
          process: "大额存单业务",
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
.atomicword-box {
  /* display: flex;
   */

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
