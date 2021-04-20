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
            >新增</el-button
          >
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
              >取消</el-button
            >
            <el-button size="small" style="margin-bottom: 20px" type="primary"
              >保存</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="logs">
      <div class="Navigation">
        <span
          :class="{ color: color === 3 ? 'color' : '' }"
          @click="
            () => {
              this.logs = true
              this.color = 3
            }
          "
          >任务日志</span
        >
      </div>
      <el-table v-show="logs" :data="TableData" border style="width: 100%">
      </el-table>
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
    CodeMirror,
  },
  data() {
    return {
      color: '',
      logs: false,
      numberValidateForm: {
        age: '',
      },
      first: 'first',
      dialogVisible: false,
      activeName: 'second',
      TableData: [
        // { FunctionDescription: 'a' },
        // { FunctionDescription: 'b' },
        // { FunctionDescription: 'c' },
        // { FunctionDescription: 'd' },
        // { FunctionDescription: 'e' },
        // { FunctionDescription: 'f' },
        // { FunctionDescription: 'g' },
      ],
      temp: {
        triggerStatus: '1',
      },
      drawer: false,
      isshow: false,
      input: '',
      ddd: [],
      code: {},
      SingleData: {},
      taskParam: [],
    }
  },
  created() {
    console.log('lang---->', this.TableData.length)
  },
  methods: {
    runQuery(val) {
      console.log('------->', val)
    },
    saveQuery(val) {
      this.SingleData = this.$store.state.taskAdmin.SingleData
      console.log('ID------>>>>>', this.$store.state.taskAdmin.SingleData)
      if (this.$store.state.taskAdmin.GroupId) {
        this.SingleData = this.$store.state.taskAdmin.SingleData
        console.log('ID------>>>>>', this.$store.state.taskAdmin.SingleData)
        const jobinfo = {
          jobParam: val,
          alarmEmail: '',
          childJobId: '',
          childJobIdArr: [],
          datasourceId: '0',
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
          jobDesc: this.$store.state.taskAdmin.GroupName,
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
          userId: 0,
          id: this.$store.state.taskAdmin.GroupId,
        }
        this.code = val
        job
          .updateJob(jobinfo)
          .then((res) => {
            console.log(res)
            this.$message('保存成功')
            this.$emit('gettreelist', jobinfo.projectId)
          })
          .catch((err) => {
            console.log(err)
            this.$message('保存失败')
          })
      } else {
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
          jobDesc: this.$store.state.taskAdmin.GroupName,
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
          userId: 0,
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
              this.$message('保存成功')
              this.$emit('gettreelist', res.content.projectId)
            })
            .catch((err) => {
              this.$message('保存失败')
              console.log(err)
            })
        }
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
    },
  },
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
  height: 440px;
}
.drawer {
  position: absolute;
  right: 5px;
  top: 3px;
}
.logs {
  width: 100%;
  height: auto;
}
.Navigation {
  height: 30px;
  width: 100%;
  background: #f5f7fa;
}
.Navigation .color {
  font-weight: 400px;
  cursor: pointer;
  color: blue;
  margin: 0;
  padding: 0;
  font-size: 13px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  width: 150px;
  height: 30px;
  background: #fff;
}
.Navigation span {
  font-weight: 400px;
  cursor: pointer;
  margin: 0;
  padding: 0;
  font-size: 13px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  width: 150px;
  height: 30px;
  background: #f5f7fa;
}
</style>
