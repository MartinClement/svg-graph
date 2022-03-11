<template>
  <svg
    :x="realX"
    :y="realY"
    :height="height"
    :width="width"
    viewbox="0 0 50 50"
  >
    <circle :class="['default-icon', `default-icon--${status}`]" cx='25' cy='25' r=25 />
  </svg>
</template>

<script>
  export default {
    name: 'Default',
    props: ['width', 'height', 'status', 'x', 'y'],
    computed: {
      realX() {
        return this.x - this.width / 2;
      },
      realY() {
        return this.y - this.height / 2;
      },
    },
  }
</script>

<style scoped>
  .default-icon {
    fill: whitesmoke;
  }
</style>