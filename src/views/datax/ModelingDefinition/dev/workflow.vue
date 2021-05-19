<template>
  <div class="workflowCanves">
    <div class="header">
      <div
        class="header_action"
        style="margin-left: 17px"
        @click="drawer = true"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="脚本模式"
          placement="top-start"
        >
          <i class="el-icon-picture-outline" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left: 27px">
        <el-tooltip
          class="item"
          effect="dark"
          content="导入已有表"
          placement="top-start"
        >
          <i class="el-icon-upload" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left: 27px">
        <el-tooltip
          class="item"
          effect="dark"
          content="查看"
          placement="top-start"
        >
          <i class="el-icon-view" />
        </el-tooltip>
      </div>
      <div
        @click="submitForm('ruleForm', 'DATA')"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="保存"
          placement="top-start"
        >
          <i class="el-icon-mobile" />
        </el-tooltip>
      </div>
      <div v-if="locking === 1" class="header_action" style="margin-left: 27px">
        <el-tooltip
          class="item"
          effect="dark"
          content="锁定表"
          placement="top-start"
        >
          <i class="el-icon-unlock" />
        </el-tooltip>
      </div>
      <div v-if="locking === 0" class="header_action" style="margin-left: 27px">
        <i class="el-icon-lock" />
      </div>
      <div
        @click="submitForm('ruleForm', 'data')"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="提交"
          placement="top-start"
        >
          <i class="el-icon-wind-power" />
        </el-tooltip>
      </div>
    </div>
    <el-drawer
      class="drawer"
      title="脚本模式"
      :visible.sync="drawer"
      size="50%"
      :with-header="true"
    >
      <div style="padding-left: 30px; padding-right: 30px">
        <div style="margin-bottom: 30px; font-size: 14px">
          表明中包含的主题域层级:
          <el-radio v-model="radio" label="1">二级主题域</el-radio>
          <el-radio v-model="radio" label="2">三级主题域</el-radio>
          <el-radio v-model="radio" label="3">四级主题域</el-radio>
        </div>
        <el-input
          style="margin-bottom: 20px"
          show-word-limit="true"
          type="textarea"
          rows="20"
          v-model="desc"
        ></el-input>
        <div>
          <el-button @click="synchronization" type="primary">同步</el-button>
        </div>
      </div>
    </el-drawer>
    <div class="top">
      <div class="title1">基本信息</div>
      <span class="tips">
        模型发布后不可修改数据层级，表类型，主题域和模型名，请确定信息无误后再操作！
      </span>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="数据层级:" prop="tabPosition">
          <el-radio-group
            v-model="ruleForm.tabPosition"
            style="margin-bottom: 30px"
          >
            <el-radio-button
              @click="
                () => {
                  ruleForm.tabPosition = '1'
                }
              "
              label="top"
              >中间层</el-radio-button
            >
            <el-radio-button
              @click="
                () => {
                  ruleForm.tabPosition = '2'
                }
              "
              label="right"
              >应用层</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
            <el-form-item label="主题域:" prop="themes">
              <el-select v-model="ruleForm.themes" style="width: 234px">
                <el-option
                  v-for="item in ruleForm.theme"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
            <el-form-item label="表类型:" prop="TableTypes">
              <el-select v-model="ruleForm.TableTypes" style="width: 234px">
                <el-option
                  v-for="item in ruleForm.TableType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="7" /> -->
        </el-row>
        <el-form-item label="业务过程:" prop="Business">
          <el-select v-model="ruleForm.Business" placeholder="请选择业务过程">
            <el-option
              v-for="item in ruleForm.Busines"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称:">
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-input style="width: 30%"></el-input>_
              <el-input style="width: 30%"></el-input>_
              <el-input style="width: 30%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <el-select
                v-model="ruleForm.ModelNames"
                placeholder="请选择模型名称"
              >
                <el-option
                  v-for="item in ruleForm.ModelName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="保障等级:" prop="Securitys">
          <el-select v-model="ruleForm.Securitys" placeholder="请选择保障等级">
            <el-option
              v-for="item in ruleForm.Security"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="表描述:">
          <el-input
            rows="5"
            type="textarea"
            placeholder="请输入表描述"
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <div class="title1">物理信息</div>
        <el-form-item label="project :" prop="delivery">
          <el-input v-model="ruleForm.project" style="width: 30%">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="生命周期:" prop="delivery">
          <el-input v-model="ruleForm.lifecycle" style="width: 30%">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否分区表:" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="true"></el-radio>
            <el-radio label="false"></el-radio>
          </el-radio-group>
        </el-form-item>
        <p style="margin-bottom: 30px; color: red">
          创建物理表后不可再修改分区信息，请谨慎操作！
        </p>
        <div class="title1">字段信息</div>
        <template style="margin-bottom: 30px">
          <el-table :data="ruleForm.tableData" style="width: 100%">
            <el-table-column prop="Field" label="字段名" width="100">
            </el-table-column>
            <el-table-column prop="FieldDesc" label="字段描述" width="100">
            </el-table-column>
            <el-table-column prop="BusinessCaliber" label="业务口径">
            </el-table-column>
            <el-table-column prop="datatype" label="数据类型">
            </el-table-column>
            <el-table-column prop="PrimaryKey" label="主键"> </el-table-column>
            <el-table-column prop="BindingIndex" label="绑定指标">
            </el-table-column>
            <el-table-column prop="NotEmpty" label="非空"> </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
            <div slot="empty">
              <p style="margin-top: 20px">
                <img src="@/icons/nodata.gif" />
              </p>
            </div>
          </el-table>
        </template>
        <div style="margin-top: 30px">
          <el-button icon="el-icon-plus">添加字段</el-button>
          <el-button>从需求导入</el-button>
        </div>
        <!-- <el-form-item style="margin-top: 30px">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script id="code">
