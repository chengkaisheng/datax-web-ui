<template>
  <div>
    <div class="btnContent">
      <ul>
        <li>
          <a @click="fromChild">
            <!-- <i class="el-icon-video-play" />运行查询 -->
            <i class="el-icon-video-play" />同步查询
            <!-- <i class="el-icon-refresh" /> -->
          </a>
        </li>
        <li>
          <a @click="saveQuery">
            <!-- <i class="el-icon-video-play" />保存查询 -->
            <i class="el-icon-copy-document" />异步查询
          </a>
        </li>
        <li>
          <el-tooltip
            class="item"
            effect="dark"
            content="清空编辑区"
            placement="top-start"
          >
            <a @click="sqlJobBuild">
              <!-- <i class="el-icon-video-play" />构建sql任务 -->
              <i class="el-icon-delete" />清空
            </a>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div :style="{ height: `400px !important` }" class="sqlArea">
      <textarea
        id="codesql1"
        ref="mycode"
        v-model="code"
        class="codesql"
        @onCursorActivity="SelectSQL"
        @click.native="chooseSql"
      />
      <div v-if="lookup" class="lookup">
        <span class="new_lookup">
          <span
            class="el-icon-arrow-right"
            @click="() => { this.ReplaceBox = !ReplaceBox}"
          />
          <input
            id="key"
            v-model="lookupdata"
            class="inputs"
            style="border: none"
            type="text"
            placeholder="查找内容"
          >
          <span @click="LookUp">查找</span>
          <!-- <span v-if="isdata">{{ DataLength }}</span> -->
        </span>
        <i class="el-icon-bottom" @click="previous" />
        <i class="el-icon-top" @click="next" />
        <span
          class="el-icon-close"
          @click="del"
        />
        <br>
        <span
          v-show="ReplaceBox"
          style="border-top: 1px solid #ccc"
          class="ReplaceBox"
        >
          <input v-model="replaceData" class="inputs" style="border: none" type="text" placeholder="替换内容">
          <span @click="ReplaceData"> <i class="el-icon-refresh" />替换</span>
        </span>
      </div>
    </div>

    <!-- <div class="btnContent">
        <el-button size="mini" type="goon" :loading="$store.state.graphQL.sqlBtnLoading" @click="fromChild">
            <i class="el-icon-refresh" /> 运行查询
        </el-button>
        <el-button size="mini" @click="saveQuery">
            <i class="el-icon-copy-document" /> 保存查询
        </el-button>

        <el-button size="mini" @click="sqlJobBuild">
            <i class="el-icon-copy-document" /> 构建sql任务
        </el-button>
    </div> -->
  </div>
</template>

