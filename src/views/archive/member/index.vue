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
                    <el-select v-model="queryParams.gender" size="small" style="width: 100px;" placeholder="">
                      <el-option label="" value="请选择" />
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
                    <el-col :span="1.5">
                      <el-button
                        v-permisaction="['archive:tbMember:export']"
                        type="primary"
                        size="mini"
                        @click="handleExport"
                      >导出</el-button>
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
                           v-permisaction="['archive:tbMember:edit']"
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
                <el-drawer
                  :title="title"
                  :visible.sync="open"
                  size="830px"
                >
                    <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名" clearable
                              :style="{width: '100%'}"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="性别" prop="gender">
                            <el-select v-model="form.gender" placeholder="请选择性别" :style="{width: '100%'}">
                              <el-option v-for="(item, index) in genderOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="身份证" prop="idCard">
                            <el-input v-model="form.idCard" placeholder="请输入身份证"
                              clearable
                              :style="{width: '100%'}"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="证件有效期">
                            <el-input
                              v-model="form.idCardStart"
                              :style="{width: '120px'}"></el-input>
                              <span> 至 </span>
                              <el-input
                                v-model="form.idCardEnd"
                                :style="{width: '130px'}"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row>
                          <el-col :span="8">
                            <el-form-item label="出生日期" prop="birthday">
                              <el-input v-model="form.birthday"
                               readonly clearable :style="{width: '100%'}">
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-form-item label=" 年龄" prop="age">
                              <el-input v-model="form.age" placeholder="年龄"
                                show-word-limit
                                readonly="readonly"
                                :style="{width: '100%'}"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8">
                            <el-form-item label="户籍类型" prop="hukouType">
                              <el-select v-model="form.hukouType" clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in hukouTypeOptions"
                                  :key="index" :label="item.label"
                                  :value="item.value" :disabled="item.disabled"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-form-item label="户籍分组" prop="hukouGroup">
                              <el-select v-model="form.hukouGroup" placeholder="请选择户籍分组" clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in hukouGroupOptions" :key="index" :label="item.label"
                                  :value="item.value" :disabled="item.disabled"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-form-item label="户籍编号" prop="hukouNo">
                              <el-input v-model="form.hukouNo"
                                :maxlength="5" show-word-limit clearable
                                :style="{width: '100%'}"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="是否户主" prop="isHolder">
                              <el-select v-model="form.isHolder" placeholder="请选择是否户主" clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in isHolderOptions"
                                  :key="index"
                                  :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="户主关系" prop="holderRelation">
                              <el-select v-model="form.holderRelation" placeholder="请选择户主关系" clearable
                                :style="{width: '100%'}">
                                <el-option v-for="(item, index) in holderRelationOptions"
                                  :key="index" :label="item.label"
                                  :value="item.value" :disabled="item.disabled"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>

                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="电话" prop="tel">
                            <el-input v-model="form.tel" placeholder="请输入电话" :maxlength="50" show-word-limit clearable
                              :style="{width: '100%'}"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="手机" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入手机" :maxlength="50" show-word-limit clearable
                              :style="{width: '100%'}"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="婚姻状况" prop="married">
                            <el-select v-model="form.married" placeholder="请选择婚姻状况" clearable :style="{width: '100%'}">
                              <el-option v-for="(item, index) in marriedOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="学历" prop="diploma">
                            <el-select v-model="form.diploma" placeholder="请选择学历" clearable :style="{width: '100%'}">
                              <el-option v-for="(item, index) in diplomaOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="残疾" prop="disability">
                            <el-select v-model="form.disability" placeholder="请选择残疾" clearable :style="{width: '100%'}">
                              <el-option v-for="(item, index) in disabilityOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="残障等级" prop="disabilityLevel">
                            <el-select v-model="form.disabilityLevel" placeholder="请选择残障等级" clearable
                              :style="{width: '100%'}">
                              <el-option v-for="(item, index) in disabilityLevelOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled">
                                </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="是否低保" prop="guarantee">
                            <el-select v-model="form.guarantee" placeholder="请选择是否低保" clearable :style="{width: '100%'}">
                              <el-option v-for="(item, index) in guaranteeOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="是否拆迁" prop="demolition">
                            <el-select v-model="form.demolition" placeholder="请选择是否拆迁" clearable :style="{width: '100%'}">
                              <el-option v-for="(item, index) in demolitionOptions"
                                :key="index" :label="item.label"
                                :value="item.value" :disabled="item.disabled">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-form-item label="服务处所" prop="employer">
                          <el-input v-model="form.workplace" placeholder="服务处所" :maxlength="100" show-word-limit
                            clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                        <el-form-item label="工作单位" prop="employer">
                          <el-input v-model="form.employer" placeholder="请输入工作单位" :maxlength="100" show-word-limit
                            clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                        <el-form-item label="养老保险" prop="pension">
                          <el-input v-model="form.pension" placeholder="请输入养老保险" :maxlength="100" show-word-limit clearable
                            :style="{width: '100%'}"></el-input>
                        </el-form-item>
                        <el-form-item label="医疗保险" prop="medicalInsurance">
                          <el-input v-model="form.medicalInsurance" placeholder="请输入医疗保险" :maxlength="100" show-word-limit
                            clearable :style="{width: '100%'}"></el-input>
                        </el-form-item>
                      </el-row>
                      </el-form>
                      <div class="demo-drawer__footer">
                        <el-button type="primary" @click="submitForm">确定</el-button>
                      </div>
                  </el-drawer>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
    import {
      addTbMember, delTbMember, getTbMember,
      listTbMember, updateTbMember, exportMember ,
    } from '@/api/archive/member'
    import { fmtDate } from '@/utils/index'
    import excel from "@/utils/excel";
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

              genderOptions: [{
                "label": "男",
                "value": "男"
              }, {
                "label": "女",
                "value": "女"
              }],
              isHolderOptions: [{
                "label": "否",
                "value": '0'
              }, {
                "label": "是",
                "value": '1'
              }],
              holderRelationOptions: [
                {label: '妻', value:'妻'},
                {label: '子', value:'子'},
                {label: '儿媳', value:'儿媳'},
                {label: '孙子', value:'孙子'},
                {label: '外孙子', value:'外孙子'},
                {label: '女婿', value:'女婿'},
                {label: '女', value:'女'},
                {label: '本人', value:'本人'},
                {label: '母亲', value:'母亲'},
                {label: '孙女', value:'孙女'},
                {label: '父亲', value:'父亲'},
                {label: '次女', value:'次女'},
                {label: '外孙女', value:'外孙女'},
                {label: '非亲属', value:'非亲属'},
                {label: '曾(外)孙子', value:'曾(外)孙子'},
                {label: '孙(外孙)女婿', value:'孙(外孙)女婿'},
                {label: '长子', value:'长子'},
                {label: '孙(外孙)媳妇', value:'孙(外孙)媳妇'},
                {label: '其他亲属', value:'其他亲属'},
                {label: '夫', value:'夫'},
                {label: '其他儿子', value:'其他儿子'},
                {label: '长女', value:'长女'},
                {label: '养女或继女', value:'养女或继女'},
                {label: '其他(外)孙子(女)', value:'其他(外)孙子(女)'},
                {label: '养子或继子', value:'养子或继子'},
                {label: '岳母', value:'岳母'},
                {label: '孙(外孙)子(女)', value:'孙(外孙)子(女)'},
                {label: '次子', value:'次子'},
                {label: '外甥女', value:'外甥女'},
                {label: '妹妹', value:'妹妹'},
                {label: '外甥', value:'外甥'},
                {label: '曾(外)孙女', value:'曾(外)孙女'},
                {label: '婆婆', value:'婆婆'},
                {label: '小集体户主', value:'小集体户主'},
                {label: '姐姐', value:'姐姐'},
                {label: '三女', value:'三女'},
                {label: '丈夫', value:'丈夫'},
                {label: '祖母', value:'祖母'},
                {label: '弟', value:'弟'},
              ],
              hukouTypeOptions: [{
                "label": "农业户口",
                "value": "农业户口"
              }, {
                "label": "城镇户口",
                "value": "城镇户口"
              }],
              hukouGroupOptions: [{
                "label": "选项一",
                "value": 1
              }, {
                "label": "选项二",
                "value": 2
              }],
              marriedOptions: [{
                "label": "已婚",
                "value": "已婚"
              }, {
                "label": "未婚",
                "value": "未婚"
              }],
              diplomaOptions: [{
                "label": "拆迁",
                "value": "拆迁"
              }, {
                "label": "非拆迁",
                "value": "非拆迁"
              }],
              disabilityOptions: [{
                "label": "是",
                "value": "是"
              }, {
                "label": "否",
                "value": "否"
              }],
              disabilityLevelOptions: [{
                "label": "一级",
                "value": "一级"
              }, {
                "label": "二级",
                "value": "二级",
              }, {
                "label": "三级",
                "value": "三级",
              }, {
                "label": "四级",
                "value": "四级"
              }],
              guaranteeOptions: [{
                "label": "是",
                "value": "是"
              }, {
                "label": "否",
                "value": "否"
              }],
              demolitionOptions: [{
                "label": "拆迁",
                "value": "拆迁"
              }, {
                "label": "非拆迁",
                "value": "非拆迁"
              }],

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
              rules: {},
              excelHead: {
                'id': '序号',
                'name': '姓名',
                'gender': '性别',
                'age' : '年龄',
                'idCard' : '身份证',
                'tel': '电话',
                'phone': '手机',
                'married': '婚姻状况',
                'pension': '养老保险',
                'medicalInsurance': '医疗保险'
              }
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
                  gender: undefined,
                  idCard: undefined,
                  idCardStart: null,
                  birthday: undefined,
                  age: undefined,
                  isHolder: 1,
                  holderRelation: undefined,
                  hukouType: undefined,
                  hukouGroup: undefined,
                  hukouNo: undefined,
                  tel: undefined,
                  phone: undefined,
                  married: undefined,
                  diploma: undefined,
                  disability: undefined,
                  disabilityLevel: undefined,
                  guarantee: undefined,
                  demolition: undefined,
                  employer: undefined,
                  pension: undefined,
                  medicalInsurance: undefined,
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
            /** 导出按钮操作 */
            handleExport() {
              const queryParams = this.queryParams
              this.$confirm('确认导出所有数据?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(function() {
                return exportMember(queryParams)
              }).then(response => {
                let headerKeys = Object.keys(this.excelHead) || [];
                let headerValues = Object.values(this.excelHead) || [];
                if (response.data.length) {
                    const params = {
                        title: headerValues,
                        key: headerKeys,
                        data: response.data,
                        autoWidth: true,
                        filename: "户籍人员信息_" + fmtDate("Ymd", new Date()),
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
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.id !== undefined) {
                          delete this.form.age
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
