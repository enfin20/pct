import { writable } from "svelte/store";
export const versions = writable(0);
export const sourceDB = writable(0);
export const updatedDB = writable(0);
export const currentDB = writable(0);
