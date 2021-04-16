<template>
  <div class="wrap">
    <div class="elid">
      <CodeMirror
        ref="codemirror"
        @querysql="runQuery"
        @saveQuery="saveQuery"
      />
      <el-button
        size="small"
        class="drawer"
        type="primary"
        style="margin-left: 16px"
        @click="drawer = true"
      >
        参数配置
      </el-button>
      <el-drawer
        title="内容新增"
        size="400px"
        :visible.sync="drawer"
        :with-header="true"
      >
        <div style="padding: 20px">
          <el-button
            style="margin-bottom: 20px"
            type="primary"
            size="small"
            @click="
              () => {
                isshow = true
              }
            "
          >新增</el-button>
          <el-input
            v-show="isshow"
            v-model="input"
            size="mini"
            placeholder="请输入参数"
          />
          <div v-show="isshow" style="margin-top: 20px">
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="primary"
              @click="
                () => {
                  drawer = false
                  isshow = false
                }
              "
            >取消</el-button>
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="primary"
            >保存</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="log">
      <template>
        <el-tabs
          v-model="first"
          style="text-align: center"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane align="center" label="任务日志" name="first">
            <template>
              <el-table
                :data="TableData"
                style="width: 100%"
                :header-cell-style="{
                  background: '#eee',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#606266',
                }"
              >
                <el-table-column
                  fixed
                  prop="FunctionDescription"
                  label="功能说明"
                  width="100"
                />
                <el-table-column
                  prop="QueryOriginalTable"
                  label="查询原表"
                  width="100"
                />
                <el-table-column prop="TargetTable" label="目标表" width="100" />
                <el-table-column
                  prop="UpdatMethod"
                  label="更新方式"
                  width="100"
                />
                <el-table-column prop="Department" label="科室部门" width="100" />
                <el-table-column
                  prop="responsibilityPerson"
                  label="负责人"
                  width="100"
                />
                <el-table-column
                  prop="CreationDate"
                  label="创建日期"
                  width="100"
                />
                <el-table-column
                  prop="OperationCycle"
                  label="运行周期"
                  width="100"
                />
                <el-table-column prop="routine" label="例程" width="100" />
                <el-table-column prop="remarks" label="备注" width="100" />
                <el-table-column
                  prop="ScriptVersion"
                  label="脚本版本"
                  width="100"
                />
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import MarddownEditor from '@/components/MarkdownEditor'
import CodeMirror from './codeMirrror'
import * as job from '@/api/datax-job-info'
import jsonFormatVue from '../../../tool/jsonFormat.vue'
export default {
  name: 'Hive',
  components: {
    JsonEditor,
    MarddownEditor,
    CodeMirror
  },
  data() {
    return {
      numberValidateForm: {
        age: ''
      },
      first: 'first',
      dialogVisible: false,
      activeName: 'second',
      TableData: [
        { FunctionDescription: 'a' },
        { FunctionDescription: 'b' },
        { FunctionDescription: 'c' },
        { FunctionDescription: 'd' },
        { FunctionDescription: 'e' },
        { FunctionDescription: 'f' },
        { FunctionDescription: 'g' }
      ],
      temp: {
        triggerStatus: '1'
      },
      drawer: false,
      isshow: false,
      input: '',
      ddd: [],
      code: {},
      SingleData: {},
      taskParam: []
    }
  },
  created() {},
  methods: {
    runQuery(val) {
      console.log('------->', val)
    },
    saveQuery(val) {
      this.SingleData = this.$store.state.taskAdmin.SingleData
      console.log('ID------>>>>>', this.$store.state.taskAdmin.SingleData)
      const jobinfo = {
        jobParam: val,
        alarmEmail: '',
        childJobId: '',
        childJobIdArr: [],
        datasourceId: '',
        executorBlockStrategy: 'SERIAL_EXECUTION',
        executorFailRetryCount: 1,
        executorHandler: 'executorJobHandler',
        executorParam: '',
        executorRouteStrategy: 'FIRST',
        executorTimeout: 1,
        glueSource: '',
        glueType: 'GLUE_SHELL',
        incStartId: '',
        incStartTime: '',
        incrementType: 0,
        jobConfigId: '',
        jobCron: '* * * ? * * *',
        jobDesc: 'tt',
        jobGroup: 1,
        jobJson: '',
        jobType: this.$store.state.taskAdmin.tabType,
        jvmParam: '',
        partitionInfo: '',
        primaryKey: '',
        projectGroupId: this.SingleData.id,
        projectId: this.$store.state.taskAdmin.projectId,
        readerTable: '',
        replaceParam: '',
        replaceParamType: 'Timestamp',
        userId: 0
      }
      console.log('this.store', this.SingleData)
      console.log('------->', val)
      console.log('======>>>', jobinfo)
      this.code = val
      // const data = { jobInfo: jobinfo }
      if (this.code) {
        job
          .AddHive(jobinfo)
          .then((res) => {
            console.log('----=====>>>>', res.content)
            this.$emit('gettreelist', jobinfo.projectId)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    handleEdit() {
      this.dialogVisible = true
    },
    handleDelete(a, b) {
      console.log(a)
      this.TableData.splice(a, 1)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
.wrap {
  width: 100%;
  height: auto;
}

.elid {
  position: relative;
  width: 100%;
  height: 450px;
}
.drawer {
  position: absolute;
  right: 5px;
  top: 3px;
}
.log {
  width: 100%;
  height: 400px;
}
</style>
