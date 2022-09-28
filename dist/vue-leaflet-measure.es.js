import { toRefs as re, ref as S, inject as ie, watch as ae, openBlock as B, createElementBlock as R, createElementVNode as c, createTextVNode as C, toDisplayString as y, unref as N, createCommentVNode as J, createStaticVNode as oe } from "vue";
const ne = {
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
var p = 63710088e-1, le = {
  meters: p,
  metres: p,
  millimeters: p * 1e3,
  millimetres: p * 1e3,
  centimeters: p * 100,
  centimetres: p * 100,
  kilometers: p / 1e3,
  kilometres: p / 1e3,
  miles: p / 1609.344,
  nauticalmiles: p / 1852,
  inches: p * 39.37,
  yards: p / 1.0936,
  feet: p * 3.28084,
  radians: 1,
  degrees: p / 111325
};
function q(e, s, t) {
  if (t = t || {}, !z(t))
    throw new Error("options is invalid");
  var r = t.bbox, i = t.id;
  if (e === void 0)
    throw new Error("geometry is required");
  if (s && s.constructor !== Object)
    throw new Error("properties must be an Object");
  r && he(r), i && fe(i);
  var a = { type: "Feature" };
  return i && (a.id = i), r && (a.bbox = r), a.properties = s || {}, a.geometry = e, a;
}
function ue(e, s, t) {
  if (!e)
    throw new Error("coordinates is required");
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  if (!L(e[0][1]) || !L(e[0][1]))
    throw new Error("coordinates must contain numbers");
  return q({
    type: "LineString",
    coordinates: e
  }, s, t);
}
function ce(e, s) {
  if (e == null)
    throw new Error("radians is required");
  if (s && typeof s != "string")
    throw new Error("units must be a string");
  var t = le[s || "kilometers"];
  if (!t)
    throw new Error(s + " units is invalid");
  return e * t;
}
function x(e) {
  if (e == null)
    throw new Error("degrees is required");
  var s = e % 360;
  return s * Math.PI / 180;
}
function L(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function z(e) {
  return !!e && e.constructor === Object;
}
function he(e) {
  if (!e)
    throw new Error("bbox is required");
  if (!Array.isArray(e))
    throw new Error("bbox must be an Array");
  if (e.length !== 4 && e.length !== 6)
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  e.forEach(function(s) {
    if (!L(s))
      throw new Error("bbox must only contain numbers");
  });
}
function fe(e) {
  if (!e)
    throw new Error("id is required");
  if (["string", "number"].indexOf(typeof e) === -1)
    throw new Error("id must be a number or a string");
}
function Z(e) {
  if (!e)
    throw new Error("coord is required");
  if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
    return e.geometry.coordinates;
  if (e.type === "Point")
    return e.coordinates;
  if (Array.isArray(e) && e.length >= 2 && e[0].length === void 0 && e[1].length === void 0)
    return e;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function me(e, s, t) {
  if (t = t || {}, !z(t))
    throw new Error("options is invalid");
  var r = t.units, i = Z(e), a = Z(s), u = x(a[1] - i[1]), l = x(a[0] - i[0]), o = x(i[1]), n = x(a[1]), f = Math.pow(Math.sin(u / 2), 2) + Math.pow(Math.sin(l / 2), 2) * Math.cos(o) * Math.cos(n);
  return ce(2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f)), r);
}
function ee(e, s, t) {
  if (e !== null)
    for (var r, i, a, u, l, o, n, f = 0, h = 0, m, d = e.type, M = d === "FeatureCollection", P = d === "Feature", A = M ? e.features.length : 1, b = 0; b < A; b++) {
      n = M ? e.features[b].geometry : P ? e.geometry : e, m = n ? n.type === "GeometryCollection" : !1, l = m ? n.geometries.length : 1;
      for (var D = 0; D < l; D++) {
        var _ = 0, k = 0;
        if (u = m ? n.geometries[D] : n, u !== null) {
          o = u.coordinates;
          var g = u.type;
          switch (f = t && (g === "Polygon" || g === "MultiPolygon") ? 1 : 0, g) {
            case null:
              break;
            case "Point":
              if (s(o, h, b, _, k) === !1)
                return !1;
              h++, _++;
              break;
            case "LineString":
            case "MultiPoint":
              for (r = 0; r < o.length; r++) {
                if (s(o[r], h, b, _, k) === !1)
                  return !1;
                h++, g === "MultiPoint" && _++;
              }
              g === "LineString" && _++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (r = 0; r < o.length; r++) {
                for (i = 0; i < o[r].length - f; i++) {
                  if (s(o[r][i], h, b, _, k) === !1)
                    return !1;
                  h++;
                }
                g === "MultiLineString" && _++, g === "Polygon" && k++;
              }
              g === "Polygon" && _++;
              break;
            case "MultiPolygon":
              for (r = 0; r < o.length; r++) {
                for (g === "MultiPolygon" && (k = 0), i = 0; i < o[r].length; i++) {
                  for (a = 0; a < o[r][i].length - f; a++) {
                    if (s(o[r][i][a], h, b, _, k) === !1)
                      return !1;
                    h++;
                  }
                  k++;
                }
                _++;
              }
              break;
            case "GeometryCollection":
              for (r = 0; r < u.geometries.length; r++)
                if (ee(u.geometries[r], s, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function te(e, s) {
  var t, r, i, a, u, l, o, n, f, h, m = 0, d = e.type === "FeatureCollection", M = e.type === "Feature", P = d ? e.features.length : 1;
  for (t = 0; t < P; t++) {
    for (l = d ? e.features[t].geometry : M ? e.geometry : e, n = d ? e.features[t].properties : M ? e.properties : {}, f = d ? e.features[t].bbox : M ? e.bbox : void 0, h = d ? e.features[t].id : M ? e.id : void 0, o = l ? l.type === "GeometryCollection" : !1, u = o ? l.geometries.length : 1, i = 0; i < u; i++) {
      if (a = o ? l.geometries[i] : l, a === null) {
        if (s(null, m, n, f, h) === !1)
          return !1;
        continue;
      }
      switch (a.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (s(a, m, n, f, h) === !1)
            return !1;
          break;
        }
        case "GeometryCollection": {
          for (r = 0; r < a.geometries.length; r++)
            if (s(a.geometries[r], m, n, f, h) === !1)
              return !1;
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    m++;
  }
}
function pe(e, s, t) {
  var r = t;
  return te(e, function(i, a, u, l, o) {
    a === 0 && t === void 0 ? r = i : r = s(r, i, a, u, l, o);
  }), r;
}
function de(e, s) {
  te(e, function(t, r, i, a, u) {
    var l = t === null ? null : t.type;
    switch (l) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        return s(q(t, i, { bbox: a, id: u }), r, 0) === !1 ? !1 : void 0;
    }
    var o;
    switch (l) {
      case "MultiPoint":
        o = "Point";
        break;
      case "MultiLineString":
        o = "LineString";
        break;
      case "MultiPolygon":
        o = "Polygon";
        break;
    }
    for (var n = 0; n < t.coordinates.length; n++) {
      var f = t.coordinates[n], h = {
        type: o,
        coordinates: f
      };
      if (s(q(h, i), r, n) === !1)
        return !1;
    }
  });
}
function _e(e, s) {
  de(e, function(t, r, i) {
    var a = 0;
    if (!!t.geometry) {
      var u = t.geometry.type;
      if (!(u === "Point" || u === "MultiPoint")) {
        var l;
        if (ee(t, function(o, n, f, h, m) {
          if (l === void 0) {
            l = o;
            return;
          }
          var d = ue([l, o], t.properties);
          if (s(d, r, i, m, a) === !1)
            return !1;
          a++, l = o;
        }) === !1)
          return !1;
      }
    }
  });
}
function ye(e, s, t) {
  var r = t, i = !1;
  return _e(e, function(a, u, l, o, n) {
    i === !1 && t === void 0 ? r = a : r = s(r, a, u, l, o, n), i = !0;
  }), r;
}
function ge(e, s) {
  if (s = s || {}, !z(s))
    throw new Error("options is invalid");
  if (!e)
    throw new Error("geojson is required");
  return ye(e, function(t, r) {
    var i = r.geometry.coordinates;
    return t + me(i[0], i[1], s);
  }, 0);
}
function ve(e) {
  return pe(e, function(s, t) {
    return s + se(t);
  }, 0);
}
var K = 6378137;
function se(e) {
  var s = 0, t;
  switch (e.type) {
    case "Polygon":
      return Q(e.coordinates);
    case "MultiPolygon":
      for (t = 0; t < e.coordinates.length; t++)
        s += Q(e.coordinates[t]);
      return s;
    case "Point":
    case "MultiPoint":
    case "LineString":
    case "MultiLineString":
      return 0;
    case "GeometryCollection":
      for (t = 0; t < e.geometries.length; t++)
        s += se(e.geometries[t]);
      return s;
  }
}
function Q(e) {
  var s = 0;
  if (e && e.length > 0) {
    s += Math.abs(X(e[0]));
    for (var t = 1; t < e.length; t++)
      s -= Math.abs(X(e[t]));
  }
  return s;
}
function X(e) {
  var s, t, r, i, a, u, l, o = 0, n = e.length;
  if (n > 2) {
    for (l = 0; l < n; l++)
      l === n - 2 ? (i = n - 2, a = n - 1, u = 0) : l === n - 1 ? (i = n - 1, a = 0, u = 1) : (i = l, a = l + 1, u = l + 2), s = e[i], t = e[a], r = e[u], o += (O(r[0]) - O(s[0])) * Math.sin(O(t[1]));
    o = o * K * K / 2;
  }
  return o;
}
function O(e) {
  return e * Math.PI / 180;
}
function $(e) {
  return e < 10 ? "0" + e.toString() : e.toString();
}
function Y(e, s, t) {
  const r = Math.abs(e), i = Math.floor(r), a = Math.floor((r - i) * 60), u = Math.round((r - i - a / 60) * 3600 * 100) / 100, l = r === e ? s : t;
  return $(i) + "\xB0 " + $(a) + "' " + $(u) + '" ' + l;
}
function I(e, s) {
  const t = s[s.length - 1], r = s.map((o) => [o.lat, o.lng]), i = e.polyline(r), a = e.polygon(r), u = ge(i.toGeoJSON(), { units: "kilometers" }) * 1e3, l = ve(a.toGeoJSON());
  return {
    lastCoord: {
      dd: {
        x: t.lng,
        y: t.lat
      },
      dms: {
        x: Y(t.lng, "E", "W"),
        y: Y(t.lat, "N", "S")
      }
    },
    length: u,
    area: l
  };
}
function v(e, s) {
  return s || (s = document), s.querySelector(e);
}
function w(e) {
  if (e)
    return e.setAttribute("style", "display:none;"), e;
}
function E(e) {
  if (e)
    return e.removeAttribute("style"), e;
}
const Me = {
  activeColor: "#ABE67E",
  completedColor: "#C8F2BE"
};
class be {
  constructor(s, t) {
    this._options = s.extend({}, Me, this._options, t);
  }
  getSymbol(s) {
    return {
      measureDrag: {
        clickable: !1,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 0.7,
        fillColor: this._options.activeColor,
        fillOpacity: 0.5,
        className: "layer-measuredrag"
      },
      measureArea: {
        clickable: !1,
        stroke: !1,
        fillColor: this._options.activeColor,
        fillOpacity: 0.2,
        className: "layer-measurearea"
      },
      measureBoundary: {
        clickable: !1,
        color: this._options.activeColor,
        weight: 2,
        opacity: 0.9,
        fill: !1,
        className: "layer-measureboundary"
      },
      measureVertex: {
        clickable: !1,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.activeColor,
        fillOpacity: 0.7,
        className: "layer-measurevertex"
      },
      measureVertexActive: {
        clickable: !1,
        radius: 4,
        color: this._options.activeColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.activeColor,
        fillOpacity: 1,
        className: "layer-measurevertex active"
      },
      resultArea: {
        clickable: !0,
        color: this._options.completedColor,
        weight: 2,
        opacity: 0.9,
        fillColor: this._options.completedColor,
        fillOpacity: 0.2,
        className: "layer-measure-resultarea"
      },
      resultLine: {
        clickable: !0,
        color: this._options.completedColor,
        weight: 3,
        opacity: 0.9,
        fill: !1,
        className: "layer-measure-resultline"
      },
      resultPoint: {
        clickable: !0,
        radius: 4,
        color: this._options.completedColor,
        weight: 2,
        opacity: 1,
        fillColor: this._options.completedColor,
        fillOpacity: 0.7,
        className: "layer-measure-resultpoint"
      }
    }[s];
  }
}
function T(e, s = 0, t = "pt-BR") {
  return isNaN(e) ? e : s ? e == null ? void 0 : e.toLocaleString(t, {
    minimumFractionDigits: s,
    maximumFractionDigits: s
  }) : e == 0 ? 0 : e ? Number.isInteger(e) ? e.toLocaleString(t) : e.toLocaleString(t, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : "";
}
function ke(e) {
  e.Control.Measure = e.Control.extend({
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
    initialize: function(s) {
      e.setOptions(this, s);
      const { activeColor: t, completedColor: r } = this.options;
      this._symbols = new be(e, { activeColor: t, completedColor: r }), this.options.units = e.extend({}, ne, this.options.units);
    },
    onAdd: function(s) {
      return this._map = s, this._latlngs = [], this._initLayout(), s.on("click", this._collapse, this), this._layer = e.layerGroup().addTo(s), this._container;
    },
    onRemove: function(s) {
      s.off("click", this._collapse, this), s.removeLayer(this._layer);
    },
    _initLayout: function() {
      const s = this._className, t = this._container = e.DomUtil.create(
        "div",
        `${s} leaflet-bar`
      );
      t.innerHTML = this.options.controlTemplateRef.value.innerHTML, t.setAttribute("aria-haspopup", !0), e.DomEvent.disableClickPropagation(t), e.DomEvent.disableScrollPropagation(t);
      const r = this.$toggle = v(".js-toggle", t);
      this.$interaction = v(".js-interaction", t);
      const i = v(".js-start", t), a = v(".js-cancel", t), u = v(".js-finish", t);
      this.$startPrompt = v(".js-startprompt", t), this.$measuringPrompt = v(".js-measuringprompt", t), this.$startHelp = v(".js-starthelp", t), this.$results = v(".js-results", t), this.$measureTasks = v(".js-measuretasks", t), this._collapse(), this._updateMeasureNotStarted(), e.Browser.android || (e.DomEvent.on(t, "mouseenter", this._expand, this), e.DomEvent.on(t, "mouseleave", this._collapse, this)), e.DomEvent.on(r, "click", e.DomEvent.stop), e.Browser.touch ? e.DomEvent.on(r, "click", this._expand, this) : e.DomEvent.on(r, "focus", this._expand, this), e.DomEvent.on(i, "click", e.DomEvent.stop), e.DomEvent.on(i, "click", this._startMeasure, this), e.DomEvent.on(a, "click", e.DomEvent.stop), e.DomEvent.on(a, "click", this._finishMeasure, this), e.DomEvent.on(u, "click", e.DomEvent.stop), e.DomEvent.on(u, "click", this._handleMeasureDoubleClick, this);
    },
    _expand: function() {
      w(this.$toggle), E(this.$interaction);
    },
    _collapse: function() {
      this._locked || (w(this.$interaction), E(this.$toggle));
    },
    _updateMeasureNotStarted: function() {
      w(this.$startHelp), w(this.$results), w(this.$measureTasks), w(this.$measuringPrompt), E(this.$startPrompt);
    },
    _updateMeasureStartedNoPoints: function() {
      w(this.$results), E(this.$startHelp), E(this.$measureTasks), w(this.$startPrompt), E(this.$measuringPrompt);
    },
    _updateMeasureStartedWithPoints: function() {
      w(this.$startHelp), E(this.$results), E(this.$measureTasks), w(this.$startPrompt), E(this.$measuringPrompt);
    },
    _startMeasure: function() {
      this._locked = !0, this._measureVertexes = e.featureGroup().addTo(this._layer), this._captureMarker = e.marker(this._map.getCenter(), {
        clickable: !0,
        zIndexOffset: this.options.captureZIndex,
        opacity: 0,
        autoPanOnFocus: !1
      }).addTo(this._layer), this._setCaptureMarkerIcon(), this._captureMarker.on("mouseout", this._handleMapMouseOut, this).on("dblclick", this._handleMeasureDoubleClick, this).on("click", this._handleMeasureClick, this), this._map.on("mousemove", this._handleMeasureMove, this).on("mouseout", this._handleMapMouseOut, this).on("move", this._centerCaptureMarker, this).on("resize", this._setCaptureMarkerIcon, this), e.DomEvent.on(
        this._container,
        "mouseenter",
        this._handleMapMouseOut,
        this
      ), this._updateMeasureStartedNoPoints(), this._map.fire("measurestart", null, !1);
    },
    _finishMeasure: function() {
      const s = e.extend({}, this._resultsModel, { points: this._latlngs });
      this._locked = !1, e.DomEvent.off(
        this._container,
        "mouseover",
        this._handleMapMouseOut,
        this
      ), this._clearMeasure(), this._captureMarker.off(), this._map.off("mousemove").off("mouseout").off("move").off("resize"), this._layer.removeLayer(this._measureVertexes).removeLayer(this._captureMarker), this._measureVertexes = null, this._updateMeasureNotStarted(), this._collapse(), this._map.fire("measurefinish", s, !1);
    },
    _clearMeasure: function() {
      this._latlngs = [], this._resultsModel = null, this._measureVertexes.clearLayers(), this._measureDrag && this._layer.removeLayer(this._measureDrag), this._measureArea && this._layer.removeLayer(this._measureArea), this._measureBoundary && this._layer.removeLayer(this._measureBoundary), this._measureDrag = null, this._measureArea = null, this._measureBoundary = null;
    },
    _centerCaptureMarker: function() {
      this._captureMarker.setLatLng(this._map.getCenter());
    },
    _setCaptureMarkerIcon: function() {
      this._captureMarker.setIcon(
        e.divIcon({
          iconSize: this._map.getSize().multiplyBy(2)
        })
      );
    },
    _getMeasurementDisplayStrings: function(s) {
      const t = this.options.units;
      return {
        lengthDisplay: r(
          s.length,
          this.options.primaryLengthUnit,
          this.options.secondaryLengthUnit
        ),
        areaDisplay: r(
          s.area,
          this.options.primaryAreaUnit,
          this.options.secondaryAreaUnit
        )
      };
      function r(a, u, l) {
        if (u && t[u]) {
          let o = i(a, t[u]);
          if (l && t[l]) {
            const n = i(
              a,
              t[l]
            );
            o = `${o} (${n})`;
          }
          return o;
        }
        return i(a, null);
      }
      function i(a, u) {
        const l = {
          acres: "acres",
          feet: "feet",
          kilometers: "kilometers",
          hectares: "hectares",
          meters: "meters",
          miles: "miles",
          sqfeet: "sqfeet",
          sqmeters: "sqmeters",
          sqmiles: "sqmiles"
        }, o = e.extend({ factor: 1, decimals: 0 }, u), n = T(a * o.factor, o.decimals), f = l[o.display] || o.display;
        return [n, f].join(" ");
      }
    },
    _updateResults: function() {
      const s = I(e, this._latlngs);
      this.options.model.value = this._resultsModel = e.extend(
        {},
        s,
        this._getMeasurementDisplayStrings(s),
        {
          pointCount: this._latlngs.length
        }
      ), setTimeout(() => {
        this.$results.innerHTML = this.options.resultsTemplateRef.value.innerHTML;
      }, 100);
    },
    _handleMeasureMove: function(s) {
      this._measureDrag ? this._measureDrag.setLatLng(s.latlng) : this._measureDrag = e.circleMarker(
        s.latlng,
        this._symbols.getSymbol("measureDrag")
      ).addTo(this._layer), this._measureDrag.bringToFront();
    },
    _handleMeasureDoubleClick: function() {
      const s = this._latlngs;
      let t, r;
      if (this._finishMeasure(), !s.length)
        return;
      s.length > 2 && s.push(s[0]);
      const i = I(e, s);
      s.length === 1 ? (t = e.circleMarker(
        s[0],
        this._symbols.getSymbol("resultPoint")
      ), this.options.model.value = i, r = this.options.pointPopupTemplateRef.value) : s.length === 2 ? (t = e.polyline(
        s,
        this._symbols.getSymbol("resultLine")
      ), this.options.model.value = e.extend(
        {},
        i,
        this._getMeasurementDisplayStrings(i)
      ), r = this.options.linePopupTemplateRef.value) : (t = e.polygon(
        s,
        this._symbols.getSymbol("resultArea")
      ), this.options.model.value = e.extend(
        {},
        i,
        this._getMeasurementDisplayStrings(i)
      ), r = this.options.areaPopupTemplateRef.value), setTimeout(() => {
        const a = e.DomUtil.create("div", "");
        a.innerHTML = r.innerHTML;
        const u = v(".js-zoomto", a);
        u && (e.DomEvent.on(u, "click", e.DomEvent.stop), e.DomEvent.on(
          u,
          "click",
          function() {
            t.getBounds ? this._map.fitBounds(t.getBounds(), {
              padding: [20, 20],
              maxZoom: 17
            }) : t.getLatLng && this._map.panTo(t.getLatLng());
          },
          this
        ));
        const l = v(".js-deletemarkup", a);
        l && (e.DomEvent.on(l, "click", e.DomEvent.stop), e.DomEvent.on(
          l,
          "click",
          function() {
            this._layer.removeLayer(t);
          },
          this
        )), t.addTo(this._layer), t.bindPopup(a, this.options.popupOptions), t.getBounds ? t.openPopup(t.getBounds().getCenter()) : t.getLatLng && t.openPopup(t.getLatLng());
      }, 100);
    },
    _handleMeasureClick: function(s) {
      const t = this._map.mouseEventToLatLng(s.originalEvent), r = this._latlngs[this._latlngs.length - 1], i = this._symbols.getSymbol("measureVertex");
      (!r || !t.equals(r)) && (this._latlngs.push(t), this._addMeasureArea(this._latlngs), this._addMeasureBoundary(this._latlngs), this._measureVertexes.eachLayer(function(a) {
        a.setStyle(i), a._path && a._path.setAttribute("class", i.className);
      }), this._addNewVertex(t), this._measureBoundary && this._measureBoundary.bringToFront(), this._measureVertexes.bringToFront()), this._updateResults(), this._updateMeasureStartedWithPoints();
    },
    _handleMapMouseOut: function() {
      this._measureDrag && (this._layer.removeLayer(this._measureDrag), this._measureDrag = null);
    },
    _addNewVertex: function(s) {
      e.circleMarker(
        s,
        this._symbols.getSymbol("measureVertexActive")
      ).addTo(this._measureVertexes);
    },
    _addMeasureArea: function(s) {
      if (s.length < 3) {
        this._measureArea && (this._layer.removeLayer(this._measureArea), this._measureArea = null);
        return;
      }
      this._measureArea ? this._measureArea.setLatLngs(s) : this._measureArea = e.polygon(
        s,
        this._symbols.getSymbol("measureArea")
      ).addTo(this._layer);
    },
    _addMeasureBoundary: function(s) {
      if (s.length < 2) {
        this._measureBoundary && (this._layer.removeLayer(this._measureBoundary), this._measureBoundary = null);
        return;
      }
      this._measureBoundary ? this._measureBoundary.setLatLngs(s) : this._measureBoundary = e.polyline(
        s,
        this._symbols.getSymbol("measureBoundary")
      ).addTo(this._layer);
    }
  }), e.Map.mergeOptions({
    measureControl: !1
  }), e.Map.addInitHook(function() {
    this.options.measureControl && (this.measureControl = new e.Control.Measure().addTo(this));
  }), e.control.measure = function(s) {
    return new e.Control.Measure(s);
  };
}
const Ce = { class: "templates" }, we = /* @__PURE__ */ oe('<a class="leaflet-control-measure-toggle js-toggle" href="#" title="Medir dist\xE2ncia e \xE1rea"> Medir </a><div class="leaflet-control-measure-interaction js-interaction"><div class="js-startprompt startprompt"><h3>Medir dist\xE2ncia e \xE1rea</h3><ul class="tasks"><a href="#" class="js-start start">Criar nova medida</a></ul></div><div class="js-measuringprompt"><h3>Medir dist\xE2ncia e \xE1rea</h3><p class="js-starthelp">Comece a medir adicionando pontos no mapa</p><div class="js-results results"></div><ul class="js-measuretasks tasks"><li><a href="#" class="js-cancel cancel">Cancelar</a></li><li><a href="#" class="js-finish finish">Finalizar</a></li></ul></div></div>', 2), Ee = [
  we
], Pe = /* @__PURE__ */ c("h3", null, "Localiza\xE7\xE3o do ponto", -1), De = /* @__PURE__ */ c("span", { class: "coorddivider" }, "/", -1), Se = /* @__PURE__ */ c("span", { class: "coorddivider" }, "/", -1), Te = /* @__PURE__ */ c("ul", { class: "tasks" }, [
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar no ponto")
  ]),
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1), Ae = /* @__PURE__ */ c("h3", null, "Medida de linha", -1), Ne = /* @__PURE__ */ c("ul", { class: "tasks" }, [
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar na linha")
  ]),
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1), xe = /* @__PURE__ */ c("h3", null, "\xC1rea", -1), Be = /* @__PURE__ */ c("ul", { class: "tasks" }, [
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-zoomto zoomto"
    }, "Centralizar na \xE1rea")
  ]),
  /* @__PURE__ */ c("li", null, [
    /* @__PURE__ */ c("a", {
      href: "#",
      class: "js-deletemarkup deletemarkup"
    }, "Excluir")
  ])
], -1), Re = { class: "group" }, Oe = /* @__PURE__ */ c("p", { class: "lastpoint heading" }, "\xDAltimo ponto adicionado", -1), $e = /* @__PURE__ */ c("span", { class: "coorddivider" }, "/", -1), qe = /* @__PURE__ */ c("span", { class: "coorddivider" }, "/", -1), Le = {
  key: 0,
  class: "group"
}, ze = /* @__PURE__ */ c("span", { class: "heading" }, "Extens\xE3o da linha", -1), Ge = {
  key: 1,
  class: "group"
}, je = /* @__PURE__ */ c("span", { class: "heading" }, "\xC1rea", -1), Ue = {
  __name: "LMeasure",
  props: ["mapRef"],
  setup(e) {
    const s = e, t = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || void 0, { mapRef: r } = re(s), i = S(), a = S(), u = S(), l = S(), o = S(), n = S({}), f = ie("useGlobalLeaflet");
    return ae(r, async (h) => {
      const m = f ? t.L : await import("leaflet/dist/leaflet-src.esm");
      ke(m), r.value && new m.Control.Measure({
        primaryLengthUnit: "meters",
        secondaryLengthUnit: "kilometers",
        primaryAreaUnit: "sqmeters",
        secondaryAreaUnit: "sqkilometers",
        controlTemplateRef: i,
        pointPopupTemplateRef: a,
        areaPopupTemplateRef: u,
        linePopupTemplateRef: l,
        resultsTemplateRef: o,
        model: n
      }).addTo(h);
    }), (h, m) => {
      var d, M, P, A, b, D, _, k, g, G, j, V, U, F, H, W;
      return B(), R("section", Ce, [
        c("section", {
          ref_key: "controlTemplateRef",
          ref: i
        }, Ee, 512),
        c("section", {
          ref_key: "pointPopupTemplateRef",
          ref: a
        }, [
          Pe,
          c("p", null, [
            C(y((M = (d = n.value.lastCoord) == null ? void 0 : d.dms) == null ? void 0 : M.y) + " ", 1),
            De,
            C(" " + y((A = (P = n.value.lastCoord) == null ? void 0 : P.dms) == null ? void 0 : A.x), 1)
          ]),
          c("p", null, [
            C(y(N(T)((D = (b = n.value.lastCoord) == null ? void 0 : b.dd) == null ? void 0 : D.y, 2)) + " ", 1),
            Se,
            C(" " + y(N(T)((k = (_ = n.value.lastCoord) == null ? void 0 : _.dd) == null ? void 0 : k.x, 2)), 1)
          ]),
          Te
        ], 512),
        c("section", {
          ref_key: "linePopupTemplateRef",
          ref: l
        }, [
          Ae,
          c("p", null, y(n.value.lengthDisplay), 1),
          Ne
        ], 512),
        c("section", {
          ref_key: "areaPopupTemplateRef",
          ref: u
        }, [
          xe,
          c("p", null, y(n.value.areaDisplay), 1),
          c("p", null, y(n.value.lengthDisplay) + " de per\xEDmetro", 1),
          Be
        ], 512),
        c("section", {
          ref_key: "resultsTemplateRef",
          ref: o
        }, [
          c("div", Re, [
            Oe,
            c("p", null, [
              C(y((G = (g = n.value.lastCoord) == null ? void 0 : g.dms) == null ? void 0 : G.y) + " ", 1),
              $e,
              C(" " + y((V = (j = n.value.lastCoord) == null ? void 0 : j.dms) == null ? void 0 : V.x), 1)
            ]),
            c("p", null, [
              C(y(N(T)((F = (U = n.value.lastCoord) == null ? void 0 : U.dd) == null ? void 0 : F.y, 2)) + " ", 1),
              qe,
              C(" " + y(N(T)((W = (H = n.value.lastCoord) == null ? void 0 : H.dd) == null ? void 0 : W.x, 2)), 1)
            ])
          ]),
          n.value.pointCount > 1 ? (B(), R("div", Le, [
            c("p", null, [
              ze,
              C(" " + y(n.value.lengthDisplay), 1)
            ])
          ])) : J("", !0),
          n.value.pointCount > 2 ? (B(), R("div", Ge, [
            c("p", null, [
              je,
              C(" " + y(n.value.areaDisplay), 1)
            ])
          ])) : J("", !0)
        ], 512)
      ]);
    };
  }
};
export {
  Ue as default
};
