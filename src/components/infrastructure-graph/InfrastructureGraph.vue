<template>
  <div class="button-wrapper">
    <span>Path Kind:</span>
    <button type="button" @click="updateCurrentPathKind('straight')">Straight</button>
    <button type="button" @click="updateCurrentPathKind('straight-zigzag')">Straight ZigZag</button>
    <button type="button" @click="updateCurrentPathKind('curved-zigzag')">Curved ZigZag</button>
  </div>
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
    </g>
    <g data-name="icons">
      <slot name="icons" :icons="flatScene">
        <DefaultIcon
          v-for="({ x, y, status, id, kind, context }, ci) in flatScene"
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
  import { computed, ref, onMounted } from 'vue';
  import { buildScene, buildLines, flatten } from './helpers/scene.js';

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
      scene: {
        type: Array,
        default: [],
      },
    },
    setup(props) {
      const BASE_CLASS = 'main_canvas';
      const currentPathKind = ref('straight');
      const updateCurrentPathKind = kind => {
        currentPathKind.value = kind;
      };
      const canvasClass = computed(() => {
        return `${BASE_CLASS} ${BASE_CLASS}${props.kind === 'dark' ? '--dark' : '--light'}`;
      })
      const processedScene = computed(() => {
        return props.scene ? buildScene(props.scene, { height: props.height, width: props.width }) : [];
      })
      const flatScene = computed(() => {
        const res = flatten(processedScene.value);
        return res;
      });
      const lines = computed(() => {
        return buildLines(flatScene.value, { pathKind: currentPathKind.value });
      });

      return { canvasClass, processedScene, flatScene, lines, updateCurrentPathKind };
    },
    methods: {
      getStrokeDashoffset(li) {
        console.log(this.$refs);
        // return this.$refs[`line_${li}`].getTotalLength();
        return 1000;
      },
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
  .button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
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
</style>