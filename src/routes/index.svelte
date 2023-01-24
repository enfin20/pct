<script context="module">
</script>

<script>
  import {
    versions,
    sourceDB,
    updatedDB,
    currentDB,
  } from "$lib/stores/versions.js";
  import {
    getIDBCategories,
    getIDBExpenses,
    getIDBTypes,
    getIDBDate,
    UpdateIDBversionDate,
  } from "$lib/IDB.js";
  import { YYYYMMDD } from "$lib/date_functions.js";
  import { onMount } from "svelte";
  import chartjs from "chart.js/auto";

  // variables globales
  let version = "";
  let versionMongoDB = "";
  let versionIndexedDB = "";

  // variables pour le dashboard
  var expensesType = [];
  let top5 = [];
  let expenses = [];
  let categoryTypes = [];
  let categories = [];

  let showMonth = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  let showType = [true, true, true, true, true, true, true, true, true];

  let classImgType = [
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
    "w-1/2 inline",
  ];

  const CHART_COLORS = {
    red: "rgb(255, 99, 132)",
    orange: "rgb(255, 159, 64)",
    yellow: "rgb(255, 205, 86)",
    green: "rgb(75, 230, 192)",
    blue: "rgb(54, 162, 235)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(101, 103, 107)",
    grey2: "rgb(153, 192, 192)",
    pct: "rgb(0, 110, 118)",
  };
  let categoryTypesColor = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.grey2,
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.purple,
    CHART_COLORS.yellow,
    CHART_COLORS.grey,
    CHART_COLORS.pct,
    "rgb(255, 99, 132)",
  ];

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
  let erreurMessage = "";

  let chartExpensesType;
  let chartExpensesCategoryType_0;
  let chartExpensesCategoryType_1;
  let chartExpensesCategoryType_2;
  let chartExpensesCategoryType_3;
  let chartExpensesCategoryType_4;
  let chartExpensesCategoryType_5;
  let chartExpensesCategoryType_6;

  let ctxExpensesType;
  let ctxExpensesCategoryType_0;
  let ctxExpensesCategoryType_1;
  let ctxExpensesCategoryType_2;
  let ctxExpensesCategoryType_3;
  let ctxExpensesCategoryType_4;
  let ctxExpensesCategoryType_5;
  let ctxExpensesCategoryType_6;

  var chartExpensesTypeData = [];
  var chartExpensesCategoryTypeData_0 = [];
  var chartExpensesCategoryTypeData_1 = [];
  var chartExpensesCategoryTypeData_2 = [];
  var chartExpensesCategoryTypeData_3 = [];
  var chartExpensesCategoryTypeData_4 = [];
  var chartExpensesCategoryTypeData_5 = [];
  var chartExpensesCategoryTypeData_6 = [];

  onMount(async (promise) => {
    loadVersion();

    ctxExpensesType = chartExpensesType.getContext("2d");
    chartExpensesTypeData = new chartjs(ctxExpensesType, {});

    ctxExpensesCategoryType_0 = chartExpensesCategoryType_0.getContext("2d");
    chartExpensesCategoryTypeData_0 = new chartjs(
      ctxExpensesCategoryType_0,
      {}
    );
    ctxExpensesCategoryType_1 = chartExpensesCategoryType_1.getContext("2d");
    chartExpensesCategoryTypeData_1 = new chartjs(
      ctxExpensesCategoryType_1,
      {}
    );
    ctxExpensesCategoryType_2 = chartExpensesCategoryType_2.getContext("2d");
    chartExpensesCategoryTypeData_2 = new chartjs(
      ctxExpensesCategoryType_2,
      {}
    );
    ctxExpensesCategoryType_3 = chartExpensesCategoryType_3.getContext("2d");
    chartExpensesCategoryTypeData_3 = new chartjs(
      ctxExpensesCategoryType_3,
      {}
    );
    ctxExpensesCategoryType_4 = chartExpensesCategoryType_4.getContext("2d");
    chartExpensesCategoryTypeData_4 = new chartjs(
      ctxExpensesCategoryType_4,
      {}
    );
    ctxExpensesCategoryType_5 = chartExpensesCategoryType_5.getContext("2d");
    chartExpensesCategoryTypeData_5 = new chartjs(
      ctxExpensesCategoryType_5,
      {}
    );
    ctxExpensesCategoryType_6 = chartExpensesCategoryType_6.getContext("2d");
    chartExpensesCategoryTypeData_6 = new chartjs(
      ctxExpensesCategoryType_6,
      {}
    );
  });

  async function loadVersion() {
    // récupération de la version IndexedDB
    versionIndexedDB = await getIDBDate();
    console.info("vidb", versionIndexedDB.substring(0, 11));
    if (versionIndexedDB.substring(0, 11) === "initIDBDate") {
      erreurMessage = versionIndexedDB;
      versionIndexedDB = "20230102";
    }
    // récupération de la version MongoDB
    let res = await fetch("/MDB/versionDate");
    const ver = await res.json();
    versionMongoDB = await ver.versionDate.concat("");
    //versionMongoDB = "20230112";
    versionMongoDB = "";

    version =
      "MDB: " +
      versionMongoDB
        .substring(6, 8)
        .concat("/")
        .concat(versionMongoDB.substring(4, 6)) +
      ", IDB: " +
      versionIndexedDB
        .substring(6, 8)
        .concat("/")
        .concat(versionIndexedDB.substring(4, 6));

    if (versionMongoDB === "") {
      sourceDB.set("IDB");
      updatedDB.set("");
      currentDB.set("IDB");
    } else {
      if (versionMongoDB >= versionIndexedDB) {
        sourceDB.set("MDB");
        updatedDB.set("IDB");
        currentDB.set("MDB");
      } else {
        sourceDB.set("IDB");
        updatedDB.set("MDB");
        currentDB.set("MDB");
      }
    }
    versions.set(version);

    //mise à jour de la version date
    if ($currentDB === "IDB") {
      UpdateIDBversionDate(YYYYMMDD(0).date);
    }
    if ($currentDB === "MDB") {
      res = await fetch("/MDB/versionDate", {
        method: "DELETE",
      });
      res = await fetch("/MDB/versionDate", {
        method: "POST",
        body: JSON.stringify({ date: YYYYMMDD(0).date }),
      });
    }
    loadData();
  }

  async function loadData() {
    categoryTypes = [];
    categories = [];
    expenses = [];

    // récupération des expenses et types
    if ($sourceDB === "IDB") {
      expenses = await getIDBExpenses();
      categoryTypes = await getIDBTypes();
      categories = await getIDBCategories();
    }
    if ($sourceDB === "MDB") {
      let res = await fetch("/MDB/expenses");
      const exp = await res.json();
      expenses = await exp.expenses;
      res = await fetch("/MDB/categoryTypes");
      const typ = await res.json();
      categoryTypes = await typ.categoryTypes;
      res = await fetch("/MDB/categories");
      const cat = await res.json();
      categories = await cat.categories;
    }
    showDashboard();
  }

  async function showDashboard() {
    ///////////////////////////////////////////
    // construction du pivot
    ///////////////////////////////////////////
    let pivot = [];
    let obj = new Object();
    for (var i = 0; i < expenses.length; i++) {
      obj = [];
      obj.amount = expenses[i].amount;
      obj.month = expenses[i].month;
      obj.description = expenses[i].description;
      obj.category = expenses[i].category;
      for (var j = 0; j < categories.length; j++) {
        if (expenses[i].category === categories[j].category) {
          obj.type = categories[j].type;
        }
      }
      pivot.push(obj);
    }

    ///////////////////////////////////////////
    // cumul par type de toutes les dépenses
    ///////////////////////////////////////////
    expensesType = [];

    for (var i = 0; i < categoryTypes.length; i++) {
      expensesType.push({ type: categoryTypes[i].type, amount: 0 });
      for (var j = 0; j < pivot.length; j++) {
        if (pivot[j].type === categoryTypes[i].type) {
          expensesType[i].amount += parseInt(pivot[j].amount);
        }
      }
    }

    ///////////////////////////////////////////
    // Récupération des 5 plus grandes dépenses en fonction des filtres
    ///////////////////////////////////////////
    top5 = [
      { description: "", amount: 0 },
      { description: "", amount: 0 },
      { description: "", amount: 0 },
      { description: "", amount: 0 },
      { description: "", amount: 0 },
    ];
    for (var i = 0; i < pivot.length; i++) {
      for (var j = 0; j < months.length; j++) {
        for (var k = 0; k < categoryTypes.length; k++) {
          if (
            pivot[i].month === months[j] &&
            showMonth[j] &&
            pivot[i].type === categoryTypes[k].type &&
            showType[k]
          ) {
            for (var l = 0; l < top5.length; l++) {
              if (pivot[i].amount >= top5[l].amount) {
                for (var m = top5.length - 1; m > l; m--) {
                  top5[m].description = top5[m - 1].description;
                  top5[m].amount = top5[m - 1].amount;
                }
                top5[l].description = pivot[i].description;
                top5[l].amount = parseInt(pivot[i].amount);
                l = top5.length + 1;
              }
            }
          }
        }
      }
    }

    ///////////////////////////////////////////
    // cumul par mois par type de toutes les dépenses
    ///////////////////////////////////////////
    let datasetExpensesType = [];
    let expensesTypeMonth = [];

    for (var i = 0; i < categoryTypes.length; i++) {
      // affichage des icones type si activé ou non
      if (showType[i]) {
        classImgType[i] = "w-1/4 md:w-1/2 inline";
      } else {
        classImgType[i] = "w-1/4 md:w-1/2 inline grayscale brightness-200";
      }

      expensesTypeMonth.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      for (var j = 0; j < months.length; j++) {
        for (var k = 0; k < pivot.length; k++) {
          if (
            pivot[k].month === months[j] &&
            pivot[k].type === categoryTypes[i].type
          ) {
            expensesTypeMonth[i][j] += parseInt(pivot[k].amount);
          }
        }
      }
      datasetExpensesType.push({
        label: categoryTypes[i].type,
        backgroundColor: categoryTypesColor[i],
        borderColor: categoryTypesColor[i],
        data: expensesTypeMonth[i],
      });
    }

    chartExpensesTypeData.destroy();
    chartExpensesTypeData = new chartjs(ctxExpensesType, {
      type: "bar",
      data: {
        labels: months,

        datasets: datasetExpensesType,
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        plugins: { legend: { labels: { boxWidth: 20 } } },
      },
    });

    ///////////////////////////////////////////
    // cumul par type par categorie par mois (selectionné) de toutes les dépenses
    ///////////////////////////////////////////
    let datasetExpensesCategoryType = [];
    let optionsCategoryType = [];
    let expensesCategoryType = [];
    let categoriesPerType = [];
    for (var i = 0; i < categoryTypes.length; i++) {
      categoriesPerType = [];
      expensesCategoryType = [];
      for (var j = 0; j < categories.length; j++) {
        if (categories[j].type === categoryTypes[i].type) {
          categoriesPerType.push(categories[j].category);
          expensesCategoryType.push(0);
          for (var k = 0; k < pivot.length; k++) {
            for (var l = 0; l < months.length; l++) {
              if (pivot[k].month === months[l] && showMonth[l]) {
                if (
                  pivot[k].type === categoryTypes[i].type &&
                  pivot[k].category === categories[j].category
                ) {
                  expensesCategoryType[expensesCategoryType.length - 1] +=
                    parseInt(pivot[k].amount);
                }
              }
            }
          }
        }
      }

      datasetExpensesCategoryType.push({
        labels: categoriesPerType,
        datasets: [
          {
            label: categoryTypes[i].type,
            data: expensesCategoryType,
          },
        ],
      });

      optionsCategoryType.push({
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: categoryTypes[i].type,
          },
        },
        plugins: { legend: { labels: { boxWidth: 15 } } },
      });
    }

    chartExpensesCategoryTypeData_0.destroy();
    chartExpensesCategoryTypeData_0 = new chartjs(ctxExpensesCategoryType_0, {
      type: "doughnut",
      data: datasetExpensesCategoryType[0],
      options: optionsCategoryType[0],
    });
    chartExpensesCategoryTypeData_1.destroy();
    chartExpensesCategoryTypeData_1 = new chartjs(ctxExpensesCategoryType_1, {
      type: "doughnut",
      data: datasetExpensesCategoryType[1],
      options: optionsCategoryType[1],
    });
    chartExpensesCategoryTypeData_2.destroy();
    chartExpensesCategoryTypeData_2 = new chartjs(ctxExpensesCategoryType_2, {
      type: "doughnut",
      data: datasetExpensesCategoryType[2],
      options: optionsCategoryType[2],
    });
    chartExpensesCategoryTypeData_3.destroy();
    chartExpensesCategoryTypeData_3 = new chartjs(ctxExpensesCategoryType_3, {
      type: "doughnut",
      data: datasetExpensesCategoryType[3],
      options: optionsCategoryType[3],
    });
    chartExpensesCategoryTypeData_4.destroy();
    chartExpensesCategoryTypeData_4 = new chartjs(ctxExpensesCategoryType_4, {
      type: "doughnut",
      data: datasetExpensesCategoryType[4],
      options: optionsCategoryType[4],
    });
    chartExpensesCategoryTypeData_5.destroy();
    chartExpensesCategoryTypeData_5 = new chartjs(ctxExpensesCategoryType_5, {
      type: "doughnut",
      data: datasetExpensesCategoryType[5],
      options: optionsCategoryType[5],
    });
    chartExpensesCategoryTypeData_6.destroy();
    chartExpensesCategoryTypeData_6 = new chartjs(ctxExpensesCategoryType_6, {
      type: "doughnut",
      data: datasetExpensesCategoryType[6],
      options: optionsCategoryType[6],
    });
  }
