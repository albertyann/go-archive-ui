<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="户主姓名" prop="holder">
            <el-input v-model="queryParams.holder" placeholder="户主姓名" clearable size="small" style="width: 160px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="户籍分组" prop="hukouGroup">
            <el-select v-model="queryParams.hukouGroup" placeholder="户籍分组" style="width: 120px;" clearable>
              <el-option v-for="dict in hukouGroupList" :key="dict.value" :label="dict.label" :value="dict.label" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['archive:house:add']" type="primary" icon="el-icon-plus" size="mini"
              @click="handleAdd">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['archive:house:remove']" type="danger" icon="el-icon-delete" size="mini"
              :disabled="multiple" @click="handleDelete">删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['archive:house:export']" type="primary" icon="el-icon-download" size="mini" @click="handleExport">导出
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="houseList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="分组" align="center" prop="hukouGroup" />
          <el-table-column label="户号" align="center" prop="hukouNo" />
          <el-table-column label="户主" align="center" prop="holder" />
          <el-table-column label="户主电话" align="center" prop="holderPhone" />
          <el-table-column label="建筑面积" align="center" prop="area" />
          <el-table-column label="房屋状态" align="center" prop="status" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-document"
                @click="showDetail(scope.row)">查看</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit"
                @click="handleUpdate(scope.row)">修改</el-button>
              <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                @confirm="handleDelete(scope.row)">
                <el-button slot="reference" size="mini" type="text"
                  icon="el-icon-delete">删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-drawer :title="title" :visible.sync="open" size="830px">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  {{ base_address }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍分组" prop="hukouGroup">
                  <el-select v-model="form.hukouGroup" placeholder="户籍分组" clearable>
                    <el-option v-for="dict in hukouGroupList" :key="dict.value" :label="dict.label"
                      :value="dict.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍户号" prop="hukouNo">
                  <el-input v-model="form.hukouNo" placeholder="户籍户号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍户主" prop="holder">
                  <el-input v-model="form.holder" placeholder="户籍户主" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户主电话" prop="holderPhone">
                  <el-input v-model="form.holderPhone" placeholder="户主电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租户姓名" prop="user">
                  <el-input v-model="form.user" placeholder="租户姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租户电话" prop="userPhone">
                  <el-input v-model="form.userPhone" placeholder="租户电话" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建筑层数" prop="floorNum">
                  <el-select v-model="form.floorNum" placeholder="建筑层数" clearable>
                    <el-option v-for="dict in floorOptions" :key="dict.label" :label="dict.label" :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建筑面积" prop="area">
                  <el-input v-model="form.area" placeholder="建筑面积" style="width: 160px" /> 平方米
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结构类型" prop="area">
                  <el-select v-model="form.structType" placeholder="结构类型" clearable>
                    <el-option v-for="dict in buildStructureOptions" :key="dict.label" :label="dict.label"
                      :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建造方式" prop="area">
                  <el-select v-model="form.buildMethod" placeholder="建造方式" clearable>
                    <el-option v-for="dict in buildMethodOptions" :key="dict.label" :label="dict.label"
                      :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="建造年份" prop="buildPeriod">
                  <el-select v-model="form.buildPeriod" placeholder="建造年份" clearable>
                    <el-option v-for="dict in buildOptions" :key="dict.label" :label="dict.label" :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="土地性质" prop="landNature">
                  <el-select v-model="form.landNature" placeholder="土地性质" clearable>
                    <el-option v-for="dict in landNatureOptions" :key="dict.label" :label="dict.label"
                      :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主要用途" prop="usage">
                  <el-select v-model="form.usage" placeholder="主要用途" clearable>
                    <el-option v-for="dict in usedOptions" :key="dict.label" :label="dict.label" :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="房屋状态" prop="status">
                  <el-select v-model="form.status" placeholder="房屋状态" clearable>
                    <el-option v-for="dict in statusOptions" :key="dict.label" :label="dict.label"
                      :value="dict.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="户籍成员" prop="status">
                  <el-button @click="openDialog = true" size="mini">添 加</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-table :data="familyMember">
                    <el-table-column label="姓名" align="center" prop="name" />
                    <el-table-column label="年龄" align="center" prop="age" />
                    <el-table-column label="电话" align="center" prop="phone" />
                    <el-table-column label="户主" align="center" prop="houseHolderRelation" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-popconfirm class="delete-popconfirm" title="确认要删除吗?" confirm-button-text="删除"
                          @confirm="handleDelete(scope.row)">
                          <el-button slot="reference" v-permisaction="['archive:house:remove']" size="mini" type="text"
                            icon="el-icon-delete">删除
                          </el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地图标注" prop="longitude">
                  {{ form.longitude +", "+ form.latitude }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <div id="mapDiv" style="width: 600px; height: 400px;"></div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-drawer>

        <!-- 详情 -->
        <el-drawer :title="title" :visible.sync="detailDialog.show" size="830px">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  {{ base_address }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍分组" prop="hukouGroup">
                  <span>{{ detail.hukouGroup }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍户号" prop="hukouNo">
                  <span>{{ detail.hukouNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户籍户主" prop="holder">
                  <span>{{ detail.holder }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="户主电话" prop="holderPhone">
                  <span>{{ detail.holderPhone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租户姓名" prop="user">
                  <span>{{ detail.user }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租户电话" prop="userPhone">
                  <span>{{ detail.userPhone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建筑层数" prop="floorNum">
                  <span>{{ showLabel(detail.floorNum, floorOptions) }}</span>
                </el-form-item>

              </el-col>
              <el-col :span="12">
                <el-form-item label="建筑面积" prop="area">
                  <span>{{ detail.area }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结构类型" prop="structType">
                  <span>{{ detail.structType }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建造方式" prop="buildMethod">
                  <span>{{ detail.buildMethod }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="建造年份" prop="buildYear">
                  <span>{{ showLabel(detail.buildPeriod, buildOptions) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="土地性质">
                  <span>{{ showLabel(detail.landNature, landNatureOptions) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主要用途" prop="usage">
                  <span>{{ showLabel(detail.usage, usedOptions) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="房屋状态" prop="status">
                  <span>{{ detail.status }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-table :data="familyMember">
                    <el-table-column label="姓名" align="center" prop="name" />
                    <el-table-column label="年龄" align="center" prop="age" />
                    <el-table-column label="电话" align="center" prop="phone" />
                    <el-table-column label="户主" align="center" prop="houseHolderRelation" />
                  </el-table>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地图标注" prop="longitude">
                  {{ detail.longitude +", "+ detail.latitude }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <div id="showMapDiv" style="width: 600px; height: 400px;"></div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button type="primary" @click="openEditForm">编辑</el-button>
            <el-button @click="closeDetailDialog">关 闭</el-button>
          </div>
        </el-drawer>

        <!-- 添加或修改对话框 -->
        <el-dialog title="添加家庭成员" :visible.sync="openDialog" width="800px">
          <el-form ref="familyForm" :model="familyParams" :inline="true" label-width="68px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="familyParams.name" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="familyParams.phone" placeholder="电话" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="familyQuery">查找</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" :data="familyResult" @selection-change="handleSelectionChange">
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="年龄" align="center" prop="age" />
            <el-table-column label="性别" align="center" prop="gender" />
            <el-table-column label="户主" align="center" prop="houseHolderRelation" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="addFamilyMember(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
  import {
    addHouse,
    delHouse,
    getHouse,
    listHouse,
    exportHouse,
    updateHouse
  } from '@/api/archive/house';
  import {
    fmtDate
  } from '@/utils/index'
  import {
    getHukouGroup
  } from '@/api/archive/car';
  import {
    listTbMember
  } from '@/api/archive/member'
  import excel from "@/utils/excel";
  import {
    getConfigKey
  } from '@/api/admin/sys-config';

  const imageURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
    "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
    "&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
    "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=cbfe568d6062fdbb2efca8c9ea29d32b";
  const mapBox = {
    editMap: null
  };

  export default {
    name: 'archiveHouse',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 弹出层标题
        title: '',
        base_address: '',
        // 是否显示弹出层
        open: false,
        openDialog: false,
        isEdit: false,
        showMap: false,
        detailDialog: {
          show: false
        },
        // 类型数据字典
        typeOptions: [],
        familyResult: [],
        floorOptions: [{
            "value": "1",
            "label": "一层",
          },
          {
            "value": "2",
            "label": "二层",
          },
          {
            "value": "3",
            "label": "三层",
          },
          {
            "value": "4",
            "label": "三层以上",
          },
        ],
        buildOptions: [{
            "value": "1",
            "label": "1980年及以前",
          },
          {
            "value": "2",
            "label": "1981~1990年",
          },
          {
            "value": "3",
            "label": "1991~2000年",
          },
          {
            "value": "4",
            "label": "2001~2010年",
          },
          {
            "value": "5",
            "label": "2011年及以后",
          },
        ],
        statusOptions: [{
            "value": "正常",
            "label": "正常",
          },
          {
            "value": "危房",
            "label": "危房",
          }
        ],
        houseList: [],
        hukouGroupList: [],
        buildStructureOptions: [{
            "value": "1",
            "label": "砖石结构(预制板)",
          },
          {
            "value": "2",
            "label": "砖石结构(非预制板)",
          },
          {
            "value": "3",
            "label": "土木结构",
          },
          {
            "value": "4",
            "label": "混凝土结构",
          },
          {
            "value": "5",
            "label": "窑洞",
          },
          {
            "value": "6",
            "label": "钢结构",
          },
          {
            "value": "7",
            "label": "混杂结构",
          },
          {
            "value": "8",
            "label": "其它",
          }
        ],
        buildMethodOptions: [{
            "value": "1",
            "label": "建筑工匠建造",
          },
          {
            "value": "2",
            "label": "有资质的施工队建造",
          },
          {
            "value": "3",
            "label": "其它",
          }
        ],
        // 土地性质
        landNatureOptions: [{
            "value": "",
            "label": "请选择",
          },
          {
            "value": "1",
            "label": "宅基地",
          },
          {
            "value": "2",
            "label": "非宅基地",
          },
          {
            "value": "3",
            "label": "农用地",
          },
          {
            "value": "4",
            "label": "建设用地",
          },
          {
            "value": "5",
            "label": "未利用地",
          }
        ],
        // 主要用途
        usedOptions: [{
            "value": "1",
            "label": "行政办公",
          },
          {
            "value": "2",
            "label": "教育设施",
          },
          {
            "value": "3",
            "label": "医疗卫生",
          },
          {
            "value": "4",
            "label": "文化设施",
          },
          {
            "value": "5",
            "label": "养老设施",
          },
          {
            "value": "6",
            "label": "批发零售",
          },
          {
            "value": "7",
            "label": "餐饮饭店",
          },
          {
            "value": "8",
            "label": "住宿宾馆",
          },
          {
            "value": "9",
            "label": "休闲娱乐",
          },
          {
            "value": "10",
            "label": "宗教场所",
          },
          {
            "value": "11",
            "label": "农贸市场",
          },
          {
            "value": "12",
            "label": "生产加工",
          },
          {
            "value": "13",
            "label": "其它",
          }
        ],

        // 家庭成员
        familyMember: [],

        // 查询参数
        queryParams: {
          holder: '',
          hukouGroup: '',
          pageIndex: 1,
          pageSize: 10,
        },
        familyParams: {
          name: '',
          phone: '',
        },
        // 表单参数
        form: {},
        detail: {},
        // 表单校验
        rules: {},
        // 导出表头信息
        excelHead: {
          'id': 'ID',
          'hukouGroup': '户籍分组',
          'hukouNo': '户籍编号',
          'holder': '户主姓名',
          'phone': '户主电话',
          'status': '房屋状态',
          'buildMethod': '建筑方式',
          'buildPeriod': '建造年份',
          'floorNum': '建筑楼层',
        }
      }
    },
    created() {
      this.getList();
      this.baseConf();
    },
    mounted() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=cbfe568d6062fdbb2efca8c9ea29d32b`;
      document.head.appendChild(script);
    },
    methods: {
      showLabel(val, options) {
        let opt = options.find(x => x.value = val)
        return opt ? opt.label : '';
      },
      showDetail(row) {
        this.detailDialog.show = true;
        this.detail = row;
        this.openDetailMap()
      },
      closeDetailDialog() {
        this.detailDialog.show = false;
      },
      openEditForm() {
        this.handleUpdate(this.detail)
        this.detailDialog.show = false;
      },
      openDetailMap() {
        let that = this;
        setTimeout(() => {
          let lay = new T.TileLayer(imageURL, {
            minZoom: 10,
            maxZoom: 18
          });
          var config = {
            layers: [lay]
          };
          let map = new T.Map('showMapDiv', config);
          let lnglat = new T.LngLat(this.detail.longitude, this.detail.latitude);
          map.centerAndZoom(lnglat, 18);

          map.clearOverLays();
          var marker = new T.Marker(lnglat);
          map.addOverLay(marker);
        }, 100)
      },
      openMap() {
        // this.showMap = true
        let that = this;

        setTimeout(() => {
          let lay = new T.TileLayer(imageURL, {
            minZoom: 10,
            maxZoom: 18
          });
          var config = {
            layers: [lay]
          };
          let map;
          if (mapBox.editMap == null) {
            map = new T.Map('mapDiv', config);
            mapBox.editMap = map;
          }


          if (that.form.longitude) {
            map.clearOverLays();
            let lnglat = new T.LngLat(that.form.longitude, that.form.latitude);
            map.centerAndZoom(lnglat, 18);
            var marker = new T.Marker(lnglat);
            map.addOverLay(marker);
          } else {
            map.centerAndZoom(new T.LngLat(120.421980, 30.299160), 18);
          }

          var cp = new T.CoordinatePickup(map, {
            callback: (lnglat) => {
              that.form.longitude = lnglat.lng.toFixed(6);
              that.form.latitude = lnglat.lat.toFixed(6);

              map.clearOverLays();
              var marker = new T.Marker(lnglat);
              map.addOverLay(marker);
            }
          })
          cp.addEvent();
        }, 100)
      },
      baseConf() {
        getConfigKey('base_address').then(res => {
          this.base_address = res.data.configValue
        });

        getHukouGroup().then(res => {
          res.data.list.forEach(r => {
            this.hukouGroupList.push({
              label: r.name,
              value: r.id + ""
            })
          })
        })
      },
      /** 查询参数列表 */
      getList() {
        this.loading = true
        listHouse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.houseList = response.data.list
          this.total = response.data.count
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          address: undefined,
          area: undefined,
          floor: undefined,
          buildYear: undefined,
          status: undefined,
          longitude: undefined,
          latitude: undefined,
          doorNo: undefined,
          hukouGroup: undefined,
          landNature: undefined,
        }
        this.resetForm('form')
      },
      getImgList: function() {
        this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
      },
      fileClose: function() {
        this.fileOpen = false
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageIndex = 1
        this.getList()
      },
      familyQuery() {
        listTbMember(this.familyParams).then((res) => {
          this.familyResult = res.data.list
        })
      },
      addFamilyMember(item) {
        this.familyMember.push(item)
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加房屋信息'
        this.isEdit = false
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getHouse(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改房屋信息'
          this.isEdit = true
        })
        this.openMap();
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('确认导出所有数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportHouse(queryParams)
        }).then(response => {
          let headerKeys = Object.keys(this.excelHead) || [];
          let headerValues = Object.values(this.excelHead) || [];
          if (response.data.length) {
            const params = {
              title: headerValues,
              key: headerKeys,
              data: response.data,
              autoWidth: true,
              filename: "房屋列表" + fmtDate("Ymd", new Date()),
            };
            excel.export_array_to_excel(params);
          } else {
            this.$Message.error("暂无数据,无法导出");
          }
        }).catch(function(e) {
          console.log(e)
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        let that = this;
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateHouse(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg)
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addHouse(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg)
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        var Ids = (row.id && [row.id]) || this.ids

        this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delHouse({
            'ids': Ids
          })
        }).then((response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        }).catch(function() {})
      }
    }
  }
</script>
