<script setup lang="ts">
import { Tool, SunOne, Chip } from "@icon-park/vue-next";
import { IconConverter } from "@icon-park/vue-next/lib/runtime";
const examples = [
  {
    name: "工具",
    icon: Tool,
    examples: [
      "如何使用 Javascript 发出 HTTP 请求？",
      "翻译：Hello, Happy World！",
      "变量命名：获取用户信息",
    ],
  },
  {
    name: "专业",
    icon: Chip,
    examples: [
      "用简单的语言解释量子计算",
      "牛顿定律是什么？",
      "AI 技术有什么应用场景？",
    ],
  },
  {
    name: "闲聊",
    icon: SunOne,
    examples: [
      "有没有关于10岁生日的创意？",
      "苏格拉底是一个什么样的人？",
      "番茄牛腩怎么做？",
    ],
  },
];
const emits = defineEmits(["clickExamples"]);
</script>

<template>
  <div class="m-4 sm:m-12">
    <div class="sm:grid grid-cols-3 gap-4 mt-4">
      <div class="flex-1" v-for="item of examples">
        <div class="flex justify-center items-center mb-4">
          <component :is="item.icon" fill="#666" />
          <div class="ml-1 text-center font-bold">
            {{ item.name }}
          </div>
        </div>
        <div class="mb-4 grid gap-4">
          <div
            class="flex justify-center items-center w-full sm:h-20 p-4 rounded bg-white hover:bg-slate-50 text-center text-slate-600 cursor-pointer"
            v-for="exa of item.examples"
            @click="$emit('clickExamples', exa)"
          >
            <div>
              {{ exa }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
