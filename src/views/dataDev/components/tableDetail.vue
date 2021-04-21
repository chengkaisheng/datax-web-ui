<template>
  <div class="table">
    <el-tabs v-model="tabsActive" type="border-card" @tab-remove="removeTab">
      <el-tab-pane name="querylog">
        <span slot="label">
          {{ tabLabel["querylog"] }}
          <el-dropdown
            v-if="tabsActive === 'querylog' && tableData.length > 0"
            style="margin-left: 10px"
            placement="top"
          />
        </span>
        <table style="heith:300px" class="Navigation">
          <div v-for="item in editableTabs" :key="index" style="padding:20px" onload="window.scrollTo(0,document.table.scrollHeight);">
            <span style="fontWeigth:700">>>{{ new Date() }};[content] : {{ item.content }}</span>
            <br>
            <span class="line1">>>[ressult]:{{ item.tableData }}</span>
            <br>
            <br>
            <span>>>{{ new Date() }};[content] : {{ err }}</span> <br>
            <span class="line1">>>[EXCEPTION]:{{ err }}</span>
          </div>
        </table>
        <!-- <span />>>{{ new Date() }};[content] : {{ content }} <br>
        <span class="line1">>>[ressult]:{{ tableData }}</span>
        <br>
        <br>
        <span />>>{{ new Date() }};[content] : {{ content }} <br>
        <span class="line1">>>[EXCEPTION]:{{ tableData }}</span> -->

        <!-- {{ tableData }} -->
      </el-tab-pane>

      <el-tab-pane name="hisSql">
        <span slot="label">
          {{ tabLabel["hisSql"] }}
          <el-dropdown
            v-if="tabsActive === 'hisSql' && sqlHistoryData.length > 0"
            style="margin-left: 10px"
            placement="top"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native.stop="fileSaver('tableHisSql', 'xlsx')"
              >导出为Excel</el-dropdown-item>
              <el-dropdown-item
                @click.native.stop="fileSaver('tableHisSql', 'csv')"
              >导出为CSV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-form ref="formInline" :inline="true" :model="formInline" size="mini" class="demo-input-size" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="5"><div class="grid-content bg-purple" />
              <el-form-item size="mini" label="执行语句">
                <el-input v-model="formInline.sqlContent" placeholder="执行语句" size="mini" clearable> />
                </el-input></el-form-item>
            </el-col>
            <el-col :span="5"><div class="grid-content bg-purple-light" />

              <el-form-item label="数据源" size="mini">
                <el-select
                  v-model="formInline.projectId"
                  placeholder="数据源"
                  size="mini"
                  clearable
                >
                  <el-option
                    v-for="item in datasourcelist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item></el-col>
            <el-col :span="5"><div class="grid-content bg-purple" />

              <el-form-item label="开始时间">
                <el-date-picker v-model="formInline.submitTimeBegin" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 90%;" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="5"><div class="grid-content bg-purple-light" /><el-form-item label="结束时间" size="mini">
              <el-date-picker v-model="formInline.submitTimeEnd" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 90%;" size="mini" />
            </el-form-item></el-col>
            <el-col :span="4"><div class="grid-content bg-purple-light" /><el-form-item size="mini">
              <el-button type="primary" size="mini" style="margin-top: 27px;" @click="onSubmit('formInline')">查询</el-button>
            </el-form-item></el-col>
          </el-row>

        </el-form>
        <el-table
          ref="tableHisSql"
          v-loading="tableLoading"
          :data="sqlHistoryData"
          height="245"
          :row-style="{ height: '33px' }"
          :cell-style="{ padding: '0' }"
          :header-row-style="{ fontWeight: '900', fontSize: '15px' }"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column label="执行语句" width="200" align="center">
            <template slot-scope="scope">
              <a @click="echoResult(scope.row)">{{ scope.row.sqlContent }}</a>
            </template>
          </el-table-column>
          <el-table-column label="数据源" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.datasourceName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="databaseSchema"
            label="数据库"
            width="150"
            align="center"
          />
          <el-table-column
            prop="sqlStatusStr"
            label="执行状态"
            width="150"
            align="center"
          />
          <el-table-column
            prop="submitTime"
            label="提交时间"
            width="150"
            align="center"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <!-- <el-table-column width="150" align="center">
            <template slot="header">
              <el-select v-model="isSaveMode" @change="getSqlList">
                <el-option :value="0" label="SQL临时查询" />
                <el-option :value="1" label="已保存SQL查询" />
              </el-select>
            </template>
            <template slot-scope="scope">
              <span>{{
                scope.row.isSaved === 0 ? "SQL临时查询" : "已保存SQL查询"
              }}</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="sqlResult" label="执行结果" width="150" align="center" /> -->
          <!-- <el-table-column
            v-if="isSaveMode === 1"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
              <el-button
                type="text"
                icon="el-icon-refresh"
                @click="handleClick(scope.row.id)"
              />
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="deleteHis(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          style="text-align: right; margin: 10px 0"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane name="asynctask">
        <span slot="label">
          {{ tabLabel["asynctask"] }}
        </span>
        <el-table
          ref="tableHisSql"
          v-loading="tableLoading"
          :data="sqlHistoryData1"
          height="245"
          :row-style="{ height: '33px' }"
          :cell-style="{ padding: '0' }"
          :header-row-style="{ fontWeight: '900', fontSize: '15px' }"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column label="执行语句" width="200" align="center">
            <template slot-scope="scope">
              <a @click="echoResult(scope.row)">{{ scope.row.sqlContent }}</a>
            </template>
          </el-table-column>
          <el-table-column label="数据源" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.datasourceName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="databaseSchema"
            label="数据库"
            width="150"
            align="center"
          />
          <el-table-column
            prop="sqlStatusStr"
            label="执行状态"
            width="150"
            align="center"
          />
          <el-table-column
            prop="submitTime"
            label="提交时间"
            width="150"
            align="center"
          />
          <el-table-column
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-button slot="reference" type="text" size="small" @click="handleClick1(scope.row)">查看</el-button> -->
              <el-popover
                placement="top"
                width="400"
                trigger="click"
              >
                <h3>执行结果</h3>
                <!-- <el-table
                  v-loading="tableLoading"
                  style="padding: 0px; margin-right: 10px"
                  :data="JSON.parse(scope.row.sqlResult).tableData"
                  height="245"
                  :row-style="{ height: '33px' }"
                  :cell-style="{ padding: '0' }"
                  :header-row-style="{ fontWeight: '900', fontSize: '15px' }"
                >
                  <el-table-column
                    v-for="item in JSON.parse(scope.row.sqlResult).columns"
                    :key="item.label"
                    :prop="item.label"
                    :label="item.label"
                    show-overflow-tooltip
                    align="center"
                  />
                </el-table> -->
                <el-button slot="reference" type="text" size="small">查看</el-button>
              </el-popover>
              <el-button
                type="text"
                icon="el-icon-refresh"
                @click="handleClick(scope.row.id)"
              />
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="deleteHis(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        closable
        :label="item.title"
        :name="item.name"
      >
        <span slot="label">
          {{ tabLabel["res"] }}
          <el-dropdown
            v-if="tabsActive === item.name&& item.tableData.length > 0"
            style="margin-left: 10px"
            placement="top"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native.stop="fileSaver('tableRes1', 'xlsx')"
              >导出为Excel</el-dropdown-item>
              <el-dropdown-item
                @click.native.stop="fileSaver('tableRes1', 'csv')"
              >导出为CSV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-table
          v-show="firstShow"
          ref="tableRes1"
          v-loading="tableLoading"
          style="padding: 0px; margin-right: 10px"
          :data="item.tableData"
          height="245"
          :row-style="{ height: '33px' }"
          :cell-style="{ padding: '0' }"
          :header-row-style="{ fontWeight: '900', fontSize: '15px' }"
        >
          <el-table-column
            v-for="item in item.columns"
            :key="item.label"
            :prop="item.name"
            :width="item.label.toUpperCase().length * 10 + 60"
            :label="item.name"
            show-overflow-tooltip
            align="center"
          />
        </el-table>
        <el-table
          v-show="secondShow"
          ref="tableRes2"
          v-loading="tableLoading"
          style="padding: 0px; margin-right: 10px"
          :data="item.secondData"
          height="245"
          :row-style="{ height: '33px' }"
          :cell-style="{ padding: '0' }"
          :header-row-style="{ fontWeight: '900', fontSize: '15px' }"
        >
          <el-table-column
            prop="name"
            label="name"
            width="200"
            align="center"
          />
          <el-table-column
            prop="value"
            label="value"
            width="400"
            align="center"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  createConnection,
  initConnection,
  sqlContextCreate,
  asyncSqlExecuteQuery,
  getAsyncTaskInfo,
  getSqlExecuteTaskResults
} from '@/graphQL/graphQL'
import * as sqlhisApi from '@/graphQL/graphQL-history'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'TableDetail',
  data() {
    return {
      columns: [],
      tableData: [],
      connectionId: '',
      firstShow: true,
      secondShow: false,
      secondData: [],
      tableLoading: false,
      tabsActive: 'res',
      /** SQL语句执行历史 */
      sqlHistoryData: [],
      // 异步任务
      sqlHistoryData1: [],
      editableTabs: [],
      editableTabsValue: '0',
      tabIndex: 0,
      tabLabel: {
        querylog: '查询日志',
        asynctask: '异步任务',
        res: '当前查询结果',
        hisSql: 'SQL查询历史'
      },
      /** 分页 */
      pagination: {
        total: 0,
        current: 1,
        size: 10
      },
      /** isSaved=0表示临时查询历史，isSaved=1表示保存了的历史 */
      isSaveMode: 0,
      host: '',
      port: '',
      userName: '',
      password: '',
      databaseName: '',
      search: '',
      formInline: {
        projectId: '',
        submitTimeBegin: '',
        submitTimeEnd: '',
        sqlContent: ''
      },
      datasourcelist: this.$store.state.taskAdmin.projectArray,
      content: ''
    }
  },
  computed: {
    getPagination() {
      return {
        size: this.pagination.size,
        current: this.pagination.current
      }
    },
    getBasedInfo() {
      return {
        projectId: this.$store.state.taskAdmin.sqlParams.projectId,
        datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId,
        databaseSchema: this.$store.state.taskAdmin.sqlParams.schema,
        datasourcelist: this.$store.state.taskAdmin.projectArray
      }
    }
  },
  watch: {
    tabsActive: {
      handler(val) {
        switch (val) {
          case 'res':
            break
          case 'hisSql':
            this.getSqlList()
            break
          case 'asynctask':
            this.getSqlListSaved()
            break
          default:
            break
        }
      }
    },
    datasourcelist: {
      handler(val) {
        this.datasourcelist = this.$store.state.taskAdmin.projectArraythis
      }
    }
  },
  created: {
    //  this.datasourcelist = this.$store.state.taskAdmin.projectArraythis.$store.state.taskAdmin.projectArray
    // this.getcreateConnec(),
  },
  methods: {
    // sql历史查询
    onSubmit(formInline) {
      sqlhisApi
        .getSqlListTemp({
          submitUser: parseInt(localStorage.getItem('userId')), // 提交用户id
          size: this.pagination.size,
          current: this.pagination.current,
          ...this.formInline,
          isSaved: 0
        })
        .then((response) => {
          if (response.code === 200) {
            this.sqlHistoryData = response.content.records
            this.pagination.total = response.content.total
          }
          this.tableLoading = false
        })
        .catch((error) => {
          console.log(error)
          this.tableLoading = false
        })
    },
    handleClick(tab) {
      this.getSqlListSaved()
    },
    // 查看
    handleClick1(row) {
      // console.log(row)
      // alert(row.id)
    },
    // 新增查询结果
    addTab(targetName) {
      const newTabName = ++this.tabIndex + ''
      this.editableTabs.push({
        title: '当前查询结果',
        name: newTabName,
        tableData: this.tableData,
        secondData: this.secondData,
        columns: this.columns,
        content: this.content
      })
      console.log(this.editableTabs)
      this.tabsActive = newTabName
      console.log(this.editableTabs)
    },
    removeTab(targetName) {
      if (this.editableTabs.length > 0) {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      } else {
        this.$message.info('不可删除')
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // async getcreateConnec() {
    //       // 1、创建链接
    //   const params1 = {
    //     config: {
    //       name: this.databaseName + '@' + this.host,
    //       driverId: driverId,
    //       host: this.host,
    //       port: this.port,
    //       databaseName: this.databaseName,
    //       authModelId: 'native',
    //       credentials: {
    //         userName: this.userName,
    //         userPassword: this.password
    //       }
    //     }
    //   }
    //   const resCreateConnection = await createConnection(params1)
    //   console.log(resCreateConnection)

    //   if (resCreateConnection.data == null) {
    //     this.$notify({
    //       title: '错误',
    //       message: resCreateConnection.message,
    //       type: 'error',
    //       duration: 2000
    //     })
    //     this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
    //   }
    // },
    initData(dsInfo, node) {
      this.datasourcelist = this.$store.state.taskAdmin.projectArraythis
      console.log('dsInfo', dsInfo)
      console.log('node', node)
      var queryDsInfo = {}
      queryDsInfo.jdbcUrl = dsInfo.jdbcUrl
      queryDsInfo.db = node.data.schema
      queryDsInfo.username = dsInfo.secretMap?.u
      queryDsInfo.password = dsInfo.secretMap?.p
      queryDsInfo.datasource = dsInfo.datasource.toLowerCase()
      this.code = 'Select * from ' + node.data.schema + '.' + node.data.tableName
      console.log(queryDsInfo, 'queryDsInfo')
      console.log(this.code, '---sql')
      this.queryData(queryDsInfo, this.code)
    },

    async queryData(queryDsInfo, sql) {
      console.log(sql)
      this.tableLoading = true
      if (queryDsInfo.jdbcUrl === undefined || queryDsInfo.jdbcUrl === '') {
        this.$notify({
          title: '错误',
          message: '未指定SQL查询数据源信息，请单击数据库以选中',
          type: 'error',
          duration: 2000
        })
        this.tableLoading = false
        return
      }
      if (sql.trim() === '') {
        this.$notify({
          title: '警告',
          message: '请先选中需要执行的SQL！',
          type: 'warning',
          duration: 2000
        })
        this.tableLoading = false
        return
      }
      // else {
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', true) // 按钮状态
      // sql = sql.replace(';', '')
      console.log(sql, 'sql')
      console.log(queryDsInfo.jdbcUrl, 'queryDsInfo.jdbcUrl')
      this.host = queryDsInfo.jdbcUrl
        .split('//')[1]
        .split('/')[0]
        .split(':')[0]
      this.port = queryDsInfo.jdbcUrl
        .split('//')[1]
        .split('/')[0]
        .split(':')[1]
      this.databaseName = queryDsInfo.db
      this.userName = queryDsInfo.username
      this.password = queryDsInfo.password

      var driverId
      switch (queryDsInfo.datasource) {
        case 'mysql':
          driverId = 'mysql:mysql8'
          break
        case 'oracle':
          driverId = 'oracle:oracle_thin'
          break
        case 'hive':
          driverId = 'generic:apache_hive2'
          break
        case 'impala':
          driverId = 'generic:cloudera_impala'
          break
        default:
          this.$notify.info('')
          this.$notify({
            title: '消息',
            message: '请联系管理员获取该数据库查询功能',
            type: 'info',
            duration: 2000
          })
          return
      }
      console.log(this.databaseName)
      if (driverId === 'oracle:oracle_thin') {
        this.databaseName = queryDsInfo.jdbcUrl
          .split('//')[1]
          .split('/')[1]
      }
      console.log(this.databaseName)
      // 1、创建链接
      const params1 = {
        config: {
          name: this.databaseName + '@' + this.host,
          driverId: driverId,
          host: this.host,
          port: this.port,
          databaseName: this.databaseName,
          authModelId: 'native',
          credentials: {
            userName: this.userName,
            userPassword: this.password
          }
        }
      }
      const resCreateConnection = await createConnection(params1)
      console.log(resCreateConnection)

      if (resCreateConnection.data == null) {
        this.$notify({
          title: '错误',
          message: resCreateConnection.message,
          type: 'error',
          duration: 2000
        })
        this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
      }

      this.connectionId = resCreateConnection.data.createConnection.id
      // 2、初始化连接
      const params2 = {
        id: this.connectionId,
        credentials: {
          userName: this.userName,
          userPassword: this.password
        }
      }
      console.log(params2)
      // var infoErr2 = ''
      // var success2 = ''
      const resInitConnection = await initConnection(params2)
        .catch((err) => {
          // infoErr2 = err.message
          console.log(err)
          this.$message.error(err.message)
          this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
        })

      console.log(resInitConnection)
      this.content = sql
      const sqlarr = sql.split(';')
      for (var i = 0; i < sqlarr.length; i++) {
        const sqlOne = sqlarr[i]
        console.log(sqlOne)
        if (sqlOne === '') {
        // console.log(sqlarr)
          continue
        }
        // 3、创建sqlcontext
        const params3 = {
          connectionId: resInitConnection.data.connection.id
        }
        const resSqlContextCreate = await sqlContextCreate(params3).catch((err) => { console.log(err) })
        const params4 = {
          connectionId: this.connectionId,
          contextId: resSqlContextCreate.data.context.id,
          query: sqlOne, // sql语句
          filter: {
            offset: 0,
            limit: 200,
            constraints: []
          }
        }
        const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(params4)
        const params5 = {
          taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
          removeOnFinish: false
        }
        let queryStatus = ''
        let resGetAsyncTaskInfo
        while (queryStatus !== 'Finished') {
          resGetAsyncTaskInfo = await getAsyncTaskInfo(params5)
          queryStatus = resGetAsyncTaskInfo.data.taskInfo.status
          if (resGetAsyncTaskInfo.data.taskInfo.error) {
            this.$message.error(resGetAsyncTaskInfo.data.taskInfo.error)
            this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
            break
          }
        }
        console.log(queryStatus, 'queryStatus')
        const params6 = {
          taskId: resGetAsyncTaskInfo.data.taskInfo.id
        }
        const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(
          params6
        )
        if (resGetSqlExecuteTaskResults) {
          this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
          console.log(
            resGetSqlExecuteTaskResults.data.result.statusMessage,
            'second_table'
          )
          if (resGetSqlExecuteTaskResults.data.result.results[0].updateRowCount) {
            this.firstShow = false
            this.secondShow = true
            this.secondData = []
            this.secondData.push({
              name: 'updateRowCount',
              value:
              resGetSqlExecuteTaskResults.data.result.results[0].updateRowCount
            })
            this.secondData.push({
              name: 'query',
              value: sql.replace(';', '')
            })
            //   const time = new Date()
            this.secondData.push({
              name: 'time',
              value: new Date().toLocaleString('cn', {
                hour12: false
              })
            })
          } else {
            this.firstShow = true
            this.secondShow = false
          }
        }
        if (!resGetSqlExecuteTaskResults.data.result.results[0].resultSet) return
        const columns =
        resGetSqlExecuteTaskResults.data.result.results[0].resultSet.columns
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
        this.autoSaveSql(sql)
        this.tableLoading = false
        this.firstShow = true
        this.secondShow = false
        this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
        this.addTab()
      }
      // }
    },
    /**
     * @description:保存时添加历史
     */
    saveSql(sql) {
      if (sql.trim() === '') {
        this.$notify({
          title: '警告',
          message: '请先编辑需要执行的SQL！',
          type: 'warning',
          duration: 2000
        })
        return
      }

      sqlhisApi
        .saveSql({
          datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId, // 数据源id
          projectId: this.$store.state.taskAdmin.sqlParams.projectId, // 项目id
          databaseSchema: this.$store.state.taskAdmin.sqlParams.schema, // 数据库schema
          sqlResult: '',
          // sqlResult: JSON.stringify({
          //   columns: this.columns,
          //   tableData: this.tableData
          // }), // sql执行结果
          sqlStatus: 1, // 1：成功  0：失败
          sqlContent: sql, // sql语句
          submitUser: parseInt(localStorage.getItem('userId')) // 提交用户id
        })
        .then((response) => {
          console.log(response)
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '错误',
              message: '保存失败',
              type: 'error',
              duration: 2000
            })
          }
        })
        .catch((_) => {
          this.$notify({
            title: '错误',
            message: '保存失败.',
            type: 'error',
            duration: 2000
          })
        })
    },
    /**
     * @description: 执行时添加历史
     */
    autoSaveSql(sql) {
      sqlhisApi
        .autoSaveSql({
          datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId, // 数据源id
          projectId: this.$store.state.taskAdmin.sqlParams.projectId, // 项目id
          databaseSchema: this.$store.state.taskAdmin.sqlParams.schema, // 数据库schema
          // sqlResult: JSON.stringify({
          //   columns: this.columns,
          //   tableData: this.tableData
          // }), // sql执行结果
          sqlResult: '',
          sqlStatus: 1, // 1：成功  0：失败
          sqlContent: sql, // sql语句
          submitUser: parseInt(localStorage.getItem('userId')) // 提交用户id
        })
        .then((response) => {
          if (response.code === 200) {
            console.log(response)
          }
        })
        .catch((_) => {
          this.$notify({
            title: '错误',
            message: '自动保存失败.',
            type: 'error',
            duration: 2000
          })
        })
    },
    /**
     * @description: 获取sql自动保存的历史记录
     */
    getSqlList(val = null) {
      // : Object.assign({ isSaved: 1 }, params)
      this.tableLoading = true
      // const searchParams = Object.assign(
      //   Object.assign({}, this.getPagination),
      //   this.getBasedInfo
      // );
      // if (this.isSaveMode === 0) {
      sqlhisApi
        .getSqlListTemp({
          size: this.pagination.size,
          current: this.pagination.current,
          projectId: this.$store.state.taskAdmin.sqlParams.projectId,
          datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId,
          databaseSchema: this.$store.state.taskAdmin.sqlParams.schema,
          isSaved: 0
        })
        .then((response) => {
          if (response.code === 200) {
            this.sqlHistoryData = response.content.records
            this.pagination.total = response.content.total
          }
          this.tableLoading = false
        })
        .catch((error) => {
          console.log(error)
          this.tableLoading = false
        })
      // } else {
      // sqlhisApi
      //   .getSqlListSaved({
      //     size: this.pagination.size,
      //     current: this.pagination.current,
      //     projectId: this.$store.state.taskAdmin.sqlParams.projectId,
      //     datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId,
      //     databaseSchema: this.$store.state.taskAdmin.sqlParams.schema,
      //     isSaved: 1
      //   })
      //   .then((response) => {
      //     if (response.code === 200) {
      //       this.sqlHistoryData1 = response.content.records
      //       this.pagination.total = response.content.total
      //     }
      //     this.tableLoading = false
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //     this.tableLoading = false
      //   })
      // }
    },
    getSqlListSaved() {
      sqlhisApi
        .getSqlListSaved({
          size: this.pagination.size,
          current: this.pagination.current,
          projectId: this.$store.state.taskAdmin.sqlParams.projectId,
          datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId,
          databaseSchema: this.$store.state.taskAdmin.sqlParams.schema,
          isSaved: 1
        })
        .then((response) => {
          if (response.code === 200) {
            this.sqlHistoryData1 = response.content.records
            this.pagination.total = response.content.total
          }
          this.tableLoading = false
        })
        .catch((error) => {
          console.log(error)
          this.tableLoading = false
        })
    },
    /**
     * @description: 删除手动保存
     */
    deleteHis(id) {
      sqlhisApi
        .deleteSaved(id)
        .then((response) => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success',
              duration: 2000
            })
          }
          this.getSqlListSaved()
        })
        .catch((_) => {
          this.$notify({
            title: '错误',
            message: '删除失败.',
            type: 'error',
            duration: 2000
          })
        })
    },
    /**
     * @description: 文件导出
     */
    fileSaver(tableRef, exportType) {
      this.$nextTick(() => {
        const wb = XLSX.utils.table_to_book(this.$refs[tableRef].$el)
        const wbout = XLSX.write(wb, {
          bookType: exportType,
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            this.tabLabel[this.tabsActive].concat('.').concat(exportType)
          )
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      })
    },
    /**
     * @description: 页面尺寸改变
     */
    handleSizeChange(size) {
      this.pagination.size = size
      this.pagination.current = 1
      this.getSqlList()
    },
    /**
     * @description: 当前页码改变
     */
    handleCurrentChange(current) {
      this.pagination.current = current
      this.getSqlList()
    },
    /**
     * @description: 回显结果
     */
    echoResult(row) {
      this.columns = row.sqlResult.columns
      this.tableData = row.sqlResult.tableData
      this.tabsActive = 'hisSql'
      this.$emit('echoResult', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  .el-tabs {
    .el-tab-pane {
      .demo-input-size{
        padding: 10px;
        margin: 0 auto;
        >>> .el-input .el-input__inner{
          height: 28px ;
          line-height: 28px;
        }
      }
      .el-table {
        .el-table-column {
          .el-select {
            height: 28px;
            >>> .el-input__inner {
              height: 28px !important;
              line-height: 28px !important;
            }
          }
        }
      }
    }
  }
}

.border-card {
  border: none;
  .el-tabs {
    border-right: none;
    box-shadow: none;
    // border-bottom: none;
    .el-tab-pane {
      height: 400px;

      .el-table {
        .el-table-column {
          .el-select {
            height: 28px;
            >>> .el-input__inner {
              height: 28px !important;
              line-height: 28px !important;
            }
          }
        }
      }
    }
  }
  >>> .el-tabs--border-card {
    border-right: none;
  }
}

.el-table::before {
  height: 0;
}

.el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}
.el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}
.line1{
	overflow : hidden;
  text-overflow: ellipsis;//当对象内文本溢出时显示省略标记
  display: -webkit-box;
  -webkit-line-clamp:2;//这边的2指的是两行
  -webkit-box-orient: vertical;
}
.Navigation {
  padding: 10px;
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
  line-height: 20px;
  // text-align: center;
  // width: 150px;
  // height: 30px;
  background: #f5f7fa;
}
.logs {
  width: 100%;
  height: auto;
}

</style>
