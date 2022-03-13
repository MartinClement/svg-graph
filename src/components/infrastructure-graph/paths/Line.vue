<script setup>
  import { ref, computed, onMounted } from 'vue';
  const props = defineProps({
    path: String,
    status: String,
    lineId: Number,
  });

  const lineRef = ref(undefined);
  const lineClass = computed(() => {
    return `line line--${props.status}`;
  });

  const pathTotalLength = computed(() => lineRef.value ? lineRef.value.getTotalLength() : 10000);
  const dashArray = computed(() => pathTotalLength.value / 10);
  const dashOffset = computed(() => pathTotalLength.value);

  onMounted(() => {
    console.log(lineRef);
  })
</script>

<template>
  <g :data-line-id="lineId" :data-line-status="status">
    <path
      :d="path"
      :class="lineClass"
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
  @keyframes glow {
    from { fill: lightgreen }
    to   { fill: green }
  }

  .line {
    stroke-width: 5;
    fill: transparent;
    &--online {
      stroke: green;
    }
  }

  [data-line-status="online"] {
    .traveling-dot {
      animation: 1s glow linear infinite alternate;
    }
  }
</style>