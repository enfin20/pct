<script>
  import {
    versions,
    sourceDB,
    updatedDB,
    currentDB,
  } from "$lib/stores/versions.js";
</script>

<nav>
  <p class="text-xs text-right text-pct">
    {$versions}
    {$sourceDB} > {$updatedDB} : {$currentDB}
  </p>
  <div class="grid grid-cols-5 text-xs md:text-base bg-pct rounded py-2 ">
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
<div class="py-2 w-full">
  <div class="flex mb-2 text-gray-500 font-bold">
    <slot />
  </div>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
