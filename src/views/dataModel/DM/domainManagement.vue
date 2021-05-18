<template>
  <div class="domain-content">
    <div class="domain-top">
      <div class="domain-icon">
        <!-- <img class="domain-img" src="@/assets/img/icon7.png" alt /> -->
        <span class="domain-society">社会行为</span>
      </div>
      <div class="domain-button">
        <el-button type="primary" icon="el-icon-edit" @click="information = true">修改基础信息</el-button>
      </div>
    </div>
    <!-- 修改基础信息弹窗 -->
    <el-dialog title="编辑基础信息" :visible.sync="information" width="35%">
              <el-form :model="form" label-width="80px" style="width: 80%;">
                <el-form-item label="域名称：" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" placeholder="社会行为"></el-input>
                </el-form-item>
                <el-form-item label="数据负责人：" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" placeholder="yang(bigdata)"></el-input>
                </el-form-item>
                <el-form-item label="业务负责人：" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" placeholder="yang(bigdata)"></el-input>
                </el-form-item>
                <el-form-item label="数据域描述：" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" type="textarea" placeholder="记录自然人的各种社会活动的明细数据，如出生，入学"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="information = false">取 消</el-button>
                <el-button type="primary" @click="information = false">确 定</el-button>
              </div>
            </el-dialog>

    <div class="domain-tex">
      <div class="domain-tex-boxone">
        <div>
          <p>英文简写：soc</p>
          <p>上级主题域：自然人>行为信息</p>
        </div>
        <div>
          <p>域数负责人：bigdata</p>
          <p>域类型：中间层</p>
        </div>
        <div>
          <p>域业务负责人：bigdata</p>
          <p>描述：记录自然人的各种社会活动的明细数据，如出生，入学，就业，...</p>
        </div>
      </div>
    </div>
    <div class="tabs-member">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 成员管理 -->
        <el-tab-pane label="成员管理" name="first">
          <div class="tabs-member-management">
            <div class="tabs-member-herder">
              <span class="tabs-meber-text">成员管理</span>
            </div>
            <div class="tabs-member-search">
              <div class="interlayer-forme">
                <span class="interlayer-search">
                  搜索主题域：
                  <el-input style="width: 15%;" placeholder="请输入主题域名搜索" v-model="processName"></el-input>
                </span>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
              </div>
            </div>
            <div class="table-button">
              <el-button type="primary" @click="dialogFormVisible = true">+添加成员</el-button>
            </div>
            <!-- 添加成员弹窗 -->
            <el-dialog title="添加成员" :visible.sync="dialogFormVisible" width="35%">
              <el-form :model="form" label-width="80px" style="width: 80%;">
                <el-form-item label="成员" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>

            <div>
              <el-row class="content">
                <!-- <img src="@/assets/img/empty.png" /> -->
              </el-row>
            </div>
            <div></div>
          </div>
        </el-tab-pane>
        <!-- 规范管理 -->
        <el-tab-pane label="规范管理" name="second">
          <div class="tabs-member-management">
            <div class="tabs-member-herder">
              <span class="tabs-meber-text">规范管理</span>
            </div>
            <div class="tabs-member-search">
              <div class="interlayer-forme">
                <span class="interlayer-search">
                  规范类型：
                  <el-input style="width: 15%;" placeholder v-model="processName"></el-input>
                </span>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
              </div>
            </div>
            <div class="table-button" trigger="click">
              <el-dropdown>
                <el-button type="primary" trigger="click" @click="newSpecification = true">
                  +新建规范
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="NewProduce = true">新建次产设计规范</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <!-- 新建规范弹窗开始 -->
              <el-dialog title="新增资产设计规范" :visible.sync="newSpecification" width="35%">
                <el-form :model="form" label-width="80px" style="width: 80%;">
                  <el-form-item label="适用域" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" placeholder="本域(含子域)"></el-input>
                  </el-form-item>
                  <el-form-item label="规则名称" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择" style="width:100%">
                      <el-option label="明细表必须绑定业务过程" value="list"></el-option>
                      <el-option label="维度表必须绑定维度实体" value="dimension"></el-option>
                      <el-option label="汇总表必须绑定汇总维度" value="summary"></el-option>
                      <el-option label="资产所属主题域层级约定" value="property"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="newSpecification = false">取 消</el-button>
                  <el-button type="primary" @click="newSpecification = false">确 定</el-button>
                </div>
              </el-dialog>
              <!-- 新建规范弹窗结束 -->
              <!-- 新建次产设计规范开始 -->
              <!-- <el-dialog title="添加成员" :visible.sync="NewProduce" width="35%">
                <el-form :model="form" label-width="80px" style="width: 80%;">
                  <el-form-item label="成员" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="NewProduce = false">取 消</el-button>
                  <el-button type="primary" @click="NewProduce = false">确 定</el-button>
                </div>
              </el-dialog> -->

              <el-row class="el-row-style">
                <el-table :data="TheNewSpecification" :header-cell-style="{background:'#fafafa'}">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column
                    prop="name"
                    label="规范类型"
                    width="140"
                    header-align="left"
                    align="left"
                  ></el-table-column>
                  <el-table-column
                    prop="subject"
                    label="约束规则"
                    width="200"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="description"
                    label="规则描述"
                    width="200"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="description"
                    label="最近一次修改人"
                    width="200"
                    header-align="center"
                    align="center"
                  ></el-table-column>
                  <el-table-column fixed="right" label="操作" header-align="center" align="center">
                    <template slot-scope>
                      <!-- <el-button
                        type="text"
                        @click="$router.push('/di/property/ad/domainManagement')"
                      >管理</el-button>
                      <i class="wire"></i>
                      <el-button type="text" @click="$router.push('')">新增子域</el-button>
                      <i class="wire"></i>
                      <el-button type="text" @click="$router.push('')">删除</el-button>
                      <i class="wire"></i>-->
                      <!-- <el-button type="text">查看权限</el-button> -->
                      <!-- <el-popover placement="top-start" width="200" fixed="right" trigger="click">
                        <el-table :data="gridData">
                          <el-table-column width="70" property="date" label="权限名称"></el-table-column>
                          <el-table-column width="50" property="name" label="状态"></el-table-column>
                          <el-table-column width="50" property="address" label="操作"></el-table-column>
                        </el-table>
                        <el-button slot="reference" type="text">查看权限{{scope.row.gridData}}</el-button>
                      </el-popover>-->
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </div>

            <!-- <div>
              <el-row class="content">
                <img src="@/assets/img/empty.png" />
              </el-row>
            </div>-->
            <div></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "domainManagement",
  data() {
    return {
      // 添加成员弹窗开始
      dialogTableVisible: false,
      dialogFormVisible: false,
      newSpecification: false,
      NewProduce: false,
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
      formLabelWidth: "120px",
      // 添加成员弹窗结束
      //   table表格数据
      TheNewSpecification: [
        // {
        //   name: "关系",
        //   subject: "rsm",
        //   description: "blgdala",
        //   admin: "bigata",
        // },
      ],
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
.domain-society {
  font-size: 16px;
}
.domain-tex {
  padding-top: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

}
.domain-tex-boxone {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.domain-tex-boxtow {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
p {
  font-size: 12px;
  margin-bottom: 8px;
  color: #999;
}
.tabs-member {
  width: 90%;
  padding-top: 20px;
  margin: 0 auto;
}

.tabs-content {
  background-color: #f5f6fa;
}
.tabs-member-management {
  width: 100%;
  height: 500px;
  background-color: #fff;
}
.tabs-member-herder {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 8px;
  background-color: #fbfbfb;
}
.interlayer-forme {
  margin-top: 10px;
  margin-bottom: 20px;
}
.interlayer-search {
  font-size: 14px;
}
.table-button {
  margin-bottom: 20px;
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
</style>