<template>
  <div class="app-container">
    <div class="main">
      <div id="menu_lt" class="lt">
        <!-- <ul>
          <li v-for="item in workflowList" :key="item.id" @click="handleWorkFlow(item)">{{ item.name }}</li>
        </ul> -->
        <el-input
          v-model="search"
          class="input_serach"
          prefix-icon="el-icon-search"
          placeholder="文件夹或建模名称"
          clearable
        />
        <el-tree
          id="main_span"
          ref="tree"
          :data="workflowList"
          highlight-current
          accordion
          default-expand-all
          draggable
          node-key="id"
          :expand-on-click-node="false"
          @node-click="handleWorkFlow"
          :filter-node-method="filterNode"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
            style="
              height: 26px;
              line-height: 26px;
              position: relative;
              display: block;
              width: 100%;
              font-size: 14px;
            "
          >
            <p style="height: 26px; line-height: 26px">
              <svg-icon
                v-if="data.type === 1"
                :icon-class="data.jobType"
                style="font-size: 15px; margin-right: 3px"
              />
              <svg-icon
                v-else
                icon-class="workflow_dev"
                style="font-size: 15px; margin-right: 3px"
              />
              {{ data.name }}
            </p>
          </span>
        </el-tree>
        <!-- 右键菜单 -->
        <vue-context-menu
          class="right-menu"
          :target="contextMenuTarget"
          :show="contextMenuVisible"
          @update:show="(show) => (contextMenuVisible = show)"
        >
          <a href="javascript:0" @click="newFolder">新建文件夹</a>
          <a id="newFile" href="javascript:"
            >新建模型<i class="el-icon-arrow-right" />
            <vue-context-menu
              class="right-menu1"
              :target="contextMenu1Target"
              :show.sync="contextMenu1Visible"
              style="display: none"
            >
              <a href="javascript:" @click="newWorkFlow('HIVE')">
                <svg-icon class="svg_icon" icon-class="HIVE" /> Hive表
              </a>
              <a href="javascript:" @click="newWorkFlow('IMPALA')">
                <svg-icon class="svg_icon" icon-class="IMPALA" /> Impala表
              </a>
            </vue-context-menu>
          </a>
          <a href="javascript:0" @click="reName">重命名</a>
          <a href="javascript:0" @click="delWorkFlow">删除</a>
        </vue-context-menu>
      </div>
      <div class="rg">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          close
          @tab-remove="removeTab"
          @tab-click="handleTabs"
        >
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            closable
          >
            <div v-if="item.name === '首页'" class="title_h3">
              一站式数据开发解决方案
            </div>
            <svg-icon
              v-if="item.name === '首页'"
              style="width: 100%; height: 600px; margin-top: 25px"
              icon-class="fengdie"
            />
            <Flow :tabsIds="item.content.id" v-if="item.name !== '首页'" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新建文件夹对话框 -->
      <el-dialog :visible.sync="newFolderDialog" width="40%" title="新建文件夹">
        <span style="margin-left: 20px">文件夹名称：</span
        ><el-input v-model="folderName" style="width: 80%; margin-left: 20px" />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" @click="createFolder">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 新建工作流对话框 -->
      <el-dialog :visible.sync="newETLdialog" width="40%" title="新建表">
        <span style="margin-left: 20px">表名称：</span
        ><el-input
          v-model="workflowName"
          style="width: 80%; margin-left: 20px"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" @click="createWorkflow">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 工作流重命名 -->
      <el-dialog :visible.sync="ReETLdialog" width="40%" title="重命名工作流">
        <span style="margin-left: 20px">名称：</span
        ><el-input
          v-model="reWorkflowName"
          style="width: 80%; margin-left: 20px"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" @click="ReNameWorkflow">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as jobProjectApi from '@/api/datax-job-project'
