
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="合同名称" prop="contractTitle">
                      <el-input
                        v-model="queryParams.contractTitle"
                        placeholder="合同名称"
                        clearable
                        size="small"
                        style="width: 160px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="甲方" prop="partyA">
                      <el-input
                        v-model="queryParams.partyA"
                        placeholder="甲方"
                        clearable
                        size="small"
                        style="width: 160px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="乙方" prop="partyB">
                      <el-input
                        v-model="queryParams.partyB"
                        placeholder="乙方"
                        clearable
                        size="small"
                        style="width: 160px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:contract:add']"
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                        > 新增 </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:contract:edit']"
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                        > 修改 </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:contract:remove']"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                        > 删除 </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="合同编号" align="center" prop="contractNumber" />
                    <el-table-column label="合同标题" align="center" prop="contractTitle" />
                    <el-table-column label="合同状态" align="center" prop="status" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <el-button
                           slot="reference"
                           v-permisaction="['admin:contract:edit']"
                           size="mini"
                           type="text"
                           icon="el-icon-edit"
                           @click="handleUpdate(scope.row)"
                         >修改
                         </el-button>
                         <el-button
                           slot="reference"
                           v-permisaction="['admin:contract:remove']"
                           size="mini"
                           type="text"
                           icon="el-icon-delete"
                           @click="handleDelete(scope.row)"
                         >删除
                         </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                  v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageIndex"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="800px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                        <el-form-item label="合同编号" prop="contractNumber" required>
                            <el-input v-model="form.contractNumber" placeholder="合同编号" />
                        </el-form-item>
                        <el-form-item label="合同标题" prop="contractTitle" required>
                            <el-input v-model="form.contractTitle" placeholder="合同标题" />
                        </el-form-item>
                        <el-form-item label="合同类型" prop="contractType">
                          <el-select
                            v-model="form.contractType"
                            placeholder="合同类型"
                            clearable
                          >
                          <el-option
                            v-for="dict in typeOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                          />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="甲方" prop="partyA">
                            <el-input v-model="form.partyA" placeholder="甲方" required />
                        </el-form-item>
                        <el-form-item label="乙方" prop="partyB">
                            <el-input v-model="form.partyB" placeholder="乙方" required />
                        </el-form-item>
                       <el-form-item label="合同生效日期" prop="effectiveDate" required>
                            <el-date-picker
                              v-model="form.effectiveDate"
                              type="date"
                              placeholder="合同生效日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同到期日期" prop="expiryDate">
                            <el-date-picker
                              v-model="form.expiryDate"
                              type="date"
                              placeholder="合同到期日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同状态" prop="status">
                          <el-select
                            v-model="form.status"
                            placeholder="合同状态"
                            clearable
                          >
                          <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                          />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="附件" prop="sys_app_logo">
                            <el-upload ref="sys_app_logo"
                              :headers="headers"
                              :file-list="fileList"
                              accept="image/png, image/jpeg"
                              :action="sys_app_logoAction" style="float:left"
                              :before-upload="sys_app_logoBeforeUpload"
                              list-type="picture-card"
                              :show-file-list="true"
                              :on-success="uploadSuccess">
                              <i class="el-icon-plus" />
                            </el-upload>
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
    import {addContract, delContract, getContract, listContract, updateContract} from '@/api/admin/contract'
    import { getToken } from '@/utils/auth'
    export default {
        name: 'Contract',
        components: {
        },
        data() {
            return {
                headers: { 'Authorization': 'Bearer ' + getToken() },
                sys_app_logoAction: process.env.VUE_APP_BASE_API + '/api/v1/public/uploadFile',
                fileList: [],
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
                contractList: [],
                statusOptions: [
                  { "value": "草稿", "label": "草稿" },
                  { "value": "审批中", "label": "审批中" },
                  { "value": "生效", "label": "生效" },
                  { "value": "到期", "label": "到期" },
                  { "value": "终止", "label": "终止" },
                ],
                typeOptions: [
                  { "value": "租房合同", "label": "租房合同" },
                  { "value": "租地合同", "label": "租地合同" },
                  { "value": "销售合同", "label": "销售合同" },
                ],

                // 关系表类型

                // 查询参数
                queryParams: {
                    contractTitle: '',
                    partyA: '',
                    partyB: '',
                    pageIndex: 1,
                    pageSize: 10,
                },
                // 表单参数
                form: {
                  files:[]
                },
                // 表单校验
                rules: {}
        }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true
                listContract(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.contractList = response.data.list
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
                    contractNumber: undefined,
                    contractTitle: undefined,
                    contractType: undefined,
                    partyA: undefined,
                    partyB: undefined,
                    effectiveDate: undefined,
                    expiryDate: undefined,
                    status: undefined,
                    files: []
                }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            sys_app_logoBeforeUpload(file) {
              const isRightSize = file.size / 1024 / 1024 < 2
              if (!isRightSize) {
                this.$message.error('文件大小超过 2MB')
              }
              return isRightSize
            },
            uploadSuccess(response, file, fileList) {
              let image_path = response.data.full_path
              this.form.files.push(image_path)
              // console.log(this.form.files)
            },
            // 文件
            handleQuery() {
                this.queryParams.pageIndex = 1
                this.getList()
            },
            resetQuery() {
                this.dateRange = []
                this.resetForm('queryForm')
                this.handleQuery()
            },
            handleAdd() {
                this.reset()
                this.open   = true
                this.title  = '添加Contract'
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
                getContract(id).then(response => {
                    this.form   = response.data
                    this.open   = true
                    this.title  = '修改Contract'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateContract(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.fileList = []
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addContract(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.fileList = []
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
                      return delContract( { 'ids': Ids })
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
