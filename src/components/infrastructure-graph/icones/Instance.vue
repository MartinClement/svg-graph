<template>
  <svg
    :x="realX"
    :y="realY"
    :height="height"
    :width="width"
    viewbox="0 0 50 50"
    :class="['instance-icon', `instance-icon--${status}`]"
  >
    <path d="M 5 5 H5 45  V45 45 H45 5 Z" class='border'/>
    <rect x='15' y='15' width="20" height="20" class="rect" />
  </svg>
</template>

<script>
  export default {
    name: 'Instance',
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
  @keyframes dashed {
    from { stroke-dashoffset: 0 }
    to   { stroke-dashoffset: -10 }
  }
  .instance-icon--online .border {
    stroke: green;
    fill: lightgreen;
    stroke-width: 5;
  }
  .instance-icon--online .rect {
    fill: green;
  }

  .instance-icon--loading .border {
    stroke: orange;
    fill: lightsalmon;
    stroke-width: 5;
    stroke-dasharray: 5;
    animation: dashed 1s linear infinite;
  }
  .instance-icon--loading .rect {
    fill: lightyellow;
  }
</style>