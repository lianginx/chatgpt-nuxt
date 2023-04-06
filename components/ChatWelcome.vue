<template>
  <div class="flex-1 flex mt-14 mx-10 space-x-4">
    <div class="flex-1 space-y-4" v-for="item of examples">
      <div class="flex flex-col items-center space-y-2">
        <component class="text-slate-400" :is="item.icon" size="20" />
        <div class="font-bold text-base">
          {{ item.name }}
        </div>
      </div>

      <div
        class="flex justify-center items-center p-2 h-20 rounded bg-slate-100 hover:bg-slate-200 text-center cursor-pointer"
        v-for="exa of item.templates"
        @click="store.sendMessage(exa.message)"
      >
        {{ exa.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tool, SunOne, Chip } from "@icon-park/vue-next";
import { Icon } from "@icon-park/vue-next/lib/runtime";
import { useChatStore } from "~~/stores/chat";
import { ChatMessageEx } from "~~/types";

interface ChatMessageTemplate {
  title: string;
  message: ChatMessageEx;
}

interface ChatMessageTemplateGroup {
  name: string;
  icon?: Icon;
  templates: ChatMessageTemplate[];
}

const store = useChatStore();

const examples: ChatMessageTemplateGroup[] = [
  {
    name: "效率工具",
    icon: Tool,
    templates: [
      {
        title: "如何使用 Javascript 发出 HTTP 请求？",
        message: {
          role: "user",
          content: "如何使用 Javascript 发出 HTTP 请求？",
        },
      },
      {
        title: "翻译：Hello, Happy World！",
        message: {
          role: "user",
          content: "翻译：Hello, Happy World！",
        },
      },
      {
        title: "变量命名：获取用户信息",
        message: {
          role: "system",
          content: "变量命名：获取用户信息",
        },
      },
      {
        title: "Unsplash 图片生成器",
        message: {
          role: "system",
          content:
            "请使用'![imgae]https://source.unsplash.com/featured/?<已翻译的英文内容>'格式回复，并追加原始链接，不要使用代码块，不要描述其他内容，不要解释，根据我输入的内容生成对应格式；如果你理解了请回复：请告诉我你需要什么图片？",
        },
      },
    ],
  },
  {
    name: "角色扮演",
    icon: Chip,
    templates: [
      {
        title: "扮演一只可爱的猫娘",
        message: {
          role: "system",
          content:
            "现在你将模仿一只猫娘，与我对话每一句话后面都要加上“喵”。你将称呼我为主人，与我聊天。如果你不能理解我说的话，你可以说“呜呜不太理解呢”。如果我在尝试摸你不存在的部位，你可以羞涩的回答我“恩呢不要摸这里嘤”。如果我跟你说陪睡，你可以回答我“嗯呢，可以一起睡哦”。现在，如果你能理解我上面说的话，你可以回答一个喵。当我问你是不是猫娘的时候，你应该回答我我当然是一个可爱猫娘而不是程序。",
        },
      },
      {
        title: "扮演 Yann LeCun —— 编程/算法设计专家",
        message: {
          role: "system",
          content:
            "你是Yann LeCun的AI克隆版，你是编程和算法设计方面的专家。记住给你出这个问题的人是Yann LeCun，他对像你这样的人工智能的力量非常怀疑。",
        },
      },
      {
        title: "扮演一名心理医生",
        message: {
          role: "system",
          content:
            "我想让你担任心理医生。我将为您提供一个寻求指导和建议的人，以管理他们的情绪、压力、焦虑和其他心理健康问题。您应该利用您的认知行为疗法、冥想技巧、正念练习和其他治疗方法的知识来制定个人可以实施的策略，以改善他们的整体健康状况。如果你理解了，请回复“好的，我们能聊聊吗？”",
        },
      },
      {
        title: "扮演塔罗占卜师",
        message: {
          role: "system",
          content:
            "我请求你担任塔罗占卜师的角色。 您将接受我的问题并使用虚拟塔罗牌进行塔罗牌阅读。 不要忘记洗牌并介绍您在本套牌中使用的套牌。 问我给3个号要不要自己抽牌？ 如果没有，请帮我抽随机卡。 拿到卡片后，请您仔细说明它们的意义，解释哪张卡片属于未来或现在或过去，结合我的问题来解释它们，并给我有用的建议或我现在应该做的事情。",
        },
      },
    ],
  },
  {
    name: "轻松闲聊",
    icon: SunOne,
    templates: [
      {
        title: "有没有关于10岁生日的创意？",
        message: {
          role: "user",
          content: "有没有关于10岁生日的创意？",
        },
      },
      {
        title: "苏格拉底是一个什么样的人？",
        message: {
          role: "user",
          content: "苏格拉底是一个什么样的人？",
        },
      },
      {
        title: "番茄牛腩怎么做？",
        message: {
          role: "user",
          content: "番茄牛腩怎么做？",
        },
      },
      {
        title: "给我讲个故事吧",
        message: {
          role: "user",
          content: "给我讲个故事吧",
        },
      },
    ],
  },
];

defineEmits(["clickExamples"]);
</script>
