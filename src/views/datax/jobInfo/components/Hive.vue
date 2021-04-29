<template>
  <div v-loading="loading" element-loading-text="运行中" class="wrap">
    <el-dialog
      title="参数配置"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div
        v-for="(itme, index) in ReplaceParameters"
        v-show="isshow"
        :key="index"
        style="margin-top: 20px"
        class="DraWer"
      >
        <span style="font-size: 14px; color: #ccc">
          参数{{ index + 1 }}：
          <el-input
            v-show="isshow"
            v-model="itme.parameters"
            style="width: 260px"
            size="mini"
            placeholder="请输入参数"
          />
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ReplaceParameter">确 定</el-button>
      </span>
    </el-dialog>
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
        @click="GetParameters"
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
            v-for="(itme, index) in parameters"
            v-show="isshow"
            :key="index"
            style="margin-top: 20px"
            class="DraWer"
          >
            <span style="font-size: 14px; color: #ccc">
              参数：
              <el-input
                v-show="isshow"
                v-model="itme.parameter"
                style="width: 260px"
                size="mini"
                placeholder="请输入参数"
              />
              <el-popconfirm
                @confirm="Delete(itme, index)"
                title="确定删除此参数吗？"
              >
                <el-button
                  slot="reference"
                  size="small"
                  style="margin-left: 10px"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                />
              </el-popconfirm>
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
            <el-button
              @click="SaveParameter"
              size="small"
              style="margin-bottom: 20px"
              type="success"
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
      <div class="LOGS">
        <div v-for="item in loglist" :key="item.id">
          <div v-if="item.tableData" style="padding: 20px; font-size: 12px">
            <span style="fontweigth: 700">>>{{ item.logtime }} </span>;[content]
            : <span>{{ item.content }}</span>
            <span class="line1">>>[ressult]:{{ item.tableData }}</span>
            <br />
          </div>
          <div
            v-if="item.error"
            style="padding: 20px; font-size: 12px; color: red"
          >
            <span>>>{{ item.logtime }}; </span> [content] :
            <span class="err1">{{ item.content }}</span>
            <span class="line1"
              >>>[EXCEPTION] : <span class="err1">{{ item.error }}</span></span
            >
            <br />
          </div>
        </div>
      </div>
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
  getSqlExecuteTaskResults,
} from '@/graphQL/graphQL'
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
      loading: false,
      ReplaceParameters: [],
      parameters: [
        // {
        //   id: '',
        //   jobId:this.$store.state.taskAdmin.SingleData.jobId,
        //   parameter: '',
        // },
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
      code: {},
      SingleData: {},
      taskParam: [],
      datasourceListQuery: {
        current: 1,
        size: 10000,
        projectId: '',
        datasourceName: '',
      },
      userName: '',
      password: '',
      loglist: [],
      tableData: [],
    }
  },
  created() {
    console.log('lang---->', this.TableData.length)
    console.log(
      'ParametersList=====>>>',
      this.$store.state.taskAdmin.ParametersList
    )
    this.ReplaceParameters = this.$store.state.taskAdmin.ParametersList
  },
  methods: {
    ReplaceParameter() {
      this.dialogVisible = true
      console.log('234561---->', this.ReplaceParameters)
    },
    GetParameters() {
      this.drawer = true
      job
        .ParametersList({ jobId: this.$store.state.taskAdmin.SingleData.jobId })
        .then((res) => {
          console.log('ParametersList', res.content)
          this.parameters = res.content
        })
    },
    SaveParameter() {
      let arr = []
      this.parameters.forEach((itme) => {
        arr.push(itme.parameter)
      })
      if (arr.includes('')) {
        this.$message('参数不能为空')
      } else {
        job.SaveParameters(this.parameters).then((res) => {
          this.$message.success(res.content)
        })
      }
    },
    Delete(itme, index) {
      console.log('index---->>>', index, itme)
      if (this.parameters.length <= 1) {
        // 如果只有一个输入框则不可以删除
        return false
      }
      job.DeleteParameters({ id: itme.id }).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.content)
          this.GetParameters()
        } else {
          this.$message.success(res.content)
        }
        console.log('delete----->', res)
      })
      //this.parameters.splice(index, 1) // 删除了数组中对应的数据也就将这个位置的输入框删除
    },
    Addhandel() {
      this.parameters.push({
        id: '',
        jobId: this.$store.state.taskAdmin.SingleData.jobId,
        parameter: '',
      })
    },
    async runQuery(val) {
      console.log('类型判断', val.jobtype)
      this.loading = true
      if (val.jobtype === 'HIVE') {
        console.log('HIVE', val)
        this.SingleData = this.$store.state.taskAdmin.SingleData
        this.datasourceListQuery.projectId = this.SingleData.projectId
        //获取数据源
        const Hivesource = await JOB.getJobList(this.datasourceListQuery).catch(
          (err) => {
            console.log(err)
          }
        )
        const datasource = Hivesource.records.filter((itme) => {
          return itme.datasource === 'hive'
        })
        if (datasource.length !== 0) {
          const host = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[0]
            .split(':')[0]
          const port = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[0]
            .split(':')[1]
          const databaseName = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[1]
          this.userName = datasource[0].secretMap.u
          this.password = datasource[0].secretMap.p
          const params1 = {
            config: {
              name: databaseName + '@' + host,
              driverId: 'generic:apache_hive2',
              host: host,
              port: port,
              databaseName: databaseName,
              authModelId: 'native',
              credentials: {
                username: this.userName,
                userPassword: this.password,
              },
            },
          }
          console.log('params1', params1)
          //创建连接
          const Createconnection = await createConnection(params1).catch(
            (err) => {
              console.log(err)
            }
          )
          if (Createconnection.errors) {
            this.loading = false
            this.$message.error(Createconnection.errors[0].message)
          }
          console.log('创建连接', Createconnection)
          const params2 = {
            id: Createconnection.data.createConnection.id,
            credentials: {
              userName: this.userName,
              userPassword: this.password,
            },
          }
          console.log('params2', params2)
          //初始化连接
          const resInitConnection = await initConnection(params2).catch(
            (err) => {
              console.log(err)
            }
          )
          console.log('初始化连接', resInitConnection)
          const params3 = {
            connectionId: resInitConnection.data.connection.id,
          }
          console.log('params3', params3)
          const Createcontext = await sqlContextCreate(params3).catch((err) => {
            console.log(err)
          })
          console.log('创建上下文', Createcontext.data.context.id)
          const params4 = {
            connectionId: params3.connectionId,
            contextId: Createcontext.data.context.id,
            query: val.code, // sql语句
            filter: {
              offset: 0,
              limit: 200,
              constraints: [],
            },
          }
          console.log('params4', params4)
          const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(params4)
          console.log('执行sql', resAsyncSqlExecuteQuery)
          const params5 = {
            taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
            removeOnFinish: false,
          }
          console.log('params5', params5)
          let queryStatus = ''
          let resGetAsyncTaskInfo
          while (queryStatus !== 'Finished') {
            resGetAsyncTaskInfo = await getAsyncTaskInfo(params5)
            queryStatus = resGetAsyncTaskInfo.data.taskInfo.status
            console.log('resGetAsyncTaskInfo--->', resGetAsyncTaskInfo)
            if (resGetAsyncTaskInfo.data.taskInfo.error) {
              this.loading = false
              console.log(resGetAsyncTaskInfo.data.taskInfo.error.message)
              this.loglist.unshift({
                title: '错误sql返回',
                logtime: new Date(),
                content: val.code,
                error: resGetAsyncTaskInfo.data.taskInfo.error.message,
              })
              // this.$message.error(resGetAsyncTaskInfo.data.taskInfo.error)
              this.$message.error(
                '执行错误',
                resGetAsyncTaskInfo.data.taskInfo.error
              )
              break
            }
            console.log(queryStatus, 'queryStatus')
          }
          const params6 = {
            taskId: resGetAsyncTaskInfo.data.taskInfo.id,
          }
          const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(
            params6
          ).catch((error) => {
            console.log(error)
          })
          console.log(
            '最后一步',
            resGetSqlExecuteTaskResults.data.result.results[0].resultSet.columns
          )
          console.log(
            '最后一步',
            resGetSqlExecuteTaskResults.data.result.results[0].resultSet.rows
          )
          if (
            resGetSqlExecuteTaskResults.data.result.statusMessage === 'Success'
          ) {
            const columns =
              resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                .columns
            const rows =
              resGetSqlExecuteTaskResults.data.result.results[0].resultSet.rows
            this.columns = columns

            this.tableData = rows.map((ele) => {
              const obj = {}
              ele.forEach((fieldVal, index) => {
                obj[columns[index].name] = fieldVal
              })
              return obj
            })
            this.loglist.unshift({
              logtime: new Date(),
              content: val.code,
              tableData: this.tableData,
            })
            this.loading = false
            this.$message.success('执行成功')
            console.log('执行成功--->', resGetSqlExecuteTaskResults)
          }
        } else if (datasource.length === 0) {
          this.loading = false
          alert('请确认是否选择数据源')
        }
      } else if (val.jobtype === 'IMPALA') {
        console.log('IMPALA--->', val)
        this.SingleData = this.$store.state.taskAdmin.SingleData
        this.datasourceListQuery.projectId = this.SingleData.projectId
        //获取数据源
        const source = await JOB.getJobList(this.datasourceListQuery).catch(
          (err) => {
            console.log(err)
          }
        )
        const datasource = source.records.filter((itme) => {
          return itme.datasource === 'impala'
        })
        console.log('datasource--->', datasource)
        if (datasource.length !== 0) {
          const host = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[0]
            .split(':')[0]
          const port = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[0]
            .split(':')[1]
          const databaseName = datasource[0].jdbcUrl
            .split('//')[1]
            .split('/')[1]
          this.userName = datasource[0].secretMap.u
          this.password = datasource[0].secretMap.p
          const params1 = {
            config: {
              name: databaseName + '@' + host,
              driverId: 'generic:cloudera_impala',
              host: host,
              port: port,
              databaseName: databaseName,
              authModelId: 'native',
              credentials: {
                username: this.userName,
                userPassword: this.password,
              },
            },
          }
          console.log('params1', params1)
          //创建连接
          const Createconnection = await createConnection(params1).catch(
            (err) => {
              console.log(err)
            }
          )
          if (Createconnection.errors) {
            this.loading = false
            this.$message.error(Createconnection.errors[0].message)
          }
          console.log('创建连接', Createconnection.data)
          const params2 = {
            id: Createconnection.data.createConnection.id,
            credentials: {
              userName: this.userName,
              userPassword: this.password,
            },
          }
          console.log('params2', params2)
          //初始化连接
          const resInitConnection = await initConnection(params2).catch(
            (err) => {
              console.log(err)
            }
          )
          console.log('初始化连接', resInitConnection)
          const params3 = {
            connectionId: resInitConnection.data.connection.id,
          }
          console.log('params3', params3)
          const Createcontext = await sqlContextCreate(params3).catch((err) => {
            console.log(err)
          })
          console.log('创建上下文', Createcontext)
          const params4 = {
            connectionId: params3.connectionId,
            contextId: Createcontext.data.context.id,
            query: val.code, // sql语句
            filter: {
              offset: 0,
              limit: 200,
              constraints: [],
            },
          }
          console.log('params4', params4)
          const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(params4)
          console.log('执行sql', resAsyncSqlExecuteQuery)
          const params5 = {
            taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
            removeOnFinish: false,
          }
          console.log('params5', params5)
          let queryStatus = ''
          let resGetAsyncTaskInfo
          while (queryStatus !== 'Finished') {
            resGetAsyncTaskInfo = await getAsyncTaskInfo(params5)
            queryStatus = resGetAsyncTaskInfo.data.taskInfo.status
            console.log('resGetAsyncTaskInfo--->', resGetAsyncTaskInfo)
            if (resGetAsyncTaskInfo.data.taskInfo.error) {
              console.log(resGetAsyncTaskInfo.data.taskInfo.error.message)
              this.loading = false
              this.loglist.unshift({
                title: '错误sql返回',
                logtime: new Date(),
                content: val.code,
                error: resGetAsyncTaskInfo.data.taskInfo.error.message,
              })
              // this.$message.error(resGetAsyncTaskInfo.data.taskInfo.error)
              this.$message.error(
                '执行错误',
                resGetAsyncTaskInfo.data.taskInfo.error
              )
              break
            }
            console.log(queryStatus, 'queryStatus')
          }
          const params6 = {
            taskId: resGetAsyncTaskInfo.data.taskInfo.id,
          }
          const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(
            params6
          ).catch((error) => {
            console.log(error)
          })
          console.log(
            '最后一步',
            resGetSqlExecuteTaskResults.data.result.results[0].resultSet.columns
          )
          console.log(
            '最后一步',
            resGetSqlExecuteTaskResults.data.result.results[0].resultSet.rows
          )
          if (
            resGetSqlExecuteTaskResults.data.result.statusMessage === 'Success'
          ) {
            const columns =
              resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                .columns
            const rows =
              resGetSqlExecuteTaskResults.data.result.results[0].resultSet.rows
            this.columns = columns

            this.tableData = rows.map((ele) => {
              const obj = {}
              ele.forEach((fieldVal, index) => {
                obj[columns[index].name] = fieldVal
              })
              return obj
            })
            this.loglist.unshift({
              logtime: new Date(),
              content: val.code,
              tableData: this.tableData,
            })
            this.loading = false
            this.$message.success('执行成功')
            console.log('执行成功--->', resGetSqlExecuteTaskResults)
          }
        } else if (datasource.length === 0) {
          this.loading = false
          alert('请确认是否选择数据源')
        }
      }
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
            this.$message({
              message: '保存成功',
              type: 'success',
            })
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
.LOGS {
  width: 100%;
  height: 300px;
  overflow: hidden;
  overflow-y: scroll;
  /* border: 1px solid #ccc; */
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
