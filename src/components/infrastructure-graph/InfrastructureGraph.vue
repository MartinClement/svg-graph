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
        :line-id="li"
      />
      <!-- <LinePath2
        v-for="(line, li) in lines"
        :key="li"
        :path="line.path"
        :status="line.status"
        :line-id="li"
      /> -->
    </g>
    <g data-name="icons">
      <slot name="icons" :icons="flatScene">
        <DefaultIcon
          v-for="({ x, y, status, id, context }, ci) in flatScene"
          :key="ci"
          :data-id="id"
          :x="x"
          :y="y"
          :context="context"
          width="50"
          height="50"
          :status="status"
        />
      </slot>
    </g>
  </svg>
  <div>
    {{ flatScene }}
    {{ lines }}
  </div>
</template>

<script>
  import InstanceIcon from './icones/Instance.vue';
  import DefaultIcon from './icones/Default.vue';
  import LinePath from './paths/Line.vue';
  import LinePath2 from './paths/Line2.vue';
  import { computed, ref, onMounted } from 'vue';
  import { buildScene, buildLines, flatten } from './helpers/scene.js';

  export default {
    name: 'InfrastructureGraph',
    components: {
      InstanceIcon,
      DefaultIcon,
      LinePath,
      LinePath2,
    },
    props: {
      width: Number,
      height: Number,
      kind: {
        type: String,
        validator: v => ['dark', 'light'].includes(v),
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

      const canvasClass = computed(() => {
        return `${BASE_CLASS} ${BASE_CLASS}${props.kind === 'dark' ? '--dark' : '--light'}`;
      });

      const processedScene = computed(() => {
        return props.scene ? buildScene(props.scene, { height: props.height, width: props.width }) : [];
      });

      const flatScene = computed(() => {
        const res = flatten(processedScene.value);
        return res;
      });

      const lines = computed(() => {
        const config = Object.assign(BASE_CONFIG, props.config)
        return buildLines(flatScene.value, config);
      });

      return { canvasClass, processedScene, flatScene, lines };
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
  .main_canvas--dark {
    background-color: #212121;
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