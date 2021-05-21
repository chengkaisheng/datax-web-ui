<template>
  <div v-loading="loading" :element-loading-text="loadingtext" class="wrap">
    <el-dialog
      :show-close="false"
      title="参数配置"
      :visible.sync="DialogVisiBle"
      width="50%"
      :before-close="handleClose"
    >
      <div
        v-for="(itme, index) in ReplaceParameters"
        v-show="isshow"
        :key="index"
        style="margin-top: 20px"
        class="DraWer"
      >
        <div class="parameter">
          <span style="font-size: 14px; color: #ccc"
            ><i class="Configurable" style="color: #000; padding-right: 40px"
              >可配置参数：{{ itme.parameter }}</i
            >
            <el-input
              v-show="isshow"
              v-model="itme.parameters"
              style="width: 260px"
              size="mini"
              placeholder="请输入参数"
            />
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ReplaceParameter">确 定</el-button>
      </span>
    </el-dialog>
    <div class="elid">
      <CodeMirror
        ref="codemirror"
        :desbel="desbel"
        @interrupt="interrupt"
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
                title="确定删除此参数吗？"
                @confirm="Delete(itme, index)"
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
              size="small"
              style="margin-bottom: 20px"
              type="success"
              @click="Addhandel"
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
              size="small"
              style="margin-bottom: 20px"
              type="success"
              @click="SaveParameter"
              >保存</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="logs">
      <div class="Navigation1">
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
          <div
            v-if="item.tableData"
            style="padding-left: 20px; font-size: 12px"
          >
            <p v-show="item.content == ''" style="fontweigth: 700">
              >> {{ item.logtime }}
            </p>
            <span
              v-if="item.content !== ''"
              style="display: inline-block; width: 100%"
            >
              >> {{ item.logtime }} {{ item.content }}
            </span>
            <br />
            <span v-if="item.tableData !== '...'" class="line1"
              >>> {{ item.logtime }} [执行结果]: Success</span
            >
          </div>
          <div
            v-if="item.error"
            style="padding: 20px; padding-top: 0px; font-size: 12px; color: red"
          >
            <span style="display: inline-block; width: 100%" class="err1">
              >> {{ item.logtime }}
              <span style="display: inline-block; width: 6px" />{{
                item.content
              }}</span
            >
            <br />
            <span class="line1">
              >> {{ item.logtime }}
              <span style="display: inline-block; width: 10px" />[EXCEPTION]:
              <span class="err1">{{ item.error }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
      desbel: true,
      moment: moment,
      loadingtext: '',
      loading: false,
      // 替换参数
      ReplaceParameters: [],
      // 配置参数
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
      DialogVisiBle: false,
      dialogVisible: false,
      activeName: 'second',
      temp: {
        triggerStatus: '1',
      },
      drawer: false,
      isshow: true,
      input: '',
      code: '',
      CODE: '',
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
      code: '',
      getinto: false,
      status: 'executing',
    }
  },
  watch: {
    parameters: {
      //       handler((val)=>{
      // this.parameters=val
      //     })
      deep: true,
      handler(newValue) {
        // if (newValue !== oldValue) {
        //   console.log(newValue, 'newValue12')
        //   this.removeJobTab(newValue)
        // }
        // console.log(newValue)
        this.parameters = newValue
      },
    },
  },
  created() {
    console.log('时间戳', moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
    this.parameters = this.$store.state.taskAdmin.ParametersList
    this.ReplaceParameters = this.$store.state.taskAdmin.ParametersList
    // this.$refs.codemirror.setCode(this.$store.state.taskAdmin.setcode)

    // this.$refs.codemirror.code = this.$store.state.taskAdmin.setcode
  },
  methods: {
    // 中断运行
    interrupt() {
      this.desbel = true
      this.status = 'stop'
      this.$message('已停止运行')
    },
    // 参数替换
    ReplaceParameter() {
      const replacedata = []
      for (let i = 0; i < this.parameters.length; i++) {
        replacedata.push({
          param: this.parameters[i].parameter,
          value:
            this.ReplaceParameters[i].parameters ||
            this.parameters[i].parameter,
        })
      }
      for (let i = 0; i < replacedata.length; i++) {
        this.CODE.code = this.CODE.code
          .split(replacedata[i].param)
          .join(replacedata[i].value)
      }
      this.getinto = true
      this.runQuery(this.CODE)
    },
    GetParameters() {
      this.drawer = true
      job
        .ParametersList({ jobId: this.$store.state.taskAdmin.SingleData.jobId })
        .then((res) => {
          console.log('ParametersList', res.content)
          this.parameters = res.content
          this.ReplaceParameters = res.content
        })
    },
    SaveParameter() {
      const arr = []
      this.parameters.forEach((itme) => {
        arr.push(itme.parameter)
      })
      if (arr.includes('')) {
        this.$message('参数不能为空')
      } else {
        job.SaveParameters(this.parameters).then((res) => {
          if (res.content) {
            this.$message.success(res.content)
            this.$forceUpdate()
            this.GetParameters()
            this.drawer = false
          }
        })
      }
    },
    Delete(itme, index) {
      console.log('index---->>>', index, itme)
      // if (this.parameters.length <= 1) {
      //   // 如果只有一个输入框则不可以删除
      //   return false
      // }
      job.DeleteParameters({ id: itme.id }).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.content)
          this.GetParameters()
        } else {
          this.$message.success(res.content)
        }
        console.log('delete----->', res)
      })
      // this.parameters.splice(index, 1) // 删除了数组中对应的数据也就将这个位置的输入框删除
    },
    Addhandel() {
      this.parameters.push({
        id: '',
        jobId: this.$store.state.taskAdmin.SingleData.jobId,
        parameter: '',
      })
    },
    handleClose() {},
    cancel() {
      this.DialogVisiBle = false
      this.desbel = true
    },
    async runQuery(val) {
      this.desbel = false
      this.status = 'executing'
      const splittedSql = val.code.split('\n')
      console.log('splitted sql', splittedSql)
      var processedSql = ''
      for (var k = 0; k < splittedSql.length; k++) {
        var line = splittedSql[k].trim()
        if (!line.startsWith('--') && line !== '') {
          processedSql = processedSql + line
          console.log('*******-', processedSql)
        }
      }
      const sqlarr = processedSql.split(';')
      console.log('sqlarr:', sqlarr)
      if (sqlarr.length <= 1) {
        this.desbel = true
        this.$message('没有要执行的sql...')
        return
      }
      this.desbel = false
      this.CODE = val
      this.loglist = []
      console.log('类型判断', this.desbel, val)
      if (val.jobtype === 'HIVE') {
        if (this.parameters.length !== 0 || this.getinto === false) {
          this.DialogVisiBle = true
        }
        if (this.parameters.length === 0 || this.getinto === true) {
          if (this.parameters.length !== 0) {
            this.getinto = false
          }
          this.DialogVisiBle = false
          this.SingleData = this.$store.state.taskAdmin.SingleData
          this.datasourceListQuery.projectId = this.SingleData.projectId
          // 获取数据源
          const Hivesource = await JOB.getJobList(
            this.datasourceListQuery
          ).catch((err) => {
            console.log(err)
          })
          if (Hivesource) {
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
              if (sqlarr[0] === '') {
                this.desbel = true
                this.$message('没有要执行的sql...')
                return
              }
              console.log('params1------>', params1)
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '开始执行sql...',
                tableData: '...',
              })
              // 1. 创建连接
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '创建连接...',
                tableData: '...',
              })
              console.log('params1-->', params1)
              const Createconnection = await createConnection(params1).catch(
                (err) => {
                  this.desbel = true
                  this.getinto = false
                  this.$message('创建连接失败！')
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: '创建连接失败>>>' + err,
                    tableData: '...',
                  })
                  console.log('ERR', err)
                }
              )
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '连接id: ' + Createconnection.data.createConnection.id,
                tableData: '...',
              })
              console.log('创建连接', Createconnection)

              // 2. 初始化连接
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '初始化连接...',
                tableData: '...',
              })
              const params2 = {
                id: Createconnection.data.createConnection.id,
                credentials: {
                  userName: this.userName,
                  userPassword: this.password,
                },
              }
              console.log('params2------->', params2)
              const resInitConnection = await initConnection(params2).catch(
                (err) => {
                  this.desbel = true
                  this.getinto = false
                  console.log(err)
                }
              )
              console.log('初始化连接', resInitConnection)
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content:
                  '初始化连接完成: ' + resInitConnection.data.connection.id,
                tableData: '...',
              })
              if (sqlarr[0] === '') {
                this.desbel = true
                this.$message('没有要执行的sql...')
                return
              }
              for (let i = 0; i < sqlarr.length - 1; i++) {
                if (this.status !== 'executing') break
                const sqlOne = sqlarr[i]
                this.loglist.push({
                  logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  content: '开始执行sql: [' + sqlOne + ']',
                  tableData: '...',
                })
                const params3 = {
                  connectionId: resInitConnection.data.connection.id,
                }
                console.log('params3------->', params3)
                const Createcontext = await sqlContextCreate(params3).catch(
                  (err) => {
                    this.desbel = true
                    this.getinto = false
                    console.log(err)
                  }
                )
                this.loglist.push({
                  logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  content:
                    '创建上下文, 上下文id: ' + Createcontext.data.context.id,
                  tableData: '...',
                })
                console.log('创建上下文', Createcontext.data.context)
                const params4 = {
                  connectionId: params3.connectionId,
                  contextId: Createcontext.data.context.id,
                  query: sqlOne, // sql语句
                  filter: {
                    offset: 0,
                    limit: 200,
                    constraints: [],
                  },
                }
                console.log('params4------>', params4)
                const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(
                  params4
                )
                console.log('执行sql', resAsyncSqlExecuteQuery)
                const params5 = {
                  taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
                  removeOnFinish: false,
                }
                console.log('params5----->', params5)
                let queryStatus = ''
                let resGetAsyncTaskInfo
                while (queryStatus !== 'Finished') {
                  async function fn() {
                    return new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve()
                      }, 2000)
                    })
                  }
                  await fn()
                  resGetAsyncTaskInfo = await getAsyncTaskInfo(params5)
                  queryStatus = resGetAsyncTaskInfo.data.taskInfo.status
                  console.log('循环执行语句', queryStatus)
                  if (resGetAsyncTaskInfo.data.taskInfo.error) {
                    this.loglist.push({
                      title: '错误sql返回',
                      logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      content: sqlOne,
                      error: resGetAsyncTaskInfo.data.taskInfo.error.message,
                    })
                    this.desbel = true
                    this.getinto = false
                    this.$message.error('执行错误')
                    break
                  } else {
                    this.loglist.push({
                      logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      content: '执行状态: ' + queryStatus,
                      tableData: '...',
                    })
                  }
                }
                // if (queryStatus === 'Finished') {}
                const params6 = {
                  taskId: resGetAsyncTaskInfo.data.taskInfo.id,
                }
                const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(
                  params6
                ).catch((error) => {
                  this.loading = false
                  this.$message(error)
                })
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage ===
                  'No Data'
                ) {
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: sqlOne,
                    tableData: this.tableData,
                  })
                  this.getinto = false
                  console.log('this.loglist====---->', this.loglist)
                  this.$message.success('执行成功')
                  console.log('成功了', resGetSqlExecuteTaskResults)
                }
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage ===
                  'Success'
                ) {
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  const columns =
                    resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                      .columns
                  const rows =
                    resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                      .rows
                  this.columns = columns

                  this.tableData = rows.map((ele) => {
                    const obj = {}
                    ele.forEach((fieldVal, index) => {
                      obj[columns[index].name] = fieldVal
                    })
                    return obj
                  })
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: sqlOne,
                    tableData: this.tableData,
                  })
                  this.getinto = false
                  this.$message.success('执行成功')
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: '执行完成',
                    tableData: '...',
                  })
                  console.log('成功了', resGetSqlExecuteTaskResults)
                }
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage !==
                  'Success'
                ) {
                  this.getinto = false
                  console.log(
                    resGetSqlExecuteTaskResults.data.result.statusMessage
                  )
                }
              }
            } else if (datasource.length === 0) {
              this.desbel = true
              this.$message('请确认是否选择数据源')
            }
          } else {
            this.desbel = true
            this.$message('请确认是否选择数据源')
          }
        }
      }
      if (val.jobtype === 'IMPALA') {
        console.log('parameters---=-=-=-999', this.parameters)
        if (this.parameters.length !== 0 || this.getinto === false) {
          this.DialogVisiBle = true
        }
        if (this.parameters.length === 0 || this.getinto === true) {
          if (this.parameters.length !== 0) {
            this.getinto = false
          }
          this.DialogVisiBle = false
          this.SingleData = this.$store.state.taskAdmin.SingleData
          this.datasourceListQuery.projectId = this.SingleData.projectId
          // 获取数据源
          const source = await JOB.getJobList(this.datasourceListQuery).catch(
            (err) => {
              console.log(err)
            }
          )
          if (source) {
            const datasource = source.records.filter((itme) => {
              return itme.datasource === 'impala'
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
              if (sqlarr[0] === '') {
                this.desbel = true
                this.$message('没有要执行的sql...')
                return
              }
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '开始执行sql...',
                tableData: '...',
              })
              // 1. 创建连接
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '创建连接...',
                tableData: '...',
              })
              console.log('params1------>', params1)
              // 创建连接
              const Createconnection = await createConnection(params1).catch(
                (err) => {
                  this.desbel = true
                  this.getinto = false
                  this.$message('创建连接失败！')
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: '创建连接失败>>>' + err,
                    tableData: '...',
                  })
                  console.log(err)
                }
              )
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '连接id: ' + Createconnection.data.createConnection.id,
                tableData: '...',
              })
              console.log('创建连接', Createconnection)

              // 2. 初始化连接
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content: '初始化连接...',
                tableData: '...',
              })
              console.log('创建连接', Createconnection.data)
              const params2 = {
                id: Createconnection.data.createConnection.id,
                credentials: {
                  userName: this.userName,
                  userPassword: this.password,
                },
              }
              console.log('params2------>', params2)
              // 初始化连接
              const resInitConnection = await initConnection(params2).catch(
                (err) => {
                  this.desbel = true
                  this.getinto = false
                  console.log(err)
                }
              )
              if (resInitConnection === undefined) {
                this.desbel = true
                this.getinto = false
                this.$('初始化连接失败')
                console.log('初始化连接失败')
              }
              this.loglist.push({
                logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                content:
                  '初始化连接完成: ' + resInitConnection.data.connection.id,
                tableData: '...',
              })
              console.log('sqlarr', sqlarr)
              if (sqlarr[0] === '') {
                this.desbel = true
                this.$message('没有要执行的sql...')
                return
              }
              for (var i = 0; i < sqlarr.length - 1; i++) {
                if (this.status !== 'executing') break
                const sqlOne = sqlarr[i]
                this.loglist.push({
                  logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  content: '开始执行sql: [' + sqlOne + ']',
                  tableData: '...',
                })
                console.log('初始化连接', resInitConnection)
                const params3 = {
                  connectionId: resInitConnection.data.connection.id,
                }
                console.log('params3----->', params3)
                const Createcontext = await sqlContextCreate(params3).catch(
                  (err) => {
                    this.desbel = true
                    this.getinto = false
                    console.log(err)
                  }
                )
                this.loglist.push({
                  logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                  content:
                    '创建上下文, 上下文id: ' + Createcontext.data.context.id,
                  tableData: '...',
                })
                console.log('创建上下文', Createcontext)
                const params4 = {
                  connectionId: params3.connectionId,
                  contextId: Createcontext.data.context.id,
                  query: sqlOne, // sql语句
                  filter: {
                    offset: 0,
                    limit: 200,
                    constraints: [],
                  },
                }
                console.log('params4------>', params4)
                const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(
                  params4
                )

                console.log('执行sql', resAsyncSqlExecuteQuery)
                const params5 = {
                  taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
                  removeOnFinish: false,
                }
                console.log('params5----->', params5)
                let queryStatus = ''
                let resGetAsyncTaskInfo
                while (queryStatus !== 'Finished') {
                  async function fn() {
                    return new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve()
                      }, 2000)
                    })
                  }
                  await fn()
                  resGetAsyncTaskInfo = await getAsyncTaskInfo(params5)
                  queryStatus = resGetAsyncTaskInfo.data.taskInfo.status
                  console.log('resGetAsyncTaskInfo--->', resGetAsyncTaskInfo)
                  if (resGetAsyncTaskInfo.data.taskInfo.error) {
                    this.loglist.push({
                      title: '错误sql返回',
                      logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      content: sqlOne,
                      error: resGetAsyncTaskInfo.data.taskInfo.error.message,
                    })
                    if (i === sqlarr.length - 2) {
                      this.desbel = true
                    }
                    this.getinto = false
                    this.$message.error('执行错误')
                    break
                  } else {
                    this.loglist.push({
                      logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                      content: '执行状态:' + queryStatus,
                      tableData: '...',
                    })
                    for (let i = 0; i <= 1000; i++) {
                      console.log(queryStatus, 'queryStatus')
                    }
                  }
                }
                const params6 = {
                  taskId: resGetAsyncTaskInfo.data.taskInfo.id,
                }
                const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(
                  params6
                ).catch((error) => {
                  this.desbel = true
                  this.getinto = false
                  console.log(error)
                })
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage ===
                  'Success'
                ) {
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  const columns =
                    resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                      .columns
                  const rows =
                    resGetSqlExecuteTaskResults.data.result.results[0].resultSet
                      .rows
                  this.columns = columns

                  this.tableData = rows.map((ele) => {
                    const obj = {}
                    ele.forEach((fieldVal, index) => {
                      obj[columns[index].name] = fieldVal
                    })
                    return obj
                  })
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: sqlOne,
                    tableData: this.tableData,
                  })
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  this.getinto = false
                  this.$message.success('执行成功')
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: '执行完成',
                    tableData: '...',
                  })
                  console.log('成功了', resGetSqlExecuteTaskResults)
                }
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage !==
                  'Success'
                ) {
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  this.getinto = false
                  console.log(
                    resGetSqlExecuteTaskResults.data.result.statusMessage
                  )
                }
                if (
                  resGetSqlExecuteTaskResults.data.result.statusMessage ===
                  'No Data'
                ) {
                  if (i === sqlarr.length - 2) {
                    this.desbel = true
                  }
                  this.loglist.push({
                    logtime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                    content: sqlOne,
                    tableData: this.tableData,
                  })
                  this.getinto = false
                  this.$message.success('执行成功')
                  console.log('成功了', resGetSqlExecuteTaskResults)
                }
              }
            } else if (datasource.length === 0) {
              this.desbel = true
              this.$message('请确认是否选择数据源')
            }
          } else {
            this.desbel = true
            this.$message('请确认是否选择数据源')
          }
        }
      }
    },
    saveQuery(val) {
      this.loading = true
      this.loadingtext = '保存中'
      console.log('2222', val)
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
            this.loading = false
            console.log(res)
            this.$store.commit('SETREDDOT', false)
            this.$emit('gettreelist', jobinfo.projectId)
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
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
              this.loading = false
              this.$emit('gettreelist', res.content.projectId)
            })
            .catch((err) => {
              this.$message('保存失败')
              this.loading = false
              console.log(err)
            })
        }
      }
    },
    handleEdit() {
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<style lang="scss" >
.wrap {
  width: 100%;
  height: auto;
}
.el-bar-tab[data-v-5715563a] {
  background: white;
}
.LOGS {
  margin: 0;
  padding: 0;
  background: white;
  padding-bottom: 50px;
  padding-top: 10px;
  width: 100%;
  height: 280px;
  line-height: 16px;
  overflow-y: scroll;
  /* border: 1px solid #ccc; */
}
.parameter {
  padding-left: 100px;
  .el-input__inner {
    height: 27px;
  }
}

.Configurable {
  display: inline-block;
  width: 200px;
}
.LOGS div {
  margin: 0;
  padding: 0;
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
.Navigation1 {
  height: 30px;
  width: 100%;
  background: #f5f7fa;
}
.Navigation1 .color {
  font-weight: 400px;
  cursor: pointer;
  color: blue;
  margin: 0;
  padding: 0;
  font-size: 13px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  height: 30px;
  background: #fff;
}
.Navigation1 span {
  font-weight: 400px;
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: 100px;
  font-size: 13px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  height: 30px;
  background: #f5f7fa;
}
</style>