import * as workFlowApi from '@/api/datax-job-info'
import * as datasourceApi from '@/api/datax-jdbcDatasource'
import Flow from './workflow.vue'
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import { getTableSchema, getTableListWithComment } from '@/api/metadata-query'

export default {
  name: 'DDLTransform',
  components: {
    Flow,
    'vue-context-menu': VueContextMenu,
  },
  data() {
    return {
      contextMenu1Visible: false,
      contextMenu1Target: '',
      fieldTermChecked: false,
      collectionTermChecked: false,
      mapKeyTermChecked: false,
      lineTermChecked: false,
      nullDefinedAsChecked: false,
      contextMenuVisible: false,
      contextMenuTarget: '',
      editableTabsValue: '首页',
      tabIndex: 0,
      editableTabs: [
        {
          title: '首页',
          name: '首页',
          content: '',
        },
      ],
      workflowList: [
        {
          id: new Date().getTime(),
          name: 'w',
          workFlowData: {},
          title: 'w',
          content: { id: 1 },
        },
        {
          id: new Date().getTime(),
          name: 'ww',
          workFlowData: {},
          title: 'ww',
          content: { id: 2 },
        },
        {
          id: new Date().getTime(),
          name: 'www',
          workFlowData: {},
          title: 'www',
          content: { id: 3 },
        },
      ],
      workflowName: '', // 新建工作流名称
      reWorkflowName: '', // 重命名工作流名称
      newETLdialog: false, // 新建工作流对话框显示与否
      ReETLdialog: false, // 重命名工作流对话框
      newFolderDialog: false, // 文件夹对话框
      folderName: '', // 文件夹名称
      nowObject: {}, // 当前选择的工作流数据对象
      search: '', // 树形控件快速检索值
      form: {
        projectId: '',
        datasourceId: '', // 数据源id
        schema: '', // 数据源schema
        targetVersion: 'hive-1.1.0', // 取值：hive-1.1.0，hive-0.13.1，hive-0.12.0
        temporary: false, // 是否临时表
        external: true, // 是否外部表
        dropAdded: true, // 是否添加删除语句
        dbNameType: 'source', // source -与源库相同, udf - 根据dbNamePattern，用源库替换patter里的%s得到库名
        dbNamePattern: '%s', // 当dbNameType为udf时，根据dbNamePattern，用源库替换patter里的%s得库名
        tableNameType: 'source', // source -与源库相同, udf - 根据tableNamePattern，用源库替换patter里的%s得到表名
        tableNamePattern: '%s', // 当tableNamePattern为udf时，根据tableNamePattern，用源库替换patter里的%s得到表名
        tableNamePattern_o: '',
        partitionKey: 'random', // 分区字段，random: 随机选择, randomDate: 随机选择时间字段，none: 无分区
        bucketKey: 'random', // 分桶字段，primaryKey: 主键，random：随机选取，none：无分桶
        bucketNum: 3, // 分桶数量，整数
        bucketSortKey: 'date', // 分桶排序字段，date：选择某一个时间字段，random：随机选取字段，none：无排序字段
        bucketSortOrder: 'desc', // 分桶排序顺序，desc：降序，asc：升序
        rowformat: 'DELIMITED', // row format，DELIMITED：DELIMITED，SERDE：SERDE，none：无
        fieldTerm: ',', // 当rowformat为DELIMITED时，字段分隔符
        rowformatCollectTerm: ',', // 当rowformat为DELIMITED时，collection分隔符
        rowformatMapKeyTerm: ':', // 当rowformat为DELIMITED时，MapKey分隔符
        rowformatLineTerm: '\\n', // 当rowformat为DELIMITED时，行分隔符
        rowformatNullDefinndAs: ' ', // 当rowformat为DELIMITED时，Null值替换值
        rowformatSerdeName: '', // 当rowformat为SERDE时，serde类名
        storedAs: 'PARQUET', // 文件存储格式，取之范围：: SEQUENCEFILE，TEXTFILE，RCFILE，ORC，PARQUET，AVRO，JSONFILE
        location: '/tmp', // 对应location，存储位置
        targetSQL: 1, // 目标SQL类型
      },
      formCopy: undefined,
      rules: {
        projectId: [
          { required: true, message: '请选择所属项目名称', trigger: 'change' },
        ],
        datasourceId: [
          { required: true, message: '请选择待转换数据源', trigger: 'change' },
        ],
        schema: [
          {
            required: true,
            message: '请选择待转换数据库/Schema',
            trigger: 'change',
          },
        ],
      },
      storedAslist: [
        'SEQUENCEFILE',
        'TEXTFILE',
        'RCFILE',
        'ORC',
        'PARQUET',
        'AVRO',
        'JSONFILE',
        '无',
      ],
      hiveVersion: [
        {
          cdh: '> CDH 5.3.x',
          hive: 'hive-1.1.0',
        },
        {
          cdh: 'CDH 5.2.x | CDH 5.3.x',
          hive: 'hive-0.13.1',
        },
        {
          cdh: 'CDH 5.0.x | CDH 5.1.x',
          hive: 'hive-0.12.0',
        },
      ],
      transformPercentage: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        searchVal: '',
        userId: '',
      },
      projectlist: [],
      datasourcelist: [],
      datasourceListQuery: {
        current: 1,
        size: 10000,
        projectId: '',
        datasourceName: '',
      },
      schemalist: [],
      tablelist: [],
      showProgressbar: false,
      resultEnable: false,
      /** 进度log */
      sqlScript: '',
      mysql2hiveDataTypeMap: {
        int: 'INT',
        double: 'DOUBLE',
        varchar: 'String',
        datetime: 'DATE',
        timestamp: 'DATETIME',
      },
      dialogVisible: false,
      isLoading: false,
      navList: [
        { nav: 'source', name: '数据源&数据库' },
        { nav: 'sql', name: 'SQL' },
        { nav: 'db', name: '数据库&表' },
        { nav: 'partition', name: '分区&分桶' },
        { nav: 'format', name: '格式控制' },
        { nav: 'storage', name: '存储' },
      ],
      pos: {
        source: 0,
        sql: 0,
        db: 0,
        partition: 0,
        format: 0,
        storage: 0,
      },
      navActive: '0',
      project_id: '', // 当前项目id
      allWorkFlowList: [], // 所以工作流数据数组
    }
  },
  watch: {
    'form.tableNamePattern_o'(val) {
      this.form.tableNamePattern = '%s' + val
    },
    'form.tableNameType'(val) {
      if (val === 'source') {
        this.form.tableNamePattern_o = ''
      }
    },
    'form.dbNameType'(val) {
      if (val === 'source') {
        this.form.dbNamePattern = '%s'
      }
    },
    '$store.state.project.currentItem'(val) {
      // this.loadProject(val)
      console.log(val, '当前项目')
      if (typeof val === 'string') {
        this.project_id = parseInt(val.split('/')[0])
        this.serachWorkFlowList(parseInt(val.split('/')[0]))
        this.getAllWorkflow(this.project_id, 'workflow')
      }
    },
    // 快速检索工作流
    search: function (val) {
      this.$refs.tree.filter(val)
    },
    // 当前选择的工作流节点数据
    nowObject: function (val) {
      this.$store.commit('changeCurrent', val)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.getPos)
    // const myChartContainer = document.getElementById('main_span')
    const myChartContainer = document.getElementById('menu_lt')
    // 右击显示菜单 区域位置
    this.contextMenuTarget = myChartContainer
    this.contextMenu1Target = myChartContainer
    const a = document.getElementById('newFile')
    const b = document.getElementsByClassName('right-menu1')
    a.onmouseover = function () {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'block'
      }
    }
    const menu = document.getElementsByClassName('right-menu')

    // 关闭浏览器右击默认菜单
    const _this = this
    myChartContainer.oncontextmenu = function (e) {
      console.log(e, '113123')
      if (e.pageY > 400) {
        menu[1].style.top = 100 + 'px'
        _this.Ycoords = e.pageY
        console.log(_this.Ycoords, 'this')
      }
      console.log(menu)
      return false
    }
    // myChartContainer.onmousedown = function(e) {

    //   return false
    // }
  },
  created() {
    if (this.$store.state.project.currentItem) {
      if (typeof this.$store.state.project.currentItem === 'string') {
        this.project_id = parseInt(
          this.$store.state.project.currentItem.split('/')[0]
        )
        this.serachWorkFlowList(
          this.$store.state.project.currentItem.split('/')[0]
        )
        this.getAllWorkflow(
          this.$store.state.project.currentItem.split('/')[0],
          'workflow'
        )
      }
    }
    this.serachWorkFlowList()
    this.formCopy = JSON.parse(JSON.stringify(this.form))
    this.getProjectList()
    // this.loadProject(this.$store.state.project.currentItem)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getPos)
  },
  methods: {
    // 快速检索关键字
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // ———————————— 右键菜单方法 ————————————start
    // 展示新建文件夹对话框
    newFolder() {
      if (this.nowObject.type === 2) {
        this.$message.info('请选择文件夹')
      } else {
        this.newFolderDialog = true
      }
    },
    // 确定新建文件夹
    createFolder() {
      console.log(this.nowObject, '当前选择目标节点')
      const params = {
        projectId: this.project_id,
        parentId: this.nowObject.id,
        type: 1,
        name: this.folderName,
      }
      this.saveWorkflow(params)
      this.contextMenuVisible = false
      this.newFolderDialog = false
    },
    // 新建工作流
    newWorkFlow(val) {
      if (this.nowObject.type === 2) {
        this.$message.info('请选择文件夹')
      } else {
        this.newETLdialog = true
      }
    },
    // 确定新建工作流
    createWorkflow() {
      console.log('新建工作流')
      this.workflowList.push({
        id: new Date().getTime(),
        name: this.workflowName,
        workFlowData: {},
        title: this.workflowName,
        content: { id: 3 },
      })
      this.newETLdialog = false
    },
    // 新增工作流或文件夹通用方法
    saveWorkflow(params) {
      // workFlowApi
      //   .addWorkflow(params)
      //   .then((res) => {
      //     if (res.code === 200) {
      //       console.log(res, '新增工作流或文件夹')
      //       this.serachWorkFlowList(this.project_id)
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    },
    // 显示重命名工作流对话框
    reName(val) {
      console.log('重命名')
      this.ReETLdialog = true
    },
    // 确定重命名工作流
    ReNameWorkflow() {
      let params = {}
      params = this.nowObject
      params.name = this.reWorkflowName
      // workFlowApi
      //   .updateWorkflow(params)
      //   .then((res) => {
      //     console.log(res)
      //     if (res.code === 200) {
      //       this.$message.success('重命名工作流成功')
      //       for (let i = 0; i < this.editableTabs.length; i++) {
      //         if (this.editableTabs[i].content === this.nowObject) {
      //           this.editableTabs[i].title = this.reWorkflowName
      //         }
      //       }
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
      console.log(this.editableTabs)
      this.ReETLdialog = false
    },
    // 删除工作流
    delWorkFlow() {
      console.log('删除')
      for (let i = 0; i < this.workflowList.length; i++) {
        if (this.workflowList[i] === this.$store.state.workflow.currentData) {
          this.workflowList.splice(i, 1)
        }
      }
      this.$message.success('删除成功')

      this.contextMenuVisible = false
    },
    // 取消对话框
    cancelDialog() {
      this.newETLdialog = false
      this.newFolderDialog = false
      this.ReETLdialog = false
    },
    // 删除tabs窗口
    removeTab(targetName) {
      console.log(targetName, 'targetName')
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
      this.tabIndex -= 1
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    },
    // ———————————— 右键菜单方法 ————————————end

    // 点击左侧工作流列表
    handleWorkFlow(e) {
      let arr = []
      this.editableTabs.forEach((itme) => {
        arr.push(itme.name)
      })
      if (arr.includes(e.name)) {
        this.editableTabsValue = e.name
      }
      if (!arr.includes(e.name)) {
        this.editableTabsValue = e.name
        this.editableTabs.push(e)
        this.nowObject = e
      }
      console.log('qqq', arr)
      if (e.type === 2) {
        this.changeTabs(e)
      }
    },
    // 点击当前tabs窗口
    handleTabs(e) {
      console.log(e, '123')
      let arr = {}
      arr = this.allWorkFlowList.filter((item) => {
        if (item.name === e.label) {
          return item
        }
      })
      this.nowObject = arr[0]
      console.log(arr, 'arr')
    },
    // 添加或查找tabs页面
    changeTabs(obj) {
      if (this.editableTabs.length > 0) {
        let indexTabs = this.editableTabs
          .map((item) => item.title)
          .indexOf(obj.name)
        console.log(indexTabs)
        if (indexTabs !== -1) {
          this.editableTabsValue = indexTabs + ''
          console.log('this.editableTabsValue', this.editableTabsValue)
        } else {
          const newTabName = ++this.tabIndex + ''
          this.editableTabs.push({
            title: obj.name,
            name: newTabName,
            content: obj,
          })
          this.editableTabsValue = newTabName
          console.log('add', this.editableTabs, newTabName)
        }
      } else {
        console.log('只有首页时，添加tabs')
        const newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: obj.name,
          name: newTabName,
          content: obj,
        })
        this.editableTabsValue = newTabName
        return
      }
    },

    // _______________________________________
    /**
     * @description: 从vuex加载项目
     */
    loadProject(item) {
      const firstD = item.indexOf('/')
      this.form.projectId =
        firstD > -1 ? parseInt(item.substring(0, firstD)) : ''
      if (this.form.projectId !== undefined && this.form.projectId !== '') {
        this.onProjectChange(this.form.projectId)
      }
    },
    /**
     * @description: 开始转换
     */
    async onTransform(formName) {
      // const len = this.tablelist.length;
      // if (len < 1) {
      //   this.$notify({
      //     title: '警告',
      //     message: '未指定需要转换的表，请选择完善构建信息',
      //     type: 'warning',
      //     duration: 2000
      //   });
      //   return;
      // }
      // var targetSQL = this.form.targetSQL;
      // if (targetSQL == 1) {
      //   this.showProgressbar = true;

      //   for (let k = 0; k < len; k++) {
      //     await getTableColumns({
      //       datasourceId: this.form.datasourceId,
      //       schema: this.form.schema,
      //       tableName: this.tablelist[k].name
      //     }).then((res) => {
      //       console.log(res.datas);
      //       const arr = [];
      //       var script =
      //         'CREATE TABLE IF NOT EXISTS ' + this.tablelist[k].name + ' (\n';
      //       for (let j = 0; j < res.datas.length; j++) {
      //         var ele = res.datas[j];
      //         script +=
      //           '  ' +
      //           ele.COLUMN_NAME +
      //           ' ' +
      //           this.mysql2hiveDataTypeMap[ele.DATA_TYPE] +
      //           " comment '" +
      //           ele.COLUMN_COMMENT +
      //           "',\n";
      //       }
      //       this.sqlScript +=
      //         script +
      //         ")\nrow format delimited fields terminated by ',' \nlines terminated by '\\n';\n\n";
      //     });
      //     // this.sqlScript = this.sqlScript + this.tablelist[j].name + '\n'
      //     this.transformPercentage = Math.round(((k + 1) / len) * 100);
      //   }
      //   console.log(this.sqlScript);
      // } else if (targetSQL == 2) {
      // } else if (targetSQL == 3) {
      // } else {
      //   this.$notify({
      //     title: '警告',
      //     message: '未知目标SQL类型：' + targetSQL,
      //     type: 'warning',
      //     duration: 2000
      //   });
      //   return;
      // }

      // // this.$refs.transformProgress.setstate = 'success'

      // this.$notify({
      //   title: '转换完成',
      //   message: 'DDL转换完成，点击查看转换结果查看SQL',
      //   type: 'success',
      //   duration: 2000
      // });
      // this.showProgressbar = false
      // this.transformPercentage = 0
      console.log('this.form', this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sqlScript = ''
          this.showProgressbar = true
          this.transformPercentage = 0
          this.isLoading = true
          if (this.form.targetSQL === 1) {
            // to hive
            db2hive(this.form).then((response) => {
              response.forEach((ele) => {
                this.sqlScript += ele + '\n'
              })
              this.transformPercentage = 100
              setTimeout(() => {
                this.showProgressbar = false
                this.resultEnable = true
              }, 1000)
              this.isLoading = false
            })
          }
        } else {
          this.resultEnable = false
          return false
        }
      })
    },
    /**
     * @description: 获取项目列表
     */

    onProjectChange(value) {
      console.log(value)
      this.datasourceListQuery.projectId = value
      // datasourceApi.getJobList(this.datasourceListQuery).then((response) => {
      //   this.datasourcelist = response.records
      //   this.form.datasourceId = ''
      //   this.form.schema = ''
      //   console.log(this.datasourcelist)
      // })
    },
    onDSChange(value) {
      console.log(value)
      getTableSchema({
        datasourceId: value,
      }).then((res) => {
        console.log(res)
        this.schemalist = res
        this.form.schema = ''
      })
    },
    onSchemaChange(value) {
      getTableListWithComment({
        id: this.form.datasourceId,
        schema: value,
      }).then((res) => {
        console.log('res', res)
        // this.tableList = res;
        this.tablelist = res
      })
    },
    /**
     * @description: 转换结果
     */
    showTransformedSQL() {
      this.dialogVisible = true
      // this.transformPercentage = 0;
    },
    /**
     * @description: 进度条颜色
     */
    progressColor(percentage) {
      if (percentage < 30) {
        return '#3d5eff'
      } else if (percentage < 70) {
        return '#409eff'
      } else {
        return '#67c23a'
      }
    },
    /**
     * @description: 进度条文字
     */
    progressFormat(percentage) {
      return percentage === 100 ? `完成` : `${percentage}%`
    },
    /**
     * @description: 新的构建
     */
    newTransform() {
      this.form = JSON.parse(JSON.stringify(this.formCopy))
      this.showProgressbar = false
      this.isLoading = false
    },
    /**
     * @description: 复制结果脚本到剪贴板
     */
    // 复制成功
    onCopy(e) {
      this.$message({
        message: '复制成功！',
        type: 'success',
      })
    },
    // 复制失败
    onError(e) {
      this.$message({
        message: '复制失败！',
        type: 'error',
      })
    },
    /**
     * @description: 脚本导出
     */
    onExportScript() {
      const fileBlob = new Blob([this.sqlScript])
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(fileBlob)
      downloadElement.href = href
      downloadElement.download = '导出脚本' + '.txt'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    },
    /**
     * @description: 跳转锚点
     */
    jumpTo(nav) {
      // behavior 可选
      // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"。
      // block 可选
      // 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"。
      // inline 可选
      // 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"。
      this.$refs[nav].$el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    },
    getPos() {
      if (this.$refs.source) {
        this.$set(
          this.pos,
          'source',
          this.$refs.source.$el.getBoundingClientRect().top
        )
      }
      if (this.$refs.sql) {
        this.$set(
          this.pos,
          'sql',
          this.$refs.sql.$el.getBoundingClientRect().top
        )
      }
      if (this.$refs.db) {
        this.$set(this.pos, 'db', this.$refs.db.$el.getBoundingClientRect().top)
      }
      if (this.$refs.partition) {
        this.$set(
          this.pos,
          'partition',
          this.$refs.partition.$el.getBoundingClientRect().top
        )
      }
      if (this.$refs.format) {
        this.$set(
          this.pos,
          'format',
          this.$refs.format.$el.getBoundingClientRect().top
        )
      }
      if (this.$refs.storage) {
        this.$set(
          this.pos,
          'storage',
          this.$refs.storage.$el.getBoundingClientRect().top
        )
      }
      if (this.pos.storage !== undefined && this.pos.storage <= 20) {
        this.navActive = '5'
      }
      if (
        this.pos.format !== undefined &&
        this.pos.format <= 20 &&
        this.pos.storage > 20
      ) {
        this.navActive = '4'
      }
      if (
        this.pos.partition !== undefined &&
        this.pos.partition <= 20 &&
        this.pos.format > 20
      ) {
        this.navActive = '3'
      }
      if (
        this.pos.db !== undefined &&
        this.pos.db <= 20 &&
        this.pos.partition > 20
      ) {
        this.navActive = '2'
      }
      if (
        this.pos.sql !== undefined &&
        this.pos.sql <= 20 &&
        this.pos.db > 20
      ) {
        this.navActive = '1'
      }
      if (
        this.pos.source !== undefined &&
        this.pos.source <= 20 &&
        this.pos.sql > 20
      ) {
        this.navActive = '0'
      }
    },
  },
}
</script>

