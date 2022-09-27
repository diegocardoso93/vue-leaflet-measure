# vue-leaflet-measure
Coordinate, linear, and area measure control for vue-leaflet
based on https://github.com/ljagis/leaflet-measure

![](http://ljagis.github.io/leaflet-measure/assets/leaflet-measure.png)

## Usage

- inside template l-map add
```javascript

<l-map @ready="onMapReady">
  <l-measure :mapRef="mapRef" />
  ...
</l-map>
```

- in script setup section, create import and ref to map
```javascript
<script setup>
import { ref } from "vue";
import { LMap } from "@vue-leaflet/vue-leaflet";
import LMeasure from "vue-leaflet-measure";

const mapRef = ref();

function onMapReady(map) {
  mapRef.value = map;
}
</script>
```

