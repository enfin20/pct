<script>
  export let expenses;
  export let categories;
  export let sourceDB;

  // nouvelle expense
  let new_month = "";
  let new_amount = "";
  let new_description = "";
  let new_category = "";
  let months = [
    "OCT",
    "NOV",
    "DEC",
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
  ];

  import { createEventDispatcher } from "svelte";
  import { IDB } from "/src/lib/IDB.js";

  const dispatch = createEventDispatcher();

  function showExpenses() {
    dispatch("showExpenses");
  }

  export async function updateExpense(
    t_id,
    month,
    amount,
    description,
    category
  ) {
    // Mise à jour de expense
    var obj = new Object();
    obj._id = t_id;
    obj.month = month;
    obj.amount = amount;
    obj.description = description;
    obj.category = category;

    if (sourceDB === "MDB") {
      const res = await fetch("/expenses", {
        method: "PUT",
        body: JSON.stringify(obj),
      });
      showExpenses();
    } else {
      IDB.Expenses.update(t_id, {
        month: month,
        amount: amount,
        description: description,
        category: category,
      });
    }
  }

  export async function deleteExpense(t_id) {
    // suppression de la expense
    var obj = new Object();
    obj._id = t_id;

    if (sourceDB === "MDB") {
      // suppression dans MongoDB
      const res = await fetch("/expenses", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
    } else {
      // suppression dans IndexedDB
      IDB.Expenses.delete(t_id);
    }

    // remise à jour du tableau
    let remove_id = "";
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i]._id === t_id) {
        remove_id = i;
      }
    }
    const deleted = expenses.splice(remove_id, 1);
    expenses = expenses;
    showExpenses();
  }

  export async function insertExpense(month, amount, description, category) {
    let new_id = "";
    var obj = new Object();
    obj.month = month;
    obj.amount = amount;
    obj.description = description.toUpperCase();
    obj.category = category;

    if (sourceDB === "MDB") {
      // insertion dans MongoDB
      const res = await fetch("/expenses", {
        method: "POST",
        body: JSON.stringify(obj),
      });
      new_id = await res.json();
      obj._id = new_id.message;
    } else {
      // insertion dans IndexedDB
      new_id = await IDB.Expenses.add({
        amount: amount,
        description: description.toUpperCase(),
        category: category,
        month: month,
      });
      obj._id = new_id;
    }

    // remise à jour du tableau
    expenses.unshift(obj);
    expenses = expenses;
    new_month = "";
    new_amount = "";
    new_description = "";
    new_category = "";
    showExpenses();
  }
</script>

<div class="py-2 grid gap-1">
  <p class="text-2xl font-bold text-gray-800 md:text-xl">Expenses</p>

  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table id="ExpensesListe" class=" text-gray-500 w-full relative">
        <thead>
          <tr>
            <th class="w-[15%] sticky top-0 bg-white">Month</th>
            <th class="w-[15%] sticky top-0 bg-white">Amount</th>
            <th class="w-[45%] sticky top-0 bg-white">Description</th>
            <th class="w-[15%] sticky top-0 bg-white">Category</th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 w-[15%]">
              <select
                bind:value={new_month}
                class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each months as m}
                  <option value={m}>
                    {m}
                  </option>
                {/each}
              </select>
            </td>
            <td class="text-left align-middle py-1 px-1 w-[15%]">
              <input
                type="text"
                bind:value={new_amount}
                class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-[35%]">
              <input
                type="text"
                bind:value={new_description}
                class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 w-[25%]">
              <select
                bind:value={new_category}
                class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
              >
                {#each categories as category}
                  <option value={category.category}>
                    {category.category}
                  </option>
                {/each}
              </select>
            </td>
            <td class="align-middle py-1 px-1 w-[10%]">
              <button
                class="text-xs md:text-base bg-green-600 hover:bg-green-800 text-white py-1 px-1 rounded"
                on:click={insertExpense(
                  new_month,
                  new_amount,
                  new_description,
                  new_category
                )}
                >Add
              </button>
            </td>
          </tr>
          {#each expenses as t}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[15%]">
                <select
                  bind:value={t.month}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each months as m}
                    <option value={m}>
                      {m}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="text-left align-middle py-1 px-1 w-[15%]">
                <input
                  type="text"
                  bind:value={t.amount}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[35%]">
                <input
                  type="text"
                  bind:value={t.description}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[25%]">
                <select
                  bind:value={t.category}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each categories as category}
                    <option value={category.category}>
                      {category.category}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="text-xs md:text-base bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={t._id}
                  on:click={updateExpense(
                    t._id,
                    t.month,
                    t.amount,
                    t.description,
                    t.category
                  )}>Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="text-xs md:text-base bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={t._id}
                  on:click={deleteExpense(t._id)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
