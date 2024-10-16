
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
                                v-permisaction="['admin:tbHouse:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:tbHouse:edit']"
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
                                v-permisaction="['admin:tbHouse:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="tbHouseList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/>
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
                             v-permisaction="['admin:tbHouse:edit']"
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
                              v-permisaction="['admin:tbHouse:remove']"
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
                        
                                    <el-form-item label="地址" prop="address">
                                        <el-input v-model="form.address" placeholder="地址"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="建筑面积" prop="area">
                                        <el-input v-model="form.area" placeholder="建筑面积"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="楼层" prop="floor">
                                        <el-input v-model="form.floor" placeholder="楼层"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="建造年份" prop="buildPeriod">
                                        <el-input v-model="form.buildPeriod" placeholder="建造年份"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="房屋状态" prop="status">
                                        <el-input v-model="form.status" placeholder="房屋状态"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="经度" prop="longitude">
                                        <el-input v-model="form.longitude" placeholder="经度"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="纬度" prop="latitude">
                                        <el-input v-model="form.latitude" placeholder="纬度"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="户口编号" prop="hukouNo">
                                        <el-input v-model="form.hukouNo" placeholder="户口编号"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="户口分组" prop="hukouGroup">
                                        <el-input v-model="form.hukouGroup" placeholder="户口分组"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="户主" prop="holder">
                                        <el-input v-model="form.holder" placeholder="户主"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="户主电话" prop="holderPhone">
                                        <el-input v-model="form.holderPhone" placeholder="户主电话"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="建筑结构" prop="structType">
                                        <el-input v-model="form.structType" placeholder="建筑结构"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="建造方式" prop="buildMethod">
                                        <el-input v-model="form.buildMethod" placeholder="建造方式"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="房屋土地性质" prop="landNature">
                                        <el-input v-model="form.landNature" placeholder="房屋土地性质"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="房屋用途" prop="usage">
                                        <el-input v-model="form.usage" placeholder="房屋用途"
                                                      />
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
    import {addTbHouse, delTbHouse, getTbHouse, listTbHouse, updateTbHouse} from '@/api/admin/tb-house'
    
    export default {
        name: 'TbHouse',
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
                tbHouseList: [],
                
                // 关系表类型
                
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
                listTbHouse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.tbHouseList = response.data.list
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
                buildPeriod: undefined,
                status: undefined,
                longitude: undefined,
                latitude: undefined,
                hukouNo: undefined,
                hukouGroup: undefined,
                holder: undefined,
                holderPhone: undefined,
                structType: undefined,
                buildMethod: undefined,
                landNature: undefined,
                usage: undefined,
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
                this.title = '添加TbHouse'
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
                getTbHouse(id).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改TbHouse'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                            updateTbHouse(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess(response.msg)
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addTbHouse(this.form).then(response => {
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
                      return delTbHouse( { 'ids': Ids })
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
