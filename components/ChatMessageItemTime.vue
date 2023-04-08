<template>
  <span>{{ moment(timestamp).fromNow() }}</span>
</template>

<script setup lang="ts">
import moment from "moment";

defineProps<{
  timestamp: number;
}>();
</script>
