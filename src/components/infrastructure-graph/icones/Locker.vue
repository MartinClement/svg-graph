<template>
  <svg
    :width="width"
    :height="height"
    :x="realX"
    :y="realY"
    viewBox="0 0 30 30"
  >
    <circle cx="15" cy=15 r="15" fill="black" />
    <rect x="7" y="10" width="16" height="16" fill="white" />
    <circle cx="15" cy=10 r="5" stroke="white" stroke-width="2" fill="transparent" />
  </svg>
</template>

<script>
  import { computed } from 'vue';
  export default {
    name: 'Locker',
    props: ['width', 'height', 'x', 'y'],
    setup(props) {
      const realX = computed(() => props.x - props.width / 2);
      const realY = computed(() => props.y - props.height / 2);

      return { realX, realY };
    }
  }
</script>