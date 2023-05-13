<template>
  <div>
    <BaseLabel :name="label" />
    <input
      :id="label"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      type="text"
      :placeholder="placeholder ?? $t('baseInput.placeholder')"
      :disabled="disabled"
      :value="value"
      @input="$emit('input', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}>();
</script>