<script>
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
  props: ['sqlHeight', 'columnList', 'tableList', 'sqlparams'],
  data() {
    return {
      code: '',
      sqlLoading: false,
      tips: {},
      lastVal: '',
      leftShow: false,
      rightShow: true,
      infoMsg: 0,
      editor: {},
      sqlContent: '',
      // lookup: '',
      datalength: false,
      isdata: true,
      replaceData: '',
      lookupdata: '',
      ReplaceBox: false,
      lookup: false,
      oldKey: '',
      index: -1,
      oldCount: 0, // 记录搜索到的所有关键词总数
      pos: []// 用于记录每个关键词的位置，以方便跳转
    }
  },
  watch: {
    code(val) {
      console.log(this.code, 'code1')
      this.infoMsg++
    },
    sqlparams(val) {
      if (val.level === 3) {
        this.code =
          'SELECT * FROM ' + val.data.schema + '.' + val.data.tableName + ';'
        console.log(this.code, 'code')
        this.leftShow = true
        this.rightShow = false
      }
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
      // this.mountCodeMirror();
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
    }
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
  mounted() {
    this.mountCodeMirror()
    // window.addEventListener('keydown', this.handelkeydown)
    // this.onKeyDown = this.onKeyDown.bind(this)
    document.addEventListener('keydown', this.onKeyDown)
  },
  methods: {
    // onKeyDown(event) {
    //   const isMac = navigator.platform.startsWith('Mac')
    //   const { key, code, keyCode, ctrlKey, metaKey } = event
    //   const isCmd = isMac && metaKey || !isMac && ctrlKey
    //   if (!isCmd) {
    //     return
    //   }
    //   const isF = key === 'f' || code === 'KeyF' || keyCode === 70
    //   if (isF && this.editor) {
    //     this.editor.execCommand('find')
    //     event.preventDefault()
    //   }
    // },
    previous() {
      this.index--
      this.index = this.index < 0 ? this.oldCount - 1 : this.index
      // search()
      // this.LookUp()
    },
    next() {
      this.index++
      // index = index == oldCount ? 0 : index;
      if (this.index === this.oldCount) {
        this.index = 0
      }
      // search()
      // this.LookUp()
    },
    del() {
      this.lookup = false
      this.ReplaceBox = false
      this.code = ''
    },
    // 点击查找
    LookUp() {
      // editor.execCommand（" find"）
      // CodeMirror.commands.find = function（cm）{clearSearch（cm）; doSearch（cm）;};
      // $('#search_result').empty()
      // var content = $('#message').val()

      // var re = new RegExp(content, 'gm')

      // var reslut = data.replace(re, "<font color='red'>" + content + '</font>')
      // $('#search_result').append(reslut)

      // document.getElementById('.result').removeClass('res')// 去除原本的res样式
      // var key = document.getElementById('#key').val() // 取key值
      // if (!key) {
      //   console.log('key为空则退出')
      //   document.getElementById('.result').each(function() { // 恢复原始数据
      //     document.getElementById('.result').replaceWith(document.getElementById('.result').html())
      //   })
      //   this.oldKey = ''
      //   return // key为空则退出
      // }
      // if (this.oldKey !== key) {
      //   console.log('进入重置方法')
      //   // 重置
      //   this.index = 0
      //   document.getElementById('.result').each(function() {
      //     document.getElementById('.result').replaceWith(document.getElementById('.result').html())
      //   })
      //   const pos = new Array()
      //   var regExp = new RegExp(key + '(?!([^<]+)?>)', 'ig')// 正则表达式匹配
      //   document.getElementById('#codesql1').replace(regExp, "<span id='result" + index + "' class='result'>" + key + '</span>') // 高亮操作
      //   document.getElementById('#key').val(key)
      //   this.oldKey = key
      //   document.getElementById('.result').each(function() {
      //     pos.push(document.getElementById('.result').offset().top)
      //   })
      //   const oldCount = document.getElementById('.result').length
      //   console.log('oldCount值：', oldCount)
      // }
      // document.getElementById('.result:eq(' + index + ')').addClass('res')// 当前位置关键词改为红色字体

      // document.getElementById('#codesql1').scrollTop(pos[index])// 跳转到指定位置

      console.log('this.code', this.code)
    },
    // 查找按键事件
    handelkeydown(event) {
      // const _this = this
      // const e = event || window.event || arguments.callee.caller.arguments[0]
      // if (e.ctrlKey && e.keyCode === 70) {
      //   e.preventDefault()
      //   _this.lookup = true
      //   this.lookupdata = this.code
      //   e.preventDefault()
      // } else if (e.ctrlKey && e.keyCode === 83) {
      //   _this.debounce(_this.saveQuery(), 2000)
      //   e.preventDefault()
      // }
    },
    // 替换
    ReplaceData() {
      const reg = new RegExp(this.lookupdata, 'g')
      console.log('1', this.code)
      const Code = this.code.replace(reg, this.replaceData)
      this.editor.setValue(sqlFormatter.format(Code))
      this.$store.commit('SETCODE', Code)
      console.log('2', this.code)
    },
    chooseSql() {
      console.log(window.getSelection())
    },
    SelectSQL(instance) {
      console.log(instance, '.....................')
    },
    /**
     * @description: 运行查询
     */
    fromChild() {
      this.$emit('querysql', {
        msg: this.infoMsg,
        code: this.code
      })
      console.log(this.code)
    },
    /**
     * @description: 保存查询
     */
    saveQuery() {
      console.log('保存查询')
      // this.code = JSON.stringify(this.code);
      this.$emit('saveQuery', this.code)
    },
    sqlJobBuild() {
      this.editor.setValue('')
      // // this.$router.push({
      // //   path: '/datax/job/JobInfo'
      // // });
      // this.mountCodeMirror()
      // // this.setCode()
    },

    mountCodeMirror(code) {
      const mime = 'text/x-sql'
      // const theme = 'ambiance'; // 设置主题，不设置的会使用默认主题
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
          tables: _this.tips
        },
        extraKeys: {
          'Ctrl-P': function(editor) {
            // this.lookupdata = this.code
            // sqlContent = editor.getValue()
            // /* 将sql内容进行格式后放入编辑器中*/
            // editor.setValue(sqlFormatter.format(sqlContent))
          },
          'Ctrl-H': function(editor) {
            let sqlContent = ''
            sqlContent = editor.getValue()
            /* 将sql内容进行格式后放入编辑器中*/
            editor.setValue(sqlFormatter.format(sqlContent))
          }
        }
        // configureMouse() {
        //     console.log(window.getSelection());
        //     return {
        //         unit: 'word'
        //     };
        // }
      })

      _this.editor = editor
      editor.setSize('auto', '400px')

      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on('cursorActivity', function(ins) {
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
        var startPos1 = { line: 0, ch: 0 }

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

        _this.code = editor.getRange(startPos1, endPos)
        console.log(_this.code, ' -- SQL')
      })

      editor.on('change', function(editor, change) {
        // 触发autocomplete
        console.log(change)
        if (change.origin === '+input') {
          var text = change.text
          if (
            text !== ' ' &&
            text !== ';' &&
            text.length !== 2 &&
            text !== '*' &&
            text !== '  '
          ) {
            // 不提示
            editor.execCommand('autocomplete')
          }
        }
        // _this.code = editor.getValue()
      })
    },
    /**
     * @description: 回显sql
     */
    setCode(code) {
      this.sqlContent = code + ';'
      this.editor.setValue(this.sqlContent)
    }
  }
}
</script>

<style lang="scss" scoped>
.codesql {
  font-size: 11pt;
  /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace, serif; */
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

>>> .CodeMirror-gutters {
  background-color: #fff;
  border-right: none;
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
    padding-left: 28px;
  }
  .inputs {
    display: inline-block;
    width: 180px;
    height: 25px;
    // border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0.1); // 透明背景
  }
}
 .res{
      color: Red;
  }
  .result{
      background: yellow;
  }
</style>
