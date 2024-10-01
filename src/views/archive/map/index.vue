<template>
  <div id="mapDiv" style="width: 100%; height: 90vh;"></div>
</template>

<script>
  export default {
    name: 'MapMain',
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
        map.centerAndZoom(new T.LngLat(120.421980,30.299160), 18);
      }
    }
  }
</script>

<style>
</style>
