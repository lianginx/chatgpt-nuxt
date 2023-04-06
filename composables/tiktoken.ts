import { ChatRole } from "~~/types";

let total = 0;
const tokens = {
  user: 0,
  assistant: 0,
  system: 0,
};

const add = (role: ChatRole, count?: number) => (tokens[role] += count ?? 1);

const sub = (role: ChatRole, count?: number) => (tokens[role] -= count ?? 1);

const getRoleTokens = (role: ChatRole) => tokens[role];

const getTotalTokens = () =>
  (total = Object.values(tokens).reduce((acc, value) => acc + value, 0));

export { add, sub, getRoleTokens, getTotalTokens };
