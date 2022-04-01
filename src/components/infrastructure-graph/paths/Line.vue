<script setup>
  import { ref, computed, onMounted } from 'vue';
  const props = defineProps({
    path: String,
    status: String,
    lineId: String,
  });

  const lineRef = ref(undefined);
  const lineClass = computed(() => {
    return `line line--${props.status}`;
  });

  const pathTotalLength = computed(() => lineRef.value ? lineRef.value.getTotalLength() : 10000);
  const dashArray = computed(() => pathTotalLength.value / 10);
  const dashOffset = computed(() => pathTotalLength.value);
</script>

<template>
  <g :data-line-id="lineId" :data-line-status="status">
    <path
      :d="path"
      class="line"
      ref="lineRef"
      :id="`path_line_${lineId}`"
    />
    <circle cx="" cy="" r="5" class="traveling-dot">
      <animateMotion dur="2s" repeatCount="indefinite">
        <mpath :xlink:href="`#path_line_${lineId}`"/>
      </animateMotion>
    </circle>
  </g>
</template>

<style lang="scss" scoped>
  @keyframes greenGlow {
    from { fill: lightgreen }
    to   { fill: green }
  }
  @keyframes orangeGlow {
    from { fill: gold }
    to   { fill: orange }
  }
  @keyframes redGlow {
    from { fill: transparent }
    to   { fill: transparent }
  }

  .line {
    stroke-width: 5;
    fill: transparent;
  }

  [data-line-status="online"] {
    .line {
      stroke: green;
    }
    .traveling-dot {
      animation: 1s greenGlow linear infinite alternate;
    }
  }
  [data-line-status="loading"] {
    .line {
      stroke: orange;
    }
    .traveling-dot {
      animation: 1s orangeGlow linear infinite alternate;
    }
  }
  [data-line-status="error"] {
    .line {
      stroke: transparent;
    }
    .traveling-dot {
      animation: 1s redGlow linear infinite alternate;
    }
  }
</style>