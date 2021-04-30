<!--
 * @Date: 2021-02-05 17:23:18
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-03-04 15:59:54
 * @FilePath: \datax-web-ui\src\views\datax\jobInfo\components\editDialog\jobDetailProEdit.vue
 * @Description: edit
-->

<template>
  <el-dialog :title="title" :visible="show" @close="$emit('close')">
    <el-row v-if="$store.state.taskAdmin.jobInfoType !== 'SHELL'">
      <el-col>
        <h1 class="tab-title">{{ tabTitle(1) }}</h1>
      </el-col>
      <el-col>
        <el-form ref="dataForm">
          <el-row :gutter="20">
            <el-card shadow="never" :bordered="false">
              <el-col :span="12">
                <el-form-item label="任务名称" prop="name">
                  <el-input
                    v-model="currentTask.name"
                    size="medium"
                    disabled
                    placeholder="请输入任务名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="描述" prop="jobDesc">
                  <el-input v-model="currentTask.jobDesc" placeholder="描述" />
                </el-form-item>
              </el-col>
            </el-card>
          </el-row>
        </el-form>
      </el-col>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(2) }}</h1>
      </el-col>
      <el-col>
        <quality-reader v-if="$store.state.taskAdmin.jobInfoType === 'DQCJOB'" ref="qualityReader" />
        <reader v-else ref="reader" />
      </el-col>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(3) }}</h1>
      </el-col>
      <el-col>
        <el-form
          :model="taskParam"
          label-position="top"
          label-width="120px"
          class="form-item-class"
          style="padding: 20px;"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="数据源">
                <el-select
                  v-if="currentTask.jobType !== 'SHELL'"
                  v-model="taskParam.writerDatasourceId"
                  filterable
                  @change="wDsChange"
                >
                  <el-option
                    v-for="(item, index) in $store.state.taskAdmin.dataSourceList"
                    :key="index"
                    :label="item.datasourceName"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-else
                  v-model="currentTask.datasourceId"
                  filterable
                  @change="wDsChange"
                >
                  <el-option
                    v-for="(item, index) in $store.state.taskAdmin.dataSourceList"
                    :key="index"
                    :label="item.datasourceName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- $store.state.taskAdmin.jobInfoType === 'DQCJOB' &&  -->
              <el-form-item
                v-if="hasSchema"
                label="Schema"
              >
                <el-select
                  v-model="taskParam.writerSchema"
                  allow-create
                  default-first-option
                  filterable
                  @change="schemaChange"
                >
                  <el-option
                    v-for="(item, index) in schemaList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据库表名" prop="tableName">
                <el-select
                  v-model="writerTablesText"
                  @change="wTbChange"
                >
                  <el-option
                    v-for="(item, index) in wTbList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="dataSource === 'hive'" label="路径" prop="path">
                <el-input
                  v-model="writerPath"
                  placeholder="为与hive表关联，请填写hive表在hdfs上的存储路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="dataSource === 'hive'" label="默认FS" prop="defaultFS">
                <el-input
                  v-model="writerDefaultFS"
                  placeholder="Hadoop hdfs文件系统namenode节点地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="dataSource === 'hive'" label="文件名" prop="fileName">
                <el-input
                  v-model="writerFileName"
                  placeholder="HdfsWriter写入时的文件名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="dataSource === 'hive'" label="文件类型" prop="fileType">
                <el-select
                  v-model="writerFileType"
                  placeholder="文件的类型"
                >
                  <el-option label="text" value="text" />
                  <el-option label="orc" value="orc" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="dataSource === 'hive'" label="模式" prop="writeMode">
                <el-select
                  v-model="writeMode"
                  placeholder="目标模式"
                >
                  <el-option label="append 写入前不做任何处理" value="append" />
                  <el-option label="nonConflict 目录下有fileName前缀的文件，直接报错" value="nonConflict" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="dataSource === 'hive'" label="fieldDelimiter" prop="fieldDelimiter">
                <el-input
                  v-model="writeFieldDelimiter"
                  placeholder="与创建表的分隔符一致"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="字段">
                <el-checkbox
                  v-model="writerColumnsParam.checkAll"
                  :indeterminate="writerColumnsParam.isIndeterminate"
                  @change="wHandleCheckAllChange"
                >全选</el-checkbox>
                <div style="margin: 15px 0;" />
                <el-checkbox-group
                  v-model="taskParam.writerColumns"
                  @change="wHandleCheckedChange"
                >
                  <el-checkbox
                    v-for="(item, index) in fromColumnList"
                    :key="index"
                    :label="item"
                  >{{ item }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="dataSource !== 'hive'" label="前置SQL">
                <el-input
                  v-model="preSQL"
                  placeholder="前置sql在insert之前执行"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="dataSource !== 'hive'" label="后置SQL">
                <el-input
                  v-model="postSQL"
                  placeholder="多个用;分隔"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分区配置">
                <el-radio-group v-model="writerColumnsParam.partition" @change="radioSelect">
                  <el-radio :label="0">分区</el-radio>
                  <el-radio :label="1">非分区</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分区字段">
                <el-select v-model="writerColumnsParam.partitionText" placeholder="选择分区字段" @change="columnSelect">
                  <el-option
                    v-for="(item, index) in fromColumnList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col>
        <h1 class="tab-title">{{ tabTitle(4) }}</h1>
      </el-col>

      <el-col style="padding: 20px;">
        <el-table
          :data="mappingTable"
          :header-cell-style="{
            background: '#f8f8fa',
            color: '#666666',
            'font-family': 'PingFangHK-Medium, PingFangHK'
          }"
          style="width: 100%"
        >
          <el-table-column label="源表">
            <template slot-scope="scope">
              <el-select
                v-model="tableForm.lcolumns[scope.row.index]"
                placeholder="请选择"
                filterable
                value-key="index"
                @change="lHandleSelect(scope.row.index, $event)"
              >
                <el-option
                  v-for="(tmp, index) in fromColumnsList"
                  :key="index"
                  :label="tmp"
                  :value="tmp"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="目标表">
            <template slot-scope="scope">
              <el-select
                v-model="tableForm.rcolumns[scope.row.index]"
                placeholder="请选择"
                filterable
                value-key="index"
                @change="rHandleSelect(scope.row.index, $event)"
              >
                <el-option
                  v-for="(tmp, index) in toColumnsList"
                  :key="index"
                  :label="tmp"
                  :value="tmp"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                size="small"
                value-key="index"
                @click="bHandleClick(scope.row.index, $event)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- <el-row v-else>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(1) }}</h1>
      </el-col>
      <el-col>
        <h2>第一行</h2>
      </el-col>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(2) }}</h1>
      </el-col>
      <el-col>
        <h2>第二行</h2>
      </el-col>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(3) }}</h1>
      </el-col>
      <el-col>
        <h2>第三行</h2>
      </el-col>
      <el-col>
        <h1 class="tab-title">{{ tabTitle(4) }}</h1>
      </el-col>
      <el-col>
        <h2>第四行</h2>
      </el-col>
    </el-row > -->
    <div v-else class="temp">
      <el-form ref="shellForm" :rules="rules" :model="temp" label-position="left" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="temp.name" disabled size="medium" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-dialog
              title="提示"
              :visible.sync="showCronBox"
              width="60%"
              append-to-body
            >
              <cron v-model="temp.jobCron" />
              <span slot="footer" class="dialog-footer">
                <el-button @click="showCronBox = false;">关闭</el-button>
                <el-button type="primary" @click="showCronBox = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-form-item label="Cron" prop="jobCron">
              <el-input v-model="temp.jobCron" auto-complete="off" placeholder="请输入Cron表达式">
                <el-button v-if="!showCronBox" slot="append" icon="el-icon-turn-off" title="打开图形配置" @click="showCronBox = true" />
                <el-button v-else slot="append" icon="el-icon-open" title="关闭图形配置" @click="showCronBox = false" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务描述" prop="jobDesc">
              <el-input v-model="temp.jobDesc" size="medium" placeholder="请输入任务描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警邮件">
              <el-input v-model="temp.alarmEmail" placeholder="请输入报警邮件，多个用逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="阻塞处理" prop="executorBlockStrategy">
              <el-select v-model="temp.executorBlockStrategy" placeholder="请选择阻塞处理策略">
                <el-option v-for="item in blockStrategies" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行器" prop="jobGroup">
              <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
                <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
          <el-form-item label="失败重试次数">
            <el-input-number v-model="temp.executorFailRetryCount" size="small" :min="0" :max="20" />
          </el-form-item>
        </el-col>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="超时时间(分钟)">
              <el-input-number v-model="temp.executorTimeout" size="small" :min="0" :max="120" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由策略" prop="executorRouteStrategy">
              <el-select v-model="temp.executorRouteStrategy" placeholder="请选择路由策略">
                <el-option v-for="item in routeStrategies" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子任务">
              <el-select v-model="temp.childJobId" multiple placeholder="子任务" value-key="id" @change="updateChildJob">
                <el-option v-for="item in jobIdList" :key="item.id" :label="item.jobDesc ? item.jobDesc : item.jobType + '任务' + item.id" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row v-if="temp.glueType==='BEAN'" :gutter="20">
          <el-col :span="12">
            <el-form-item label="辅助参数" prop="incrementType">
              <el-select v-model="temp.incrementType" placeholder="请选择参数类型" value="">
                <el-option v-for="item in incrementTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 1" :gutter="20">
          <el-col :span="12">
            <el-form-item label="增量主键开始ID" prop="incStartId">
              <el-input v-model="temp.incStartId" placeholder="首次增量使用" style="width: 56%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ID增量参数" prop="replaceParam">
              <el-input v-model="temp.replaceParam" placeholder="-DstartId='%s' -DendId='%s'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="reader数据源" prop="datasourceId">
              <el-select v-model="temp.datasourceId" placeholder="reader数据源" class="filter-item">
                <el-option v-for="item in dataSourceList" :key="item.id" :label="item.datasourceName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="reader表" prop="readerTable">
              <el-input v-model="temp.readerTable" placeholder="读表的表名" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="主键" label-width="40px" prop="primaryKey">
              <el-input v-model="temp.primaryKey" placeholder="请填写主键字段名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 2" :gutter="20">
          <el-col :span="12">
            <el-form-item label="增量开始时间" prop="incStartTime">
              <el-date-picker
                v-model="temp.incStartTime"
                type="datetime"
                placeholder="首次增量使用"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 57%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增量时间字段" prop="replaceParam">
              <el-input v-model="temp.replaceParam" placeholder="-DlastTime='%s' -DcurrentTime='%s'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增量时间格式" prop="replaceParamType">
              <el-select v-model="temp.replaceParamType" placeholder="增量时间格式" @change="incStartTimeFormat">
                <el-option v-for="item in replaceFormatTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 3" :gutter="20">
          <el-col :span="12">
            <el-form-item label="分区字段" prop="partitionField">
              <el-input v-model="partitionField" placeholder="请输入分区字段" style="width: 56%" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="分区时间">
              <el-select v-model="timeFormatType" placeholder="分区时间格式">
                <el-option v-for="item in timeFormatTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input-number v-model="timeOffset" size="samll" :min="-20" :max="0" style="width: 65%" />
          </el-col>
        </el-row>
        <!-- <el-row v-if="temp.glueType==='BEAN'" :gutter="20">
          <el-col :span="24">
            <el-form-item label="JVM启动参数">
              <el-input v-model="temp.jvmParam" placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError" />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">
        取消
      </el-button>
      <el-button
        v-if="$store.state.taskAdmin.jobInfoType !== 'SHELL'"
        type="primary"
        @click="handleSubmit"
      >
        确定
      </el-button>
      <el-button
        v-else
        type="primary"
        @click="handleShell"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import reader from '@/views/datax/json-build/reader'
