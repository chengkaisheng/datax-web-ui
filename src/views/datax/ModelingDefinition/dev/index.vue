<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">模型定义</div>
          <el-col class="left-description">
            数据开发人员根据指标定义设计维度模型后，进行模型的新建、编辑、查看和修改操作，方便管理。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <div id="menu_lt" class="lt" :style="{ width: width + 'px' }">
        <!-- <ul>
          <li
            v-for="item in workflowList"
            :key="item.id"
            @click="handleWorkFlow(item)"
          >
            {{ item.name }}
          </li>
        </ul> -->
        <el-dropdown v-if="showCurrent" @command="handleCommand">
          <span>
            {{ dropdownText }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in options"
              :key="item.id"
              :command="item.id + '/' + item.name"
            >{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="height: 20px" />
        <el-input
          v-model="search"
          prefix-icon="el-icon-search"
          placeholder="输入文件夹或模型名称快速检索"
          clearable
          style="margin-top: 7px"
        />
        <el-tree
          id="main_span"
          ref="tree"
          v-loading="loading"
          :data="workflowList"
          highlight-current
          default-expand-all
          draggable
          node-key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-drag-start="handleDragStart"
          @node-click="handleWorkFlow"
        >
          <!--        style="
          height: 32px;
          line-height: 32px;
          position: relative;
          display: block;
          width: 100%;
          font-size: 14px;
        " -->
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
            style="font-size: 14px;"
          >
            <p>
              <svg-icon
                v-if="data.type === 1"
                :icon-class="data.jobType"
                style="margin-right: 6px"
              />
              <svg-icon
                v-if="data.jobType === 'HIVE'"
                :icon-class="data.jobType"
                style="margin-right: 6px"
              />
              <svg-icon
                v-if="data.jobType === 'IMPALA'"
                :icon-class="data.jobType"
                style="margin-right: 6px"
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
          <a
            id="newFile"
            href="javascript:"
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
        <u id="drag" @mousedown="mousedown">
          <div class="arrow">
            <li class="el-icon-caret-left" />
            <li class="el-icon-caret-right" />
          </div>
        </u>
      </div>
      <!-- </vue-draggable-resizable> -->
      <!--拖拽-->
      <!-- <vue-draggable-resizable
        style="z-index: 999"
        :h="height"
        :w="width"
        :x="-50"
        :y="10"
        @resizing="handleResize"
        class-name="dragging1"
      >
        <div class="drag">拖拽</div>
      </vue-draggable-resizable> -->
      <!--拖拽-->

      <div class="rg" style="user-select: none">
        <el-tabs
          v-model="editableTabsValue"
          type="border-card"
          closable
          @tab-remove="removeTab"
          @tab-click="handleTabs"
        >
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.id"
            v-loading="tabDelLoading"
            :label="item.name"
            :name="item.name"
            closable
            tab-position="left"
          >
            <!-- <span slot="label" style="user-select: none">
              <svg-icon
                v-if="item.name !== '首页'"
                :icon-class="item.jobType"
                style="font-size: 15px; margin-right: 3px"
              />
              {{ item.name }}
            </span> -->
            <div v-if="item.name === '首页'" class="title_h3">
              一站式数据开发解决方案
            </div>
            <svg-icon
              v-if="item.name === '首页'"
              style="width: 100%; height: calc(100vh - 50px); margin-top: 25px"
              icon-class="fengdie"
            />
            <Model
              v-if="item.name !== '首页' && item.jobType !== 'wenjianjia'"
              :tabs-ids="item.id"
              :table-type="item.jobType"
              :tabledata="nowObject"
              @getTree="gettree"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 新建文件夹对话框 -->
      <el-dialog :visible.sync="newFolderDialog" width="30%" title="新建文件夹">
        <span>文件夹名称：</span><el-input v-model="folderName" style="width: 71%; margin-left: 20px" />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" :disabled="isdisabled" @click="createFolder">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 新建模型对话框 -->
      <el-dialog :visible.sync="newETLdialog" width="40%" title="新建表">
        <span style="margin-left: 20px">表名称：</span><el-input
          v-model="workflowName"
          style="width: 80%; margin-left: 20px"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" :disabled="isdisabled" @click="createWorkflow">
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 模型重命名 -->
      <el-dialog :visible.sync="ReETLdialog" width="40%" title="重命名模型">
        <span style="margin-left: 20px">名称：</span><el-input
          v-model="reWorkflowName"
          style="width: 80%; margin-left: 20px"
          oninput="this.value = this.val.replace(/^ +| +$/g, '')"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelDialog"> 取消 </el-button>
          <el-button type="goon" size="small" :disabled="isdisabled" @click="ReNameWorkflow">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as modeling from '@/api/datax-job-modeling'
// import * as workFlowApi from '@/api/datax-job-info'
// import * as datasourceApi from '@/api/datax-jdbcDatasource'
import * as jobProjectApi from '@/api/datax-job-project'
import Model from './model.vue'
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import { getTableSchema, getTableListWithComment } from '@/api/metadata-query'

export default {
  name: 'DDLTransform',
  components: {
    Model,
    'vue-context-menu': VueContextMenu
  },
  data() {
    return {
      isdisabled: true,
      tabDelLoading: false,
      icon: 'el-icon-arrow-left',
      width: 325,
      tabledata: '',
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
          content: ''
        }
      ],
      workflowList: [
        // {
        //   id: 1,
        //   type: 1,
        //   jobType: 'wenjianjia',
        //   name: 'test',
        //   workFlowData: {},
        //   title: 't_test_model',
        //   content: { id: 1 },
        //   children: [
        //     {
        //       id: 2,
        //       type: 2,
        //       jobType: 'HIVE',
        //       name: 't_test_model',
        //       workFlowData: {},
        //       title: 't_test_model',
        //       content: { id: 1 },
        //     },
        //     {
        //       id: 3,
        //       type: 2,
        //       jobType: 'IMPALA',
        //       name: 't_rtl_user_info',
        //       workFlowData: {},
        //       title: 't_rtl_user_info',
        //       content: { id: 2 },
        //     },
        //     {
        //       id: 4,
        //       type: 2,
        //       jobType: 'HIVE',
        //       name: 't_rtl_order_info',
        //       workFlowData: {},
        //       title: 't_rtl_order_info',
        //       content: { id: 3 },
        //     },
        //   ],
        // },
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
        targetSQL: 1 // 目标SQL类型
      },
      formCopy: undefined,
      rules: {
        projectId: [
          { required: true, message: '请选择所属项目名称', trigger: 'change' }
        ],
        datasourceId: [
          { required: true, message: '请选择待转换数据源', trigger: 'change' }
        ],
        schema: [
          {
            required: true,
            message: '请选择待转换数据库/Schema',
            trigger: 'change'
          }
        ]
      },
      storedAslist: [
        'SEQUENCEFILE',
        'TEXTFILE',
        'RCFILE',
        'ORC',
        'PARQUET',
        'AVRO',
        'JSONFILE',
        '无'
      ],
      hiveVersion: [
        {
          cdh: '> CDH 5.3.x',
          hive: 'hive-1.1.0'
        },
        {
          cdh: 'CDH 5.2.x | CDH 5.3.x',
          hive: 'hive-0.13.1'
        },
        {
          cdh: 'CDH 5.0.x | CDH 5.1.x',
          hive: 'hive-0.12.0'
        }
      ],
      transformPercentage: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        searchVal: '',
        userId: ''
      },
      projectlist: [],
      datasourcelist: [],
      datasourceListQuery: {
        current: 1,
        size: 10000,
        projectId: '',
        datasourceName: ''
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
        timestamp: 'DATETIME'
      },
      dialogVisible: false,
      isLoading: false,
      navList: [
        { nav: 'source', name: '数据源&数据库' },
        { nav: 'sql', name: 'SQL' },
        { nav: 'db', name: '数据库&表' },
        { nav: 'partition', name: '分区&分桶' },
        { nav: 'format', name: '格式控制' },
        { nav: 'storage', name: '存储' }
      ],
      pos: {
        source: 0,
        sql: 0,
        db: 0,
        partition: 0,
        format: 0,
        storage: 0
      },
      navActive: '0',
      project_id: '', // 当前项目id
      allWorkFlowList: [], // 所以工作流数据数组
      jobType: '',
      projectid: '45/123',
      options: [],
      dropdownText: '123',
      showCurrent: true,
      loading: true,
      // 右键鼠标的Y坐标
      Ycoords: null,
      CurrentMousePosition: '',
      CurrentWidth: 300
    }
  },
  watch: {
    reWorkflowName(val) {
      console.log(val)
      this.isdisabled = false
      var rel = /^ +| +$/g
      if (rel.test(val) || val === '') {
        this.isdisabled = true
      }
    },
    folderName(val) {
      this.isdisabled = false
      var rel = /^ +| +$/g
      if (rel.test(val) || val === '') {
        this.isdisabled = true
      }
    },
    workflowName(val) {
      this.isdisabled = false
      var rel = /^ +| +$/g
      if (rel.test(val) || val === '') {
        this.isdisabled = true
      }
    },

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
      if (val === undefined) {
        return
      }
      console.log('valllll', val)
      localStorage.setItem('project_id', JSON.stringify(val))
      const project_id = JSON.parse(localStorage.getItem('project_id'))
        ? JSON.parse(localStorage.getItem('project_id'))
        : JSON.parse(localStorage.getItem('projectid'))
      if (typeof val === 'string') {
        this.project_id = parseInt(val.split('/')[0])
        this.getlist(this.project_id)
      }
    },
    // 快速检索工作流
    search: function(val) {
      this.$refs.tree.filter(val)
    },
    // 当前选择的工作流节点数据
    nowObject: function(val) {
      this.$store.commit('changeCurrent', val)
    },
    Ycoords(val) {
      const menu = document.getElementsByClassName('right-menu')
      const menu1 = document.getElementsByClassName('right-menu1')
      const menu2 = document.getElementsByClassName('right-menu2')
      console.log(menu, menu1, menu2)
      if (val > 500) {
        setTimeout(() => {
          menu[1].style.top =
            parseInt(menu[1].style.top.split('px')[0]) - 200 + 'px'
          menu1[0].style.top =
            parseInt(menu1[0].style.top.split('px')[0]) - 200 + 'px'
          menu2[0].style.top =
            parseInt(menu2[0].style.top.split('px')[0]) - 200 + 'px'
        }, 100)
      }
    }
  },
  mounted() {
    const drag = document.getElementById('drag')
    console.log('drag--->', drag)
    window.addEventListener('scroll', this.getPos)
    const myChartContainer = document.getElementById('menu_lt')
    console.log(myChartContainer)
    // 右击显示菜单 区域位置
    this.contextMenuTarget = myChartContainer
    this.contextMenu1Target = myChartContainer

    const menu = document.getElementsByClassName('right-menu')

    // 关闭浏览器右击默认菜单
    const _this = this
    myChartContainer.oncontextmenu = function(e) {
      console.log(e, '右键事件')
      console.log(menu[1])
      if (e.pageY > 400) {
        menu[1].style.top = 100 + 'px'
        _this.Ycoords = e.pageY
        console.log(_this.Ycoords, 'this')
      }
      console.log('menu', menu)
      return false
    }
    // myChartContainer.onmousedown = function(e) {

    //   return false
    // }
    const a = document.getElementById('newFile')
    const b = document.getElementsByClassName('right-menu1')
    for (var i = 0; i < b.length; i++) {
      b[i].style.display = 'none'
    }
    a.onmouseover = function() {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'block'
      }
    }
    a.onmouseout = function() {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'none'
      }
    }
  },
  created() {
    document.addEventListener('mouseup', this.mouseUp)
    this.getItem()
    // this.formCopy = JSON.parse(JSON.stringify(this.form))
    // console.log('this.formCopy', this.formCopy)
    const str = sessionStorage.getItem('strParam')
    if (sessionStorage.getItem('level') === '2') {
      if (str) {
        this.dropdownText = str.split('/')[1]
        this.getlist(str.split('/')[0])
        this.$store.commit('changeCurrent', str)
      }
      this.showCurrent = false
    }
    setTimeout(() => {
      console.log('res.records--->', this.options)
      if (sessionStorage.getItem('strParam')) {
        const project_id =
          sessionStorage.getItem('strParam').split('/')[0] || 45
        this.dropdownText =
          sessionStorage.getItem('strParam').split('/')[1] || 123
        this.getlist(project_id)
      } else {
        const project_id = '45'
        this.dropdownText = '123'
        this.getlist(project_id)
      }
    }, 1000)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getPos)
  },
  destroyed() {
    document.removeEventListener('mouseup', this.mouseUp)
  },
  methods: {
    shrink() {
      this.width = 200
      this.icon = 'el-icon-arrow-right'
    },
    // 移动鼠标放大
    mousedown(event) {
      document.addEventListener('mousemove', this.mouseMove)
      this.CurrentMousePosition = event.clientX
    },
    mouseMove(event) {
      const pixel = event.clientX - this.CurrentMousePosition
      this.width = this.CurrentWidth + pixel
      if (this.width < 200) {
        this.width = 200
      }
      if (this.width > 200) {
        this.width = this.CurrentWidth + pixel
      }
    },
    // 移动鼠标放大
    mouseUp() {
      this.CurrentWidth = this.width
      document.removeEventListener('mousemove', this.mouseMove)
    },
    gettree(data) {
      this.getlist(data)
    },
    handleCommand(data) {
      this.dropdownText = data.split('/')[1]
      const project_id = data.split('/')[0]
      sessionStorage.setItem('strParam', data)
      this.getlist(project_id)
    },
    // 获取下拉选择列表
    getItem() {
      this.loading = true
      this.listQuery.userId = JSON.parse(localStorage.getItem('userId'))
      jobProjectApi
        .list(this.listQuery)
        .then((res) => {
          this.options = res.records
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取tree列表
    getlist(val, newtask) {
      this.loading = true
      const projectId = { projectId: val }
      modeling
        .Getlist(projectId)
        .then((res) => {
          this.workflowList = res.content
          this.loading = false
          // this.lastdata =
          //   res.content[0].children[res.content[0].children.length - 1]
          if (newtask && newtask.name === 'newtask') {
            const newarr = []
            for (var i in res.content[0].children) {
              if (res.content[0].children[i].children) {
                newarr.push(res.content[0].children[i].children)
              } else {
                newarr.push(res.content[0].children)
              }
              if (res.content[0].children[i].children) {
                for (var j in res.content[0].children[i].children) {
                  newarr.push(res.content[0].children[i].children[j])
                }
              }
            }
            this.lastdata = newarr.flat(Infinity).filter((itme) => {
              return itme.id === newtask.id
            })
            console.log('新建工作流-=-=-=newtask', this.lastdata[0])
            this.handleWorkFlow(this.lastdata[0])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 快速检索关键字
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // ———————————— 右键菜单方法 ————————————start
    // 展示新建文件夹对话框
    newFolder() {
      this.newFolderDialog = true
    },
    // 确定新建文件夹
    createFolder() {
      console.log(this.nowObject, '当前选择目标节点')
      const params = {
        projectId: this.nowObject.projectId,
        parentId: this.nowObject.id,
        type: 1,
        jobType: 'wenjianjia',
        name: this.folderName
      }
      console.log('======', params)
      modeling
        .Newtable(params)
        .then((res) => {
          if (res.code === 200 && res.content !== '请选择父级目录') {
            this.getlist(params.projectId)
          }
          if (res.content === '请选择父级目录') {
            this.$message(res.content)
          }
        })
        .catch((err) => {
          this.$message(err)
          console.log('新建', err)
        })
      this.contextMenuVisible = false
      this.newFolderDialog = false
    },
    // 新建工作流
    newWorkFlow(val) {
      console.log(val)
      this.jobType = val
      if (this.nowObject.type === 2) {
        this.$message.info('请选择文件夹')
      } else {
        this.newETLdialog = true
      }
    },
    // 确定新建工作流
    async createWorkflow() {
      console.log('任务类型', this.jobType)
      const params = {
        name: this.workflowName,
        projectId: this.nowObject.projectId,
        parentId: this.nowObject.id,
        type: 2,
        jobType: this.jobType
      }
      console.log('params------>', params)
      modeling
        .Newtable(params)
        .then((res) => {
          if (res.code === 200) {
            this.workflowName = ''
            const newtask = { name: 'newtask', id: res.content }
            this.getlist(params.projectId, newtask)
          }
          console.log('新建', res)
        })
        .catch((err) => {
          this.workflowName = ''
          console.log('新建', err)
          // this.newETLdialog = false
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
      console.log('重命名', this.nowObject)
      this.ReETLdialog = true
    },
    // 确定重命名工作流
    ReNameWorkflow() {
      if (!this.nowObject.id || this.nowObject === undefined) {
        this.$message('选择需要修改的表')
      }
      if (this.nowObject.id) {
        let params = {}
        params = this.nowObject
        params.name = this.reWorkflowName
        console.log('params--->', params)
        modeling
          .Update(params)
          .then((res) => {
            console.log('重命名----》', res)
            if (res.code === 200) {
              this.$message.success('重命名成功')
            }
          })
          .catch((err) => {
            console.log(err)
          })
        console.log(this.editableTabs)
        this.ReETLdialog = false
      }
      this.ReETLdialog = false
    },
    // 删除表任务
    delWorkFlow(data) {
      console.log('删除', this.nowObject)
      this.$confirm('此操作将删除该任务表' + ',' + '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tabDelLoading = true
          modeling
            .DeleteTable({ id: this.nowObject.id })
            .then((res) => {
              if (res.code === 200) {
                console.log('delete')
                this.getlist(this.nowObject.projectId)
                for (let i = 0; i < this.editableTabs.length; i++) {
                  if (this.editableTabs[i].name === this.nowObject.name) {
                    this.editableTabs.splice(i, 1)
                  }
                }
                const lastdata = this.editableTabs[this.editableTabs.length - 1]
                console.log('lastdata--->', lastdata)
                this.handleWorkFlow(lastdata)
                this.$message.success('删除成功')
              }
              this.tabDelLoading = false
            })
            .catch((err) => {
              // this.$message('删除失败' + err)
              console.log('删除失败', err)
              this.$message.error('删除失败', err)
              this.tabDelLoading = false
            })
          this.contextMenuVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          this.contextMenuVisible = false
        })
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
      if (targetName === '首页') {
        return
      }
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
    handleWorkFlow(data) {
      console.log('任务数据', data)
      this.$store.commit('TABLEDATA', data)
      this.$store.commit('Singledata', data)
      this.reWorkflowName = data.name
      this.nowObject = data
      if (data.jobType === 'wenjianjia') {
        return
      }
      const arr = []
      this.editableTabs.forEach((itme) => {
        arr.push(itme.name)
      })
      if (arr.includes(data.name)) {
        this.editableTabsValue = data.name
        this.nowObject = data
      }
      if (!arr.includes(data.name)) {
        this.editableTabsValue = data.name
        this.editableTabs.push(data)
        this.nowObject = data
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
        const indexTabs = this.editableTabs
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
            content: obj
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
          content: obj
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
        datasourceId: value
      }).then((res) => {
        console.log(res)
        this.schemalist = res
        this.form.schema = ''
      })
    },
    onSchemaChange(value) {
      getTableListWithComment({
        id: this.form.datasourceId,
        schema: value
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
        type: 'success'
      })
    },
    // 复制失败
    onError(e) {
      this.$message({
        message: '复制失败！',
        type: 'error'
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
        inline: 'nearest'
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
    // 拖拽tree
    handleDragStart(node, ev) {
      this.dropId = node.data.id
      console.log('节点开始拖拽时触发的事件', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      this.targetId = dropNode.key
      console.log('拖拽进入其他节点时触发的事件', this.targetId)
      console.log('拖拽进入其他节点时触发的事件', dropNode)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('拖拽离开某个节点时触发的事件')
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('拖拽结束时（可能未成功）触发的事件')
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('拖拽成功完成时触发的事件')
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(dropNode)

      if (dropNode.data.type === 2) {
        return type !== 'inner'
      } else {
        return type === 'inner'
      }
    },
    allowDrag(draggingNode) {
      console.log(draggingNode, 'draggingNode')
      return draggingNode.data.name.indexOf('三级 3-2-2') === -1
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('...', dropNode)
      if (dropNode.data.type === 1) {
        modeling
          .Update({
            id: this.dropId,
            parentId: this.targetId
          })
          .then((res) => {
            console.log(res)
            if (res.code === 200) {
              console.log(res.msg)
            } else {
              this.$message.err(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.$message.error('拖拽失败，目标必须是文件夹')
        this.serachWorkFlowList(this.$store.state.project.currentItem.split('/')[0])
      }
      console.log('tree drop: ', dropNode.label, dropType, draggingNode)
    }
  }
}
</script>

<style lang="scss" >
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
      width: 150px;
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
    // margin: 20px 20px 0 20px;
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
      position: relative;
      // border: 1px solid #ccc;
      width: 325px;
      // height: 650px;
      padding: 10px;
      // height: calc(100vh - 50px);
      background: #f8f8fa;
      .el-input {
        margin-bottom: 20px;
      }
      ul {
        li {
          height: 32px;
          line-height: 32px;
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
      .dragging1 {
        border: 1px solid #000;
        color: #000;
      }
    }
    #drag {
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0px;
      right: 4px;
      z-index: 999;
      height: 100%;
      // width: 1px;
      // border: 2px solid #ccc;
      background: #f8f8fa;
      cursor: e-resize;
    }
    #drag:hover {
      width: 5px;
    }
    .arrow {
      position: absolute;
      top: 300px;
    }
    #drag li {
      list-style: none;
      margin: 0;
      padding: 0;
      color: #ccc;
    }
    .rg {
      // flex: 1;
      width: 100%;
      height: 100%;
      flex: 1;
      overflow-y: hidden;
    }
  }

  .el-dialog {
    border-radius: 4px;

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
      // border-top: 1px solid #f3f3f3;
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
.el-input .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.el-tree {
    position: relative;
    cursor: default;
    background: #f8f8fa;
    color: black;
    margin: -10px 0px 0 -8px;
}

.el-tabs--border-card > .el-tabs__content {
  padding: 0px;
}
.el-tabs--border-card > .el-tabs__header {
  background-color: #f8f8fa;
  border-bottom: 1px solid #dfe4ed;
  margin: 0;
  /* height: 32px; */
}
.el-tabs--border-card {
    background: #fff;
    margin-top: 1px;
    border: none;
}
.el-tabs__item {
    padding: 0 20px;
    height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 31px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
}

.title_h3 {
          position: absolute;
          font-size: 24px;
          font-weight: 700;
          font-family: '楷体';
          left: 24px;
          top: 30px;
        }
.el-tree-node__expand-icon {
    cursor: pointer;
    color: black;
    font-size: 18px;
}

.el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
    margin-left: -7px;
}

.el-tree-node__content {
    height: 32px;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #3D5FFF;
    background-color: #fff;
    border-right-color: white;
    border-left-color: white;
    /* border-bottom-color: white; */
}

.el-tabs--border-card>.el-tabs__header {
    background-color: #f8f8fa;
    border-bottom: 0px solid #dfe4ed;
    margin: 0;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item {
    border: 1px solid transparent;
    margin-top: -1px;
    color: black;
}
#icon {
  z-index: 999;
  position: absolute;
  top: 300px;
  right: -13px;
  display: block;
  height: 30px;
  width: 10px;
  color: white;
  font-size: 12px;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  background: rgb(16, 167, 132);
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 0px solid #dfe4ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
