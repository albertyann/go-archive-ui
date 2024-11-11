<template>
  <div>
    <table>
      <tr>
        <th />
        <th>面积</th>
        <th>长 x 宽</th>
        <th>是否流转</th>
        <th>备注</th>
      </tr>
      <tr v-for="(item, index) in data" :key="index">
        <td><span style="margin: 0 0px;">{{ index + 1 }}</span></td>
        <td><el-input-number v-model="item.area" placeholder="面积" style="width:100px" :controls="false" /></td>
        <td>
          <el-input-number v-model="item.length" placeholder="长" style="width:60px" :controls="false" />
          <el-input-number v-model="item.width" placeholder="宽" style="width:60px" :controls="false" />
          <el-button size="small" type="primary" circle style="margin-left: 3px;" @click="calcArea(item, item.length, item.width)">=</el-button>
        </td>
        <td>
          <el-select v-model="item.flow" placeholder="是否流转" style="width:105px">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </td>
        <td>
          <el-input v-model="item.remarks" placeholder="备注" style="width:200px" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'FarmerLandTb',
  components: {},
  props: {
    data: {
      type: Array,
      default: () => {
        return Array(6).fill().map(() => ({
          area: undefined,
          length: undefined,
          width: undefined,
          remarks: '',
          flow: 0
        }))
      }
    }
  },
  data() {
    return {
      open: false
    }
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    calcArea(x, a, b) {
      x.area = (a * b).toFixed(4)
    }
  }
}
</script>
