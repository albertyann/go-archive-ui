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
        map: undefined,
        buildPeriod:[{
            "value": "1",
            "label": "1980年及以前",
          },
          {
            "value": "2",
            "label": "1981~1990年",
          },
          {
            "value": "3",
            "label": "1991~2000年",
          },
          {
            "value": "4",
            "label": "2001~2010年",
          },
          {
            "value": "5",
            "label": "2011年及以后",
          },
        ]
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
        let lay = new T.TileLayer(imageURL, {minZoom: 12, maxZoom: 18});
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
              if (house.longitude.length > 0) {
                let lnglat = new T.LngLat(parseFloat(house.longitude), parseFloat(house.latitude))
                var marker = new T.Marker(lnglat);
                this.map.addOverLay(marker);

                var infoWin = new T.InfoWindow();
                infoWin.setLngLat(lnglat);

                let lnglat1 = new T.LngLat(parseFloat(house.longitude) - 0.0001, parseFloat(house.latitude) - 0.0001)
                let lnglat2 = new T.LngLat(parseFloat(house.longitude) + 0.0001, parseFloat(house.latitude) + 0.0001)
                var bounds  = new T.LngLatBounds(lnglat1, lnglat2);
                var option  = {"fillColor": "#3300FF", "color": "#3333CC", "weight": 1};
                if (house.status == '危房') {
                  option.fillColor = "#CC3300";
                  option.color = "#CC0000";
                }
                var rect = new T.Rectangle(bounds, option);
                this.map.addOverLay(rect);

                let label = this.buildPeriod[house.buildPeriod] ? this.buildPeriod[house.buildPeriod].label : "-";

                let content = '户主: ' + house.holder +'<br/>' +
                              '建筑层数: ' + house.floorNum +'<br/>' +
                              '建造年份: ' + label +'<br/>' +
                              '面积: ' + house.area +' 平米 <br/>' +
                              '房屋状态: ' + house.status +'<br/>'
                infoWin.setContent(content);
                //向地图上添加信息窗口
                marker.addEventListener("click", function () {
                    marker.openInfoWindow(infoWin);
                });
              }
            })
          }
        )
      }
    }
  }
</script>

<style>
</style>
