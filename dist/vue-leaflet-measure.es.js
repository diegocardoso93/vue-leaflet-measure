import { toRefs, ref, inject, watch, openBlock, createElementBlock, createElementVNode, createTextVNode, toDisplayString, unref, createCommentVNode, createStaticVNode } from "vue";
var units = {
  acres: {
    factor: 24711e-8,
    display: "acres",
    decimals: 2
  },
  feet: {
    factor: 3.2808,
    display: "feet",
    decimals: 0
  },
  kilometers: {
    factor: 1e-3,
    display: "km",
    decimals: 2
  },
  hectares: {
    factor: 1e-4,
    display: "hectares",
    decimals: 2
  },
  meters: {
    factor: 1,
    display: "m",
    decimals: 0
  },
  miles: {
    factor: 3.2808 / 5280,
    display: "miles",
    decimals: 2
  },
  sqfeet: {
    factor: 10.7639,
    display: "sqfeet",
    decimals: 0
  },
  sqmeters: {
    factor: 1,
    display: "m\xB2",
    decimals: 0
  },
  sqkilometers: {
    factor: 1e-3,
    display: "km\xB2",
    decimals: 0
  },
  sqmiles: {
    factor: 386102e-12,
    display: "sqmiles",
    decimals: 2
  }
};
var earthRadius = 63710088e-1;
var factors = {
  meters: earthRadius,
  metres: earthRadius,
  millimeters: earthRadius * 1e3,
  millimetres: earthRadius * 1e3,
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  kilometers: earthRadius / 1e3,
  kilometres: earthRadius / 1e3,
  miles: earthRadius / 1609.344,
  nauticalmiles: earthRadius / 1852,
  inches: earthRadius * 39.37,
  yards: earthRadius / 1.0936,
  feet: earthRadius * 3.28084,
  radians: 1,
  degrees: earthRadius / 111325
};
function feature(geometry, properties, options) {
  options = options || {};
  if (!isObject(options))
    throw new Error("options is invalid");
  var bbox = options.bbox;
  var id = options.id;
  if (geometry === void 0)
    throw new Error("geometry is required");
  if (properties && properties.constructor !== Object)
    throw new Error("properties must be an Object");
  if (bbox)
    validateBBox(bbox);
  if (id)
    validateId(id);
  var feat = { type: "Feature" };
  if (id)
    feat.id = id;
  if (bbox)
    feat.bbox = bbox;
  feat.properties = properties || {};
  feat.geometry = geometry;
  return feat;
}
function lineString(coordinates, properties, options) {
  if (!coordinates)
    throw new Error("coordinates is required");
  if (coordinates.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  if (!isNumber(coordinates[0][1]) || !isNumber(coordinates[0][1]))
    throw new Error("coordinates must contain numbers");
  return feature({
    type: "LineString",
    coordinates
  }, properties, options);
}
function radiansToLength(radians, units2) {
  if (radians === void 0 || radians === null)
    throw new Error("radians is required");
  if (units2 && typeof units2 !== "string")
    throw new Error("units must be a string");
  var factor = factors[units2 || "kilometers"];
  if (!factor)
    throw new Error(units2 + " units is invalid");
  return radians * factor;
}
function degreesToRadians(degrees) {
  if (degrees === null || degrees === void 0)
    throw new Error("degrees is required");
  var radians = degrees % 360;
  return radians * Math.PI / 180;
}
function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
function isObject(input) {
  return !!input && input.constructor === Object;
}
function validateBBox(bbox) {
  if (!bbox)
    throw new Error("bbox is required");
  if (!Array.isArray(bbox))
    throw new Error("bbox must be an Array");
  if (bbox.length !== 4 && bbox.length !== 6)
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  bbox.forEach(function(num) {
    if (!isNumber(num))
      throw new Error("bbox must only contain numbers");
  });
}
function validateId(id) {
  if (!id)
    throw new Error("id is required");
  if (["string", "number"].indexOf(typeof id) === -1)
    throw new Error("id must be a number or a string");
}
function getCoord(coord) {
  if (!coord)
    throw new Error("coord is required");
  if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point")
    return coord.geometry.coordinates;
  if (coord.type === "Point")
    return coord.coordinates;
  if (Array.isArray(coord) && coord.length >= 2 && coord[0].length === void 0 && coord[1].length === void 0)
    return coord;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function distance(from, to, options) {
  options = options || {};
  if (!isObject(options))
    throw new Error("options is invalid");
  var units2 = options.units;
  var coordinates1 = getCoord(from);
  var coordinates2 = getCoord(to);
  var dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  var dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  var lat1 = degreesToRadians(coordinates1[1]);
  var lat2 = degreesToRadians(coordinates2[1]);
  var a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  return radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), units2);
}
function coordEach(geojson, callback, excludeWrapCoord) {
  if (geojson === null)
    return;
  var j, k, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, coordIndex = 0, isGeometryCollection, type = geojson.type, isFeatureCollection = type === "FeatureCollection", isFeature = type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;
      if (geometry === null)
        continue;
      coords = geometry.coordinates;
      var geomType = geometry.type;
      wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;
      switch (geomType) {
        case null:
          break;
        case "Point":
          if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
              return false;
            coordIndex++;
            if (geomType === "MultiPoint")
              multiFeatureIndex++;
          }
          if (geomType === "LineString")
            multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString")
              multiFeatureIndex++;
            if (geomType === "Polygon")
              geometryIndex++;
          }
          if (geomType === "Polygon")
            multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            if (geomType === "MultiPolygon")
              geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false)
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry.geometries.length; j++)
            if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false)
              return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}
