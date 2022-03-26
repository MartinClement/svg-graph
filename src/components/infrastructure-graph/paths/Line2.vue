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
  const minusPathTotalLength = computed(() => -pathTotalLength.value);
</script>

<template>
  <g :data-line-id="lineId" :data-line-status="status">
    <path
      :d="path"
      class="line"
      ref="lineRef"
      :id="`path_line_${lineId}`"
    />
    <!-- <circle cx="" cy="" r="5" class="traveling-dot">
      <animateMotion dur="2s" repeatCount="indefinite">
        <mpath :xlink:href="`#path_line_${lineId}`"/>
      </animateMotion>
    </circle> -->
  </g>
</template>

<style lang="scss" scoped>
  @keyframes slideIn {
    from { stroke-dashoffset: v-bind(pathTotalLength)}
    to   { stroke-dashoffset: v-bind(minusPathTotalLength)}
  }
  .line {
    stroke-width: 5;
    stroke-dasharray: v-bind(pathTotalLength);
    fill: transparent;
    animation: slideIn 2s linear infinite;
  }

  [data-line-status="online"] {
    .line {
      stroke: green;
    }
  }
  [data-line-status="loading"] {
    .line {
      stroke: orange;
    }
  }
  [data-line-status="error"] {
    .line {
      stroke: transparent;
    }
  }
</style>