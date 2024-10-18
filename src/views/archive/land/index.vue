
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini"
                          @click="handleQuery">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:tbLand:add']"
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:tbLand:edit']"
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                        >修改
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="tbLandList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                         <el-button
                           slot="reference"
                           v-permisaction="['admin:tbLand:edit']"
                           size="mini"
                           type="text"
                           icon="el-icon-edit"
                           @click="handleUpdate(scope.row)"
                         > 修改 </el-button>
                         <el-button
                           slot="reference"
                           v-permisaction="['admin:tbLand:remove']"
                           size="mini"
                           type="text"
                           icon="el-icon-delete"
                           @click="handleDelete(scope.row)"
                         > 删除 </el-button>
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
                    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                      <el-form-item label="户主" prop="holder">
                          <el-input v-model="form.holder" placeholder="户主" />
                      </el-form-item>
                      <el-form-item label="自留地" prop="selfLand">
                          <el-input v-model="form.selfLand" placeholder="自留地" />
                      </el-form-item>
                      <el-form-item label="1996年应得面积" prop="dueArea">
                          <el-input v-model="form.dueArea" placeholder="1996年应得面积" />
                      </el-form-item>
                      <el-form-item label="2023年实际面积" prop="actualArea">
                          <el-input v-model="form.actualArea" placeholder="2023年实际面积" />
                      </el-form-item>
                      <el-form-item label="2018年确权面积" prop="confirmedArea">
                          <el-input v-model="form.confirmedArea" placeholder="2018年确权面积" />
                      </el-form-item>
                      <el-form-item label="确权后被征用面积" prop="expropriatedArea">
                          <el-input v-model="form.expropriatedArea" placeholder="确权后被征用面积" />
                      </el-form-item>
                      <el-form-item label="流入面积" prop="inflowArea">
                          <el-input v-model="form.inflowArea" placeholder="流入面积" />
                      </el-form-item>
                      <el-form-item label="流出面积" prop="outflowArea">
                          <el-input v-model="form.outflowArea" placeholder="流出面积" />
                      </el-form-item>
                      <el-form-item label="承包面积" prop="contractedArea">
                          <el-input v-model="form.contractedArea" placeholder="承包面积" />
                      </el-form-item>
                      <el-form-item label="实际种植面积" prop="actualPlantingArea">
                          <el-input v-model="form.actualPlantingArea" placeholder="实际种植面积" />
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
    import {addTbLand, delTbLand, getTbLand, listTbLand, updateTbLand} from '@/api/archive/land'

    export default {
        name: 'TbLand',
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
                // 是否显示弹出层
                open: false,
                isEdit: false,
                // 类型数据字典
                typeOptions: [],
                tbLandList: [],

                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,

                },
                // 表单参数
                form: {
                },
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
                listTbLand(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.tbLandList = response.data.list
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
                    holder: undefined,
                    selfLand: undefined,
                    dueArea: undefined,
                    actualArea: undefined,
                    confirmedArea: undefined,
                    expropriatedArea: undefined,
                    inflowArea: undefined,
                    outflowArea: undefined,
                    contractedArea: undefined,
                    actualPlantingArea: undefined,
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
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset()
                const id =
                row.id || this.ids
                getTbLand(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改土地信息'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
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
            /** 删除按钮操作 */
            handleDelete(row) {
                var Ids = (row.id && [row.id]) || this.ids

                this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                      return delTbLand( { 'ids': Ids })
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
