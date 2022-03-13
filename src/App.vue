<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import InfrastructureGraph from './components/infrastructure-graph/InfrastructureGraph.vue';
  import InstanceIcon from './components/infrastructure-graph/icones/Instance.vue';
  import DefaultIcon from './components/infrastructure-graph/icones/Default.vue';
  import LockerIcon from './components/infrastructure-graph/icones/Locker.vue';

  const scene = [
    [{ id: 'User', status: 'online', kind: 'default', to: ['EP'], w: 50, h: 50 }],
    [{ id: 'EP', status: 'online', kind: 'default', to: ['ELB'], w: 50, h: 50 }],
    [{ id: 'ELB', status: 'online', kind: 'default', to: ['I1', 'I2', 'I3'], w: 50, h: 50 }],
    [
      { id: 'I1', status: 'online', kind: 'instances', to: ['L'], w:80, h:80 },
      { id: 'I2', status: 'online', kind: 'instances', to: ['L'], w:80, h:80 },
      { id: 'I3', status: 'online', kind: 'instances', to: ['L'], w:80, h:80 }
    ],
    [
      { id: 'EFS', status: 'online', kind: 'default', w:50, h:50 },
      { id: 'L', status: 'online', kind: 'locker', to: ['EFS', 'AS', 'S3'], w:20, h:20 },
      { id: 'S3', status: 'online', kind: 'default', w:50, h:50 },
    ],
    [{ id: 'AS', status: 'online', kind: 'default',  w:50, h:50}],
  ];

  const resolveIconeByKind = kind => {
    switch(kind) {
      case 'instances':
        return InstanceIcon;
      case 'locker':
        return LockerIcon;
      default:
        return DefaultIcon;
    }
  }
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <InfrastructureGraph
    :width="800"
    :height="400"
    kind="dark"
    :scene="scene"
  >
    <template #icons="graphProps">
      <component
        v-for="({ x, y, status, id, kind, context, w, h }, ii) in graphProps.icons"
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
</style>
