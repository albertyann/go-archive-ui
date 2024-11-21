<template>
  <el-drawer title="详情" :visible="openView" size="830px">
    <el-form ref="form" :model="detail" size="medium" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <span>{{ detail.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="gender">
            <span>{{ detail.gender }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证" prop="idCard">
            <span>{{ detail.idCard }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件有效期">
            <span>{{ detail.idCardStart }}</span> 至 <span>{{ detail.idCardEnd }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <span>{{ detail.birthday }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label=" 年龄" prop="age">
              <span>{{ detail.age }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="户籍类型" prop="hukouType">
            <span>{{ detail.hukouType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="户籍分组" prop="hukouGroup">
            <span>{{ detail.hukouGroup }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="户籍编号" prop="hukouNo">
            <span>{{ detail.hukouNo }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否户主" prop="isHolder">
            <span>{{ detail.isHolder == 1 ? '是' : '否' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户主关系" prop="holderRelation">
            <span>{{ detail.holderRelation }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="电话" prop="tel">
              <span>{{ detail.tel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机" prop="phone">
            <span>{{ detail.phone }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="婚姻状况" prop="married">
            <span>{{ detail.married }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历" prop="diploma">
            <span>{{ detail.diploma }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="残疾" prop="disability">
            <span>{{ detail.disability }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="残障等级" prop="disabilityLevel">
            <span>{{ detail.disabilityLevel }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否低保" prop="guarantee">
            <span>{{ detail.guarantee }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否拆迁" prop="demolition">
            <span>{{ detail.demolition }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="服务处所" prop="employer">
          <span>{{ detail.workplace }}</span>
        </el-form-item>
        <el-form-item label="工作单位" prop="employer">
          <span>{{ detail.employer }}</span>
        </el-form-item>
        <el-form-item label="养老保险" prop="pension">
            <span>{{ detail.pension }}</span>
        </el-form-item>
        <el-form-item label="医疗保险" prop="medicalInsurance">
          <span>{{ detail.medicalInsurance }}</span>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="demo-drawer__footer">
      <el-button type="primary" @click="closeView">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
  import {
    getTbMember
  } from '@/api/archive/member'
  export default {
    name: 'residentDetail',
    components: {},
    props: {
      openView: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        open: true,
        detail: {},
      }
    },
    created() {
      this.getDetail();
    },
    methods: {
      getDetail() {
        this.loading = true
        getTbMember(1).then(response => {
          this.detail = response.data
          this.loading = false
        })
      },
      closeView() {
        this.$emit('handleClose', false)
      }
    }
  }
</script>


