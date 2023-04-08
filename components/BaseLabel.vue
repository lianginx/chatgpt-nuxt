<template>
  <label :for="name" class="block mb-2 text-sm font-medium text-gray-900">{{
    name
  }}</label>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>
