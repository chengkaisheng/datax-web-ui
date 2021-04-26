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
            v-for="(itme, index) in arrayData"
            v-show="isshow"
            :key="itme.id"
            style="margin-top: 20px"
            class="DraWer"
          >
            <span style="font-size: 14px; color: #ccc">
              参数：
              <el-input
                v-show="isshow"
                v-model="itme.data"
                style="width: 260px"
                size="mini"
                placeholder="请输入参数"
              />
              <el-button
                size="small"
                style="margin-left: 10px"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="Delete(index)"
              />
            </span>
          </div>
          <div v-show="isshow" style="margin-top: 20px">
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="success"
            >添加</el-button>
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="danger"
              @click="
                () => {
                  drawer = false
                }
              "
            >取消</el-button>
            <el-button
              size="small"
              style="margin-bottom: 20px"
              type="success"
            >保存</el-button>
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
        >任务日志</span>
      </div>
      <div v-show="logs" />
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import MarddownEditor from '@/components/MarkdownEditor'
import CodeMirror from './codeMirrror'
import * as job from '@/api/datax-job-info'
import * as JOB from '@/api/datax-jdbcDatasource'
import {
  createConnection,
  initConnection,
  sqlContextCreate,
  asyncSqlExecuteQuery,
  getAsyncTaskInfo,
  getSqlExecuteTaskResults
} from '@/graphQL/graphQL'
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
      arrayData: [
        {
          id: 0,
          data: ''
        }
      ],
      dataNum: 1,
      color: 1,
      logs: false,
      numberValidateForm: {
        age: ''
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
        triggerStatus: '1'
      },
      drawer: false,
      isshow: true,
      input: '',
      ddd: [],
      code: {},
      SingleData: {},
      taskParam: [],
      datasourceListQuery: {
        current: 1,
        size: 10000,
        projectId: '',
        datasourceName: ''
      }
    }
  },
  created() {
    console.log('lang---->', this.TableData.length)
  },
  methods: {
    Delete(index) {
      console.log('index---->>>', index)
      if (this.arrayData.length <= 1) {
        // 如果只有一个输入框则不可以删除
        return false
      }
      this.arrayData.splice(index, 1) // 删除了数组中对应的数据也就将这个位置的输入框删除
    },
    Addhandel() {
      this.arrayData.push({
        id: this.dataNum++,
        data: ''
      })
    },
    runQuery(val) {
      this.SingleData = this.$store.state.taskAdmin.SingleData
      this.datasourceListQuery.projectId = this.SingleData.projectId
      JOB.getJobList(this.datasourceListQuery)
        .then((res) => {
          const data = []
          res.records.forEach((itme) => {
            data.push(itme.datasource)
          })
          if (data.indexOf('hive') != -1) {
            console.log('hive任务', val)
          }
          if (data.indexOf('impala') != -1) {
            console.log('impala=====>', res.records)
            const data = res.records.filter((item) => {
              return item.datasource == 'impala'
            })
            console.log('url======', data[0].jdbcUrl)
            const host = data[0].jdbcUrl
              .split('//')[1]
              .split('/')[0]
              .split(':')[0]
            const port = data[0].jdbcUrl
              .split('//')[1]
              .split('/')[0]
              .split(':')[1]
            const databaseName = data[0].jdbcUrl.split('//')[1].split('/')[1]
            const userName = data[0].secretMap.u
            const password = data[0].secretMap.p
            const params1 = {
              config: {
                name: databaseName + '@' + host,
                driverId: 'generic:cloudera_impala',
                host: host,
                port: port,
                databaseName: databaseName,
                authModelId: 'native',
                credentials: {
                  username: userName,
                  userPassword: password
                }
              }
            }
            console.log('params1---->', params1)
            // debugger
            let query123 = null
            createConnection(params1).then((res) => {
              console.log('111111111', res)
              query123 = res.data.createConnection.id
              const params2 = {
                id: query123,
                credentials: {
                  userName: this.userName,
                  userPassword: this.password
                }
              }
              console.log('params2', params2)
              initConnection(params2).then((res) => {
                console.log('22222bu', res)
                const params2 = {
                  id: query123,
                  credentials: {
                    userName: this.userName,
                    userPassword: this.password
                  }
                }
                const params3 = {
                  connectionId: res.data.connection.id
                }

                sqlContextCreate(params3).then((res) => {
                  console.log('33333bu', res)
                  const params4 = {
                    connectionId: params3.connectionId,
                    contextId: res.data.context.id,
                    query: val.code,
                    filter: {
                      offset: 0,
                      limit: 200,
                      constraints: []
                    }
                  }
                  console.log('34567', params4)
                  asyncSqlExecuteQuery(params4).then((res) => {
                    console.log('44444444bu', res)

                    const params5 = {
                      taskId: res.data.taskInfo.id,
                      removeOnFinish: false
                    }
                    getAsyncTaskInfo(params5).then((res) => {
                      console.log('555555555bu', res)
                      const params6 = {
                        taskId: res.data.taskInfo.id,
                        removeOnFinish: false
                      }
                      getSqlExecuteTaskResults(params6).then((res) => {
                        console.log(res)
                      })
                    })
                  })
                })
              })
            })
            console.log(query123, 1213123)

            console.log('impala------>>>', data)
            const jobParam = {
              jobId: this.SingleData.jobId,
              executorParam: val.code
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
          id: this.$store.state.taskAdmin.GroupId
        }
        this.code = val
        job
          .updateJob(jobinfo)
          .then((res) => {
            console.log(res)
            this.$store.commit('SETREDDOT', false)
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
    }
  }
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
