<template>
  <div class="domain-content layout">
    <div class="domain-top">
      <div class="domain-icon">
        <img class="domain-img" src="@/assets/img/icon7.png" alt />
        <span class="domain-society">MAMe34t66B</span>
      </div>
      <div class="domain-button">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="domain-tex">
      <div class="domain-tex-boxone">
        <div>
          <p>指标名称：近一周大额存单累计充值金额</p>
          <p>指标单位：金额(万元(人民币))</p>
          <p>业务口径：时间修饰词：近一周：不含当前业务日期当天的最近一周 业务修饰词1：大额存单业务 原子词：累计充值金额</p>
        </div>
        <div>
          <p>分析维度：日</p>
          <p>主题域：自然人行为信息金融产品行为</p>
        </div>
        <div>
          <p>数据负责人：bigdata</p>
          <p>业务负责人：bigdata</p>
        </div>
      </div>
    </div>
    <div class="tabs-member">
      <div class="tabs-member-dk">
        <div class="tabs-member-top">
          <span class="tabs-member-tex">取数逻辑</span>
        </div>
        <div class="domain-tex">
          <div class="domain-tex-boxone">
            <div>
              <p>更新频率：天</p>
              <p>来源表：antmeta.cdjrj.test_gs_0111</p>
            </div>
            <div>
              <p>保障等级：A1</p>
            </div>
            <div>
              <p>是否可累加：否</p>
            </div>
          </div>
        </div>
        <div class="domain-table">
          <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
            <el-radio-button label="top">列表模式</el-radio-button>
            <el-radio-button label="right">SQL模式</el-radio-button>
          </el-radio-group>
        </div>
        <div class="domain-table-ListMode">
          <div class="domain-tex-content">
            <div>
              <p>近一周大额存单累计充值金额</p>
              <p>分析维度</p>
              <p>数据来源</p>
            </div>
            <div>
              <p>日</p>
            </div>
            <div>
              <p>COUNT(id)</p>
              <p>level</p>
              <p>antemeta.cdjrj.test_gs_0111</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "domainManagement",
  data() {
    return {
      // table切换
      tabPosition: "left",

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
      value: "",
      formLabelWidth: "120px",

      activeName: "first"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style  scoped>
p {
  margin: 0;
  padding: 0;
}
.domain-content {
  padding-top: 20px;
  width: 100%;
}
.el-input--small {
  width: 200px;
}
.domain-top {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.domain-icon {
  display: flex;
  align-items: center;
}
.domain-img {
  width: 20px;
  margin-right: 10px;
}
.layout {
  width: 100%;
  position: absolute;
}

.domain-tex {
  width: 70%;
  padding-top: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  display: flex;
  margin-left: 5%;
  justify-content: space-between;
}
.domain-tex-boxone {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.domain-table-ListMode {
  width: 95%;
  padding-top: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  margin-left: 5%;
  padding-right: 7%;
  background-color: #f7f9fb;
}
.domain-tex-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
p {
  font-size: 12px;
  margin-bottom: 8px;
  color: #999;
}
.content {
  width: 100%;
  min-height: 200px;
  background: #fff;
  margin-top: 86px;
  height: calc(100vh - 400px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabs-member {
  width: 100%;
  padding-top: 25px;

  background-color: #f5f6fa;
}
.tabs-member-dk {
  width: 1425px;
  height: 300px;
  margin-bottom: 25px;
  background-color: #fff;
  margin: 0 auto;
}
.tabs-member-top {
  width: 100%;
  height: 45px;
  line-height: 44px;
  padding-left: 15px;
  border: 1px solid #dadada;
  background-color: #fafafa;
}
.tabs-member-tex {
  font-size: 14px;
}
.domain-table {
  margin-left: 6%;
  padding-top: 19px;
}
</style>