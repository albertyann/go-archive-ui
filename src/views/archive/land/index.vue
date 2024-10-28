<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="户主姓名" prop="holder">
            <el-input v-model="queryParams.holder" placeholder="户主姓名" clearable size="small" style="width: 160px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:tbLand:add']" type="primary" icon="el-icon-plus" size="mini"
              @click="handleAdd">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:tbLand:export']" type="primary" icon="el-icon-download" size="mini"
              @click="handleExport">导出
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="tbLandList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="户主" align="center" prop="holder" />
          <el-table-column label="自留地" align="center" prop="selfLand" />
          <el-table-column label="应得面积" align="center" prop="dueArea" />
          <el-table-column label="实际面积" align="center" prop="actualArea" />
          <el-table-column label="确权面积" align="center" prop="confirmedArea" />
          <el-table-column label="征用面积" align="center" prop="expropriatedArea" />
          <el-table-column label="流入面积" align="center" prop="inflowArea" />
          <el-table-column label="流出面积" align="center" prop="outflowArea" />
          <el-table-column label="承包面积" align="center" prop="contractedArea" />
          <el-table-column label="实际种植面积" align="center" prop="actualPlantingArea" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
            <template slot-scope="scope">
              <el-button slot="reference" v-permisaction="['admin:tbLand:edit']" size="mini" type="text"
                icon="el-icon-document" @click="handleDetail(scope.row)"> 查看 </el-button>
              <el-button slot="reference" v-permisaction="['admin:tbLand:edit']" size="mini" type="text"
                icon="el-icon-edit" @click="handleUpdate(scope.row)"> 修改 </el-button>
              <el-button slot="reference" v-permisaction="['admin:tbLand:remove']" size="mini" type="text"
                icon="el-icon-delete" @click="handleDelete(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-col :span="12">
              <el-form-item label="户主" prop="holder">
                <el-input v-model="form.holder" placeholder="户主" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自留地" prop="selfLand">
                <el-input-number v-model="form.selfLand" placeholder="自留地" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="1996年应得面积" prop="dueArea">
                <el-input-number v-model="form.dueArea" placeholder="1996年应得面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="2023年实际面积" prop="actualArea">
                <el-input-number v-model="form.actualArea" placeholder="2023年实际面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="2018年确权面积" prop="confirmedArea">
                <el-input-number v-model="form.confirmedArea" placeholder="2018年确权面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确权后被征用面积" prop="expropriatedArea">
                <el-input-number v-model="form.expropriatedArea" placeholder="确权后被征用面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流入面积" prop="inflowArea">
                <el-input-number v-model="form.inflowArea" placeholder="流入面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流出面积" prop="outflowArea">
                <el-input-number v-model="form.outflowArea" placeholder="流出面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承包面积" prop="contractedArea">
                <el-input-number v-model="form.contractedArea" placeholder="承包面积" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际种植面积" prop="actualPlantingArea">
                <el-input-number v-model="form.actualPlantingArea" placeholder="实际种植面积" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 查看对话框 -->
        <el-dialog title="查看详情" :visible.sync="detailDialogShow" width="800px">
          <el-form ref="form" :model="detail" label-width="140px">
            <el-col :span="12">
              <el-form-item label="户主" prop="holder">
                <span>{{ detail.holder }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自留地" prop="selfLand">
                <span>{{ detail.selfLand }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="1996年应得面积" prop="dueArea">
                <span>{{ detail.dueArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="2023年实际面积" prop="actualArea">
                <span>{{ detail.actualArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="2018年确权面积" prop="confirmedArea">
                <span>{{ detail.confirmedArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确权后被征用面积" prop="expropriatedArea">
                <span>{{ detail.expropriatedArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流入面积" prop="inflowArea">
                <span>{{ detail.inflowArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流出面积" prop="outflowArea">
                <span>{{ detail.outflowArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="承包面积" prop="contractedArea">
                <span>{{ detail.contractedArea }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际种植面积" prop="actualPlantingArea">
                <span>{{ detail.actualPlantingArea }}</span>
              </el-form-item>
            </el-col>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailDialogShow=false">关 闭</el-button>
          </div>
        </el-dialog>

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
  import {
    addTbLand,
    delTbLand,
    getTbLand,
    listTbLand,
    updateTbLand,
    exportLand
  } from '@/api/archive/land'
  import excel from "@/utils/excel";
  import {
    fmtDate
  } from '@/utils/index'
  export default {
    name: 'TbLand',
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
        detailDialogShow: false,
        detail: {},
        isEdit: false,
        // 类型数据字典
        typeOptions: [],
        tbLandList: [],

        // 查询参数
        queryParams: {
          holder: "",
          pageIndex: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 导出表头信息
        excelHead: {
          'id': 'ID',
          'holder': '户主',
          'selfLand': '自留地',
          'dueArea': '1996年应得面积',
          'actualArea': '2023年实际面积',
          'confirmedArea': '2018年确权面积',
          'expropriatedArea': '确权后被征用面积',
          'inflowArea': '流入面积',
          'outflowArea': '流出面积',
          'contractedArea': '承包面积',
          'actualPlantingArea': '实际种植面积',
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询参数列表 */
      getList() {
        this.loading = true
        listTbLand(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.tbLandList = response.data.list
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
          id: 0,
          holder: '',
          selfLand: 0,
          dueArea: 0,
          actualArea: 0,
          confirmedArea: 0,
          expropriatedArea: 0,
          inflowArea: 0,
          outflowArea: 0,
          contractedArea: 0,
          actualPlantingArea: 0,
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
        this.title = '添加土地信息'
        this.isEdit = false
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      handleDetail(row) {
        getTbLand(row.id).then(response => {
          this.detail = response.data
          this.detailDialogShow = true
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getTbLand(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改土地信息'
          this.isEdit = true
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateTbLand(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg)
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addTbLand(this.form).then(response => {
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
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('确认导出所有数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportLand(queryParams)
        }).then(response => {
          let headerKeys = Object.keys(this.excelHead) || [];
          let headerValues = Object.values(this.excelHead) || [];
          if (response.data.length) {
            const params = {
              title: headerValues,
              key: headerKeys,
              data: response.data,
              autoWidth: true,
              filename: "土地信息" + fmtDate("Ymd", new Date()),
            };
            excel.export_array_to_excel(params);
          } else {
            this.$Message.error("暂无数据,无法导出");
          }
        }).catch(function(e) {
          console.log(e)
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
          return delTbLand({
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
