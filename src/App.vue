<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import InfrastructureGraph from './components/infrastructure-graph/InfrastructureGraph.vue';
  import { ref, computed } from 'vue';
  // const scenes = [
  //   [
  //     [{ id: 'elb', status: 'offline' }],
  //     [
  //       { id: 'i1', status: 'offline' },
  //       { id: 'i2', status: 'offline' },
  //       { id: 'i3', status: 'offline' },
  //     ],
  //     [
  //       { id: 'efs', status: 'offline' },
  //       { id: 'node', status: 'offline' },
  //       { id: 's3', status: 'offline' },
  //     ],
  //     [
  //       { id: 'rds', status: 'loading' },
  //     ],
  //   ],
  //   [
  //     [{ id: 'elb', to: ['i2'], status: 'online' }],
  //     [
  //       { id: 'i1', status: 'loading' },
  //       { id: 'i2', to: ['node'], status: 'online' },
  //       { id: 'i3', status: 'error' },
  //     ],
  //     [
  //       { id: 'efs', status: 'loading' },
  //       { id: 'node', to: ['efs', 's3', 'rds'], status: 'loading' },
  //       { id: 's3', status: 'loading' },
  //     ],
  //     [
  //       { id: 'rds', status: 'loading'},
  //     ],
  //   ],
  //   [
  //     [{ id: 'elb', to: ['i2'], status: 'online' }],
  //     [
  //       { id: 'i1', to: ['node'], status: 'online' },
  //       { id: 'i2', to: ['node'], status: 'online' },
  //       { id: 'i3', status: 'loading' },
  //     ],
  //     [
  //       { id: 'efs', status: 'online' },
  //       { id: 'node', to: ['efs', 's3', 'rds'], status: 'online' },
  //       { id: 's3', status: 'online' },
  //     ],
  //     [
  //       { id: 'rds', status: 'online'},
  //     ],
  //   ],
  // ];

  const scenes = [
    [
      [
        { id: 'origin_one', status: 'online', to: ['top-child', 'middle-top-child'] },
        { id: 'origin_two', status: 'online' },
        { id: 'origin_two', status: 'online' },
        { id: 'origin_two', status: 'online', to: [ 'bottom-child', 'middle-bottom-child'] }
      ],
      [
        { id: 'top-child', status: 'loading' },
        { id: 'middle-top-child', status: 'loading' },
        { id: 'middle-bottom-child', status: 'loading' },
        { id: 'bottom-child', status: 'loading' },
      ],
    ],
  ];
  const sceneIndex = ref(0);
  const currentScene = computed(() => {
    return scenes[sceneIndex.value];
  });

  // setInterval(() => {
  //   sceneIndex.value = (sceneIndex.value+1) % scenes.length;
  // }, 3000);
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <InfrastructureGraph :width="800" :height='400' kind="dark" :scene="currentScene"/>
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
