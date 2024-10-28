<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="户籍人数" :total="stat.totalMember">
          <div v-for="item in stat.genderStat">
            <template>{{ item.gender }}<span> {{ item.num }}</span></template>
          </div>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="户籍数" :total="stat.hukouCount">
          <template>数量 <span> {{ stat.hukouCount }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="车辆数量" :total="stat.carCount">
          <template>数量 <span>{{ stat.carCount }}</span></template>
        </chart-card>
      </el-col>
      <el-col :sm="24" :xs="24" :md="6" :xl="6" :lg="6" :style="{ marginBottom: '12px' }">
        <chart-card title="承包面积" :total="stat.landArea">
          <template>农业用地 <span>{{ stat.landArea }}</span></template>
        </chart-card>
      </el-col>
    </el-row>

    <el-card :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <el-tabs>
          <el-tab-pane label="数据分布">
            <el-row>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :list="barData" title="年龄分布" />
              </el-col>
              <el-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :list="landData" title="土地分布" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import Trend from '@/components/Trend'
import MiniArea from '@/components/MiniArea'
import MiniBar from '@/components/MiniBar'
import MiniProgress from '@/components/MiniProgress'
import RankList from '@/components/RankList/index'
import Bar from '@/components/Bar.vue'
import { hukouStat } from '@/api/archive/stat';

const barData2 = []

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

export default {
  name: 'DashboardAdmin',
  components: {
    ChartCard,
    Trend,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar
  },
  data() {
    return {
      barData: [],
      landData: [],
      rankList,
      stat: {
        carCount: 0,
        totalMember: 0,
        genderStat:{},
        hukouCount: 0,
        landArea:0
      }
    }
  },
  created() {
    hukouStat().then(res => {
      this.stat.genderStat = res.data.genderStat
      this.stat.hukouCount = res.data.hukouCount
      this.stat.landArea   = res.data.landArea
      let total = 0;
      this.stat.genderStat.forEach(x => {
         total += x.num
      })

      // 人数
      this.stat.totalMember = total;

      // 车辆数
      this.stat.carCount = res.data.carCount;

      // 年龄分布
      let ageStat = res.data.ageStat;
      this.sortAgeStat(ageStat)
      ageStat.forEach(row => {
        this.barData.push({
          x: row.cls,
          y: row.num
        })
      })

      // 土地分布
      let landGroupStat = res.data.landGroupStat;
      landGroupStat.sort((a, b) => {
        if (a.group > b.group) {
          return 1
        }
        if (a.group < b.group) {
          return -1
        }
        return 0
      })
      landGroupStat.forEach(row => {
        this.landData.push({
          x: row.group + ' 组',
          y: row.area
        })
      })
    })
  },
  methods: {
    sortAgeStat(list) {
      list.sort((a, b) => {
          let aRange = a.cls.split('~').map(Number);
          let bRange = b.cls.split('~').map(Number);

          if (aRange[0] === bRange[0]) {
              return aRange[1] - bRange[1];
          }
          return aRange[0] - bRange[0];
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

::v-deep .el-tabs__item{
   padding-left: 16px!important;
   height: 50px;
   line-height: 50px;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
