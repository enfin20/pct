<script context="module">
</script>

<script>
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
  import { sourceDB, updatedDB, currentDB } from "$lib/stores/versions.js";
  import { onMount } from "svelte";
  import { IDB, getIDBCategories, getIDBExpenses } from "$lib/IDB.js";

  let categories = [];
  let expenses = [];

  onMount(async (promise) => {
    let res = [];
    //initialisation du tableau en fonction de la source
    if ($sourceDB === "IDB") {
      categories = await getIDBCategories();
      expenses = await getIDBExpenses();
    }
    if ($sourceDB === "MDB") {
      res = await fetch("/MDB/categories");
      const cat = await res.json();
      categories = await cat.categories;

      res = await fetch("/MDB/expenses");
      const exp = await res.json();
      expenses = await exp.expenses;
    }

    // Mise à jour de l'autre base
    if ($updatedDB === "IDB") {
      let IDB_key = "";
      IDB.Expenses.clear();
      for (var i = 0; i < expenses.length; i++) {
        IDB_key = await IDB.Expenses.add({
          month: expenses[i].month,
          amount: expenses[i].amount,
          description: expenses[i].description,
          category: expenses[i].category,
        });
      }
    }
    if ($updatedDB === "MDB") {
      var obj = new Object();
      obj.key = "ALL"; // pour supprimer tous les éléments
      let res = await fetch("/MDB/expenses", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      let new_id = "";
      for (var i = 0; i < expenses.length; i++) {
        obj = new Object();
        obj.month = expenses[i].month;
        obj.amount = expenses[i].amount;
        obj.description = expenses[i].description;
        obj.category = expenses[i].category;
        res = await fetch("/MDB/expenses", {
          method: "POST",
          body: JSON.stringify(obj),
        });
        new_id = await res.json();
        expenses[i].key = new_id.insertedId;
      }
    }
  });

  export async function updateExpense(
    key,
    month,
    amount,
    description,
    category
  ) {
    var obj = new Object();
    obj.key = key;
    obj.month = month;
    obj.amount = amount;
    obj.description = description;
    obj.category = category;
    if ($currentDB === "IDB") {
      IDB.Expenses.update(key, {
        month: month,
        amount: amount,
        description: description,
        category: category,
      });
    }
    if ($currentDB === "MDB") {
      const res = await fetch("/MDB/expenses", {
        method: "PUT",
        body: JSON.stringify(obj),
      });
    }
  }

  export async function deleteExpense(key) {
    var obj = new Object();
    obj.key = key;
    if ($currentDB === "IDB") {
      IDB.Expenses.delete(key);
    }
    if ($currentDB === "MDB") {
      const res = await fetch("/MDB/expenses", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
    }
    // remise à jour du tableau
    let remove_elt = "";
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].key === key) {
        remove_elt = i;
      }
    }
    const deleted = expenses.splice(remove_elt, 1);
    expenses = expenses;
  }

  export async function insertExpense(month, amount, description, category) {
    let new_key = "";
    var obj = new Object();
    obj.month = month;
    obj.amount = amount;
    obj.description = description;
    obj.category = category;
    if ($currentDB === "IDB") {
      new_key = await IDB.Expenses.add({
        month: month,
        amount: amount,
        description: description,
        category: category,
      });
      obj.key = new_key;
    }
    if ($currentDB === "MDB") {
      const res = await fetch("/MDB/expenses", {
        method: "POST",
        body: JSON.stringify(obj),
      });
      new_key = await res.json();
      obj.key = new_key.message;
    }
    // remise à jour du tableau
    expenses.unshift(obj);
    expenses = expenses;
    new_month = "";
    new_amount = "";
    new_description = "";
    new_category = "";
  }
</script>

<div class="py-2 grid gap-1">
  <p class="text-2xl font-bold text-gray-800 md:text-xl">Categories</p>

  <div class="flex flex-col h-screen">
    <div class="flex-grow overflow-y-auto">
      <table
        id="ExpensesListe"
        class=" text-gray-500 w-full relative table table-compact bg-white"
      >
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
          {#each expenses as e}
            <tr
              class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
            >
              <td class="text-left align-middle py-1 px-1 w-[15%]">
                <select
                  bind:value={e.month}
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
                  bind:value={e.amount}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[35%]">
                <input
                  type="text"
                  bind:value={e.description}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                />
              </td>
              <td class="text-left align-middle py-1 px-1 w-[25%]">
                <select
                  bind:value={e.category}
                  class="text-xs md:text-base appearance-none border-2 border-gray-200 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pink-400"
                >
                  {#each categories as c}
                    <option value={c.category}>
                      {c.category}
                    </option>
                  {/each}
                </select>
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="text-xs md:text-base bg-green-400 hover:bg-green-600 text-gray-500 py-1 px-1 rounded"
                  id={e.key}
                  on:click={updateExpense(
                    e.key,
                    e.month,
                    e.amount,
                    e.description,
                    e.category
                  )}>Update</button
                >
              </td>
              <td class="align-middle py-1 px-1 w-[5%]">
                <button
                  class="text-xs md:text-base bg-red-400 hover:bg-red-600 text-gray-500 py-1 px-1 rounded"
                  id={e.key}
                  on:click={deleteExpense(e.key)}>Delete</button
                >
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
