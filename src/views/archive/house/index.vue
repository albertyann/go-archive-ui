
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                      <el-button
                        v-permisaction="['archive:house:add']"
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                      >新增
                      </el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button
                        v-permisaction="['archive:house:edit']"
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                      >修改
                      </el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button
                        v-permisaction="['archive:house:remove']"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                      >删除
                      </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="houseList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="地址" align="center" prop="address" >
                      <template slot-scope="scope">
                        <span>{{ scope.row.address }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="建筑面积" align="center" prop="area" />
                    <el-table-column label="房屋状态" align="center" prop="status" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <el-popconfirm
                           class="delete-popconfirm"
                           title="确认要修改吗?"
                           confirm-button-text="修改"
                           @confirm="handleUpdate(scope.row)"
                         >
                           <el-button
                             slot="reference"
                             v-permisaction="['archive:house:edit']"
                             size="mini"
                             type="text"
                             icon="el-icon-edit"
                           >修改
                           </el-button>
                         </el-popconfirm>
                         <el-popconfirm
                            class="delete-popconfirm"
                            title="确认要删除吗?"
                            confirm-button-text="删除"
                            @confirm="handleDelete(scope.row)"
                         >
                            <el-button
                              slot="reference"
                              v-permisaction="['archive:house:remove']"
                              size="mini"
                              type="text"
                              icon="el-icon-delete"
                            >删除
                            </el-button>
                         </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                  v-show="total > 0"
                  :total="total"
                  :page.sync="queryParams.pageIndex"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-drawer
                  :title="title"
                  :visible.sync="open"
                  size="830px"
                >
                    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                        <el-form-item label="基础地址" prop="address">
                          <el-input v-model="base_address" placeholder="基础地址"/>
                        </el-form-item>
                        <el-form-item label="门牌号" prop="address">
                          <el-input v-model="form.doorNumber" placeholder="门牌号"/>
                        </el-form-item>
                        <el-form-item label="建筑面积" prop="area">
                          <el-input v-model="form.area" placeholder="建筑面积"/>
                        </el-form-item>
                        <el-form-item label="楼层" prop="floor">
                          <el-input v-model="form.floor" placeholder="楼层"/>
                        </el-form-item>
                        <el-form-item label="建造年份" prop="buildYear">
                          <el-input v-model="form.buildYear" placeholder="建造年份"/>
                        </el-form-item>
                        <el-form-item label="地图标注" prop="buildYear">
                          <div id="mapDiv" style="width: 400px; height: 400px;"></div>
                        </el-form-item>
                        <el-form-item label="房屋状态" prop="status">
                          <el-select
                            v-model="form.status"
                            placeholder="房屋状态"
                            clearable
                            size="small"
                            style="width: 160px"
                          >
                          <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                          />
                          </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-drawer>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
    import {addHouse, delHouse, getHouse, listHouse, updateHouse} from '@/api/archive/house';
    import { getConfigKey } from '@/api/admin/sys-config';
    export default {
        name: 'archiveHouse',
        components: {
        },
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
            isEdit: false,
            // 类型数据字典
            typeOptions: [],
            statusOptions: [
              {
                "value": "正常",
                "label": "正常",
              },
              {
                "value": "危房",
                "label": "危房",
              }
            ],
            houseList: [],

            // 关系表类型

            // 查询参数
            queryParams: {
                pageIndex: 1,
                pageSize: 10,

            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {}
          }
        },
        created() {
          this.getList();
          this.baseConf();
        },
        mounted() {
          const script = document.createElement('script');
          script.type  = 'text/javascript';
          script.src   = `http://api.tianditu.gov.cn/api?v=4.0&tk=cbfe568d6062fdbb2efca8c9ea29d32b`;
          document.head.appendChild(script);
        },
        methods: {
          initMap() {
            const imageURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
                            "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
                            "&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                            "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=cbfe568d6062fdbb2efca8c9ea29d32b";
            let lay = new T.TileLayer(imageURL, {minZoom: 1, maxZoom: 18});
            var config = {layers: [lay]};
            let map = new T.Map('mapDiv', config);
            map.centerAndZoom(new T.LngLat(120.421980,30.299160), 18);

            // getConfigKey('base_location').then(res => {
            //   let val = res.data.configValue;
            //   let latlng = val.split(',');

            // })
          },
          baseConf() {
            getConfigKey('base_address').then(res => {
              this.base_address = res.data.configValue
            });
          },
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listHouse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.houseList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
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
                doorNumber: undefined,
              }
              this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            // 关系
            // 文件
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageIndex = 1
                this.getList()
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
                    this.form   = response.data
                    this.open   = true
                    this.title  = '修改房屋信息'
                    this.isEdit = true

                    this.initMap()
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                let that = this;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                      this.form.address = that.base_address + this.form.doorNumber;
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
              }).then(function () {
                return delHouse( { 'ids': Ids })
              }).then((response) => {
               if (response.code === 200) {
                 this.msgSuccess(response.msg)
                 this.open = false
                 this.getList()
               } else {
                 this.msgError(response.msg)
               }
              }).catch(function () {
              })
            }
        }
    }
</script>
