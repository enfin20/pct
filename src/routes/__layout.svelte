<script>
  import {
    versions,
    sourceDB,
    updatedDB,
    currentDB,
  } from "$lib/stores/versions.js";
</script>

<p class="text-xs text-right text-pct px-2">
  {$versions}
  {$sourceDB} > {$updatedDB} : {$currentDB}
</p>

<div class="navbar text-xs md:text-base bg-pct text-white  w-full">
  <div class="flex-1">
    <a class="btn btn-ghost text-base md:text-xl" href="/">PCT</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/expenses">EXPENSES</a></li>
      <li><a href="/categories">CATEGORIES</a></li>
      <li><a href="/categoryTypes">TYPES</a></li>
      <li><a href="/roadbook">ROADBOOK</a></li>
    </ul>
  </div>
</div>

<div class="px-2 py-2 w-full">
  <div class="flex mb-2 text-gray-500 font-bold">
    <slot />
  </div>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
