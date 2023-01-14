<script>
  export let categoryTypes;
  export let categories;
  export let sourceDB;

  let new_category = "";
  let new_type = "";

  import { createEventDispatcher } from "svelte";
  import { IDB } from "$lib/IDB";

  const dispatch = createEventDispatcher();

  function showCategories() {
    dispatch("showCategories");
  }

  export async function updateCategory(c_id, category, type) {
    var obj = new Object();
    obj._id = c_id;
    obj.category = category;
    obj.type = type;
    if (sourceDB === "MDB") {
      // MAJ MongoDB
      const res = await fetch("/categories", {
        method: "PUT",
        body: JSON.stringify(obj),
      });
    } else {
      // MAJ IndexedDB
      IDB.Categories.update(c_id, {
        category: category,
        type: type,
      });
    }
    showCategories();
  }

  export async function deleteCategory(c_id) {
    var obj = new Object();
    obj._id = c_id;
    if (sourceDB === "MDB") {
      // suppression dans MongoDB
      const res = await fetch("/categories", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
    } else {
      // suppression dans IndexedDB
      IDB.Categories.delete(c_id);
    }

    // remise à jour du tableau
    let remove_id = "";
    for (var i = 0; i < categories.length; i++) {
      if (categories[i]._id === c_id) {
        remove_id = i;
      }
    }
    const deleted = categories.splice(remove_id, 1);
    categories = categories;
    showCategories();
  }

  export async function insertCategory(category, type) {
    let new_id = "";
    var obj = new Object();
    obj.category = category;
    obj.type = type;
    if (sourceDB === "MDB") {
      // insertion dans MongoDB
      const res = await fetch("/categories", {
        method: "POST",
        body: JSON.stringify(obj),
      });
      new_id = await res.json();
      obj._id = new_id.message;
    } else {
      // insertion dans IndexedDB
      new_id = await IDB.Categories.add({
        category: category,
        type: type,
      });
      obj._id = new_id;
    }
    // remise à jour du tableau
    categories.unshift(obj);
    categories = categories;
    new_category = "";
    new_type = "";
    showCategories();
  }
</script>

<div class="py-2 grid gap-1">
  <p class="text-2xl font-bold text-gray-800 md:text-xl">Categories</p>

  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="CategoriesListe" class="text-sm text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[45%] sticky top-0 bg-white">Category</th>
            <th class="w-[45%] sticky top-0 bg-white">Type</th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-[45%]">
              <input
                type="text"
                bind:value={new_category}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-[45%]">
              <select
                bind:value={new_type}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each categoryTypes as t}
                  <option value={t.type}>
                    {t.type}
                  </option>
                {/each}
              </select>
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertCategory(new_category, new_type)}
                >Add
              </button>
            </td>
          </tr>
          {#each categories as c}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[45%]">
                <input
                  type="text"
                  bind:value={c.category}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[45%]">
                <select
                  bind:value={c.type}
                  class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each categoryTypes as t}
                    <option value={t.type}>
                      {t.type}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={c._id}
                  on:click={updateCategory(c._id, c.category, c.type)}
                  >Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={c._id}
                  on:click={deleteCategory(c._id)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
