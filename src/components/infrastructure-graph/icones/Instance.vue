<template>
  <svg
    :x="realX"
    :y="realY"
    :height="height"
    :width="width"
    viewBox="0 0 40 30"
    :class="['instance-icon', `instance-icon--${status}`]"
  >
    <ellipse cx="20" cy="21" rx="18" ry="5" class="base"/>
    <g class="group" data-name="bottom">
      <path d="M5 15 L20 10 L35 15 L20 20 Z" fill="#424242"/>
      <path d="M5 15 L20 20 V25 L5 20 Z" fill="#ccc"/>
      <path d="M20 20 L35 15 V20 L20 25 Z" fill="#aaa"/>
    </g>
      <ellipse cx="20" cy="15" rx="8" ry="3" class="glow"/>
    <g class="group" data-name="top">
      <path d="M5 10 L20 5 L35 10 L20 15 Z" fill="#808080"/>
      <path d="M5 10 L20 15 V20 L5 15 Z" fill="#ccc" />
      <path d="M20 15 L35 10 V15 L20 20 Z" fill="#aaa"/>
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'Instance',
    props: ['width', 'height', 'status', 'x', 'y', 'context'],
    computed: {
      realX() {
        return this.x - this.width / 2
      },
      realY() {
        return this.y - this.height / 2 - 12;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @keyframes levitate {
    from { transform: translateY(0);}
    to   { transform: translateY(-4px);}
  }

  @keyframes dashed {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 40 }
  }

  @keyframes choke {
    0%   { transform: translateX(0);}
    50%  { transform: translateX(10px);}
    100% {transform: translateX(-10px);}
  }

  .instance-icon {
    stroke-width: 0.5;

    [data-name="top"] {
      animation: levitate 2s linear alternate infinite;
    }

    &--online {
      .group { stroke: green; }
      .glow { fill: lightgreen; }
      .base {
        fill: lightgreen;
        stroke: green;
        stroke-width: 1;
      }
    }
    &--loading {
      .group { stroke: orange; }
      .glow { fill: orange; }
      .base {
        fill: gold;
        stroke: orange;
        stroke-width: 1;
        stroke-dasharray: 10;
        animation: 2s dashed linear infinite;
      }
    }
    &--error {
      .group { stroke: orange; }
      .glow { fill: orange; }
      .base {
        fill: gold;
        stroke: orange;
        stroke-width: 1;
        stroke-dasharray: 10;
        animation: 2s dashed linear infinite;
      }
    }
  }
  

</style>