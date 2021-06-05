<template>
  <div class="workflowCanves">
    <div class="header">
      <div
        class="header_action"
        style="margin-left: 17px"
        @click="drawer = true"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="脚本模式"
          placement="top-start"
        >
          <i class="el-icon-tickets" />
        </el-tooltip>
      </div>
      <div class="header_action" style="margin-left: 27px">
        <el-tooltip
          class="item"
          effect="dark"
          content="导入已有表"
          placement="top-start"
        >
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :disabled="Lock"
          >
            <i class="el-icon-upload" />
          </el-upload>
        </el-tooltip>
      </div>
      <div @click="Looktable" class="header_action" style="margin-left: 27px">
        <el-tooltip
          class="item"
          effect="dark"
          content="查看"
          placement="top-start"
        >
          <i class="el-icon-view" />
        </el-tooltip>
      </div>
      <div
        @click="submitForm('ruleForm', 'data')"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="保存"
          placement="top-start"
        >
          <i class="el-icon-mobile" />
        </el-tooltip>
      </div>
      <div
        v-if="locking === 1"
        @click="LocKing"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="锁定表"
          placement="top-start"
        >
          <i class="el-icon-unlock" />
        </el-tooltip>
      </div>
      <div
        v-if="locking === 0"
        @click="Unlocking"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="解锁表"
          placement="top-start"
        >
          <i class="el-icon-lock" />
        </el-tooltip>
      </div>
      <div
        @click="submitForm('ruleForm', 'DATA')"
        class="header_action"
        style="margin-left: 27px"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="提交"
          placement="top-start"
        >
          <i class="el-icon-wind-power" />
        </el-tooltip>
      </div>
    </div>
    <el-drawer
      class="drawer"
      title="脚本模式"
      :visible.sync="drawer"
      size="50%"
      :with-header="true"
    >
      <div style="padding-left: 30px; padding-right: 30px">
        <div style="margin-bottom: 30px; font-size: 14px">
          <span style="margin-right: 20px">表名中包含的主题域层级:</span>
          <span>
            <el-radio v-model="radio" label="2">二级主题域</el-radio>
            <el-radio v-model="radio" label="3">三级主题域</el-radio>
            <el-radio v-model="radio" label="4">四级主题域</el-radio>
          </span>
        </div>

        <el-input
          style="margin-bottom: 20px"
          show-word-limit="true"
          type="textarea"
          rows="18"
          v-model="desc"
        ></el-input>
        <div>
          <el-button @click="synchronization" type="primary">同步</el-button>
        </div>
      </div>
    </el-drawer>
    <div class="top" v-loading="loading" :element-loading-text="loadingtext">
      <div class="title1">基本信息</div>
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
        <el-form-item label="数据层级:">
          <el-radio-group v-model="ruleForm.tabPosition">
            <el-radio-button
              @click="
                () => {
                  ruleForm.tabPosition = 'MiddleLayer'
                }
              "
              label="mid"
              >中间层</el-radio-button
            >
            <el-radio-button
              @click="
                () => {
                  ruleForm.tabPosition = 'applicationLayer'
                }
              "
              label="app"
              >应用层</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
            <el-form-item label="主题域:" prop="themes">
              <el-select
                :disabled="Lock"
                v-model="ruleForm.themes"
                style="width: 234px"
              >
                <el-option
                  v-for="item in ruleForm.theme"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
            <el-form-item label="表类型:">
              <el-select
                :disabled="isbtn"
                v-model="ruleForm.TableTypes"
                style="width: 234px"
              >
                <el-option
                  v-for="item in ruleForm.TableType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="7" /> -->
        </el-row>
        <el-form-item label="业务过程:" prop="Business">
          <el-select
            :disabled="Lock"
            v-model="ruleForm.Business"
            placeholder="请选择业务过程"
          >
            <el-option
              v-for="item in ruleForm.Busines"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称:" style="margin-bottom: 0px">
          <el-col :span="11">
            <el-form-item>
              <el-input
                :disabled="isbtn"
                v-model="ruleForm.Modelname1"
                style="width: 30%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="保障等级:" prop="Securitys">
          <el-select
            :disabled="Lock"
            v-model="ruleForm.Securitys"
            placeholder="请选择保障等级"
          >
            <el-option
              v-for="item in ruleForm.Security"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="表描述:">
          <el-input
            :disabled="Lock"
            rows="5"
            type="textarea"
            placeholder="请输入表描述"
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <div class="title1">物理信息</div>
        <el-form-item label="project :" prop="delivery">
          <el-input
            :disabled="Lock"
            v-model="ruleForm.project"
            style="width: 30%"
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="生命周期:" prop="delivery">
          <el-input
            :disabled="Lock"
            v-model="ruleForm.lifecycle"
            style="width: 30%"
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否分区表:" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <span @click="showtable" :class="Resource ? Resource : ''">
              <el-radio :disabled="Subtable" label="true"></el-radio>
            </span>
            <span
              style="margin-left: 20px"
              @click="hidetable"
              :class="Resource ? Resource : ''"
            >
              <el-radio :disabled="Subtable" label="false"></el-radio>
            </span>
          </el-radio-group>
        </el-form-item>
        <!--分表table-->
        <template v-if="show" style="margin-bottom: 30px">
          <el-table
            :data="ruleForm.tableDatas"
            style="width: 100%; overflow: scroll; text-align: center"
          >
            <el-table-column
              v-for="(itme, index) in Tabletops"
              :key="index"
              :prop="itme.prop"
              :label="itme.label"
              width="auto"
              style="text-align: center"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="120%"
              style="text-align: center"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="Donotadd"
                  @click.native.prevent="DeleteDatas(scope.row, scope.$index)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
                <el-button
                  :disabled="Donotadd"
                  @click.native.prevent="Editdatas(scope.row, scope.$index)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
            <div slot="empty">
              <p style="margin-top: 20px">
                <img src="@/icons/Nodata.jpg" />
              </p>
            </div>
          </el-table>
        </template>
        <div class="foot" v-if="show" style="margin-top: 30px">
          <div>
            <el-button
              @click="addfield('top')"
              icon="el-icon-plus"
              :disabled="Donotadd"
              >添加字段</el-button
            >
          </div>
          <div>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :disabled="Donotadd"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button :disabled="Donotadd" style="margin-left: 10px;">从需求导入</el-button>
            </el-upload>
          </div>
        </div>
        <el-dialog title="添加字段" :visible.sync="dialogVisibles" width="35%">
          <div class="table_top">
            <span style="margin-right: 20px">字段名称:</span
            ><span
              ><el-input
                style="widht: 100px"
                placeholder="请输入字段名称"
                v-model="names"
              >
              </el-input
            ></span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">字段描述:</span
            ><span>
              <el-input placeholder="请输入字段描述" v-model="comments">
              </el-input>
            </span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">业务口径:</span
            ><span>
              <el-input placeholder="请输入业务口径" v-model="BusinessCalibers">
              </el-input>
            </span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">绑定指标:</span
            ><span>
              <el-input placeholder="请输入绑定指标" v-model="BindingIndexs">
              </el-input>
            </span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">字段主键:</span
            ><span>
              <el-select v-model="isKeys" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">数据类型:</span
            ><span>
              <el-select v-model="types" placeholder="请选择">
                <el-option label="字符串" value="String"></el-option>
                <el-option label="数值" value="int"></el-option>
                <el-option label="日期类型" value="datetime"></el-option>
                <el-option label="Boolean" value="Boolean"></el-option>
                <el-option label="NaN" value="NaN"></el-option>
              </el-select>
            </span>
          </div>
          <div style="height: 10px"></div>
          <div class="table_top">
            <span style="margin-right: 20px">非空字段:</span
            ><span>
              <el-select v-model="notNulls" placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </span>
          </div>
          <!-- <el-input placeholder="请输入非空字段" v-model="TableData.notNull">
          <template slot="prepend">非空字段</template>
        </el-input> -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibles = false">取 消</el-button>
            <el-button type="primary" @click="addfields">确 定</el-button>
          </span>
        </el-dialog>
        <div style="height: 30px"></div>
        <p style="margin-bottom: 30px; color: red">
          创建物理表后不可再修改分区信息，请谨慎操作！
        </p>
        <div class="title1">字段信息</div>
        <template style="margin-bottom: 30px">
          <el-table
            :data="ruleForm.tableData"
            style="width: 100%; overflow: scroll; text-align: center"
            :fit="true"
          >
            <el-table-column
              v-for="(itme, index) in Tabletop"
              :key="index"
              :prop="itme.prop"
              :label="itme.label"
              width="auto"
              style="text-align: center"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="100%"
              style="text-align: center"
            >
              <template slot-scope="scope">
                <!-- <el-button
                  @click="handleClick(scope.row, index)"
                  type="text"
                  size="small"
                  >查看</el-button
                > -->
                <el-button
                  @click.native.prevent="DeleteData(scope.row, scope.$index)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
                <el-button
                  @click.native.prevent="Editdata(scope.row, scope.$index)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
            <div slot="empty">
              <p style="margin-top: 20px">
                <img src="@/icons/nodata.gif" />
              </p>
            </div>
          </el-table>
        </template>
        <div class="foot" style="margin-top: 30px">
          <el-button @click="Addfield('bottom')" icon="el-icon-plus"
            >添加字段</el-button
          >

          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button style="margin-left: 10px;">从需求导入</el-button>
          </el-upload>
        </div>
      </el-form>
      <el-dialog title="添加字段" :visible.sync="dialogVisible" width="35%">
        <div class="table_top">
          <span style="margin-right: 20px">字段名称:</span
          ><span
            ><el-input
              style="widht: 100px"
              placeholder="请输入字段名称"
              v-model="name"
            >
            </el-input
          ></span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">字段描述:</span
          ><span>
            <el-input placeholder="请输入字段描述" v-model="comment">
            </el-input>
          </span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">业务口径:</span
          ><span>
            <el-input placeholder="请输入业务口径" v-model="BusinessCaliber">
            </el-input>
          </span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">绑定指标:</span
          ><span>
            <el-input placeholder="请输入绑定指标" v-model="BindingIndex">
            </el-input>
          </span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">字段主键:</span
          ><span>
            <el-select v-model="isKey" placeholder="请选择">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">数据类型:</span
          ><span>
            <el-select v-model="type" placeholder="请选择">
              <el-option label="字符串" value="String"></el-option>
              <el-option label="数值" value="int"></el-option>
              <el-option label="日期类型" value="datetime"></el-option>
              <el-option label="Boolean" value="Boolean"></el-option>
              <el-option label="NaN" value="NaN"></el-option>
            </el-select>
          </span>
        </div>
        <div style="height: 10px"></div>
        <div class="table_top">
          <span style="margin-right: 20px">非空字段:</span
          ><span>
            <el-select v-model="notNull" placeholder="请选择">
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </span>
        </div>
        <!-- <el-input placeholder="请输入非空字段" v-model="TableData.notNull">
          <template slot="prepend">非空字段</template>
        </el-input> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Addfields">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <el-dialog
        title="字段信息查看"
        :visible.sync="DialogVisible"
        @close="closeDialog"
        width="70%"
      >
        <el-table :data="Table" style="width: 100%">
          <el-table-column
            v-for="(itme, index) in Tabletop"
            :key="index"
            :prop="itme.prop"
            :label="itme.label"
            width="auto"
          >
          </el-table-column>
        </el-table>
      </el-dialog> -->
    </div>
  </div>
