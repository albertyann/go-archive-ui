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
            <el-button v-permisaction="['admin:hmFarmerLand:add']" type="primary" icon="el-icon-plus" size="mini"
              @click="handleAdd">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:hmFarmerLand:edit']" type="success" icon="el-icon-edit" size="mini"
              :disabled="single" @click="handleUpdate">修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:hmFarmerLand:remove']" type="danger" icon="el-icon-delete" size="mini"
              :disabled="multiple" @click="handleDelete">删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="hmFarmerLandList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="农户姓名" align="center" prop="farmerName" />
          <el-table-column label="1996年人口数" align="center" prop="population" />
          <el-table-column label="独生子女数" align="center" prop="childrenCount" />
          <el-table-column label="自留地" align="center" prop="selfLand" />
          <el-table-column label="宅地" align="center" prop="homestead" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button slot="reference" v-permisaction="['admin:contract:edit']" size="mini" type="text"
                icon="el-icon-edit" @click="handleUpdate(scope.row)">修改
              </el-button>
              <el-button slot="reference" v-permisaction="['admin:contract:remove']" size="mini" type="text"
                icon="el-icon-delete" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="900px">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="农户姓名" prop="farmerName">
                    <el-input v-model="form.farmerName" placeholder="农户姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="1996年人口数" prop="population1996">
                    <el-input-number v-model="form.population" style="width: 100px;" placeholder="1996年人口数" controls-position="right" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="独生子女数" prop="childrenCount">
                    <el-input-number v-model="form.childrenCount" style="width: 100px;" placeholder="独生子女数" controls-position="right" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="自留地面积" prop="selfLand">
                    <el-input v-model="form.selfLand" placeholder="自留地面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="宅地面积" prop="homestead">
                    <el-input v-model="form.homestead" placeholder="宅地面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其他面积" prop="otherArea">
                    <el-input v-model="form.otherArea" placeholder="其他面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="form.remarks" placeholder="备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="实际座园地(m²)" prop="actualArea">
                      <table>
                        <tr>
                          <th>面积</th>
                          <th>长 x 宽</th>
                          <th>是否流转</th>
                          <th>备注</th>
                        </tr>
                        <tr>
                          <td><el-input v-model="form.actualArea" placeholder="面积" style="width:60px" /></td>
                          <td>
                            <el-input v-model="form.actualLength" placeholder="长" style="width:60px" />
                            <el-input v-model="form.actualWidth" placeholder="宽" style="width:60px" />
                            <el-button size="small" type="primary" circle style="margin-left: 3px;">=</el-button>
                          </td>
                          <td>
                            <el-select v-model="form.actualFlow" placeholder="是否流转" style="width:80px">
                              <el-option label="否" value="0" />
                              <el-option label="是" value="1" />
                            </el-select>
                          </td>
                          <td>
                            <el-input v-model="form.actualRemarks" placeholder="备注"  style="width:200px" />
                          </td>
                        </tr>
                      </table>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="人口田面积(m²)" prop="personArea">
                    <table>
                      <tr>
                        <th>面积</th>
                        <th>长 x 宽</th>
                        <th>是否流转</th>
                        <th>备注</th>
                      </tr>
                      <tr>
                        <td><el-input v-model="form.personArea" placeholder="面积" style="width:60px" /></td>
                        <td>
                          <el-input v-model="form.personLength" placeholder="长" style="width:60px" />
                          <el-input v-model="form.personWidth" placeholder="宽" style="width:60px" />
                          <el-button size="small" type="primary" circle style="margin-left: 3px;">=</el-button>
                        </td>
                        <td>
                          <el-select v-model="form.personFlow" placeholder="是否流转" style="width:80px">
                            <el-option label="否" value="0" />
                            <el-option label="是" value="1" />
                          </el-select>
                        </td>
                        <td>
                          <el-input v-model="form.personRemarks" placeholder="备注"  style="width:200px" />
                        </td>
                      </tr>
                    </table>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col span="24">
                  <el-form-item label="承包地面积(m²)" prop="personRemarks">
                    <table>
                      <tr>
                        <th></th>
                        <th>面积</th>
                        <th>长 x 宽</th>
                        <th>是否流转</th>
                        <th>备注</th>
                        <th></th>
                      </tr>
                      <tr>
                        <td><span style="margin: 0 0px;">1</span></td>
                        <td><el-input v-model="form.personRemarks" placeholder="面积" style="width:60px" /></td>
                        <td>
                          <el-input v-model="form.personLength" placeholder="长" style="width:60px" />
                          <el-input v-model="form.personWidth" placeholder="宽" style="width:60px" />
                          <el-button size="small" type="primary" circle style="margin-left: 3px;">=</el-button>
                        </td>
                        <td>
                          <el-select v-model="form.personFlow" placeholder="是否流转" style="width:80px">
                            <el-option label="否" value="0" />
                            <el-option label="是" value="1" />
                          </el-select>
                        </td>
                        <td>
                          <el-input v-model="form.personRemarks" placeholder="备注"  style="width:200px" />
                        </td>
                        <td>
                          <!-- <el-button type="default" icon="el-icon-plus" circle size="small"></el-button> -->
                        </td>
                      </tr>
                    </table>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="box-card" shadow="never">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="权证面积" prop="certificateArea">
                    <el-input v-model="form.certificateArea" placeholder="权证面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合计承包地面积" prop="totalContractedArea">
                    <el-input v-model="form.totalContractedArea" placeholder="合计承包地面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合计土地面积" prop="totalLandArea">
                    <el-input v-model="form.totalLandArea" placeholder="合计土地面积(m²)" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="土地使用面积" prop="totalUsedArea">
                    <el-input v-model="form.totalUsedArea" placeholder="土地使用面积(m²)" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="失地人数" prop="lostLandPerson">
                    <el-input-number v-model="form.lostLandPerson" placeholder="失地人数" controls-position="right" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="失地备注" prop="lostLandRemarks">
                    <el-input type="textarea" v-model="form.lostLandRemarks" placeholder="失地备注" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
  import {
    addFarmerLand,
    delFarmerLand,
    getFarmerLand,
    listFarmerLand,
    updateFarmerLand
  } from '@/api/archive/field'

  export default {
    name: 'FarmerLand',
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
        // 是否显示弹出层
        open: false,
        isEdit: false,
        // 类型数据字典
        typeOptions: [],
        hmFarmerLandList: [],

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
      this.getList()
    },
    methods: {
      /** 查询参数列表 */
      getList() {
        this.loading = true
        listFarmerLand(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.hmFarmerLandList = response.data.list
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
          farmerName: undefined,
          population1996: undefined,
          childrenCount: undefined,
          selfLand: undefined,
          homestead: undefined,
          otherArea: undefined,
          remarks: undefined,
          actualArea: undefined,
          actualLength: undefined,
          actualWidth: undefined,
          actualRemarks: undefined,
          actualFlow: undefined,
          personArea: undefined,
          personLength: undefined,
          personWidth: undefined,
          personRemarks: undefined,
          personFlow: undefined,
          certificateArea: undefined,
          totalContractedArea: undefined,
          totalLandArea: undefined,
          totalUsedArea: undefined,
          lostLandPerson: undefined,
          lostLandRemarks: undefined,
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
        this.title = '添加农户土地信息表'
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
        const id =
          row.id || this.ids
        getFarmerLand(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改农户土地信息表'
          this.isEdit = true
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateFarmerLand(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg)
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addFarmerLand(this.form).then(response => {
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
          return delFarmerLand({
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
