<template>
  <div class="interlayer-content">
    <div class="head">
      <a @click="$router.back(-1)">
        <i class="el-icon-arrow-left"></i>
      </a>
      <span @click="$router.back(-1)">详情</span>
    </div>
    <div class="layout">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1">
          <template slot="title">
            <i
              :class="{'el-icon-arrow-right':activeName!=='1','el-icon-arrow-down':activeName=='1'}"
              style="margin-left:15px"
            ></i>
            <span class="basic">基础信息</span>
          </template>
          <el-form
            :model="numberValidateForm"
            ref="numberValidateForm"
            label-width="150px"
            class="demo-ruleForm"
          >
            <el-col :span="8">
              <el-form-item
                label="指标:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-select v-model="value" placeholder="请选择">
                  <el-option style="color:#5ab0ff">+ 新增目标</el-option>
                     <el-option style="height:auto;background:#e6f7ff">
                         <h5>近一周大额存单累计充值金额</h5>
                         <p>近一周大额存单累计充值金额近一周大额存单累计充值金额近一周大额存单累计充值金额近一周大额存单累计充值金额近一周大额存单累计充值金额</p>
                     </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :span="8"
                label="主题域:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <p class="topic">自然人/行为信息/金融产品行为</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :span="8"
                label="日期维度:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                 <p class="inform">若需要添加日期维度，请联系燕青</p>
              </el-form-item>
             
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="其他维度:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-input v-model="input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :span="8"
                label="是否可累加:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <template>
                  <el-radio v-model="radio" label="1">备选项</el-radio>
                  <el-radio v-model="radio" label="2">备选项</el-radio>
                </template>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                :span="8"
                label="是否是高管目标:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <template>
                  <el-radio v-model="radio" label="1">备选项</el-radio>
                  <el-radio v-model="radio" label="2">备选项</el-radio>
                </template>
                   <p class="inform">高管指标将走高管链接报警和保障，请谨慎!</p>
              </el-form-item>
              
            </el-col>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <el-collapse accordion v-model="activeName1">
        <el-collapse-item name="1">
          <template slot="title">
            <i
              :class="{'el-icon-arrow-right':activeName1!=='1','el-icon-arrow-down':activeName1=='1'}"
              style="margin-left:15px"
            ></i>
            <span class="basic">加工逻辑</span>
          </template>
          <el-form
            :model="numberValidateForm"
            ref="numberValidateForm"
            label-width="150px"
            class="demo-ruleForm"
          >
            <el-col>
              <el-form-item
                :span="8"
                label="加工方式:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <template>
                  <el-radio v-model="radio" label="1">备选项</el-radio>
                  <el-radio v-model="radio" label="2">备选项</el-radio>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :span="8"
                label="来源表:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                label="更新频率:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in ['分钟','小时','天','周','月']"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :span="8"
                label="保障等级:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in ['A1','A2','A3','A4']"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <p class="inform">目前仅A1,A2等级指标进行计算</p>
            </el-col>

            <el-col>
              <el-form-item
                :span="8"
                label="维度来源字段:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-table :data="tableData" stripe style="width: 100%">
                  <el-table-column prop="date" label="维度"></el-table-column>
                  <el-table-column prop="name" label="来源字段">
                    <template slot-scope="scope">
                      <el-select v-model="value" placeholder="请选择" @click="handleClick(scope.row)">
                        <el-option
                          v-for="item in ['id','level','name','age']"
                          :key="item"
                          :label="item"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="日期格式">
                    <template slot-scope="scope">
                      <el-date-picker
                        @click="handleClick(scope.row)"
                        v-model="value1"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                </el-table>
                <p class="inform">此处未读信息来源[基础信息]中的设置,若需要增删维度，请在[基础信息]中进行基本操作，按维度聚合指标目前还不支持计算</p>
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item
                :span="8"
                label="计算公式:"
                prop="age"
                :rules="[
      { required: true, message: ''},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
              >
                <el-switch
                  v-model="value1"
                  active-color="#13ce66"
                  inactive-color="#bfbfbf"
                  active-text="聚合函数"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <el-col>
                  <el-select v-model="value" placeholder="请选择" :disabled="!value1">
                    <el-option
                      v-for="item in  [{
          label: '常量'
        }, {
          label: '聚合函数'
        }, {
          value: '求和',
          label: 'sum-'
        }, {
          value: '最大值',
          label: 'max-'
        }, {
          value: '最小值',
          label: 'min-'
        }, {
          value: '均值',
          label: 'avg-'
        }, {
          value: '技数',
          label: 'count-'
        }, {
          value: '去重计算',
          label: 'distinct-count'
        }]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                  <el-select v-model="value" placeholder="请选择" style="width:180px" :disabled="!value1">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select v-model="value" placeholder="请选择" style="width:60px;margin:0 10px;" :disabled="!value1">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select v-model="value" placeholder="请选择" style="width:100px;"  disabled>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select v-model="value" placeholder="请选择"  disabled>
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                     
                    ></el-option>
                  </el-select>
                </el-col>
                <p class="inform">请设置来源表再设置指标公式</p>
              </el-form-item>
              <el-form-item label="Where:">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea1"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button>预览指标计算口径(sql)</el-button>
                <p class="inform">未获取到预览数据，请正确填写计算公式，过滤条件（当是子查询：请正确填写子查询，计算公式）</p>
              </el-form-item>
            </el-col>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <p>
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </p>
    </div>
  </div>
</template>
        
<script>
export default {
  name: "AtomicWord",
  data() {
    return {
      activeName: "1",
      activeName1: "1",
      value1:false,
      numberValidateForm: {
        age: ""
      },
      tableData: [
        {
          date: "日",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: lightblue;color:#fff;font-weight: 500;";
      }
    },
    // 按钮
    handleClick() {
      alert("button click");
    },
    changeMoreStatus(status) {
      console.log(555);
      this.moreStatus = status;
    }
  },
  components: {},
  created() {
    this.$emit("showNavBars", true);
  }
};
</script>

<style scoped>
.topic {
  color: #1890ff;
}
/deep/.el-table th {
  background: #eee;
}
.inform {
  font-size: 12px;
  color: #bfbfbf;
}
.el-select-dropdown__item span{
  float:none !important;
}
/deep/ .el-input--small .el-input__inner,
.el-select {
  width: 300px;
}
/deep/ .el-textarea__inner {
  width: 90% !important;
  height: 70px !important;
}
.layout {
  padding: 25px 75px;
}
.interlayer-content {
  position: absolute;
  width: 100%;
  background: #f7f9fb;
}
.head {
  display: flex;
  height: 50px;
  background: #000;
  width: 100%;
  justify-content: normal;
}
.el-collapse {
  margin-bottom: 20px;
}
.head span {
  color: #fff;
  font-size: 14px;
}
.head a {
  margin-left: 12px;
  margin-right: 30px;
}
.head a i {
  font-size: 16px;
  color: #fff;
}
</style>
