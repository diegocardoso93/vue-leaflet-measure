<template>
  <section class="templates">
    <section ref="controlTemplateRef">
      <a
        class="leaflet-control-measure-toggle js-toggle"
        href="#"
        title="Medir distância e área"
      >
        Medir
      </a>
      <div class="leaflet-control-measure-interaction js-interaction">
        <div class="js-startprompt startprompt">
          <h3>Medir distância e área</h3>
          <ul class="tasks">
            <a href="#" class="js-start start">Criar nova medida</a>
          </ul>
        </div>
        <div class="js-measuringprompt">
          <h3>Medir distância e área</h3>
          <p class="js-starthelp">Comece a medir adicionando pontos no mapa</p>
          <div class="js-results results"></div>
          <ul class="js-measuretasks tasks">
            <li><a href="#" class="js-cancel cancel">Cancelar</a></li>
            <li>
              <a href="#" class="js-finish finish">Finalizar</a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section ref="pointPopupTemplateRef">
      <h3>Localização do ponto</h3>
      <p>
        {{ model.lastCoord?.dms?.y }} <span class="coorddivider">/</span>
        {{ model.lastCoord?.dms?.x }}
      </p>
      <p>
        {{ numberFormat(model.lastCoord?.dd?.y, 2) }}
        <span class="coorddivider">/</span>
        {{ numberFormat(model.lastCoord?.dd?.x, 2) }}
      </p>
      <ul class="tasks">
        <li><a href="#" class="js-zoomto zoomto">Centralizar no ponto</a></li>
        <li><a href="#" class="js-deletemarkup deletemarkup">Excluir</a></li>
      </ul>
    </section>

    <section ref="linePopupTemplateRef">
      <h3>Medida de linha</h3>
      <p>{{ model.lengthDisplay }}</p>
      <ul class="tasks">
        <li><a href="#" class="js-zoomto zoomto">Centralizar na linha</a></li>
        <li><a href="#" class="js-deletemarkup deletemarkup">Excluir</a></li>
      </ul>
    </section>

    <section ref="areaPopupTemplateRef">
      <h3>Área</h3>
      <p>{{ model.areaDisplay }}</p>
      <p>{{ model.lengthDisplay }} de perímetro</p>
      <ul class="tasks">
        <li><a href="#" class="js-zoomto zoomto">Centralizar na área</a></li>
        <li><a href="#" class="js-deletemarkup deletemarkup">Excluir</a></li>
      </ul>
    </section>

    <section ref="resultsTemplateRef">
      <div class="group">
        <p class="lastpoint heading">Último ponto adicionado</p>
        <p>
          {{ model.lastCoord?.dms?.y }} <span class="coorddivider">/</span>
          {{ model.lastCoord?.dms?.x }}
        </p>
        <p>
          {{ numberFormat(model.lastCoord?.dd?.y, 2) }}
          <span class="coorddivider">/</span>
          {{ numberFormat(model.lastCoord?.dd?.x, 2) }}
        </p>
      </div>
      <div v-if="model.pointCount > 1" class="group">
        <p>
          <span class="heading">Extensão da linha</span>
          {{ model.lengthDisplay }}
        </p>
      </div>
      <div v-if="model.pointCount > 2" class="group">
        <p><span class="heading">Área</span> {{ model.areaDisplay }}</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, toRefs, inject, watch } from "vue";
import { loadLeafletMeasure, numberFormat } from "./leaflet-measure";

const WINDOW_OR_GLOBAL =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  undefined;

const props = defineProps(["mapRef"]);
const { mapRef } = toRefs(props);

const controlTemplateRef = ref();
const pointPopupTemplateRef = ref();
const areaPopupTemplateRef = ref();
const linePopupTemplateRef = ref();
const resultsTemplateRef = ref();

const model = ref({});

const useGlobalLeaflet = inject("useGlobalLeaflet");

watch(mapRef, async (map) => {
  if (mapRef.value) {
    const L = useGlobalLeaflet
      ? WINDOW_OR_GLOBAL.L
      : await import("leaflet/dist/leaflet-src.esm");

    loadLeafletMeasure(L);

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
      model: model,
    }).addTo(map);
  }
});
</script>

<style lang="scss">
$color-divider: #ddd;
$color-button: #5e66cc;
$color-lightertext: #999;

$spacing-external: 12px;
$spacing-internal: 10px;

$max-width: 280px;

$button-icon-size: 12px;
$button-icon-spacing: 4px;

@mixin hoverbutton {
  color: $color-button;
  text-decoration: none;
  &:hover {
    opacity: 0.5;
    text-decoration: none;
  }
}

@mixin button($icon) {
  display: inline;
  width: auto;
  height: auto;
  padding-left: 20px;
  margin-right: $button-icon-spacing;
  line-height: 1em;
  border: 0;
  text-align: left;
  color: $color-button;
  &,
  &:hover {
    background-color: transparent;
  }
  background: {
    image: url("../assets/#{ $icon }.png");
    repeat: no-repeat;
    position: 0% 50%;
    size: $button-icon-size $button-icon-size;
  }

  @include hoverbutton;
}

.leaflet-control-measure,
.leaflet-measure-resultpopup {
  h3 {
    margin: 0 0 $spacing-external 0;
    padding-bottom: $spacing-internal;
    border-bottom: solid 1px $color-divider;
  }
  p {
    margin: $spacing-internal 0 0 0;
    line-height: 1.5em;
    &:first-child {
      margin-top: 0;
    }
  }
  .tasks {
    margin: $spacing-external 0 0 0;
    padding: $spacing-internal 0 0 0;
    border-top: solid 1px $color-divider;
    text-align: right;

    list-style: none;
    list-style-image: none;

    li {
      display: inline;
      margin: 0 $spacing-internal 0 0;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .coorddivider {
    color: $color-lightertext;
  }
}

.leaflet-control-measure {
  max-width: $max-width;
  background: #fff;

  .leaflet-control-measure-toggle,
  .leaflet-control-measure-toggle:hover {
    width: 44px !important;
    height: 44px !important;

    background: {
      size: 22px 22px !important;
      image: url("../assets/rulers.png");
    }
    border: 0;
    border-radius: 4px;
    .leaflet-touch & {
      border-radius: 2px;
    }

    // Hide text
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;

    .leaflet-touch & {
      background-size: 16px 16px;
    }
  }

  // Special styling because start prompt has no content, just header and tasks
  .startprompt {
    h3 {
      margin-bottom: $spacing-internal;
    }
    .tasks {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
      text-align: left;
    }
  }

  .leaflet-control-measure-interaction {
    padding: $spacing-internal $spacing-external;
  }

  .results {
    .group {
      margin-top: $spacing-internal;
      padding-top: $spacing-internal;
      border-top: dotted 1px lighten($color-divider, 5);
      &:first-child {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }
    }
    .heading {
      margin-right: $spacing-internal * 0.5;
      color: $color-lightertext;
    }
  }

  a.start {
    @include button(start);
  }
  a.cancel {
    @include button(cancel);
  }
  a.finish {
    @include button(check);
  }
}

.leaflet-measure-resultpopup {
  a.zoomto {
    @include button(focus);
  }
  a.deletemarkup {
    @include button(trash);
  }
}

.templates {
  display: none;
}
</style>
