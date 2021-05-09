<template>
  <div>
    <div class="btnContent">
      <ul>
        <li>
          <a
            :style="desbel"
            :loading="$store.state.graphQL.sqlBtnLoading"
            @click="fromChild"
          >
            <i class="el-icon-video-play" />运行
          </a>
        </li>
        <li>
          <a @click="saveQuery"> <i class="el-icon-s-claim" />保存 </a>
        </li>
      </ul>
    </div>
    <div :style="{ height: `400px !important` }" class="sqlArea">
      <textarea
        ref="mycode"
        v-model="DataMerging"
        class="codesql"
        @click="searchCode"
        @onCursorActivity="SelectSQL"
        @click.native="chooseSql"
      />
      <!-- <div v-if="lookup" class="lookup">
        <span class="new_lookup">
          <span
            @click="
              () => {
                this.ReplaceBox = !ReplaceBox
              }
            "
            class="el-icon-arrow-right"
          ></span>
          <input
            class="inputs"
            v-model="lookupdata"
            style="border: none"
            type="text"
          />
          <span @click="LookUp">查找</span>
          <span v-if="isdata">{{ DataLength }}</span>
        </span>
        <i class="el-icon-bottom"></i>
        <i class="el-icon-top"></i>
        <span
          class="el-icon-close"
          @click="
            () => {
              this.lookup = false
              this.ReplaceBox = false
            }
          "
        ></span>
        <br />
        <span
          style="border-top: 1px solid #ccc"
          v-show="ReplaceBox"
          class="ReplaceBox"
        >
          <input v-model="replaceData" class="inputs" type="text" />
          <i @click="ReplaceData" class="el-icon-refresh"></i>
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as job from '@/api/datax-job-info'
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import sqlFormatter from 'sql-formatter'

import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'

const CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
export default {
  name: 'CodeMirror',
  props: {
    DataMerging: String,
    require: true,
  },
  props: ['sqlHeight', 'columnList', 'tableList', 'sqlparams', 'desbel'],
  data() {
    return {
      datalength: false,
      isdata: false,
      replaceData: '',
      lookupdata: '',
      ReplaceBox: false,
      lookup: false,
      notes: `--============================================程序说明================================================
-- 脚本名称:
-- 功能说明:
-- 查询原表:
-- 目标的表:
-- 更新方式:
-- 科室部门:
-- 负责人员: ${JSON.parse(localStorage.getItem('userName'))}
-- 创建日期: ${new Date()}
-- 运行周期:
-- 备注信息:
-- 脚本版本: 修改人\t修改日期\t修改内容
-- v1
-- ===================================================================================================`,
      code: '',
      sqlLoading: false,
      tips: {},
      lastVal: '',
      leftShow: false,
      rightShow: true,
      infoMsg: 0,
      editor: {},
      SingleData: {},
      jobtype: '',
      _editor: null,
    }
  },
  computed: {
    DataMerging() {
      if (!this.code) {
        return this.notes + (this.code || '')
      } else if (this.code) {
        return this.code
      }
    },
  },
  watch: {
    '$store.state.taskAdmin.setcode': function () {
      this.code = this.$store.state.taskAdmin.setcode
    },
    code(val) {
      this.$store.commit('SETREDDOT', true)
      if (this.$store.state.taskAdmin.setcode !== val) {
        this.$store.commit('SETREDDOT', true)
      } else {
        this.$store.commit('SETREDDOT', false)
      }
      this.infoMsg++
    },
    sqlparams(val) {
      if (val.level === 3) {
        this.code =
          'SELECT * FROM ' + val.data.schema + '.' + val.data.tableName + ';'
        this.leftShow = true
        this.rightShow = false
      }
    },
    SingleData() {
      console.log('this.store', this.SingleData)
    },
    columnList(val) {
      // this.tips = {}
      const columeObj = {}
      val.forEach((ele) => {
        columeObj[ele.name] = []
      })
      // for (let i = 0; i < val.length; i++) {
      //   columeObj[val[i].name] = [];
      // }
      this.tips = Object.assign(this.tips, columeObj)
      console.log(this.tips, 'tips1')
    },
    tableList(val) {
      // this.tips = {}
      const tableObj = {}
      val.forEach((ele) => {
        tableObj[ele.name] = []
      })
      // this.mountCodeMirror();
      // for (let i = 0; i < val.length; i++) {
      //   tableObj[val[i].name] = [];
      // }
      this.tips = Object.assign(this.tips, tableObj)
      console.log(this.tips, 'tips2')
    },
  },
  beforeMount() {
    // const columeObj = {};
    // this.columnList.forEach((ele) => {
    //   columeObj[ele.name] = [];
    // });
    // const tableObj = {};
    // this.tableList.forEach((ele) => {
    //   tableObj[ele.name] = [];
    // });
    // this.tips = Object.assign(this.tips, columeObj, tableObj);
    // console.log(this.tips, 'tips');
  },
  created() {
    this.code = this.$store.state.taskAdmin.setcode
    this.jobtype = this.$store.state.taskAdmin.SingleData
  },
  mounted() {
    const editor = this.mountCodeMirror()
    this._editor = editor
    window.addEventListener('keydown', this.handelkeydown)
  },
  destroyed() {},

  methods: {
    searchCode(e) {
      this.codemirror.execCommand('find') //触发
    },
    //替换
    // ReplaceData() {
    //   const reg = new RegExp(this.lookupdata, 'g')
    //   console.log('1', this.code)
    //   const Code = this.code.replace(reg, this.replaceData)
    //   this.editor.setValue(sqlFormatter.format(Code))
    //   this.$store.commit('SETCODE', Code)
    //   console.log('2', this.code)
    // },
    //节流函数
    throttle(fn, delay = 2000) {
      let timer = null
      let firstTime = true
      return function (...args) {
        if (firstTime) {
          // 第一次加载
          fn.apply(this, args)
          return (firstTime = false)
        }
        if (timer) {
          // 定时器正在执行中，跳过
          return
        }
        timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
          fn.apply(this, args)
        }, delay)
      }
    },
    //防抖
    debounce(fn, delay) {
      let timerId = null
      return function () {
        let self = this
        let args = arguments
        timerId && clearTimeout(timerId)
        timerId = setTimeout(function () {
          fn.apply(self, args)
        }, delay || 1000)
      }
    },
    handelkeydown(e) {
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault()
        this.saveQuery()
      }
    },
    chooseSql() {},
    SelectSQL(instance) {},
    /**
     * @description: 运行查询
     */
    fromChild() {
      this.$emit('querysql', {
        msg: this.infoMsg,
        code: this._editor.getValue(),
        jobtype: this.jobtype.jobType,
      })
    },
    /**
     * @description: 保存查询
     */
    saveQuery() {
      console.log('getValue', this._editor.getValue())
      this.TIPS = false
      this.$emit('saveQuery', this._editor.getValue())
    },
    sqlJobBuild() {
      // this.$route.push('/datax/job/JobInfo')
      this.$router.push({
        path: '/datax/job/JobInfo',
      })
      console.log('=================')
      // window.location.href = '/datax/job/JobInfo'
    },

    mountCodeMirror(code) {
      const mime = 'text/x-sql'
      //const theme = 'ambiance' // 设置主题，不设置的会使用默认主题
      const _this = this
      const editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // theme: theme,
        // autofocus: true,
        // extraKeys: { Ctrl: 'delCharBefore' }, // 自定义快捷键
        hintOptions: {
          // 自定义提示选项,
          completeSingle: false,
          tables: _this.tips,
        },
        extraKeys: {
          'Ctrl-P': function (editor) {
            let sqlContent = ''
            sqlContent = editor.getValue()
            /* 将sql内容进行格式后放入编辑器中*/
            editor.setValue(sqlFormatter.format(sqlContent))
          },
        },
        // configureMouse() {
        //     console.log(window.getSelection());
        //     return {
        //         unit: 'word'
        //     };
        // }
      })

      _this.editor = editor
      editor.setSize('auto', '400px')

      //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on('cursorActivity', function (ins) {
        _this.code = editor.getSelection()
        if (_this.code.trim() !== '') {
          return
        }
        var cursor = editor.getCursor()
        var curCh = cursor.ch
        var curLineNo = cursor.line
        var curLineContent = editor.getLine(curLineNo)
        // var sqlScript = ''
        var endPos = {}
        var startPos = {}

        // 当前行
        if (curLineContent.indexOf(';') === -1) {
          // 当前行无分号
          // 往前找;
          let i = curLineNo - 1
          for (; i >= 0; i--) {
            var tempLine = editor.getLine(i)
            if (tempLine.indexOf(';') !== -1) {
              startPos.line = i
              startPos.ch = tempLine.indexOf(';') + 1
              break
            }
          }
          if (i === -1) {
            startPos.line = 0
            startPos.ch = 0
          }
          // 往后找;
          let j = curLineNo + 1
          for (; j <= editor.lastLine(); j++) {
            tempLine = editor.getLine(j)
            if (tempLine.indexOf(';') !== -1) {
              endPos.line = j
              endPos.ch = tempLine.indexOf(';')
              break
            }
          }
          if (j === editor.lastLine() + 1) {
            endPos.line = editor.lastLine() + 1
            endPos.ch = 0
          }
        } else if (curLineContent.indexOf(';') + 1 >= curCh) {
          // 当前行分号在当前鼠标后
          endPos.line = curLineNo
          endPos.ch = curLineContent.indexOf(';')
          // 往前找;
          let i = curLineNo - 1
          for (; i >= 0; i--) {
            tempLine = editor.getLine(i)
            if (tempLine.indexOf(';') !== -1) {
              startPos.line = i
              startPos.ch = tempLine.indexOf(';') + 1
              break
            }
          }
          if (i === -1) {
            startPos.line = 0
            startPos.ch = 0
          }
        } else {
          // 当前行分号在当前鼠标前
          startPos.line = curLineNo
          startPos.ch = curLineContent.indexOf(';') + 1
          // 往后找;
          let j = curLineNo + 1
          for (; j <= editor.lastLine(); j++) {
            tempLine = editor.getLine(j)
            if (tempLine.indexOf(';') !== -1) {
              endPos.line = j
              endPos.ch = tempLine.indexOf(';')
              break
            }
          }
          if (j === editor.lastLine() + 1) {
            endPos.line = editor.lastLine() + 1
            endPos.ch = 0
          }
        }

        _this.code = editor.getRange(startPos, endPos)
      })

      editor.on('change', function (editor, change) {
        // 触发autocomplete
        if (change.origin === '+input') {
          var text = change.text[0]
          if (
            text !== ' ' &&
            text !== ';' &&
            change.text.length !== 2 &&
            text !== '*' &&
            text !== '  '
          ) {
            // 不提示
            editor.execCommand('autocomplete')
          }
        }
        // _this.code = editor.getValue();
      })
      return editor
    },
    /**
     * @description: 回显sql
     */
  },
}
</script>

