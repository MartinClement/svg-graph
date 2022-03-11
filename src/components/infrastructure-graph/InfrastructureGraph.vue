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
  >
    <g data-name="lines">
      <path
        v-for="(line, li) in lines"
        :key="li"
        :d="line.path"
        :class="`path path--${line.status}`"
      />
    </g>
    <g data-name="icons">
      <component
        v-for="({ x, y, status, id, kind, context }, ci) in flatScene"
        v-bind:is="resolveIconComponent(kind)"
        :key="ci"
        :data-id="id"
        :x="x"
        :y="y"
        :context="context"
        width="50"
        height="50"
        :status="status"
      />
      <!-- <InstanceIcon
        v-for="({ x, y, status, id }, ci) in flatScene"
        :key="ci"
        :data-id="id"
        :x="x"
        :y="y"
        width="50"
        height="50"
        :status="status"
        @click="handleInstanceClick"
      /> -->
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
  import { computed, ref } from 'vue';
  import { buildScene, buildLines, flatten } from './helpers/scene.js';

  export default {
    name: 'InfrastructureGraph',
    components: {
      InstanceIcon,
    },
    props: ['width', 'height', 'kind', 'scene'],
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
        return flatten(processedScene.value);
      });
      const lines = computed(() => {
        return buildLines(flatScene.value, { pathKind: currentPathKind.value });
      });

      const resolveIconComponent = kind => {
        switch(kind) {
          case 'instances':
            return InstanceIcon;
          case 'placeholder':
            return {
              template: "<circle cy='x' cy='y' r='0' />",
              props: ['x', 'y'],
            };
          default:
            return DefaultIcon;
        }
      }

      return { canvasClass, processedScene, flatScene, lines, updateCurrentPathKind, resolveIconComponent };
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
  .path {
    fill: transparent;
  }
  .path--hidden {
    stroke: transparent!important;
  }
  .line--online,
  .path--online {
    stroke: lightgreen;
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
    stroke-dasharray: 10;
    animation: dashed 1s linear infinite;
  }
</style>