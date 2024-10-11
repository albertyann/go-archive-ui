
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                  <el-form-item label="姓名" prop="name">
                    <el-input
                      v-model="queryParams.name"
                      placeholder="姓名"
                      clearable
                      size="small"
                      style="width: 120px"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="身份证" prop="idCard">
                    <el-input
                      v-model="queryParams.idCard"
                      placeholder="身份证"
                      clearable
                      size="small"
                      style="width: 180px"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="手机" prop="phone">
                    <el-input
                      v-model="queryParams.phone"
                      placeholder="手机"
                      clearable
                      size="small"
                      style="width: 120px"
                      @keyup.enter.native="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="性别" prop="gender">
                    <el-select v-model="queryParams.gender" size="small" style="width: 60px;">
                      <el-option label="男" value="男" />
                      <el-option label="女" value="女" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="年龄" prop="age">
                    <el-select v-model="queryParams.compare" size="small" style="width: 120px;" placeholder="比较">
                      <el-option label="等于" value="EQ" />
                      <el-option label="大于" value="G" />
                      <el-option label="大于等于" value="GE" />
                      <el-option label="小于" value="L" />
                      <el-option label="小于等于" value="LE" />
                    </el-select>
                    <el-input
                      v-model="queryParams.age"
                      placeholder="年龄"
                      clearable
                      size="small"
                      style="width: 80px"
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
                            v-permisaction="['admin:tbMember:add']"
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            v-permisaction="['admin:tbMember:edit']"
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
                                v-permisaction="['admin:tbMember:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="tbMemberList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
                    <el-table-column label="姓名" align="center" prop="name" />
                    <el-table-column label="性别" align="center" prop="gender" />
                    <el-table-column label="年龄" align="center" prop="age" />
                    <el-table-column label="身份证" align="center" prop="idCard" />
                    <el-table-column label="手机" align="center" prop="phone" width="140" />
                    <el-table-column label="婚姻状况" align="center" prop="married" />

                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                          <el-button
                            v-permisaction="['admin:tbMember:edit']"
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                          >详情
                          </el-button>
                          <el-button
                           v-permisaction="['admin:tbMember:edit']"
                           size="mini"
                           type="text"
                           icon="el-icon-edit"
                           @click="handleUpdate(scope.row)"
                         >修改
                         </el-button>
                         <el-popconfirm
                            class="delete-popconfirm"
                            title="确认要删除吗?"
                            confirm-button-text="删除"
                            @confirm="handleDelete(scope.row)"
                         >
                            <el-button
                              slot="reference"
                              v-permisaction="['admin:tbMember:remove']"
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
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageIndex"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                          <el-form-item label="名称" prop="name">
                              <el-input v-model="form.name" placeholder="名称" />
                          </el-form-item>
                          <el-form-item label="电话" prop="phone">
                              <el-input v-model="form.phone" placeholder="电话" />
                          </el-form-item>
                          <el-form-item label="性别" prop="gender">
                              <el-select v-model="form.gender" placeholder="请选择">
                                <el-option
                                  v-for="dict in sexOptions"
                                  :key="dict.value"
                                  :label="dict.label"
                                  :value="dict.label"
                                />
                              </el-select>
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
    import {addTbMember, delTbMember, getTbMember, listTbMember, updateTbMember} from '@/api/archive/member'

    export default {
        name: 'archiveMember',
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
                tbMemberList: [],
                sexOptions: [],

                // 关系表类型

                // 查询参数
                queryParams: {
                  name: '',
                  idCard: '',
                  phone: '',
                  gender: '',
                  compare: '',
                  age: '',
                  overSixty: 0,
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
            this.getList();
            this.getDicts('sys_user_sex').then(response => {
              this.sexOptions = response.data
            })
        },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listTbMember(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.tbMemberList = response.data.list
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
                name: undefined,
                phone: undefined,
                gender: undefined,
                createAt: undefined,
                updateAt: undefined,
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
                this.title = '添加人员信息'
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
                getTbMember(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改人员信息'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateTbMember(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addTbMember(this.form).then(response => {
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
                      return delTbMember( { 'ids': Ids })
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
