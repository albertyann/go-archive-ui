<template>
  <div id="mapDiv" style="width: 100%; height: 90vh;"></div>
</template>

<script>
  import { getConfigKey } from '@/api/admin/sys-config'
  import { listHouse } from '@/api/archive/house';
  export default {
    name: 'MapMain',
    data() {
      return {
        houseList: [],
        houseTotal: 0,
        map: undefined
      }
    },
    mounted() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src  = `http://api.tianditu.gov.cn/api?v=4.0&tk=cbfe568d6062fdbb2efca8c9ea29d32b`;
      script.onload = () => {
        this.initMap();
      };
      document.head.appendChild(script);
    },
    methods: {
      initMap() {
        const imageURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
                        "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
                        "&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=cbfe568d6062fdbb2efca8c9ea29d32b";
        let lay = new T.TileLayer(imageURL, {minZoom: 1, maxZoom: 18});
        var config = {layers: [lay]};
        let map = new T.Map('mapDiv', config);
        this.map = map;

        getConfigKey('base_location').then(res => {
          let val = res.data.configValue;
          let latlng = val.split(',');
          map.centerAndZoom(new T.LngLat(latlng[0], latlng[1]), 18);

          this.loadHouse();
        })
      },
      loadHouse() {
        listHouse().then(response => {
            this.houseList = response.data.list
            this.houseTotal = response.data.count

            this.houseList.forEach(house => {
              let lnglat = new T.LngLat(house.longitude, house.latitude)
              var marker = new T.Marker(lnglat);
              this.map.addOverLay(marker);

              var infoWin = new T.InfoWindow();
              infoWin.setLngLat(lnglat);

              let content = '户主: ' + house.holder +'<br/>' +
                            '电话: ' + house.holderPhone +'<br/>' +
                            '状态: ' + house.status +'<br/>' +
                            '面积: ' + house.area +' 平米 <br/>'
              infoWin.setContent(content);
              //向地图上添加信息窗口
              this.map.addOverLay(infoWin);
            })
          }
        )
      }
    }
  }
</script>

<style>
</style>