</script>

<div>
  <div class="py-2 w-full font-bold text-red-500 text-xs text-right">
    {erreurMessage}
  </div>

  <div class="grid grid-cols-4 md:grid-cols-9 place-content-center">
    <div class="hidden md:grid" />
    {#each expensesType as e, i}
      <div>
        <input
          id="type-me{i}"
          class="peer hidden"
          type="checkbox"
          bind:checked={showType[i]}
          on:change={showDashboard}
        />
        <label
          for="type-me{i}"
          class="select-none cursor-pointer 
          py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out  peer-checked:text-pct "
        >
          <img
            class={classImgType[i]}
            src="/images/{e.type}.png"
            alt={e.type}
          />$ {e.amount}
        </label>
      </div>
    {/each}
  </div>
  <div class="grid grid-cols-1 place-content-center mt-10 ">
    <div class="border-solid hover:border-dotted border-2 rounded mr-1">
      <canvas bind:this={chartExpensesType} id="ExpensesType" />
    </div>
  </div>
  <div class="grid grid-cols-6 md:grid-cols-12 place-content-center mt-10">
    {#each months as m, i}
      <div>
        <input
          id="choose-me{i}"
          class="peer hidden"
          type="checkbox"
          bind:checked={showMonth[i]}
          on:change={showDashboard}
        />
        <label
          for="choose-me{i}"
          class="select-none cursor-pointer rounded-lg border-2 border-blue-100
          py-0 md:py-3 px-6 text-xs md:text-base font-bold text-blue-100 transition-colors duration-200 ease-in-out peer-checked:bg-blue-100 peer-checked:text-gray-700 peer-checked:border-blue-100 "
        >
          {m}
        </label>
      </div>
    {/each}
  </div>
  <div class="grid grid-cols-2 md:grid-cols-4 place-content-center mt-5">
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_0} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_1} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_2} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_3} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_4} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_5} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      <canvas bind:this={chartExpensesCategoryType_6} />
    </div>
    <div class="border-solid hover:border-dotted border-2 rounded mr-1 mt-1">
      TOP 5<br /><br />
      <div class="grid grid-cols-3 text-xs md:text-sm">
        {#each top5 as t}
          <div>{t.description}</div>
          <div />
          <div>{t.amount}</div>
        {/each}
      </div>
    </div>
  </div>
</div>
