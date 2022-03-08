<template>
  <svg
    :class="canvasClass"
    :width="width"
    :height="height"
  >
    <g data-name="lines">
      <!-- <line
        v-for="({ x1, x2, y1, y2, status }, li) in lines"
        :key="li"
        :x1="x1"
        :x2="x2"
        :y1="y1"
        :y2="y2"
        :class="`line line--${status}`"
      /> -->
      <path
        v-for="(line, li) in lines"
        :key="li"
        :d="line.path"
        :class="`path path--${line.status}`"
      />
    </g>
    <g data-name="circles">
      <!-- <circle
        v-for="({ x, y, status }, ci) in flatScene"
        :key="ci"
        :cx="x"
        :cy="y"
        r="30"
        :class="`circle circle--${status}`"
      /> -->
      <InstanceIcon
        v-for="({ x, y, status }, ci) in flatScene"
        :key="ci"
        :x="x"
        :y="y"
        width="50"
        height="50"
        :status="status"
      />
    </g>
  </svg>
  <div>
    {{ flatScene }}
    {{ lines }}
  </div>
</template>

<script>
  import InstanceIcon from './icones/Instance.vue';
  import { computed } from 'vue';
  import { buildScene, buildLines, flatten } from './helpers/scene.js';

  export default {
    name: 'InfrastructureGraph',
    components: {
      InstanceIcon,
    },
    props: ['width', 'height', 'kind', 'scene'],
    setup(props) {
      const BASE_CLASS = 'main_canvas';
      const canvasClass = computed(() => {
        return `${BASE_CLASS} ${BASE_CLASS}${props.kind === 'dark' ? '--dark' : '--light'}`;
      })
      const processedScene = computed(() => {
        return props.scene ? buildScene(props.scene, { height: props.height, width: props.width }) : [];
      })

      const flatScene = computed(() => {
        return flatten(processedScene.value);
      });

      const lines = computed(() => {
        return buildLines(flatScene.value);
      });

      return { canvasClass, processedScene, flatScene, lines };
    }
  }
</script>

<style>
  @keyframes pulse {
    0%   { stroke-width: 0 }
    50%  { stroke-width: 10 }
    100% { stroke-width: 0 }
  };
  @keyframes dashed {
    from { stroke-dashoffset: 0 }
    to { stroke-dashoffset: -40 }
  };
</style>
<style scoped lang="postcss">
  .main_canvas--dark {
    background-color: #777;
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
  .path {
    fill: transparent;
  }
  .line--online,
  .path--online {
    stroke: lightgreen  ;
    stroke-width: 5;
  }
  .line--offline,
  .path--offline {
    stroke: grey;
    stroke-width: 5;
  }
  .line--loading,
  .path--loading {
    stroke: darkgoldenrod;
    stroke-width: 5;
    stroke-dasharray: 20;
    animation: dashed 1s linear infinite;
  }
</style>