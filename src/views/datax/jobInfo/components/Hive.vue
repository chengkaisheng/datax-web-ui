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
        title="新增参数"
        size="400px"
        :visible.sync="drawer"
        :with-header="true"
      >
        <div style="padding-left: 26px">
          <div
            style="margin-top: 20px"
            class="DraWer"
            v-show="isshow"
            v-for="(itme, index) in arrayData"
            :key="itme.id"
          >
            <span style="font-size: 14px; color: #ccc">
              参数：
              <el-input
                style="width: 260px"
                v-show="isshow"
                v-model="itme.data"
                size="mini"
                placeholder="请输入参数"
              />
              <el-button
                @click="Delete(index)"
                size="small"
                style="margin-left: 10px"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </span>
          </div>
          <div v-show="isshow" style="margin-top: 20px">
            <el-button
              @click="Addhandel"
              size="small"
              style="margin-bottom: 20px"
              type="success"
              >添加</el-button
            >
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="danger"
              @click="
                () => {
                  drawer = false
                }
              "
              >取消</el-button
            >
            <el-button size="small" style="margin-bottom: 20px" type="success"
              >保存</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="logs">
      <div class="Navigation">
        <span
          :class="{ color: color === 1 ? 'color' : '' }"
          @click="
            () => {
              this.logs = true
              this.color = 1
            }
          "
          >任务日志</span
        >
      </div>
      <div v-show="logs"></div>
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
      arrayData: [
        {
          id: 0,
          data: '',
        },
      ],
      dataNum: 1,
      color: 1,
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
      isshow: true,
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
    Delete(index) {
      console.log('index---->>>', index)
      if (this.arrayData.length <= 1) {
        //如果只有一个输入框则不可以删除
        return false
      }
      this.arrayData.splice(index, 1) //删除了数组中对应的数据也就将这个位置的输入框删除
    },
    Addhandel() {
      this.arrayData.push({
        id: this.dataNum++,
        data: '',
      })
    },
    runQuery(val) {
      console.log('------->', val)
    },
    saveQuery(val) {
      this.SingleData = this.$store.state.taskAdmin.SingleData
      console.log('ID------>>>>>', this.SingleData)
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
          jobType: this.$store.state.taskAdmin.SingleData.jobType,
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
            this.$store.commit('SETREDDOT', false)
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
.DraWer {
  display: flex;
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
