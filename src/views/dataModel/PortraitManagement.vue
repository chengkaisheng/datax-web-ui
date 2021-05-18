<template>
  <div class="IndexConfiguration-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="画像" name="first">
        <div class="portrayal-content">
          <router-link
            to="/asset/ConsumerLoanCustomer"
            style="text-decoration: none;color: #000;"
          >
            <div class="portrayal-box">
              <div class="portrayal-wire"></div>
              <div class="portrayal-box-top">
                <span class="portrayal-tetle">消费贷客户</span>
                <!-- <img src="../../../assets/img/icon6.png" alt /> -->
                <p class="portrayal-dsce">消费待客户画像</p>
              </div>
              <div class="portrayal-box-bottom">
                <!-- <img class="portrayal-icon" src="../../../assets/img/icon5.png" alt /> -->
                <span class="portrayal-text">实体负责人：bigdata</span>
              </div>
            </div>
          </router-link>
        </div>
      </el-tab-pane>

      <el-tab-pane label="业务画像" name="second">
        <br />
        <el-row>
          <el-col :span="14" align="left">
            <div class="grid-content bg-purple" style="margin-left:50px">
              <el-dropdown>
                <span class="el-dropdown-link">
                  下拉菜单
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>下拉菜单</el-dropdown-item>
                  <el-dropdown-item>下拉菜单</el-dropdown-item>
                  <!-- <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  <el-dropdown-item divided>蚵仔煎</el-dropdown-item>-->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple-light">
              <el-input placeholder="请输入业务画像名称进行查询" v-model="roleSearchContent" style="width:300px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button type="primary" @click="information = true" style="margin-left:10px">+新建业务画像</el-button>
            </div>
          </el-col>
          
        </el-row>
       
        <el-row class="content">
          <!-- <img src="@/assets/img/empty.png" /> -->
        </el-row>
      </el-tab-pane>
    </el-tabs>
     <!-- 新建业务画像弹窗 -->
          <el-dialog title="新建业务画像" :visible.sync="information" width="35%">
            <el-form :model="form" label-width="80px" style="width: 80%;">
              <el-form-item label="业务画像名称：" :label-width="formLabelWidth" >
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入业务画像名称"></el-input>
              </el-form-item>
              <el-form-item label="使用场景：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入使用场景及用途等"></el-input>
              </el-form-item>
              <el-form-item label="管理员" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请选择管理员"></el-input>
              </el-form-item>
              <el-form-item label="成员：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请选择成员"></el-input>
              </el-form-item>
              <el-form-item label="所属画像：" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择所属画像" style="width:100%">
                  <el-option label="营销场景" value="list"></el-option>
                  <el-option label="关系" value="dimension"></el-option>
                  <el-option label="自然人" value="dimension"></el-option>
                </el-select>
              </el-form-item>
             <el-form-item label="业务画像主表：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入业务画像主表"></el-input>
              </el-form-item>
              <el-form-item label="业务画像主键：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请输入业务画像"></el-input>
              </el-form-item>
              <el-form-item label="共享成员：" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" placeholder="请选择共享成员"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="information = false">取 消</el-button>
              <el-button type="primary" @click="information = false">确 定</el-button>
            </div>
          </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PortraitManagement",
  data() {
    return {
       //   弹窗
      information: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      activeName: "first",
      moreStatus: "down"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  components: {},
  created() {
    this.$emit("showNavBars", true);
  }
};
</script>

<style scoped>
.IndexConfiguration-content {
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
}
.frome-span {
  display: inline-block;
  font-size: 12px;
  width: 300px;
  height: 20px;
}

.portrayal-content {
  width: 100%;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  background-color: #f5f6fa;
}
.portrayal-box {
  width: 285px;
  height: 170px;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.portrayal-box:hover {
  -moz-box-shadow: 0 0 5px #909090;
  -webkit-box-shadow: 0 0 5px #909090;
  box-shadow: 0 0 5px #909090;
  cursor: pointer;
}
.portrayal-box-top {
  width: 285px;
  height: 123px;
  padding: 0 20px;
  background-color: #fff;
}
.portrayal-box-bottom {
  width: 285px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #f5f6fa;
}
.portrayal-wire {
  width: 285px;
  height: 5px;
  border-radius: 3px 0 0 0;
  background-color: #1890ff;
}
.portrayal-tetle {
  padding-top: 15px;
  /* padding:15px 20px 0 50px; */
  padding-bottom: 20px;
  padding-right: 135px;
  display: inline-block;
  font-size: 18px;
}
.portrayal-dsce {
  font-size: 14px;
  color: #8c8c8c;
}
.portrayal-text {
  font-size: 12px;
  color: #abacaf;
}
.portrayal-icon {
  display: inline-block;
  margin-right: 10px;
}
.bg-purple-light {
  display: flex;
}
/* 文字下拉框样式开始 */
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/* 文字下拉样式结束 */

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
</style>
