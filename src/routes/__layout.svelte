<script>
  import {
    versions,
    sourceDB,
    updatedDB,
    currentDB,
  } from "$lib/stores/versions.js";
</script>

<nav>
  <p class="text-xs text-right text-pct px-2">
    {$versions}
    {$sourceDB} > {$updatedDB} : {$currentDB}
  </p>
  <div class="grid grid-cols-5 text-xs md:text-base bg-pct px-2 py-2 ">
    <div>
      <a
        href="/"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        PCT</a
      >
    </div>
    <div>
      <a
        href="/expenses"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Expenses
      </a>
    </div>
    <div>
      <a
        href="/categories"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Cat.
      </a>
    </div>
    <div>
      <a
        href="/categoryTypes"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Types
      </a>
    </div>
    <div>
      <a
        href="/roadbook"
        class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      >
        Roadbook
      </a>
    </div>
  </div>
</nav>
<div class="px-2 py-2 w-full">
  <div class="flex mb-2 text-gray-500 font-bold">
    <slot />
  </div>
</div>
Footer © 2023 GitHub, Inc. Footer navigation Terms Privacy Security Status Docs Contact
GitHub Pricing API Training Blog About pct/__layout.svelte at 0edb9082549cc563e1463f446385c4f7a31a44f2
· enfin20/pct

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