import qualityReader from '@/views/datax/jsonQuality/reader'
import writer from '@/views/datax/json-build/writer'
import qualityWriter from '@/views/datax/jsonQuality/reader'
import { getTables as dsQueryGetTables, getColumns as dsQueryGetColumns, getTableSchema as dsQueryGetSchema } from '@/api/metadata-query'
import { updateJob, updateTask } from '@/api/datax-job-info'
import { isJSON } from '@/utils/validate'
import * as job from '@/api/datax-job-info'
import Cron from '@/components/Cron'

export default {
  name: 'JobDetailProEdit',
  components: {
    reader,
    qualityReader,
    writer,
    qualityWriter,
    Cron
  },
  props: {
    title: { type: String, default: '' },
    show: { type: Boolean, default: false },
    jobId: { type: Number, default: 0 }
  },
  data() {
    return {
      currentTask: {},
      taskParam: {},
      dataSource: '',
      /** writer table list */
      wTbList: [],
      // shell任务的数据
      showCronBox: false,
      rules: {
        jobGroup: [{ required: true, message: '执行器不能为空', trigger: 'change' }],
        executorRouteStrategy: [{ required: true, message: '路由策略不能为空', trigger: 'change' }],
        executorBlockStrategy: [{ required: true, message: '阻塞处理不能为空', trigger: 'change' }],
        glueType: [{ required: true, message: 'jobType is required', trigger: 'change' }],
        projectId: [{ required: true, message: 'projectId is required', trigger: 'change' }],
        // name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        jobDesc: [{ required: true, message: '任务描述不能为空', trigger: 'blur' }],
        jobProject: [{ required: true, message: 'jobProject is required', trigger: 'blur' }],
        jobCron: [{ required: true, message: 'cron表达式不能为空', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        name: '',
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: [],
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: '',
        glueType: '',
        glueSource: '',
        jobJson: '',
        executorParam: '',
        replaceParam: '',
        replaceParamType: 'Timestamp',
        jvmParam: '',
        incStartTime: '',
        partitionInfo: '',
        incrementType: 0,
        incStartId: '',
        primaryKey: '',
        projectId: '',
        datasourceId: '',
        readerTable: ''
      },
      executorList: '',
      jobIdList: '',
      jobProjectList: '',
      dataSourceList: '',
      blockStrategies: [
        { value: 'SERIAL_EXECUTION', label: '单机串行' },
        { value: 'DISCARD_LATER', label: '丢弃后续调度' },
        { value: 'COVER_EARLY', label: '覆盖之前调度' }
      ],
      routeStrategies: [
        { value: 'FIRST', label: '第一个' },
        { value: 'LAST', label: '最后一个' },
        { value: 'ROUND', label: '轮询' },
        { value: 'RANDOM', label: '随机' },
        { value: 'CONSISTENT_HASH', label: '一致性HASH' },
        { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
        { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
        { value: 'FAILOVER', label: '故障转移' },
        { value: 'BUSYOVER', label: '忙碌转移' }
      ],
      glueTypes: [
        { value: 'GLUE_SHELL', label: 'Shell任务' }
      ],
      incrementTypes: [
        { value: 0, label: '无' },
        { value: 1, label: '主键自增' },
        { value: 2, label: '时间自增' },
        { value: 3, label: 'HIVE分区' }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      glueSource: '',
      timeOffset: 0,
      timeFormatType: 'yyyy-MM-dd',
      partitionField: '',
      timeFormatTypes: [
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'yyyyMMdd', label: 'yyyyMMdd' },
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' }
      ],
      replaceFormatTypes: [
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'HH:mm:ss', label: 'HH:mm:ss' },
        { value: 'yyyy/MM/dd HH:mm:ss', label: 'yyyy/MM/dd HH:mm:ss' },
        { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss' },
        { value: 'Timestamp', label: '时间戳' }
      ],
      statusList: [
        { value: 500, label: '失败' },
        { value: 502, label: '失败(超时)' },
        { value: 200, label: '成功' },
        { value: 0, label: '无' }
      ],
      /** 源列 */
      fromColumnList: [],
      writerColumnsParam: {
        checkAll: false,
        isIndeterminate: true,
        ifCreateTable: false,
        partition: 0, // 分区配置
        partitionText: '' // 分区字段
      },
      /** schema */
      schemaList: [],
      /** mapping */
      mappingTable: [],
      tableForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      },
      /** 源表列 */
      fromColumnsList: [],
      /** 目标表列 */
      toColumnsList: []
    }
  },
  computed: {
    tabTitle() {
      return tabVal => {
        switch (tabVal) {
          case 1:
            return '基础信息'
          case 2:
            return '源表配置'
          case 3:
            return '目标表配置'
          case 4:
            return '字段映射'
          default:
            return ''
        }
      }
    },
    hasSchema() {
      return this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
    },
    writerTablesText: {
      set(val) {
        const t = []
        if (val !== null && val !== undefined) {
          t.push(val)
        }
        this.$set(this.taskParam, 'writerTables', t)
      },
      get() {
        if (this.taskParam.hasOwnProperty('writerTables')) {
          return this.taskParam.writerTables.length > 0 ? this.taskParam.writerTables[0] : ''
        }
        return ''
      }
    },
    readerTablesText() {
      if (this.taskParam.hasOwnProperty('readerTables')) {
        return this.taskParam.readerTables.length > 0 ? this.taskParam.readerTables[0] : ''
      }
      return ''
    },
    preSQL: {
      set(val) {
        this.$set(this.taskParam.rdbmsWriter, 'preSql', val)
      },
      get() {
        return this.taskParam.rdbmsWriter?.preSql
      }
    },
    postSQL: {
      set(val) {
        this.$set(this.taskParam.rdbmsWriter, 'postSql', val)
      },
      get() {
        return this.taskParam.rdbmsWriter?.postSql
      }
    },
    writerPath: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writerPath', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writerPath
      }
    },
    writerDefaultFS: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writerDefaultFS', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writerDefaultFS
      }
    },
    writerFileName: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writerFileName', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writerFileName
      }
    },
    writerFileType: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writerFileType', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writerFileType
      }
    },
    writeMode: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writeMode', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writeMode
      }
    },
    writeFieldDelimiter: {
      set(val) {
        this.$set(this.taskParam.hiveWriter, 'writeFieldDelimiter', val)
      },
      get() {
        return this.taskParam.hiveWriter?.writeFieldDelimiter
      }
    },
    readerColumns() {
      return this.$store.state.taskAdmin.selectReaderColumn
    },
    writerColumns() {
      return this.taskParam.writerColumns
    }
  },
  watch: {
    show(val) {
      if (val) {
        console.log(this.$store.state.taskAdmin.taskList)
        this.currentTask = this.$store.state.taskAdmin.currentTask
        this.temp = this.currentTask
        console.log(this.currentTask, 'currentTask', !Array.isArray(this.currentTask.childJobId))
        if (Array.isArray(this.currentTask.childJobId)) {
          this.temp.childJobId = []
        } else {
          if (this.temp.childJobId.length > 0) {
            this.temp.childJobId = this.currentTask.childJobId.split(',').map(Number)
          }
        }
        console.log(this.temp.childJobId, 'this.temp.childJobId')
        if (this.currentTask.jobType !== 'SHELL') {
          if (this.currentTask.hasOwnProperty('jobParam')) {
            this.taskParam = JSON.parse(this.currentTask.jobParam)
            this.$store.commit('SET_READER_DATASOURCE_ID', this.taskParam.readerDatasourceId)
            this.$store.commit('SET_READER_TABLENAME', this.readerTablesText)
            this.$store.commit('SET_READER_SCHEMA', this.taskParam.readerSchema)
          }
          this.dataSource = this.$store.state.taskAdmin.dataSourceList.find(ele => {
            ele.id === this.taskParam.writerDatasourceId
          })?.datasource
          if (this.hasSchema) {
            this.getSchema()
          }
          this.getTables()
          this.getColumns()
        }
      }
    },
    readerColumns(val) {
      console.log('val', val)
      this.tableForm.lcolumns = JSON.parse(JSON.stringify(val))
      this.fromColumnsList = val
      this.mappingTable = []
      val.forEach((row, index) => {
        const obj = {
          column: row,
          index
        }
        this.mappingTable.push(obj)
      })
    },
    writerColumns(val) {
      this.tableForm.rcolumns = JSON.parse(JSON.stringify(val))
      this.toColumnsList = val
    }
  },
  created() {
    this.getExecutor()
    this.getJobIdList()
    this.temp = this.$store.state.taskAdmin.currentTask
  },
  methods: {
    updateChildJob() {
      // let arrchildSet = ''
      // console.log(this.temp.childJobId, this.temp.childJobId.length)
      // if (this.temp.childJobId.length >= 2) {
      //   for (let i = 0; i < this.temp.childJobId.length; i++) {
      //     if (!arrchildSet) {
      //       arrchildSet = this.temp.childJobId[i]
      //     } else {
      //       arrchildSet = arrchildSet + ',' + this.temp.childJobId[i]
      //     }
      //   }
      // } else if (this.temp.childJobId.length === 1) {
      //   arrchildSet = this.temp.childJobId[0] + ''
      // } else {
      //   arrchildSet = ''
      // }
      // console.log(arrchildSet, 'arrchildSet')
      // this.temp.childJobId = arrchildSet
    },
    // 获取子任务列表
    getJobIdList() {
      job.getJobIdList().then(response => {
        const { content } = response
        this.jobIdList = content
        console.log(content, '子任务')
      })
    },
    // 获取执行器列表
    getExecutor() {
      job.getExecutorList().then(response => {
        const { content } = response
        this.executorList = content
      })
    },
    // 选择区分
    radioSelect(val) {
      console.log(val, '分区')
    },
    // 分区字段
    columnSelect(val) {
      this.writerColumnsParam.partitionText = val
      this.$store.commit('changePartitionText', val)
      console.log(this.writerColumnsParam, 'writerForm')
      this.$store.state.taskAdmin.partitionVal
      console.log(val, '分区字段')
    },
    /**
     * @description: 关闭
     */
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('close')
        })
        .catch(_ => {})
    },
    /**
     * @description: 提交更新
     */
    handleUpdate() {
      console.log('handleUpdate()')
    },
    /**
     * @description: 目标表 - 数据源切换
     */
    wDsChange() {
      this.$store.commit('SET_WRITER_DATASOURCE_ID', this.taskParam.writerDatasourceId)
      this.dataSource = this.$store.state.taskAdmin.dataSourceList.find(ele => ele.id === this.taskParam.writerDatasourceId)?.datasource
      this.$set(this.taskParam, 'writerSchema', '')
      this.$set(this.taskParam, 'writerTables', [])
      this.fromColumnList = []
      if (this.hasSchema) {
        this.getSchema()
      } else {
        this.getTables()
      }
    },
    /**
     * @description: 目标表 - 点击Schema触发表改变
     */
    schemaChange() {
      this.$set(this.taskParam, 'writerTables', [])
      this.fromColumnList = []
      this.getTables()
    },
    /**
     * @description: 目标表 - 库表切换
     */
    wTbChange(t) {
      this.getColumns()
      this.$store.commit('SET_WRITER_TABLENAME', t)
    },
    /**
     * @description: 获取表
     */
    getTables() {
      const obj = {}
      if (this.hasSchema) {
        obj.datasourceId = this.taskParam.writerDatasourceId
        obj.tableSchema = this.taskParam.writerSchema
      } else {
        obj.datasourceId = this.taskParam.writerDatasourceId
      }
      // 组装
      dsQueryGetTables(obj).then(response => {
        this.wTbList = response
        this.$store.commit('SET_WRITER_TABLENAME', this.wTbList[0])
      }).catch(error => {
        console.log(error)
        this.wTbList = []
        this.$store.commit('SET_WRITER_TABLENAME', '')
      })
    },
    /**
     * @description: 获取表字段
     */
    getColumns() {
      const obj = {}
      obj.datasourceId = this.taskParam.writerDatasourceId
      obj.tableName = this.taskParam.writerTables[0]
      dsQueryGetColumns(obj).then(response => {
        this.fromColumnList = response

        if (JSON.parse(this.currentTask.jobParam).writerTables[0] === this.taskParam.writerTables[0] &&
          JSON.parse(this.currentTask.jobParam).writerDatasourceId === this.taskParam.writerDatasourceId) {
          this.$set(this.taskParam, 'writerColumns', JSON.parse(this.currentTask.jobParam).writerColumns)
        } else {
          this.$set(this.taskParam, 'writerColumns', this.fromColumnList)
        }

        this.writerColumnsParam.checkAll = this.taskParam.writerColumns.length === this.fromColumnList.length
        this.writerColumnsParam.isIndeterminate =
          this.taskParam.writerColumns.length > 0 && this.taskParam.writerColumns.length < this.fromColumnList.length

        this.$store.commit('SET_WRITER_COLUMNS', response)

        this.tableForm.rcolumns = response
        this.toColumnsList = response
      })
    },
    /**
     * @description: writer表项全选
     */
    wHandleCheckAllChange(val) {
      this.taskParam.writerColumns = val ? this.fromColumnList : []
      this.writerColumnsParam.checkAll = val
      this.writerColumnsParam.isIndeterminate = false
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.taskParam.writerColumns)
    },
    /**
     * @description: writer表项改变
     */
    wHandleCheckedChange(value) {
      const checkedCount = value.length
      this.writerColumnsParam.checkAll = checkedCount === this.fromColumnList.length
      this.writerColumnsParam.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fromColumnList.length
      this.$store.commit('SET_SELECT_WRITERCOLUMN', value)
    },
    /**
     * @description: 获取schema
     */
    getSchema() {
      dsQueryGetSchema({
        datasourceId: this.taskParam.writerDatasourceId
      }).then(response => {
        this.schemaList = response
      })
    },
    lHandleSelect(index, v) {},
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {},
    /**
     * @description: map点击删除
     */
    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1)
      this.toColumnsListChecked.splice(index, 1)

      this.tableForm.lcolumns.splice(index, 1)
      this.tableForm.rcolumns.splice(index, 1)
      this.mappingTable.splice(index, 1)
    },
    /**
     * @description: 提交
    //  */
    // 编辑提交
    handleSubmit() {
      console.log(11111111111111111111)
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.tableForm.rcolumns)
      this.$store.commit('SET_SELECT_READERCOLUMN', this.tableForm.lcolumns)
      const jobParam = {
        readerDatasourceId: this.$store.state.taskAdmin.readerDataSourceID,
        writerDatasourceId: this.taskParam.writerDatasourceId,
        readerTables: [this.$store.state.taskAdmin.readerTableName], // reader表名[Array]
        writerTables: this.taskParam.writerTables, // writer表名[Array]
        readerColumns: this.$store.state.taskAdmin.selectReaderColumn, // 已选择的表项
        writerColumns: this.taskParam.writerColumns,
        readerSchema: this.$store.state.taskAdmin.readerSchema,
        writerSchema: this.hasSchema ? this.taskParam.writerSchema : '',
        transformer: this.taskParam.transformer,
        hiveReader: this.taskParam.hiveReader,
        hiveWriter: this.dataSource === 'hive' ? this.taskParam.hiveWriter : {},
        rdbmsReader: this.taskParam.rdbmsReader,
        rdbmsWriter: this.dataSource !== 'hive' ? this.taskParam.rdbmsWriter : { preSql: '', postSql: '' },
        hbaseReader: this.taskParam.hbaseReader,
        hbaseWriter: this.taskParam.hbaseWriter,
        mongoDBReader: this.taskParam.mongoDBReader,
        mongoDBWriter: this.taskParam.mongoDBWriter
      }
      // console.log(jobParam)
      if (this.currentTask.glueType === 'BEAN' && !isJSON(this.currentTask.jobJson)) {
        this.$notify({
          title: 'Fail',
          message: 'json格式错误',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.currentTask.childJobId) {
        const auth = []
        for (const i in this.currentTask.childJobId) {
          auth.push(this.currentTask.childJobId[i].id)
        }
        this.currentTask.childJobIdArr = auth
        this.currentTask.childJobId = auth.toString()
      }
      // this.temp.executorHandler =
      //   this.temp.glueType === "BEAN" ? "executorJobHandler" : "";
      this.currentTask.glueSource = this.glueSource
      // if (this.partitionField) {
      //   this.currentTask.partitionInfo =
      //     this.partitionField +
      //     ',' +
      //     this.timeOffset +
      //     ',' +
      //     this.timeFormatType;
      // }
      if (this.currentTask.jobType === 'DQCJOB') {
        const tempjobRule = JSON.parse(JSON.stringify(this.$store.state.taskAdmin.jobRule))
        tempjobRule.forEach(ele => {
          const codeArr = []
          ele.ruleId.forEach(code => {
            codeArr.push({ code })
          })
          ele.ruleId = codeArr
        })
        jobParam.rule = tempjobRule
      }
      this.$set(this.currentTask, 'jobParam', JSON.stringify(jobParam))
      updateJob(this.currentTask).then(() => {
        this.$emit('fetchData')
        this.$emit('close')
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },

    // shell任务编辑修改
    handleShell() {
      this.temp.childJobId = this.temp.childJobId.toString()
      console.log(this.$store.state.taskAdmin.Group, 'data')
      this.temp.projectGroupId = this.$store.state.taskAdmin.Group.id
      console.log(this.temp, '123')
      updateTask(this.temp).then(() => {
        job.getTaskInfo(this.temp.id).then((res) => {
          console.log(res, 'content')
          if (res.code === 200) {
            console.log('>>>>', res.content)
            this.$store.commit('SET_JOB_INFO', res.content)
            this.temp = res.content
          }
        }).catch((err) => {
          console.log(err)
        })
        // this.temp = {
        //   id: undefined,
        //   jobGroup: '',
        //   jobCron: '',
        //   name: '',
        //   executorRouteStrategy: '',
        //   executorBlockStrategy: '',
        //   childJobId: '',
        //   executorFailRetryCount: '',
        //   alarmEmail: '',
        //   executorTimeout: '',
        //   userId: 0,
        //   jobConfigId: '',
        //   executorHandler: '',
        //   glueType: '',
        //   glueSource: '',
        //   jobJson: '',
        //   executorParam: '',
        //   replaceParam: '',
        //   replaceParamType: 'Timestamp',
        //   jvmParam: '',
        //   incStartTime: '',
        //   partitionInfo: '',
        //   incrementType: 0,
        //   incStartId: '',
        //   primaryKey: '',
        //   projectId: '',
        //   datasourceId: '',
        //   readerTable: ''
        // }
        this.$store.commit('changeWatch', 1)
        this.$store.commit('closeTabs', 1)
        this.$emit('fetchData')
        this.$emit('close')
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #f0f0f0;
}
::v-deep .el-card {
  border: 0;
}
.tab-class {
  margin: 20px 0;
  text-align: center;
}
.tab-title {
  font-size: 21px;
  font-weight: 700;
  margin: 20px 0;
}
::v-deep .el-select {
  width: 100%;
}
.temp {
  margin-top: 20px;
}
</style>
