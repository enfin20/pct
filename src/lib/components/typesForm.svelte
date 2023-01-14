<script>
  export let categoryTypes;
  export let sourceDB;

  let new_type = "";

  import { createEventDispatcher } from "svelte";
  import { IDB } from "$lib/IDB";

  const dispatch = createEventDispatcher();

  function showTypes() {
    dispatch("showTypes");
  }

  export async function updateType(t_id, type) {
    var obj = new Object();
    obj._id = t_id;
    obj.type = type;
    if (sourceDB === "MDB") {
      const res = await fetch("/categoryTypes", {
        method: "PUT",
        body: JSON.stringify(obj),
      });
    } else {
      IDB.Types.update(t_id, {
        type: type,
      });
    }
    showTypes();
  }

  export async function deleteType(t_id) {
    var obj = new Object();
    obj._id = t_id;
    if (sourceDB === "MDB") {
      // suppression dans MongoDB
      const res = await fetch("/categoryTypes", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
    } else {
      // suppression dans IndexedDB
      IDB.Types.delete(t_id);
    }

    // remise à jour du tableau
    let remove_id = "";
    for (var i = 0; i < categoryTypes.length; i++) {
      if (categoryTypes[i]._id === t_id) {
        remove_id = i;
      }
    }
    const deleted = categoryTypes.splice(remove_id, 1);
    categoryTypes = categoryTypes;

    showTypes();
  }

  export async function insertType(type) {
    let new_id = "";
    var obj = new Object();
    obj.type = type;
    if (sourceDB === "MDB") {
      // insertion dans MongoDB
      const res = await fetch("/categoryTypes", {
        method: "POST",
        body: JSON.stringify(obj),
      });
      new_id = await res.json();
      obj._id = new_id.message;
    } else {
      // insertion dans IndexedDB
      new_id = await IDB.Types.add({
        type: type,
      });
      obj._id = new_id;
    }
    // remise à jour du tableau
    categoryTypes.unshift(obj);
    categoryTypes = categoryTypes;
    new_type = "";
    showTypes();
  }
</script>

<div class="py-2 grid gap-1">
  <p class="text-2xl font-bold text-gray-800 md:text-xl">Types</p>

  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="CategoriesListe" class="text-sm text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[90%] sticky top-0 bg-white">Type</th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-[90%]">
              <input
                type="text"
                bind:value={new_type}
                class=" appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertType(new_type)}
                >Add
              </button>
            </td>
          </tr>
          {#each categoryTypes as t}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[90%]">
                <input
                  type="text"
                  bind:value={t.type}
                  class="appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={t._id}
                  on:click={updateType(t._id, t.type)}>Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={t._id}
                  on:click={deleteType(t._id)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
