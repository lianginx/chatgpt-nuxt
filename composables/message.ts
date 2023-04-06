// import { ChatMessage, ChatMessageEx, ChatMessageExOption } from "../types";

// export const messagesEx = ref<ChatMessageEx[]>([]);

// /**
//  * 获取消息队列中最后一条消息
//  */
// export const getLastMessage = () =>
//   messagesEx.value[messagesEx.value.length - 1];

// /**
//  * 获取扩展消息队列
//  * @param option 过滤条件
//  * @returns 扩展消息队列
//  */
// export const getMessagesEx = ({
//   role,
//   content,
//   active,
//   show,
//   error,
//   errorMessage,
//   sendDate = { start: undefined, end: undefined },
// }: ChatMessageExOption = {}) => {
//   return messagesEx.value.filter(
//     (msg: ChatMessageEx) =>
//       (role === undefined || msg.role === role) &&
//       (active === undefined || msg.active === active) &&
//       (show === undefined || msg.show === show) &&
//       (error === undefined || msg.error === error) &&
//       (errorMessage === undefined ||
//         msg.errorMessage?.includes(errorMessage)) &&
//       (typeof content === "undefined" ||
//         (typeof content === "boolean"
//           ? !content || msg.content
//           : msg.content.includes(content))) &&
//       (sendDate?.start && msg.sendDate
//         ? msg.sendDate >= sendDate.start
//         : true) &&
//       (sendDate?.end && msg.sendDate ? msg.sendDate <= sendDate.end : true)
//   );
// };

// /**
//  * 获取标准消息队列
//  * @param option 过滤条件
//  * @returns 标准消息队列
//  */
// export const getMessages = (
//   option: ChatMessageExOption = {}
// ): ChatMessage[] => {
//   option.content = option.content ?? true;
//   option.active = option.active ?? true;
//   option.error = option.error ?? false;
//   return getMessagesEx(option).map((msg) => ({
//     role: msg.role,
//     content: msg.content,
//   }));
// };

// /**
//  * 追加新消息到消息队列
//  * @param items 新消息
//  */
// export const appendMessages = (...items: ChatMessageEx[]) => {
//   messagesEx.value.push(
//     ...items.map((msg) => ({
//       ...msg,
//       active: msg.active ?? true,
//       show: msg.show ?? true,
//       error: msg.error ?? false,
//       sendDate: Date.now(),
//     }))
//   );
//   return getLastMessage();
// };

// /**
//  * 追加消息内容到新消息
//  */
// export const appendMessageContent = (content: string) => {
//   const lastMsg = getLastMessage();
//   lastMsg.content += content ?? "";
//   lastMsg.sendDate = Date.now();
//   return lastMsg;
// };

// /**
//  * 标记本轮对话为错误并补充错误信息
//  */
// export const makeErrorMessage = (errorMessage: string) => {
//   const lastMsg = getLastMessage();
//   lastMsg.error = true;
//   lastMsg.errorMessage = errorMessage;
//   return lastMsg;
// };

// export const nextMessage = (currentIndex?: number | null) => {
//   const userMessages = getMessagesEx({ role: "user" });
//   const index = currentIndex ?? -1;
//   const nextIndex = index + 1 === userMessages.length ? 0 : index + 1;
//   return {
//     index: nextIndex,
//     message: userMessages.at(nextIndex)?.content ?? null,
//   };
// };

// export const previousMessage = (currentIndex?: number | null) => {
//   const userMessages = getMessagesEx({ role: "user" });
//   const index = currentIndex ?? userMessages.length;
//   const nextIndex = index - 1 < 0 ? userMessages.length - 1 : index - 1;
//   return {
//     index: nextIndex,
//     message: userMessages.at(nextIndex)?.content ?? null,
//   };
// };
