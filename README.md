# vue-leaflet-measure
Coordinate, linear and area measure control for vue-leaflet
based on https://github.com/ljagis/leaflet-measure

![](http://ljagis.github.io/leaflet-measure/assets/leaflet-measure.png)

## Usage

- inside template l-map add
```javascript

<l-map :maxZoom="17" @ready="onMapReady" :use-global-leaflet="true">
  ...
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

import "leaflet/dist/leaflet.css";
import "vue-leaflet-measure/dist/style.css";

const mapRef = ref();

function onMapReady(map) {
  mapRef.value = map;
}
</script>
```