<style lang="scss" scoped>
.codesql {
  font-size: 11pt;
  /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace, serif; */
}
>>> .CodeMirror-dialog.CodeMirror-dialog-top {
  z-index: 999;
  left: 500px;
  top: 30px;
}
.btnContent {
  padding-left: 15px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #f5f7fa;
  font-size: 13px;
  ul {
    overflow: hidden;
    li {
      float: left;
      margin-right: 30px;
      a {
        i {
          margin-right: 10px;
        }
      }
      a:hover {
        color: skyblue;
      }
    }
  }
}

.sqlArea {
  position: relative;
  height: 400px;
  overflow: scroll;
  overflow-x: hidden;
  font-size: 13px;
  z-index: 1;
  .lookup {
    position: absolute;
    top: 40px;
    right: 50px;
    border: 1px solid #ccc;
    z-index: 999;
  }
}

.sqlArea::-webkit-scrollbar {
  display: none;
}

.lookup {
  width: 300px;
  height: auto;
  border-radius: 3px;
  padding-right: 10px;
  text-align: center;
  position: absolute;
  top: 40px;
  right: 50px;
  border: 1px solid #ccc;
  span {
    margin: 0;
    padding: 0;
  }
  .new_lookup {
    width: 100%;
  }
  .ReplaceBox {
    display: block;
    width: 100%;
    height: 24px;
    text-align: left;
    padding-left: 23px;
  }
  .inputs {
    display: inline-block;
    width: 180px;
    height: 25px;
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
  }
}
>>> .CodeMirror-gutters {
  background-color: #fff;
  border-right: none;
}
.tips {
  color: red;
}

>>> .CodeMirror-lines {
    padding: 4px 0;
    line-height: 15px;
}
</style>
