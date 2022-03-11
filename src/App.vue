<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  import InfrastructureGraph from './components/infrastructure-graph/InfrastructureGraph.vue';

  const scene = [
    [{ id: 'User', status: 'online', kind: 'default', to: ['EP'] }],
    [{ id: 'EP', status: 'online', kind: 'default', to: ['ELB'] }],
    [{ id: 'ELB', status: 'online', kind: 'default', to: ['I'] }],
    [
      { kind: 'placeholder'},
      { id: 'I', status: 'online', kind: 'instances', context: { count: 4 }, to: ['AS', 'efs']},
      { id: 'efs', kind: 'default', status: 'loading' },
    ],
    [
      { id: 'AS', kind: 'instances', status: 'online' , context: { count: 3 }},
    ]

  ]

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <InfrastructureGraph :width="800" :height='400' kind="dark" :scene="scene"/>
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
