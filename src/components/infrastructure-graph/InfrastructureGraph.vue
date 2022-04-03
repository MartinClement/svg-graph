<template>
  <svg
    :class="canvasClass"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g data-name="lines">
      <LinePath
        v-for="(line, li) in lines"
        :key="li"
        :path="line.path"
        :status="line.status"
        :line-id="`${li}-${uniqueId}`"
      />
    </g>
    <g data-name="icons">
      <slot name="icons" :icons="processedScene">
        <DefaultIcon
          v-for="({ x, y, w, h, status, id, context }, ci) in processedScene"
          :key="ci"
          :data-id="id"
          :x="x"
          :y="y"
          :context="context"
          :width="w"
          :height="h"
          :status="status"
        />
      </slot>
    </g>
  </svg>
</template>

<script>
  import InstanceIcon from './icones/Instance.vue';
  import DefaultIcon from './icones/Default.vue';
  import LinePath from './paths/Line.vue';
  import { computed } from 'vue';
  import { buildHorizontalScene, buildVerticalScene, buildLines } from './helpers/scene.js';

  export default {
    name: 'InfrastructureGraph',
    components: {
      InstanceIcon,
      DefaultIcon,
      LinePath,
    },
    props: {
      width: Number,
      height: Number,
      kind: {
        type: String,
        validator: v => ['dark', 'light'].includes(v),
      },
      direction: {
        type: String,
        default: 'horizontal',
        validator: v => ['horizontal', 'vertical'].includes(v),
      },
      config: {
        type: Object,
        default: () => ({}),
      },
      scene: {
        type: Array,
        default: [],
      },
    },
    setup(props) {
      const BASE_CLASS = 'main_canvas';
      const BASE_CONFIG = {
        dispatchOrigins: false,
        curveGutter: 20,
        originsGap: 5,
        pathKind: 'straight',
      };

      const uniqueId = computed(() => {
        return Math.floor(Math.random() * 50) * Math.floor(Math.random() * 50) * Math.floor(Math.random() * 50);
      });

      const canvasClass = computed(() => {
        return `${BASE_CLASS} ${BASE_CLASS}${props.kind === 'dark' ? '--dark' : '--light'}`;
      });

      const processedScene = computed(() => {
        const buildFunction = props.direction === 'horizontal' ? buildHorizontalScene : buildVerticalScene;
        return props.scene ? buildFunction(props.scene, { height: props.height, width: props.width }) : [];
      });

      const lines = computed(() => {
        const config = Object.assign(BASE_CONFIG, props.config)
        return buildLines(processedScene.value, config);
      });

      return { canvasClass, processedScene, lines, uniqueId };
    },
  };
</script>

<style>
  @keyframes pulse {
    0%   { stroke-width: 0 }
    50%  { stroke-width: 10 }
    100% { stroke-width: 0 }
  };
</style>
<style scoped lang="postcss">
  .main_canvas {
    border: 2px solid #424242;
  }
  .main_canvas--dark {
    background-color: #121212;
  }
  .main_canvas--light {
    background-color: #777;
  }
  .circle--online {
    fill: green;
    stroke: lightgreen;
    stroke-width: 5;
  }
  .circle--offline {
    fill: grey;
  }
  .circle--loading {
    fill: orange;
    stroke: darkgoldenrod;
    animation: pulse 1s ease-in-out infinite;
  }
  .circle--error {
    fill: darkred;
  }
</style>