import go from 'gojs'
import * as workFlowApi from '@/api/datax-job-info'
import * as logApi from '@/api/datax-job-log'
export default {
  name: 'Flow',
  data() {
    return {
      locking: 1,
      desc: '',
      radio: '',
      ruleForm: {
        // tableData: [
        //   {
        //     Field: 'Field',
        //     FieldDesc: 'FieldDesc',
        //     BusinessCaliber: '888',
        //     datatype: 'string',
        //     PrimaryKey: 's',
        //     BindingIndex: '666',
        //     NotEmpty: 'true',
        //   },
        //   {
        //     Field: 'Field',
        //     FieldDesc: 'FieldDesc',
        //     BusinessCaliber: '888',
        //     datatype: 'string',
        //     PrimaryKey: 's',
        //     BindingIndex: '666',
        //     NotEmpty: 'false',
        //   },
        //   {
        //     Field: 'Field',
        //     FieldDesc: 'FieldDesc',
        //     BusinessCaliber: '888',
        //     datatype: 'string',
        //     PrimaryKey: 's',
        //     BindingIndex: '666',
        //     NotEmpty: 'true',
        //   },
        // ],
        theme: [
          { id: 1, value: '主题域1', name: '主题域1' },
          { id: 2, value: '主题域2', name: '主题域2' },
        ],
        TableType: [
          { id: 1, value: '类型1', name: '类型1' },
          { id: 2, value: '类型2', name: '类型2' },
        ],
        Busines: [
          { id: 1, value: '业务过程1', name: '业务过程1' },
          { id: 2, value: '模型名称1', name: '模型名称1' },
        ],
        Security: [
          { id: 1, value: 'A', name: 'A' },
          { id: 2, value: 'B', name: 'B' },
          { id: 3, value: 'C', name: 'C' },
        ],
        ModelName: [
          { id: 1, value: '模型名称1', name: '模型名称1' },
          { id: 2, value: '模型名称2', name: '模型名称2' },
          { id: 3, value: '模型名称3', name: '模型名称3' },
        ],
        themes: '',
        TableTypes: '',
        Business: '',
        Securitys: '',
        ModelNames: '',
        name: '',
        lifecycle: '',
        project: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        tabPosition: '',
      },
      rules: {
        Securitys: [
          { required: true, message: '请选择保障等级', trigger: 'change' },
        ],
        TableTypes: [
          { required: true, message: '请选择表类型', trigger: 'change' },
        ],
        themes: [
          { required: true, message: '请选择主图域', trigger: 'change' },
        ],
        tabPosition: [
          { required: true, message: '请选择数据层级', trigger: 'change' },
        ],
        Business: [
          { required: true, message: '请选择业务过程', trigger: 'change' },
        ],
      },
      drawer: false,
      /** 工作流Id */
      myId: '',
      taskList: '', // 当前任务列表
      form: {
        // taskName: '子任务' // 选中任务名称
      },
      currentType: '', // 当前选中节点的任务类型
      dialogFormVisible: false,
      dialogDrawer: false, // 抽屉
      project_id: '', // 当前项目Id
      dataJob: {}, // 当前任务数据
      showCronBox: false, // cron表达式对话框
      drawerForm: {},
      dialogLogVisible: false,
      dialogDetails: false,
    }
  },
  watch: {},
  created() {
    console.log('qqq', this.ruleForm.theme)
  },
  mounted() {},
  methods: {
    submitForm(formName, data) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (data === 'data') {
            this.$message({
              message: '执行成功',
              type: 'success',
            })
          }
          if (data === 'DATA')
            this.$message({
              message: '保存成功',
              type: 'success',
            })
          console.log('www', this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleClick() {
      console.log('111')
    },
    synchronization() {
      console.log('label', this.radio, this.desc)
    },
    Submit() {
      this.$message({
        message: '执行成功',
        type: 'success',
      })
      console.log('www', this.ruleForm)
    },
    fetchTables(e) {
      console.log(e, '111111111')
      const param = {}
      param.datasourceId = e
      dsQueryApi.getTables(param).then((res) => {
        this.tableList = res
      })
    },
    //脚本模式弹框
    ScriptMode() {},
    // 点击选中任务
    handleWorkFlow(e) {
      console.log(e)
      this.dataJob = e
    },
  },
}
</script>

<style lang="scss">
.workflowCanves {
  .tit {
    height: 30px;
    line-height: 30px;
    background-color: skyblue;
    margin: 10px;
    .el-button {
      margin: 0px 24px;
    }
  }
  // .parent {
  //     width: 100%;
  //     height: 100%;
  //     display: flex;
  //     border: solid 1px lightgray;
  //   .myPalette {
  //     width: 100px;
  //     margin-right: 2px;
  //   }
  //   .myDiagram {
  //     flex-grow: 1;
  //     height: 589px;
  //   }
  // }
}
</style>
<style scoped>
.drawer {
  overflow: scroll;
}
.title1 {
  height: 40px;
  width: 100%;
  padding-left: 10px;
  margin-bottom: 20px;
  line-height: 40px;
  background: #f5f5f5;
  color: #000;
  /* background: #00ffff; */
}
.top {
  width: 100%;
  height: auto;
  padding-top: 15px;
  padding-left: 30px;
  border: 1px solid #ccc;
}
.tips {
  display: block;
  height: 40px;
  width: 100%;
  padding-left: 20px;
  font-size: 14px;
  line-height: 40px;
  background: #f8f8ff;
  border: 1px solid #ccc;
}
.header {
  overflow: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
}
.header_action {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  line-height: 20px;
  float: left;
  cursor: pointer;
}
.svgIcon {
  font-size: 18px;
}
.header_action:not(:first-child) {
  margin-left: 32px;
}
.header_action span {
  margin-left: 4px;
}
.header_switch {
  float: right;
}
.header-second {
  overflow: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  background: #f8f8fa;
}
</style>
