<template>
  <div>
    <Consumer-header></Consumer-header>
    <div class="tab-content">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-text">
        <!-- 全部 -->
        <el-tab-pane label="全部(0)" name="first">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:40%;margin-top:15px;font-size:12px">
              负责人：
              <el-select v-model="charger" placeholder="请选择负责人"></el-select>
              <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 待提交 -->
        <el-tab-pane label="待提交(0)" name="second">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 上线中 -->
        <el-tab-pane label="上线中(0)" name="third">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder="请选择负责人">
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 上线失败 -->
        <el-tab-pane label="上线失败(0)" name="fourth">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder="请选择负责人">
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 待生效 -->
        <el-tab-pane label="待生效(0)" name="fifth">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder="请选择负责人">
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 已经上线 -->
        <el-tab-pane label="已上线(0)" name="sixth ">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName"></el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder="请选择状态">
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder="请选择负责人">
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 待下线 -->
        <el-tab-pane label="待下线(0)" name="seventh">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder>
                  <!-- <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>-->
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 已下线 -->
        <el-tab-pane label="已下线(0)" name="eighth">
          <div>
            <el-row style="font-size:12px">
              <el-col :span="7">
                搜索标签：
                <el-input style="width: 68%;" placeholder="请输入标签名进行查询" v-model="processName"></el-input>
              </el-col>
              <el-col :span="7" style="width: 30%;">
                标签类目：
                <el-select v-model="themeDomain" placeholder="请选择" style="width: 260px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="10" style="width: 40%;">
                标签类型：
                <el-select v-model="status" placeholder="请选择状态">
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <el-button type="primary" style="margin-left: 10px;">搜索</el-button>
                <el-button>重置</el-button>
                <span class="more" v-show="moreStatus=='down'" @click="changeMoreStatus('up')">
                  <a>更多</a>
                  <i class="el-icon-arrow-down"></i>
                </span>
                <span class="more" v-show="moreStatus=='up'" @click="changeMoreStatus('down')">
                  <a>收起</a>
                  <i class="el-icon-arrow-up"></i>
                </span>
              </el-col>
            </el-row>
            <el-row v-show="moreStatus=='up'" style="width:100%;margin-top:15px;font-size:12px">
              <span class="conceal-span">
                统计类型：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                是否公开：
                <el-select v-model="status" placeholder>
                  <el-option value="未上线">未上线</el-option>
                  <el-option value="已上线">已上线</el-option>
                  <el-option value="已下线">已下线</el-option>
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
              </span>
              <span class="conceal-span">
                数据负责人：
                <el-select v-model="charger" placeholder="请选择负责人">
                  <el-option value="上线中">上线中</el-option>
                  <el-option value="上线失败">上线失败</el-option>
                </el-select>
                <span style="color: #1890FF; margin-left: 15px;">只看自己</span>
              </span>
            </el-row>
            <el-row class="content">
              <!-- <img src="@/assets/img/empty.png" /> -->
            </el-row>
          </div>
        </el-tab-pane>
        <template >
          <div class="table-button" >
            <!-- <el-button type="primary">+ 新建原子词</el-button> -->
          </div>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ConsumerHeader from "./ConsumerHeader";
export default {
  name: "ConsumerLoanCustomer",
  components: {
    ConsumerHeader //加入组件
  },
  data() {
    return {
      moreStatus: "down",
      activeName: "first",
      status: "",
      charger: "",
      processName: "",
      themeDomain: "",
      options: [
        {
          value: "选项1",
          label: "主题一"
        },
        {
          value: "选项2",
          label: "主题二"
        }
      ],
      value: "",

      optionss: [
        {
          valuee: "选项1",
          label: "状态一"
        },
        {
          valuee: "选项2",
          label: "状态二"
        }
      ],
      valuee: "",

      principal: [
        {
          principalListe: "选项1",
          label: "负责人一"
        },
        {
          principalListe: "选项2",
          label: "负责人二"
        }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeMoreStatus(status) {
      console.log(555);
      this.moreStatus = status;
    }
  }
};
</script>

<style scoped>
.tab-content {
  width: 100%;
  padding: 0 20px;
}
.tab-text {
}

.table-button {
  /* margin-top: 100px; */
}
.more {
  margin-left: 15px;
}
.more a,
.more i {
  color: #1890ff;
  font-size: 12px;
  cursor: pointer;
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
.conceal-span {
  display: inline-block;
  margin-right: 15px;
}
</style>