<style lang="scss">
#newFile {
  position: relative;
  .right-menu1 {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
    height: auto;
    // overflow-y: auto;
    border-radius: 1px;
    display: block;
    margin-left: 116px;
    margin-top: 28px;
    font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: fixed;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    z-index: 999;
    display: none;
    padding: 2px;
    box-shadow: 5px 5px 10px gray;
    a {
      padding: 2px 15px;
      width: 176px;
      height: 28px;
      line-height: 28px;
      text-align: left;
      display: block;
      color: #1a1a1a;
      text-decoration: none;
      font-size: 13px;
      i {
        margin-left: 20px;
      }
    }
    #level3 {
      padding: 2px 15px;
      width: 176px;
      height: 28px;
      line-height: 28px;
      text-align: left;
      display: block;
      color: #1a1a1a;
      text-decoration: none;
      font-size: 13px;
      position: relative;
      .right-menu2 {
        border: 1px solid #eee;
        box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
        height: 90px;
        border-radius: 1px;
        display: block;
        margin-left: 116px;
        margin-top: 28px;
        left: 60px;
        top: -28px;
        font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        position: absolute;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        z-index: 999;
        display: block;
        padding: 2px;
        box-shadow: 5px 5px 10px gray;
        a {
          padding: 2px 15px;
          width: 176px;
          height: 28px;
          line-height: 28px;
          text-align: left;
          display: block;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 13px;
          i {
            margin-left: 20px;
          }
        }
        a:hover {
          background: #42b983;
          color: #fff;
        }
        hr {
          color: #eee;
        }
      }
    }
    a:hover {
      background: #42b983;
      color: #fff;
    }
    hr {
      color: #eee;
    }
  }
}
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .box-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
      border: 0 !important;
      border-radius: 0;
      .left {
        float: left;
        width: 120px;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000a6;
        margin: 15px 24px;
      }
    }
  }

  .main {
    padding: 0px 24px 0px 0;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;
    display: flex;
    .el-form {
      margin: 15px 0;
      >>> .el-form-item__label {
        font-size: 15px !important;
      }
      h1 {
        font-size: 24px;
        margin: 15px 0 20px 0;
        font-weight: 550;
      }
      .el-row {
        .el-col {
          .el-form-item {
            .el-select {
              width: 100%;
            }
            .el-checkbox {
              width: 46%;
              .el-input {
                width: 50%;
              }
            }
          }
        }
      }
    }
    .lt {
      width: 360px;
      padding: 10px;
      height: calc(100vh - 181px);
      background: #f8f8fa;
      .el-input {
        margin-bottom: 20px;
      }
      ul {
        li {
          height: 40px;
          line-height: 40px;
          background-color: #f8f8fa;
          cursor: pointer;
        }
        li:hover {
          background-color: #eff2ff;
        }
        li:visited {
          background-color: #3b4986;
        }
      }
      .right-menu {
        border: 1px solid #eee;
        box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
        border-radius: 1px;
        display: block;
        font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        position: fixed;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        z-index: 999;
        display: none;
        padding: 2px;
        box-shadow: 5px 5px 10px gray;
        a {
          padding: 2px 15px;
          // width: 120px;
          height: 28px;
          line-height: 28px;
          text-align: left;
          display: block;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 13px;
          i {
            margin-left: 20px;
          }
        }
        a:hover {
          background: #42b983;
          color: #fff;
        }
        hr {
          color: #eee;
        }
      }
    }
    .rg {
      flex: 1;
      .el-tabs__nav .el-tabs__item:nth-child(1) span {
        display: none;
      }
      .el-tabs {
        .el-tabs__content {
          // height: calc(100vh - 80px);
          overflow-y: auto;
          overflow-x: auto;
        }
        .el-tabs__header {
          height: 32px;
          line-height: 32px;
          margin: 0;
          .el-tabs__nav {
            width: 200px;
            border-top: 1px solid #f8f8fa;
            .el-tabs__item {
              width: 100%;
              border: none;
              border-top: 1px solid #f8f8fa;
              border-radius: 6px 6px 0px 0px;
              height: 32px;
              line-height: 32px;
              position: relative;
              overflow: hidden;
              vertical-align: bottom;
              text-overflow: ellipsis;
              white-space: nowrap;
              .el-icon-close {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
        }
        .el-tabs__item.is-active {
          background-color: #ffffff;
          // border-bottom-color:  #3d5eff;
        }
        // .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
        //   height: 50px;
        //   line-height: 50px;
        // }
        .el-tab-pane {
          // padding: 10px;
          // height: 100%;
          position: relative;
          .job_detail {
            height: 100%;
          }
          .title_h3 {
            position: absolute;
            font-size: 24px;
            font-weight: 700;
            font-family: '楷体';
            left: 24px;
            top: 30px;
          }
        }
      }
    }
  }

  .el-dialog {
    border-radius: 8px;

    .el-dialog__header {
      font-size: 24px;

      .p_tit {
        font-size: 16px;
        color: #cccccc;
        margin-top: 20px;
      }
    }

    .el-dialog__body {
      padding: 10px 20px;

      .el-form {
        overflow: hidden;
        border-radius: 6px;
        padding-right: 25px;
      }
    }

    .el-dialog__footer {
      border-top: 1px solid #f3f3f3;
      padding: 20px;
    }
  }

  .codesql {
    font-size: 11pt;
    // font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    // DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    >>> .el-textarea__inner {
      font-family: PingFangHK-Medium, PingFangHK;
    }
  }

  >>> .el-dialog__body {
    padding-top: 10px;
  }

  .result-options {
    .el-tooltip {
      background: #e6e6e6;
    }
    .el-tooltip:hover {
      background: #daf3fd;
    }
  }
  .result-op {
    display: none;
  }

  .dialogBody:hover {
    .result-op {
      display: inline;
      transition: width 0.15s linear;
    }
  }
  >>> .el-aside {
    margin-right: 20px;
  }
  >>> .el-menu-item.is-active {
    font-weight: 550;
    font-size: 17px;
  }
  >>> .el-menu-item {
    text-align: right;
  }
  >>> .el-menu {
    // border-right: 0;
    background: transparent;
  }
  // >>> .el-main {
  //   border-left: 1px solid #e6e6e6;
  // }
}
</style>
