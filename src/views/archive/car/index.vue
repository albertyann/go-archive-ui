<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="车牌" prop="carNo">
            <el-input v-model="queryParams.carNo" placeholder="车牌" clearable size="small" style="width: 160px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="车主" prop="ownerName">
            <el-input v-model="queryParams.ownerName" placeholder="车主" clearable size="small" style="width: 160px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="电话" prop="ownerPhone">
            <el-input v-model="queryParams.ownerPhone" placeholder="电话" clearable size="small" style="width: 160px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['admin:tbCar:add']" type="primary" icon="el-icon-plus" size="mini"
              @click="handleAdd">新增
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="tbCarList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="车牌" align="center" prop="carNo" />
          <el-table-column label="车主" align="center" prop="ownerName" />
          <el-table-column label="联系电话" align="center" prop="ownerPhone" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button slot="reference" v-permisaction="['admin:tbCar:edit']" size="mini" type="text"
                icon="el-icon-edit" @click="handleUpdate(scope.row)">修改
              </el-button>
              <el-button slot="reference" v-permisaction="['admin:tbCar:remove']" size="mini" type="text"
                icon="el-icon-delete" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="车牌" prop="carNo">
              <el-input v-model="form.carNo" placeholder="车牌" />
            </el-form-item>
            <el-form-item label="落户时间" prop="registerTime">
              <el-date-picker v-model="form.registerTime" type="date" placeholder="落户时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车主" prop="ownerName">
              <el-input v-model="form.ownerName" placeholder="车主" />
            </el-form-item>
            <el-form-item label="车主电话" prop="ownerPhone">
              <el-input v-model="form.ownerPhone" placeholder="车主电话" />
            </el-form-item>
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
    addTbCar,
    delTbCar,
    getTbCar,
    listTbCar,
    updateTbCar
  } from '@/api/archive/car'
  export default {
    name: 'archiveCar',
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
        tbCarList: [],

        // 查询参数
        queryParams: {
          carNo: '',
          ownerName: '',
          ownerPhone: '',
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
        listTbCar(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.tbCarList = response.data.list
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
          carNo: undefined,
          registerTime: undefined,
          ownerName: undefined,
          ownerPhone: undefined,
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
        this.title = '添加车辆信息'
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
        getTbCar(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改车辆信息'
          this.isEdit = true
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateTbCar(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess(response.msg)
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addTbCar(this.form).then(response => {
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

        this.$confirm('是否确认删除"' + row.carNo + '"?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delTbCar({
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
