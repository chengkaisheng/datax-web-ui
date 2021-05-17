<template>
  <div class="workflowCanves">
    <div class="header">
      <div
        class="header_action"
        style="margin-left: 17px"
        @click="drawer = true"
      >
        <i class="el-icon-picture-outline" />
      </div>
      <div class="header_action" style="margin-left: 27px">
        <i class="el-icon-upload" />
      </div>
      <div class="header_action" style="margin-left: 27px">
        <i class="el-icon-view" />
      </div>
      <div class="header_action" style="margin-left: 27px">
        <i class="el-icon-mobile" />
      </div>
      <div class="header_action" style="margin-left: 27px">
        <i class="el-icon-unlock" />
      </div>
      <div class="header_action" style="margin-left: 27px">
        <i class="el-icon-wind-power" />
      </div>
    </div>
    <el-drawer title="脚本模式" :visible.sync="drawer" :with-header="true">
    </el-drawer>
    <div class="top">
      <h1>基本信息</h1>
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
        <el-form-item label="数据层级" prop="name">
          <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
            <el-radio-button label="top" @click="aaa">中间层</el-radio-button>
            <el-radio-button label="right" @click="bbb">应用层</el-radio-button>
          </el-radio-group>
          <el-col :span="11">
            <el-form-item label="主图域" prop="date1">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="表类型" prop="date1">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="业务过程" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                v-model="ruleForm.date2"
                style="width: 100%"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
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
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
      tabPosition: '',
      drawer: false,
      /** 工作流Id */
      myId: '',
      taskList: '', // 当前任务列表
      form: {
        // taskName: '子任务' // 选中任务名称
      },
      currentType: '', // 当前选中节点的任务类型
      dialogFormVisible: false,
      taskArr: [
        {
          name: 'a',
          type: 'NORMAL',
        },
        {
          name: 'b',
          type: 'IMPORT',
        },
        {
          name: 'c',
          type: 'EXPORT',
        },
        {
          name: 'd',
          type: 'HIVE',
        },
        {
          name: 'e',
          type: 'IMPALA',
        },
        {
          name: 'f',
          type: 'SHELL',
        },
      ],
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
  created() {},
  mounted() {},
  methods: {
    //脚本模式弹框
    ScriptMode() {},
    // 点击选中任务
    handleWorkFlow(e) {
      console.log(e)
      this.dataJob = e
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    aaa() {
      this.tabPosition = 'top'
    },
    bbb() {
      this.tabPosition = 'right'
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
.top {
  width: 100%;
  height: auto;
  padding-top: 15px;
  padding-left: 30px;
}
.tips {
  display: block;
  height: 40px;
  width: 100%;
  line-height: 40px;
  border: 1px solid #ccc;
  background: #808080;
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