</template>
<script id="code">
// import go from 'gojs'
import * as modeling from '@/api/datax-job-modeling'
import { pinyin } from 'pinyin-pro'
// import * as workFlowApi from '@/api/datax-job-info'
// import * as logApi from '@/api/datax-job-log'
// import { fromTextArea } from 'codemirror'
export default {
  name: 'Flow',
  props: ['tabledata', 'tableType'],
  data() {
    return {
      Subtable: false,
      Donotadd: false,
      show: false,
      loadingtext: '',
      loading: false,
      isbtn: true,
      Lock: false,
      DialogVisible: false,
      dialogVisible: false,
      dialogVisibles: false,
      newlabel: '',
      newprop: '',
      Tabletop: [
        { label: '字段名', prop: 'name' },
        { label: '字段描述', prop: 'comment' },
        { label: '业务口径', prop: 'BusinessCaliber' },
        { label: '数据类型', prop: 'type' },
        { label: '主键', prop: 'isKey' },
        { label: '绑定指标', prop: 'BindingIndex' },
        { label: '非空', prop: 'notNull' },
      ],
      Tabletops: [
        { label: '字段名', prop: 'name' },
        { label: '字段描述', prop: 'comment' },
        { label: '业务口径', prop: 'BusinessCaliber' },
        { label: '数据类型', prop: 'type' },
        { label: '主键', prop: 'isKey' },
        { label: '绑定指标', prop: 'BindingIndex' },
        { label: '非空', prop: 'notNull' },
      ],
      locking: 1,
      desc: '',
      radio: '',
      Table: [],
      //table
      name: '',
      comment: '',
      BusinessCaliber: '',
      type: '',
      isKey: '',
      BindingIndex: '',
      notNull: '',
      //table
      //分表table
      names: '',
      comments: '',
      BusinessCalibers: '',
      types: '',
      isKeys: '',
      BindingIndexs: '',
      notNulls: '',
      //分表table
      ruleForm: {
        tableData: [
          // {
          //   Field: 'Field',
          //   FieldDesc: 'FieldDesc',
          //   BusinessCaliber: '888',
          //   datatype: 'string',
          //   PrimaryKey: 's',
          //   BindingIndex: '666',
          //   NotEmpty: 'true',
          // },
          // {
          //   Field: 'Field',
          //   FieldDesc: 'FieldDesc',
          //   BusinessCaliber: '888',
          //   datatype: 'string',
          //   PrimaryKey: 's',
          //   BindingIndex: '666',
          //   NotEmpty: 'false',
          // },
          // {
          //   Field: 'Field',
          //   FieldDesc: 'FieldDesc',
          //   BusinessCaliber: '888',
          //   datatype: 'string',
          //   PrimaryKey: 's',
          //   BindingIndex: '666',
          //   NotEmpty: 'true',
          // },
        ],
        tableDatas: [],
        Modelname1: '',
        Modelname2: '',
        Modelname3: '',
        theme: [
          { id: 1, value: '二级主题域', name: '二级主题域' },
          { id: 2, value: '三级主题域', name: '三级主题域' },
          { id: 3, value: '四级主题域', name: '四级主题域' },
        ],
        TableType: [
          { id: 1, value: 'hive', name: 'hive' },
          { id: 2, value: 'impala', name: 'impala' },
        ],
        Busines: [
          { id: 1, value: '业务过程1', name: '业务过程1' },
          { id: 2, value: '业务过程2', name: '业务过程2' },
        ],
        Security: [
          { id: 1, value: 'A', name: 'A' },
          { id: 2, value: 'B', name: 'B' },
          { id: 3, value: 'C', name: 'C' },
        ],
        ModelName: [
          { id: 1, value: '模型名称1', name: '模型名称1' },
          { id: 2, value: '模型名称2', name: '模型名称2' },
          { id: 3, value: '模型名称3', name: '模型名称3' },
        ],
        themes: '',
        TableTypes: '',
        Business: '',
        Securitys: '',
        ModelNames: '',
        name: '',
        lifecycle: '',
        project: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        tabPosition: '',
      },
      rules: {
        Securitys: [
          { required: true, message: '请选择保障等级', trigger: 'change' },
        ],
        // TableTypes: [
        //   { required: true, message: '请选择表类型', trigger: 'change' },
        // ],
        themes: [
          { required: true, message: '请选择主图域', trigger: 'change' },
        ],
        Business: [
          { required: true, message: '请选择业务过程', trigger: 'change' },
        ],
      },
      drawer: false,
      /** 工作流Id */
      myId: '',
      taskList: '', // 当前任务列表
      form: {
        // taskName: '子任务' // 选中任务名称
      },
      currentType: '', // 当前选中节点的任务类型
      dialogFormVisible: false,
      dialogDrawer: false, // 抽屉
      project_id: '', // 当前项目Id
      dataJob: {}, // 当前任务数据
      showCronBox: false, // cron表达式对话框
      drawerForm: {},
      dialogLogVisible: false,
      dialogDetails: false,
      fileList: [],
      btn: '',
      index: '',
      Resource: '',
    }
  },
  computed: {},
  watch: {
    'ruleForm.resource': {
      handler: function () {
        if (this.ruleForm.resource === 'true') {
          this.show = true
        } else {
          this.show = false
          this.Donotadd = false
        }
      },
    },
    Resource(val) {
      if (val === 'true') {
        this.Donotadd = true
        this.Subtable = true
      }
    },
  },
  created() {
    this.ruleForm.Modelname1 = this.$store.state.taskAdmin.tabledata.name || ''
    this.ruleForm.tabPosition =
      this.$store.state.taskAdmin.tabledata.dataLayer || ''
    this.ruleForm.themes =
      this.$store.state.taskAdmin.tabledata.subjectField || ''
    this.ruleForm.TableTypes =
      this.tableType.toLowerCase() ||
      this.$store.state.taskAdmin.tabledata.tableType ||
      ''
    this.ruleForm.Business =
      this.$store.state.taskAdmin.tabledata.busProcess || ''
    this.ruleForm.Securitys =
      this.$store.state.taskAdmin.tabledata.securityLevel || ''
    this.ruleForm.desc = this.$store.state.taskAdmin.tabledata.description || ''
    this.ruleForm.project =
      this.$store.state.taskAdmin.tabledata.projectDays || ''
    this.ruleForm.lifecycle =
      this.$store.state.taskAdmin.tabledata.lifeCycle || ''
    this.ruleForm.resource =
      this.$store.state.taskAdmin.tabledata.pritition + '' || ''
    this.ruleForm.tableData =
      JSON.parse(this.$store.state.taskAdmin.tabledata.modelJson) || []
    this.Resource = this.$store.state.taskAdmin.tabledata.pritition + ''
    this.ruleForm.tableDatas = this.$store.state.taskAdmin.tabledata
      .prititionJson
      ? JSON.parse(this.$store.state.taskAdmin.tabledata.prititionJson)
      : []
    console.log('tableDatas===>', this.ruleForm.tableDatas)
  },
  mounted() {},
  methods: {
    // handlePreview(file) {
    //   // console.log('file---->', file)
    // },
    // handleRemove(file) {
    //   // console.log('file----->', file)
    // },
    // update(val) {
    //   // console.log('val----', val.file)
    // },
    // handleExceed(val) {
    //   console.log(val)
    // },
    submitForm(formName, data) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (data === 'data') {
            this.loading = true
            this.loadingtext = '保存中'
            let params = {
              name: this.$store.state.taskAdmin.tabledata.name,
              id: this.$store.state.taskAdmin.tabledata.id,
              modelJson: JSON.stringify(this.ruleForm.tableData),
              dataLayer: this.ruleForm.tabPosition,
              subjectField: this.ruleForm.themes,
              tableType: this.ruleForm.TableTypes,
              busProcess: this.ruleForm.Business,
              modelName: this.ruleForm.Modelname1,
              securityLevel: this.ruleForm.Securitys,
              description: this.ruleForm.desc,
              projectDays: this.ruleForm.project,
              lifeCycle: this.ruleForm.lifecycle,
              pritition: this.ruleForm.resource,
              databaseName:
                this.ruleForm.tabPosition +
                '_' +
                pinyin(this.ruleForm.themes).substr(0, 1) +
                '_' +
                pinyin(this.ruleForm.Business).substr(0, 1),
              prititionJson: JSON.stringify(this.ruleForm.tableDatas),
            }
            console.log('保存数据', params)
            modeling
              .Update(params)
              .then((res) => {
                if (res.code === 200) {
                  this.Resource = params.pritition + ''
                  let projectId = this.$store.state.taskAdmin.tabledata
                    .projectId
                  this.$emit('getTree', projectId)
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                  })
                  this.loading = false
                }
                console.log('保存结果', res.msg)
              })
              .catch((err) => {
                this.loading = false
                console.log('ERR------>', err)
              })
          }
          if (data === 'DATA') {
            this.loading = true
            this.loadingtext = '执行中'
            let params = {
              name: this.$store.state.taskAdmin.tabledata.name,
              id: this.$store.state.taskAdmin.tabledata.id,
              projectId: this.$store.state.taskAdmin.tabledata.projectId,
              parentId: this.$store.state.taskAdmin.tabledata.parentId,
              modelJson: JSON.stringify(this.ruleForm.tableData),
              dataLayer: this.ruleForm.tabPosition,
              subjectField: this.ruleForm.themes,
              tableType: this.ruleForm.TableTypes,
              busProcess: this.ruleForm.Business,
              modelName:
                this.ruleForm.Modelname1 +
                this.ruleForm.Modelname2 +
                this.ruleForm.Modelname3 +
                this.ruleForm.ModelNames,
              securityLevel: this.ruleForm.Securitys,
              description: this.ruleForm.desc,
              projectDays: this.ruleForm.project,
              lifeCycle: this.ruleForm.lifecycle,
              pritition: this.ruleForm.resource,
              databaseName:
                this.ruleForm.tabPosition +
                '_' +
                pinyin(this.ruleForm.themes).substr(0, 1) +
                '_' +
                pinyin(this.ruleForm.Business).substr(0, 1),
              prititionJson: JSON.stringify(this.ruleForm.tableDatas),
            }
            modeling
              .RunTask(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: res.msg,
                    type: 'success',
                  })
                }
                this.loading = false
                console.log('执行结果', res.msg)
              })
              .catch((err) => {
                this.loading = false
                console.log('执行错误', err)
              })

            console.log('执行数据', params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    closeDialog() {
      this.Table = []
      console.log('111')
    },
    showtable() {
      this.show = true
      console.log('show')
    },
    hidetable() {
      this.show = false
      console.log('hide')
    },
    //脚本模式同步
    synchronization() {
      console.log('label', this.radio, this.desc)
    },
    //运行表
    Submit() {
      this.$message({
        message: '执行成功',
        type: 'success',
      })
      console.log('www', this.ruleForm)
    },
    LocKing() {
      this.locking = 0
      this.Lock = true
      this.Subtable = true
      this.$message({
        message: '表已锁定',
        type: 'success',
      })
    },
    Unlocking() {
      this.locking = 1
      this.Lock = false
      if (this.ruleForm.resource === 'true') {
        this.Subtable = true
      } else {
        this.Subtable = false
      }
      // this.Subtable = false
      this.$message({
        message: '表已解锁',
        type: 'success',
      })
    },
    Looktable() {
      console.log('查看表')
    },
    //查看表
    // handleClick(data) {
    //   this.DialogVisible = true
    //   this.Table.push(data)
    //   console.log('查看表', data)
    // },
    DeleteData(data, index) {
      this.ruleForm.tableData.splice(index, 1)
    },
    DeleteDatas(data, index) {
      this.ruleForm.tableDatas.splice(index, 1)
    },
    Editdatas(data, index) {
      console.log('分表table', data, index)
      this.names = data.name
      this.comments = data.comment
      this.BusinessCalibers = data.BusinessCaliber
      this.types = data.type
      this.isKeys = data.isKey
      this.BindingIndexs = data.BindingIndex
      this.notNulls = data.notNull
      this.dialogVisibles = true
      this.btn = 'edit'
      this.index = index
      console.log(this.notNull)
      console.log('编辑数组', this.ruleForm.tableData)
      console.log('编辑表', data, index)
    },
    //编辑表
    Editdata(data, index) {
      this.name = data.name
      this.comment = data.comment
      this.BusinessCaliber = data.BusinessCaliber
      this.type = data.type
      this.isKey = data.isKey
      this.BindingIndex = data.BindingIndex
      this.notNull = data.notNull
      this.dialogVisible = true
      this.btn = 'edit'
      this.index = index
      console.log(this.notNull)
      console.log('编辑数组', this.ruleForm.tableData)
      console.log('编辑表', data, index)
    },
    //是否分表编辑表
    // Editdatas(data, index) {
    //   this.names = data.names
    //   this.comments = data.comments
    //   this.BusinessCalibers = data.BusinessCalibers
    //   this.types = data.types
    //   this.isKeys = data.isKeys
    //   this.BindingIndexs = data.BindingIndexs
    //   this.notNulls = data.notNulls
    //   this.dialogVisible = true
    //   this.index = index
    //   console.log(this.notNull)
    //   console.log('编辑数组', this.ruleForm.tableData)
    //   console.log('编辑表', data, index)
    // },
    //是否分表表格
    addfield() {
      this.dialogVisibles = true
      this.names = ''
      this.comments = ''
      this.BusinessCalibers = ''
      this.types = ''
      this.isKeys = ''
      this.BindingIndexs = ''
      this.notNulls = ''
    },
    //是否分表表格
    addfields() {
      console.log('分表table', this.index)
      if (this.btn === '') {
        let data = {
          name: this.names,
          comment: this.comments,
          BusinessCaliber: this.BusinessCalibers,
          type: this.types,
          isKey: this.isKeys,
          BindingIndex: this.BindingIndexs,
          notNull: this.notNulls,
        }
        this.ruleForm.tableDatas.push(data)
        this.dialogVisibles = false
        this.names = ''
        this.comments = ''
        this.BusinessCalibers = ''
        this.types = ''
        this.isKeys = ''
        this.BindingIndexs = ''
        this.notNulls = ''
      }
      if (this.btn === 'edit') {
        let data = {
          name: this.names,
          comment: this.comments,
          BusinessCaliber: this.BusinessCalibers,
          type: this.types,
          isKey: this.isKeys,
          BindingIndex: this.BindingIndexs,
          notNull: this.notNulls,
        }
        console.log('edit', this.index, data)
        this.ruleForm.tableDatas.splice(this.index, 1, data)
        this.dialogVisibles = false
        this.btn = ''
      }
    },
    //添加字段
    Addfield() {
      this.dialogVisible = true
      this.name = ''
      this.comment = ''
      this.BusinessCaliber = ''
      this.type = ''
      this.isKey = ''
      this.BindingIndex = ''
      this.notNull = ''
    },
    //添加字段
    Addfields() {
      if (this.btn === '') {
        let data = {
          name: this.name,
          comment: this.comment,
          BusinessCaliber: this.BusinessCaliber,
          type: this.type,
          isKey: this.isKey,
          BindingIndex: this.BindingIndex,
          notNull: this.notNull,
        }
        console.log('添加字段数据', data)
        this.ruleForm.tableData.push(data)
        this.dialogVisible = false
        this.name = ''
        this.comment = ''
        this.BusinessCaliber = ''
        this.type = ''
        this.isKey = ''
        this.BindingIndex = ''
        this.notNull = ''
      }
      if (this.btn === 'edit') {
        let data = {
          name: this.name,
          comment: this.comment,
          BusinessCaliber: this.BusinessCaliber,
          type: this.type,
          isKey: this.isKey,
          BindingIndex: this.BindingIndex,
          notNull: this.notNull,
        }
        console.log('edit', this.index, data)
        this.ruleForm.tableData.splice(this.index, 1, data)
        this.dialogVisible = false
        this.btn = ''
      }
    },

    //上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //上传文件
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
.true {
  pointer-events: none;
}
.el-table th > .cell {
  text-align: center;
}
.el-table .cell {
  text-align: center;
}
.table_top {
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawer {
  overflow: scroll;
}
.foot {
  display: flex;
  align-items: flex-end;
  justify-content: left;
}
.title1 {
  height: 40px;
  width: 100%;
  padding-left: 10px;
  margin-bottom: 20px;
  line-height: 40px;
  background: #f8f8fa;
  color: #000;

  /* background: #00ffff; */
}
.top {
  width: 100%;
  height: auto;
  padding-top: 15px;
  padding-left: 15px;
  /* border: 1px solid #ccc; */
}
.tips {
  display: block;
  height: 40px;
  width: 100%;
  padding-left: 20px;

  font-size: 14px;
  line-height: 40px;
  background: #f8f8ff;
  border: 1px solid #ccc;
}
.header {
  overflow-y: hidden;
  padding: 8px 0;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  height: 37px;
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

.header {
  height: 100%;
}
</style>
