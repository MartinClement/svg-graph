<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import InfrastructureGraph from './components/infrastructure-graph/InfrastructureGraph.vue';
  import InstanceIcon from './components/infrastructure-graph/icones/Instance.vue';
  import DefaultIcon from './components/infrastructure-graph/icones/Default.vue';
  import LockerIcon from './components/infrastructure-graph/icones/Locker.vue';
  import DatabaseIcon from './components/infrastructure-graph/icones/Database.vue';

  import { computed, ref } from 'vue';

  const currentPathKind = ref('straight');
  const currentDispatchOrigins = ref(false);
  const lineGap = ref(5);
  const updateCurrentPathKind = kind => {
    currentPathKind.value = kind;
  };

  const updateDispatchOrigins = value => {
    currentDispatchOrigins.value = value;
  };

  const updateLineGap = e => {
    lineGap.value = e.target.value;
  };

  const graphConfig = computed(() => {
    return {
      pathKind: currentPathKind.value,
      dispatchOrigins: currentDispatchOrigins.value,
      originsGap: lineGap.value,
    }
  })

  const scene = [
    [{ id: 'User', status: 'online', kind: 'default', to: ['EP'], w: 50, h: 50 }],
    [{ id: 'EP', status: 'online', kind: 'default', to: ['ELB'], w: 50, h: 50 }],
    [{ id: 'ELB', status: 'online', kind: 'default', to: ['I1', 'I2', 'I3'], w: 50, h: 50 }],
    [
      { id: 'I1', status: 'online', kind: 'instances', to: ['L'], w:80, h:80 },
      { id: 'I2', status: 'error', kind: 'instances', to: ['L'], w:80, h:80 },
      { id: 'I3', status: 'loading', kind: 'instances', to: ['L'], w:80, h:80 }
    ],
    [
      { id: 'EFS', status: 'online', kind: 'default', w:50, h:50 },
      { id: 'L', status: 'online', kind: 'locker', to: ['EFS', 'RDS', 'S3'], w:20, h:20 },
      { id: 'S3', status: 'online', kind: 'default', w:50, h:50 },
    ],
    [{ id: 'RDS', status: 'online', kind: 'db',  w:80, h:80}],
  ];

  const scene2 = [
    [{ id: 'top', status: 'online', kind: 'default', to: ['middle1', 'middle2'], w: 40, h: 40 }],
    [
      { id: 'middle1', status: 'online', kind: 'default', to: ['bottom1', 'bottom2', 'bottom3'], w: 40, h: 40 },
      { id: 'middle2', status: 'online', kind: 'default', to: ['bottom1', 'bottom2', 'bottom3'], w: 40, h: 40 },
    ],
    [
      { id: 'bottom1', status: 'online', kind: 'default', to: ['very-bottom1', 'very-bottom2', 'very-bottom3', 'very-bottom4'], w: 40, h: 40 },
      { id: 'bottom2', status: 'online', kind: 'default', to: ['very-bottom1', 'very-bottom2', 'very-bottom3', 'very-bottom4'], w: 40, h: 40 },
      { id: 'bottom3', status: 'online', kind: 'default', to: ['very-bottom1', 'very-bottom2', 'very-bottom3', 'very-bottom4'], w: 40, h: 40 },
    ],
    [
      { id: 'very-bottom1', status: 'online', kind: 'default', to: [], w: 40, h: 40 },
      { id: 'very-bottom2', status: 'online', kind: 'default', to: [], w: 40, h: 40 },
      { id: 'very-bottom3', status: 'online', kind: 'default', to: [], w: 40, h: 40 },
      { id: 'very-bottom4', status: 'online', kind: 'default', to: [], w: 40, h: 40 },
    ]
  ]

  const resolveIconeByKind = kind => {
    switch(kind) {
      case 'instances':
        return InstanceIcon;
      case 'locker':
        return LockerIcon;
      case 'db':
        return DatabaseIcon;
      default:
        return DefaultIcon;
    }
  }
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div class="button-wrapper">
    <span>Path Kind:</span>
    <button type="button" @click="updateCurrentPathKind('straight')">Straight</button>
    <button type="button" @click="updateCurrentPathKind('straight-zigzag')">Straight ZigZag</button>
    <button type="button" @click="updateCurrentPathKind('curved-zigzag')">Curved ZigZag</button>
  </div>
  <div class="button-wrapper">
    <span>Dispatch Origins:</span>
    <button type="button" @click="updateDispatchOrigins(true)">On</button>
    <button type="button" @click="updateDispatchOrigins(false)">Off</button>
  </div>
  <div class="button-wrapper">
    <span>lineGap:</span>
    <input :value="lineGap" type="range" @change="e => updateLineGap(e)" min="0" max="20"/>
    <span>{{ lineGap }}</span>
  </div>
  <InfrastructureGraph
    :width="800"
    :height="400"
    kind="light"
    :scene="scene"
    :config="graphConfig"
  >
    <template #icons="graphProps">
      <component
        v-for="({ x, y, status, kind, w, h }, ii) in graphProps.icons"
        :is='resolveIconeByKind(kind)'
        :key="ii"
        :x="x"
        :y="y"
        :width="w"
        :height="h"
        :status="status"
      />
    </template>
  </InfrastructureGraph>
  <InfrastructureGraph
    :width="400"
    :height="600"
    kind="light"
    direction="vertical"
    :scene="scene2"
    :config="graphConfig"
  >
  </InfrastructureGraph>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.button-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