function geomEach(geojson, callback) {
  var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === "FeatureCollection", isFeature = geojson.type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
    featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
    featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
    featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
      if (geometry === null) {
        if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false)
          return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false)
            return false;
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry.geometries.length; j++) {
            if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false)
              return false;
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    featureIndex++;
  }
}
function geomReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  geomEach(geojson, function(currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
    if (featureIndex === 0 && initialValue === void 0)
      previousValue = currentGeometry;
    else
      previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
  });
  return previousValue;
}
function flattenEach(geojson, callback) {
  geomEach(geojson, function(geometry, featureIndex, properties, bbox, id) {
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (callback(feature(geometry, properties, { bbox, id }), featureIndex, 0) === false)
          return false;
        return;
    }
    var geomType;
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }
    for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
      var coordinate = geometry.coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate
      };
      if (callback(feature(geom, properties), featureIndex, multiFeatureIndex) === false)
        return false;
    }
  });
}
function segmentEach(geojson, callback) {
  flattenEach(geojson, function(feature$$1, featureIndex, multiFeatureIndex) {
    var segmentIndex = 0;
    if (!feature$$1.geometry)
      return;
    var type = feature$$1.geometry.type;
    if (type === "Point" || type === "MultiPoint")
      return;
    var previousCoords;
    if (coordEach(feature$$1, function(currentCoord, coordIndex, featureIndexCoord, mutliPartIndexCoord, geometryIndex) {
      if (previousCoords === void 0) {
        previousCoords = currentCoord;
        return;
      }
      var currentSegment = lineString([previousCoords, currentCoord], feature$$1.properties);
      if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false)
        return false;
      segmentIndex++;
      previousCoords = currentCoord;
    }) === false)
      return false;
  });
}
function segmentReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  var started = false;
  segmentEach(geojson, function(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
    if (started === false && initialValue === void 0)
      previousValue = currentSegment;
    else
      previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
    started = true;
  });
  return previousValue;
}
function length(geojson, options) {
  options = options || {};
  if (!isObject(options))
    throw new Error("options is invalid");
  if (!geojson)
    throw new Error("geojson is required");
  return segmentReduce(geojson, function(previousValue, segment) {
    var coords = segment.geometry.coordinates;
    return previousValue + distance(coords[0], coords[1], options);
  }, 0);
}
function area(geojson) {
  return geomReduce(geojson, function(value, geom) {
    return value + calculateArea(geom);
  }, 0);
}
var RADIUS = 6378137;
function calculateArea(geojson) {
  var area2 = 0, i;
  switch (geojson.type) {
    case "Polygon":
      return polygonArea(geojson.coordinates);
    case "MultiPolygon":
      for (i = 0; i < geojson.coordinates.length; i++) {
        area2 += polygonArea(geojson.coordinates[i]);
      }
      return area2;
    case "Point":
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
      return 0;
    case "GeometryCollection":
      for (i = 0; i < geojson.geometries.length; i++) {
        area2 += calculateArea(geojson.geometries[i]);
      }
      return area2;
  }
}
function polygonArea(coords) {
  var area2 = 0;
  if (coords && coords.length > 0) {
    area2 += Math.abs(ringArea(coords[0]));
    for (var i = 1; i < coords.length; i++) {
      area2 -= Math.abs(ringArea(coords[i]));
    }
  }
  return area2;
}
function ringArea(coords) {
  var p1;
  var p2;
  var p3;
  var lowerIndex;
  var middleIndex;
  var upperIndex;
  var i;
  var area2 = 0;
  var coordsLength = coords.length;
  if (coordsLength > 2) {
    for (i = 0; i < coordsLength; i++) {
      if (i === coordsLength - 2) {
        lowerIndex = coordsLength - 2;
        middleIndex = coordsLength - 1;
        upperIndex = 0;
      } else if (i === coordsLength - 1) {
        lowerIndex = coordsLength - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }
      p1 = coords[lowerIndex];
      p2 = coords[middleIndex];
      p3 = coords[upperIndex];
      area2 += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
    }
    area2 = area2 * RADIUS * RADIUS / 2;
  }
  return area2;
}
function rad(_) {
  return _ * Math.PI / 180;
}
function pad(num) {
  return num < 10 ? "0" + num.toString() : num.toString();
}
function ddToDms(coordinate, posSymbol, negSymbol) {
  const dd = Math.abs(coordinate), d = Math.floor(dd), m = Math.floor((dd - d) * 60), s = Math.round((dd - d - m / 60) * 3600 * 100) / 100, directionSymbol = dd === coordinate ? posSymbol : negSymbol;
  return pad(d) + "\xB0 " + pad(m) + "' " + pad(s) + '" ' + directionSymbol;
}
function calc(L, latlngs) {
  const last = latlngs[latlngs.length - 1];
  const path = latlngs.map((latlng) => [latlng.lat, latlng.lng]);
  const polyline = L.polyline(path), polygon = L.polygon(path);
  const meters = length(polyline.toGeoJSON(), { units: "kilometers" }) * 1e3;
  const sqMeters = area(polygon.toGeoJSON());
  return {
    lastCoord: {
      dd: {
        x: last.lng,
        y: last.lat
      },
      dms: {
        x: ddToDms(last.lng, "E", "W"),
        y: ddToDms(last.lat, "N", "S")
      }
    },
    length: meters,
    area: sqMeters
  };
}
function selectOne(selector, el) {
  if (!el) {
    el = document;
  }
  return el.querySelector(selector);
}
function hide(el) {
  if (el) {
    el.setAttribute("style", "display:none;");
    return el;
  }
}
function show(el) {
  if (el) {
    el.removeAttribute("style");
    return el;
  }
}
const DEFAULT_OPTIONS = {
  activeColor: "#ABE67E",
  completedColor: "#C8F2BE"
};
class Symbology {
  constructor(L, options) {
    this._options = L.extend({}, DEFAULT_OPTIONS, this._options, options);
  }
  getSymbol(name) {
    const symbols = {
      measureDrag: {
        clickable: false,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 0.7,
        fillColor: this._options.activeColor,
        fillOpacity: 0.5,
        className: "layer-measuredrag"
      },
      measureArea: {
        clickable: false,
        stroke: false,
        fillColor: this._options.activeColor,
        fillOpacity: 0.2,
        className: "layer-measurearea"
      },
      measureBoundary: {
        clickable: false,
        color: this._options.activeColor,
        weight: 2,
        opacity: 0.9,
        fill: false,
        className: "layer-measureboundary"
      },
      measureVertex: {
        clickable: false,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.activeColor,
        fillOpacity: 0.7,
        className: "layer-measurevertex"
      },
      measureVertexActive: {
        clickable: false,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.activeColor,
        fillOpacity: 1,
        className: "layer-measurevertex active"
      },
      resultArea: {
        clickable: true,
        color: this._options.completedColor,
        weight: 2,
        opacity: 0.9,
        fillColor: this._options.completedColor,
        fillOpacity: 0.2,
        className: "layer-measure-resultarea"
      },
      resultLine: {
        clickable: true,
        color: this._options.completedColor,
        weight: 3,
        opacity: 0.9,
        fill: false,
        className: "layer-measure-resultline"
      },
      resultPoint: {
        clickable: true,
        radius: 4,
        color: this._options.completedColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.completedColor,
        fillOpacity: 0.7,
        className: "layer-measure-resultpoint"
      }
    };
    return symbols[name];
  }
}
function numberFormat(n, fixedDecimals = 0, locale = "pt-BR") {
  if (isNaN(n))
    return n;
  if (fixedDecimals) {
    return n == null ? void 0 : n.toLocaleString(locale, {
      minimumFractionDigits: fixedDecimals,
      maximumFractionDigits: fixedDecimals
    });
  }
  if (n == 0)
    return 0;
  if (!n)
    return "";
  if (Number.isInteger(n)) {
    return n.toLocaleString(locale);
  }
  return n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function loadLeafletMeasure(L) {
  L.Control.Measure = L.Control.extend({
    _className: "leaflet-control-measure",
    options: {
      units: {},
      position: "topright",
      primaryLengthUnit: "feet",
      secondaryLengthUnit: "miles",
      primaryAreaUnit: "acres",
      activeColor: "#ABE67E",
      completedColor: "#C8F2BE",
      captureZIndex: 1e4,
      popupOptions: {
        className: "leaflet-measure-resultpopup",
        autoPanPadding: [10, 10]
      },
      controlTemplateRef: null,
      pointPopupTemplateRef: null,
      areaPopupTemplateRef: null,
      linePopupTemplateRef: null,
      resultsTemplateRef: null
    },
    initialize: function(options) {
      L.setOptions(this, options);
      const { activeColor, completedColor } = this.options;
      this._symbols = new Symbology(L, { activeColor, completedColor });
      this.options.units = L.extend({}, units, this.options.units);
    },
    onAdd: function(map) {
      this._map = map;
      this._latlngs = [];
      this._initLayout();
      map.on("click", this._collapse, this);
      this._layer = L.layerGroup().addTo(map);
      return this._container;
    },
    onRemove: function(map) {
      map.off("click", this._collapse, this);
      map.removeLayer(this._layer);
    },
    _initLayout: function() {
      const className = this._className, container = this._container = L.DomUtil.create(
        "div",
        `${className} leaflet-bar`
      );
      container.innerHTML = this.options.controlTemplateRef.value.innerHTML;
      container.setAttribute("aria-haspopup", true);
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      const $toggle = this.$toggle = selectOne(".js-toggle", container);
      this.$interaction = selectOne(".js-interaction", container);
      const $start = selectOne(".js-start", container);
      const $cancel = selectOne(".js-cancel", container);
      const $finish = selectOne(".js-finish", container);
      this.$startPrompt = selectOne(".js-startprompt", container);
      this.$measuringPrompt = selectOne(".js-measuringprompt", container);
      this.$startHelp = selectOne(".js-starthelp", container);
      this.$results = selectOne(".js-results", container);
      this.$measureTasks = selectOne(".js-measuretasks", container);
      this._collapse();
      this._updateMeasureNotStarted();
      if (!L.Browser.android) {
        L.DomEvent.on(container, "mouseenter", this._expand, this);
        L.DomEvent.on(container, "mouseleave", this._collapse, this);
      }
      L.DomEvent.on($toggle, "click", L.DomEvent.stop);
      if (L.Browser.touch) {
        L.DomEvent.on($toggle, "click", this._expand, this);
      } else {
        L.DomEvent.on($toggle, "focus", this._expand, this);
      }
      L.DomEvent.on($start, "click", L.DomEvent.stop);
      L.DomEvent.on($start, "click", this._startMeasure, this);
      L.DomEvent.on($cancel, "click", L.DomEvent.stop);
      L.DomEvent.on($cancel, "click", this._finishMeasure, this);
      L.DomEvent.on($finish, "click", L.DomEvent.stop);
      L.DomEvent.on($finish, "click", this._handleMeasureDoubleClick, this);
    },
    _expand: function() {
      hide(this.$toggle);
      show(this.$interaction);
    },
    _collapse: function() {
      if (!this._locked) {
        hide(this.$interaction);
        show(this.$toggle);
      }
    },
    _updateMeasureNotStarted: function() {
      hide(this.$startHelp);
      hide(this.$results);
      hide(this.$measureTasks);
      hide(this.$measuringPrompt);
      show(this.$startPrompt);
    },
    _updateMeasureStartedNoPoints: function() {
      hide(this.$results);
      show(this.$startHelp);
      show(this.$measureTasks);
      hide(this.$startPrompt);
      show(this.$measuringPrompt);
    },
    _updateMeasureStartedWithPoints: function() {
      hide(this.$startHelp);
      show(this.$results);
      show(this.$measureTasks);
      hide(this.$startPrompt);
      show(this.$measuringPrompt);
    },
    _startMeasure: function() {
      this._locked = true;
      this._measureVertexes = L.featureGroup().addTo(this._layer);
      this._captureMarker = L.marker(this._map.getCenter(), {
        clickable: true,
        zIndexOffset: this.options.captureZIndex,
        opacity: 0,
        autoPanOnFocus: false
      }).addTo(this._layer);
      this._setCaptureMarkerIcon();
      this._captureMarker.on("mouseout", this._handleMapMouseOut, this).on("dblclick", this._handleMeasureDoubleClick, this).on("click", this._handleMeasureClick, this);
      this._map.on("mousemove", this._handleMeasureMove, this).on("mouseout", this._handleMapMouseOut, this).on("move", this._centerCaptureMarker, this).on("resize", this._setCaptureMarkerIcon, this);
      L.DomEvent.on(
        this._container,
        "mouseenter",
        this._handleMapMouseOut,
        this
      );
      this._updateMeasureStartedNoPoints();
      this._map.fire("measurestart", null, false);
    },
    _finishMeasure: function() {
      const model = L.extend({}, this._resultsModel, { points: this._latlngs });
      this._locked = false;
      L.DomEvent.off(
        this._container,
        "mouseover",
        this._handleMapMouseOut,
        this
      );
      this._clearMeasure();
      this._captureMarker.off();
      this._map.off("mousemove").off("mouseout").off("move").off("resize");
      this._layer.removeLayer(this._measureVertexes).removeLayer(this._captureMarker);
      this._measureVertexes = null;
      this._updateMeasureNotStarted();
      this._collapse();
      this._map.fire("measurefinish", model, false);
    },
    _clearMeasure: function() {
      this._latlngs = [];
      this._resultsModel = null;
      this._measureVertexes.clearLayers();
      if (this._measureDrag) {
        this._layer.removeLayer(this._measureDrag);
      }
      if (this._measureArea) {
        this._layer.removeLayer(this._measureArea);
      }
      if (this._measureBoundary) {
        this._layer.removeLayer(this._measureBoundary);
      }
      this._measureDrag = null;
      this._measureArea = null;
      this._measureBoundary = null;
    },
    _centerCaptureMarker: function() {
      this._captureMarker.setLatLng(this._map.getCenter());
    },
    _setCaptureMarkerIcon: function() {
      this._captureMarker.setIcon(
        L.divIcon({
          iconSize: this._map.getSize().multiplyBy(2)
        })
      );
    },
    _getMeasurementDisplayStrings: function(measurement) {
      const unitDefinitions = this.options.units;
      return {
        lengthDisplay: buildDisplay(
          measurement.length,
          this.options.primaryLengthUnit,
          this.options.secondaryLengthUnit
        ),
        areaDisplay: buildDisplay(
          measurement.area,
          this.options.primaryAreaUnit,
          this.options.secondaryAreaUnit
        )
      };
      function buildDisplay(val, primaryUnit, secondaryUnit) {
        if (primaryUnit && unitDefinitions[primaryUnit]) {
          let display = formatMeasure(val, unitDefinitions[primaryUnit]);
          if (secondaryUnit && unitDefinitions[secondaryUnit]) {
            const formatted = formatMeasure(
              val,
              unitDefinitions[secondaryUnit]
            );
            display = `${display} (${formatted})`;
          }
          return display;
        }
        return formatMeasure(val, null);
      }
      function formatMeasure(val, unit) {
        const unitDisplays = {
          acres: "acres",
          feet: "feet",
          kilometers: "kilometers",
          hectares: "hectares",
          meters: "meters",
          miles: "miles",
          sqfeet: "sqfeet",
          sqmeters: "sqmeters",
          sqmiles: "sqmiles"
        };
        const u = L.extend({ factor: 1, decimals: 0 }, unit);
        const formattedNumber = numberFormat(val * u.factor, u.decimals);
        const label = unitDisplays[u.display] || u.display;
        return [formattedNumber, label].join(" ");
      }
    },
    _updateResults: function() {
      const calced = calc(L, this._latlngs);
      this.options.model.value = this._resultsModel = L.extend(
        {},
        calced,
        this._getMeasurementDisplayStrings(calced),
        {
          pointCount: this._latlngs.length
        }
      );
      setTimeout(() => {
        this.$results.innerHTML = this.options.resultsTemplateRef.value.innerHTML;
      }, 100);
    },
    _handleMeasureMove: function(evt) {
      if (!this._measureDrag) {
        this._measureDrag = L.circleMarker(
          evt.latlng,
          this._symbols.getSymbol("measureDrag")
        ).addTo(this._layer);
      } else {
        this._measureDrag.setLatLng(evt.latlng);
      }
      this._measureDrag.bringToFront();
    },
    _handleMeasureDoubleClick: function() {
      const latlngs = this._latlngs;
      let resultFeature, popupContent;
      this._finishMeasure();
      if (!latlngs.length) {
        return;
      }
      if (latlngs.length > 2) {
        latlngs.push(latlngs[0]);
      }
      const calced = calc(L, latlngs);
      if (latlngs.length === 1) {
        resultFeature = L.circleMarker(
          latlngs[0],
          this._symbols.getSymbol("resultPoint")
        );
        this.options.model.value = calced;
        popupContent = this.options.pointPopupTemplateRef.value;
      } else if (latlngs.length === 2) {
        resultFeature = L.polyline(
          latlngs,
          this._symbols.getSymbol("resultLine")
        );
        this.options.model.value = L.extend(
          {},
          calced,
          this._getMeasurementDisplayStrings(calced)
        );
        popupContent = this.options.linePopupTemplateRef.value;
      } else {
        resultFeature = L.polygon(
          latlngs,
          this._symbols.getSymbol("resultArea")
        );
        this.options.model.value = L.extend(
          {},
          calced,
          this._getMeasurementDisplayStrings(calced)
        );
        popupContent = this.options.areaPopupTemplateRef.value;
      }
      setTimeout(() => {
        const popupContainer = L.DomUtil.create("div", "");
        popupContainer.innerHTML = popupContent.innerHTML;
        const zoomLink = selectOne(".js-zoomto", popupContainer);
        if (zoomLink) {
          L.DomEvent.on(zoomLink, "click", L.DomEvent.stop);
          L.DomEvent.on(
            zoomLink,
            "click",
            function() {
              if (resultFeature.getBounds) {
                this._map.fitBounds(resultFeature.getBounds(), {
                  padding: [20, 20],
                  maxZoom: 17
                });
              } else if (resultFeature.getLatLng) {
                this._map.panTo(resultFeature.getLatLng());
              }
            },
            this
          );
        }
        const deleteLink = selectOne(".js-deletemarkup", popupContainer);
        if (deleteLink) {
          L.DomEvent.on(deleteLink, "click", L.DomEvent.stop);
          L.DomEvent.on(
            deleteLink,
            "click",
            function() {
              this._layer.removeLayer(resultFeature);
            },
            this
          );
        }
        resultFeature.addTo(this._layer);
        resultFeature.bindPopup(popupContainer, this.options.popupOptions);
        if (resultFeature.getBounds) {
          resultFeature.openPopup(resultFeature.getBounds().getCenter());
        } else if (resultFeature.getLatLng) {
          resultFeature.openPopup(resultFeature.getLatLng());
        }
      }, 100);
    },
    _handleMeasureClick: function(evt) {
      const latlng = this._map.mouseEventToLatLng(evt.originalEvent), lastClick = this._latlngs[this._latlngs.length - 1], vertexSymbol = this._symbols.getSymbol("measureVertex");
      if (!lastClick || !latlng.equals(lastClick)) {
        this._latlngs.push(latlng);
        this._addMeasureArea(this._latlngs);
        this._addMeasureBoundary(this._latlngs);
        this._measureVertexes.eachLayer(function(layer) {
          layer.setStyle(vertexSymbol);
          if (layer._path) {
            layer._path.setAttribute("class", vertexSymbol.className);
          }
        });
        this._addNewVertex(latlng);
        if (this._measureBoundary) {
          this._measureBoundary.bringToFront();
        }
        this._measureVertexes.bringToFront();
      }
      this._updateResults();
      this._updateMeasureStartedWithPoints();
    },
    _handleMapMouseOut: function() {
      if (this._measureDrag) {
        this._layer.removeLayer(this._measureDrag);
        this._measureDrag = null;
      }
    },
    _addNewVertex: function(latlng) {
      L.circleMarker(
        latlng,
        this._symbols.getSymbol("measureVertexActive")
      ).addTo(this._measureVertexes);
    },
    _addMeasureArea: function(latlngs) {
      if (latlngs.length < 3) {
        if (this._measureArea) {
          this._layer.removeLayer(this._measureArea);
          this._measureArea = null;
        }
        return;
      }
      if (!this._measureArea) {
        this._measureArea = L.polygon(
          latlngs,
          this._symbols.getSymbol("measureArea")
        ).addTo(this._layer);
      } else {
        this._measureArea.setLatLngs(latlngs);
      }
    },
    _addMeasureBoundary: function(latlngs) {
      if (latlngs.length < 2) {
        if (this._measureBoundary) {
          this._layer.removeLayer(this._measureBoundary);
          this._measureBoundary = null;
        }
        return;
      }
      if (!this._measureBoundary) {
        this._measureBoundary = L.polyline(
          latlngs,
          this._symbols.getSymbol("measureBoundary")
        ).addTo(this._layer);
      } else {
        this._measureBoundary.setLatLngs(latlngs);
      }
    }
  });
  L.Map.mergeOptions({
    measureControl: false
  });
  L.Map.addInitHook(function() {
    if (this.options.measureControl) {
      this.measureControl = new L.Control.Measure().addTo(this);
    }
  });
  L.control.measure = function(options) {
    return new L.Control.Measure(options);
  };
}
var LMeasure_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = { class: "templates" };
const _hoisted_2 = /* @__PURE__ */ createStaticVNode('<a class="leaflet-control-measure-toggle js-toggle" href="#" title="Medir dist\xE2ncia e \xE1rea"> Medir </a><div class="leaflet-control-measure-interaction js-interaction"><div class="js-startprompt startprompt"><h3>Medir dist\xE2ncia e \xE1rea</h3><ul class="tasks"><a href="#" class="js-start start">Criar nova medida</a></ul></div><div class="js-measuringprompt"><h3>Medir dist\xE2ncia e \xE1rea</h3><p class="js-starthelp">Comece a medir adicionando pontos no mapa</p><div class="js-results results"></div><ul class="js-measuretasks tasks"><li><a href="#" class="js-cancel cancel">Cancelar</a></li><li><a href="#" class="js-finish finish">Finalizar</a></li></ul></div></div>', 2);
const _hoisted_4 = [
  _hoisted_2
];
const _hoisted_5 = /* @__PURE__ */ createElementVNode("h3", null, "Localiza\xE7\xE3o do ponto", -1);
const _hoisted_6 = /* @__PURE__ */ createElementVNode("span", { class: "coorddivider" }, "/", -1);
const _hoisted_7 = /* @__PURE__ */ createElementVNode("span", { class: "coorddivider" }, "/", -1);
const _hoisted_8 = /* @__PURE__ */ createElementVNode("ul", { class: "tasks" }, [
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar no ponto")
  ]),
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1);
const _hoisted_9 = /* @__PURE__ */ createElementVNode("h3", null, "Medida de linha", -1);
const _hoisted_10 = /* @__PURE__ */ createElementVNode("ul", { class: "tasks" }, [
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar na linha")
  ]),
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1);
const _hoisted_11 = /* @__PURE__ */ createElementVNode("h3", null, "\xC1rea", -1);
const _hoisted_12 = /* @__PURE__ */ createElementVNode("ul", { class: "tasks" }, [
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar na \xE1rea")
  ]),
  /* @__PURE__ */ createElementVNode("li", null, [
    /* @__PURE__ */ createElementVNode("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1);
const _hoisted_13 = { class: "group" };
const _hoisted_14 = /* @__PURE__ */ createElementVNode("p", { class: "lastpoint heading" }, "\xDAltimo ponto adicionado", -1);
const _hoisted_15 = /* @__PURE__ */ createElementVNode("span", { class: "coorddivider" }, "/", -1);
const _hoisted_16 = /* @__PURE__ */ createElementVNode("span", { class: "coorddivider" }, "/", -1);
const _hoisted_17 = {
  key: 0,
  class: "group"
};
const _hoisted_18 = /* @__PURE__ */ createElementVNode("span", { class: "heading" }, "Extens\xE3o da linha", -1);
const _hoisted_19 = {
  key: 1,
  class: "group"
};
const _hoisted_20 = /* @__PURE__ */ createElementVNode("span", { class: "heading" }, "\xC1rea", -1);
const _sfc_main = {
  __name: "LMeasure",
  props: ["mapRef"],
  emits: ["ready"],
  setup(__props, { emit }) {
    const props = __props;
    const WINDOW_OR_GLOBAL = typeof self === "object" && self.self === self && self || typeof global === "object" && global.global === global && global || void 0;
    const { mapRef } = toRefs(props);
    const controlTemplateRef = ref();
    const pointPopupTemplateRef = ref();
    const areaPopupTemplateRef = ref();
    const linePopupTemplateRef = ref();
    const resultsTemplateRef = ref();
    const model = ref({});
    const useGlobalLeaflet = inject("useGlobalLeaflet");
    watch(mapRef, async (map) => {
      const L = useGlobalLeaflet ? WINDOW_OR_GLOBAL.L : await import("leaflet/dist/leaflet-src.esm");
      loadLeafletMeasure(L);
      if (mapRef.value) {
        new L.Control.Measure({
          primaryLengthUnit: "meters",
          secondaryLengthUnit: "kilometers",
          primaryAreaUnit: "sqmeters",
          secondaryAreaUnit: "sqkilometers",
          controlTemplateRef,
          pointPopupTemplateRef,
          areaPopupTemplateRef,
          linePopupTemplateRef,
          resultsTemplateRef,
          model
        }).addTo(map);
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
      return openBlock(), createElementBlock("section", _hoisted_1, [
        createElementVNode("section", {
          ref_key: "controlTemplateRef",
          ref: controlTemplateRef
        }, _hoisted_4, 512),
        createElementVNode("section", {
          ref_key: "pointPopupTemplateRef",
          ref: pointPopupTemplateRef
        }, [
          _hoisted_5,
          createElementVNode("p", null, [
            createTextVNode(toDisplayString((_b = (_a = model.value.lastCoord) == null ? void 0 : _a.dms) == null ? void 0 : _b.y) + " ", 1),
            _hoisted_6,
            createTextVNode(" " + toDisplayString((_d = (_c = model.value.lastCoord) == null ? void 0 : _c.dms) == null ? void 0 : _d.x), 1)
          ]),
          createElementVNode("p", null, [
            createTextVNode(toDisplayString(unref(numberFormat)((_f = (_e = model.value.lastCoord) == null ? void 0 : _e.dd) == null ? void 0 : _f.y, 2)) + " ", 1),
            _hoisted_7,
            createTextVNode(" " + toDisplayString(unref(numberFormat)((_h = (_g = model.value.lastCoord) == null ? void 0 : _g.dd) == null ? void 0 : _h.x, 2)), 1)
          ]),
          _hoisted_8
        ], 512),
        createElementVNode("section", {
          ref_key: "linePopupTemplateRef",
          ref: linePopupTemplateRef
        }, [
          _hoisted_9,
          createElementVNode("p", null, toDisplayString(model.value.lengthDisplay), 1),
          _hoisted_10
        ], 512),
        createElementVNode("section", {
          ref_key: "areaPopupTemplateRef",
          ref: areaPopupTemplateRef
        }, [
          _hoisted_11,
          createElementVNode("p", null, toDisplayString(model.value.areaDisplay), 1),
          createElementVNode("p", null, toDisplayString(model.value.lengthDisplay) + " de per\xEDmetro", 1),
          _hoisted_12
        ], 512),
        createElementVNode("section", {
          ref_key: "resultsTemplateRef",
          ref: resultsTemplateRef
        }, [
          createElementVNode("div", _hoisted_13, [
            _hoisted_14,
            createElementVNode("p", null, [
              createTextVNode(toDisplayString((_j = (_i = model.value.lastCoord) == null ? void 0 : _i.dms) == null ? void 0 : _j.y) + " ", 1),
              _hoisted_15,
              createTextVNode(" " + toDisplayString((_l = (_k = model.value.lastCoord) == null ? void 0 : _k.dms) == null ? void 0 : _l.x), 1)
            ]),
            createElementVNode("p", null, [
              createTextVNode(toDisplayString(unref(numberFormat)((_n = (_m = model.value.lastCoord) == null ? void 0 : _m.dd) == null ? void 0 : _n.y, 2)) + " ", 1),
              _hoisted_16,
              createTextVNode(" " + toDisplayString(unref(numberFormat)((_p = (_o = model.value.lastCoord) == null ? void 0 : _o.dd) == null ? void 0 : _p.x, 2)), 1)
            ])
          ]),
          model.value.pointCount > 1 ? (openBlock(), createElementBlock("div", _hoisted_17, [
            createElementVNode("p", null, [
              _hoisted_18,
              createTextVNode(" " + toDisplayString(model.value.lengthDisplay), 1)
            ])
          ])) : createCommentVNode("", true),
          model.value.pointCount > 2 ? (openBlock(), createElementBlock("div", _hoisted_19, [
            createElementVNode("p", null, [
              _hoisted_20,
              createTextVNode(" " + toDisplayString(model.value.areaDisplay), 1)
            ])
          ])) : createCommentVNode("", true)
        ], 512)
      ]);
    };
  }
};
export { _sfc_main as default };
