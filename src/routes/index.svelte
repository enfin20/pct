<script context="module">
</script>

<script>
  let versionMongoDB = "";
  let versionIndexedDB = "";
  let sourceDB = "";

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
  let dashboardVisible = "flex";
  let expensesVisible = "hidden";
  let categoriesVisible = "hidden";
  let typesVisible = "hidden";
  let roadbookVisible = "hidden";
  let expenses = [];
  let categories = [];
  let categoryTypes = [];
  let roadbook = [];
  let top5 = [];

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

  let erreurMessageRG = "";
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

  var expensesType = [];

  let chartExpensesType;
  let chartExpensesCategoryType_0;
  let chartExpensesCategoryType_1;
  let chartExpensesCategoryType_2;
  let chartExpensesCategoryType_3;
  let chartExpensesCategoryType_4;
  let chartExpensesCategoryType_5;
  let chartExpensesCategoryType_6;
  let chartExpensesCategoryType_7;

  let ctxExpensesType;
  let ctxExpensesCategoryType_0;
  let ctxExpensesCategoryType_1;
  let ctxExpensesCategoryType_2;
  let ctxExpensesCategoryType_3;
  let ctxExpensesCategoryType_4;
  let ctxExpensesCategoryType_5;
  let ctxExpensesCategoryType_6;
  let ctxExpensesCategoryType_7;

  var chartExpensesTypeData = [];
  var chartExpensesCategoryTypeData_0 = [];
  var chartExpensesCategoryTypeData_1 = [];
  var chartExpensesCategoryTypeData_2 = [];
  var chartExpensesCategoryTypeData_3 = [];
  var chartExpensesCategoryTypeData_4 = [];
  var chartExpensesCategoryTypeData_5 = [];
  var chartExpensesCategoryTypeData_6 = [];
  var chartExpensesCategoryTypeData_7 = [];

  import ExpensesForm from "/src/lib/components/expensesForm.svelte";
  import CategoriesForm from "/src/lib/components/categoriesForm.svelte";
  import TypesForm from "/src/lib/components/typesForm.svelte";
  import RoadbookForm from "/src/lib/components/roadbookForm.svelte";
  import chartjs from "chart.js/auto";

  import {
    IDB,
    getIDBDate,
    getIDBTypes,
    getIDBCategories,
    getIDBExpenses,
    getIDBRoadbook,
    UpdateIDBversionDate,
  } from "/src/lib/IDB.js";
  import { YYYYMMDD } from "/src/lib/date_functions.js";

  import { onMount } from "svelte";

  onMount(async (promise) => {
    synchData();
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

  export async function synchData() {
    //
    // synchronisation des data entre MongoDB et IndexedDB
    //
    categoryTypes = [];
    categories = [];
    expenses = [];
    roadbook = [];
    let IDB_id = "";
    let res = [];

    try {
      // récupération de la version MongoDB
      res = await fetch("/versionDate");
      const ver = await res.json();
      console.info("ver :", ver);
      if (res.status === 500) {
        // réseau KO
        versionMongoDB = "";
        //        erreurMessageRG = "synchData (versionDate) : " + ver.erreur;
        erreurMessageRG = "Pas de connexion à la base";
      } else {
        // réseau OK
        versionMongoDB = await ver.version[0].date;
        console.info("version MongoDB :", versionMongoDB);
      }
    } catch {
      versionMongoDB = "";
    }

    //   versionMongoDB = "";

    // récupération de la version IndexedDB
    versionIndexedDB = await getIDBDate();
    console.info("version IndexedDB :", versionIndexedDB);

    if (versionMongoDB === "") {
      //
      // pas de réseau, on prend IndexedDB
      // refresh     : No
      // data        : IDB
      // VersionDate : IDB
      //
      sourceDB = "IDB";
      console.log("IndexedDB");

      categoryTypes = await getIDBTypes();
      for (var i = 0; i < categoryTypes.length; i++) {
        categoryTypes[i]._id = categoryTypes[i].type;
      }
      categories = await getIDBCategories();
      for (var i = 0; i < categories.length; i++) {
        categories[i]._id = categories[i].category;
      }
      expenses = await getIDBExpenses();
      for (var i = 0; i < expenses.length; i++) {
        expenses[i]._id = expenses[i].id;
      }
      roadbook = await getIDBRoadbook();
      for (var i = 0; i < roadbook.length; i++) {
        roadbook[i]._id = roadbook[i].day;
      }
      // mise à jour de la version IndexedDB
      UpdateIDBversionDate(YYYYMMDD(0).date);
    } else if (versionMongoDB >= versionIndexedDB) {
      //
      // versionMongoDB >= versionIndexedDB
      // refresh     : IDB
      // data        : MDB
      // VersionDate : MDB
      //
      sourceDB = "MDB";
      console.log("MongoDB --> IndexedDB");

      // récupération de tous les types
      res = await fetch("/categoryTypes");
      const typ = await res.json();
      if (res.status === 500) {
        // réseau KO
        erreurMessageRG = "synchData (categoryTypes) : " + typ.erreur;
      } else {
        // réseau OK
        categoryTypes = await typ.categoryTypes;

        // mise à jour de IndexedDB

        IDB.Types.clear();
        for (var i = 0; i < categoryTypes.length; i++) {
          try {
            IDB_id = await IDB.Types.add({
              type: categoryTypes[i].type,
            });
          } catch (error) {
            erreurMessageRG = "synchData (categoryTypes) : " + error.message;
          }
        }
      }

      // récupération de toutes les categories
      res = await fetch("/categories");
      const cat = await res.json();
      if (res.status === 500) {
        // réseau KO
        erreurMessageRG = "synchData (categories) : " + cat.erreur;
      } else {
        // réseau OK
        categories = await cat.categories;
        // mise à jour de IndexedDB
        IDB.Categories.clear();
        for (var i = 0; i < categories.length; i++) {
          try {
            IDB_id = await IDB.Categories.add({
              category: categories[i].category,
              type: categories[i].type,
            });
          } catch (error) {
            erreurMessageRG =
              "synchData (categories) : " + IDB_id + " " + error.message;
          }
        }
      }

      // récupération de toutes les dépenses
      res = await fetch("/expenses");
      const tra = await res.json();
      if (res.status === 500) {
        // réseau KO
        erreurMessageRG = "synchData (expenses) : " + tra.erreur;
      } else {
        // réseau OK
        expenses = await tra.expenses;
        // mise à jour de IndexedDB
        IDB.Expenses.clear();
        for (var i = 0; i < expenses.length; i++) {
          try {
            IDB_id = await IDB.Expenses.add({
              _id: expenses[i]._id,
              amount: expenses[i].amount,
              description: expenses[i].description,
              category: expenses[i].category,
              month: expenses[i].month,
            });
          } catch (error) {
            erreurMessageRG = "synchData (expenses) : " + error.message;
          }
        }
      }

      // récupération du roadbook
      res = await fetch("/roadbook");
      const road = await res.json();
      if (res.status === 500) {
        // réseau KO
        erreurMessageRG = "synchData (roadbook) : " + road.erreur;
      } else {
        // réseau OK
        roadbook = await road.roadbook;
        IDB.Roadbook.clear();
        for (var i = 0; i < roadbook.length; i++) {
          try {
            IDB_id = await IDB.Roadbook.add({
              day: roadbook[i].day,
              difficulty: roadbook[i].difficulty,
              night: roadbook[i].night,
              landscape: roadbook[i].landscape,
              weather: roadbook[i].weather,
              detail: roadbook[i].detail,
              start: roadbook[i].start,
              end: roadbook[i].end,
            });
          } catch (error) {
            erreurMessageRG = "synchData (roadbook) : " + error.message;
          }
        }
      }

      // mise à jour de la version IndexedDB
      UpdateIDBversionDate(versionMongoDB);

      // mise à jour de la version MongoDB
      res = await fetch("/versionDate", {
        method: "DELETE",
      });
      obj = new Object();
      obj.date = YYYYMMDD(0).date;
      res = await fetch("/versionDate", {
        method: "POST",
        body: JSON.stringify(obj),
      });
    } else {
      //
      // versionIndexedDB >= versionMongoDB
      // refresh     : MDB
      // data        : MDB
      // VersionDate : MDB
      //
      sourceDB = "MDB";
      console.log("IndexedDB --> MongoDB");
      var obj = new Object();

      // récupération de tous les categories
      categories = await getIDBCategories();
      obj = new Object();
      obj._id = 0; // pour supprimer tous les éléments
      res = await fetch("/categories", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      for (var i = 0; i < categories.length; i++) {
        categories[i]._id = categories[i].category;
        obj = new Object();
        obj.category = categories[i].category;
        obj.type = categories[i].type;

        res = await fetch("/categories", {
          method: "POST",
          body: JSON.stringify(obj),
        });
      }

      // récupération de tous les types
      categoryTypes = await getIDBTypes();
      obj = new Object();
      obj._id = 0; // pour supprimer tous les éléments
      res = await fetch("/categoryTypes", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      for (var i = 0; i < categoryTypes.length; i++) {
        categoryTypes[i]._id = categoryTypes[i].type;
        obj = new Object();
        obj.type = categoryTypes[i].type;

        res = await fetch("/categoryTypes", {
          method: "POST",
          body: JSON.stringify(obj),
        });
      }

      // récupération de tous les expenses
      expenses = await getIDBExpenses();
      obj = new Object();
      obj._id = 0; // pour supprimer tous les éléments
      res = await fetch("/expenses", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      for (var i = 0; i < expenses.length; i++) {
        expenses[i]._id = expenses[i].id;
        obj = new Object();
        obj.category = expenses[i].category;
        obj.month = expenses[i].month;
        obj.amount = expenses[i].amount;
        obj.description = expenses[i].description;

        res = await fetch("/expenses", {
          method: "POST",
          body: JSON.stringify(obj),
        });
      }

      // récupération de roadbook
      roadbook = await getIDBRoadbook();
      obj = new Object();
      obj._id = 0; // pour supprimer tous les éléments
      res = await fetch("/roadbook", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      for (var i = 0; i < roadbook.length; i++) {
        roadbook[i]._id = roadbook[i].day;
        obj = new Object();
        obj.difficulty = roadbook[i].difficulty;
        obj.night = roadbook[i].night;
        obj.landscape = roadbook[i].landscape;
        obj.weather = roadbook[i].weather;
        obj.detail = roadbook[i].detail;
        obj.day = roadbook[i].day;
        obj.start = roadbook[i].start;
        obj.end = roadbook[i].end;
        res = await fetch("/roadbook", {
          method: "POST",
          body: JSON.stringify(obj),
        });
      }

      // mise à jour de la version MongoDB
      res = await fetch("/versionDate", {
        method: "DELETE",
      });
      obj = new Object();
      obj.date = YYYYMMDD(0).date;
      res = await fetch("/versionDate", {
        method: "POST",
        body: JSON.stringify(obj),
      });
    }
    showDashboard();
  }

  export async function showDashboard() {
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

    dashboardVisible = "flex";
    categoriesVisible = "hidden";
    typesVisible = "hidden";
    expensesVisible = "hidden";
    roadbookVisible = "hidden";
  }

  export async function showExpenses() {
    dashboardVisible = "hidden";
    categoriesVisible = "hidden";
    typesVisible = "hidden";
    expensesVisible = "flex";
    roadbookVisible = "hidden";
  }

  export async function showCategories() {
    dashboardVisible = "hidden";
    categoriesVisible = "flex";
    expensesVisible = "hidden";
    typesVisible = "hidden";
    roadbookVisible = "hidden";
  }

  export async function showTypes() {
    dashboardVisible = "hidden";
    categoriesVisible = "hidden";
    expensesVisible = "hidden";
    typesVisible = "flex";
    roadbookVisible = "hidden";
  }

  export async function showRoadbook() {
    dashboardVisible = "hidden";
    categoriesVisible = "hidden";
    expensesVisible = "hidden";
    typesVisible = "hidden";
    roadbookVisible = "flex";
  }
</script>

<svelte:head>
  <title>Pacific Crest Trail</title>
</svelte:head>
<p class="text-center text-xl font-bold text-white bg-red-600">
  {erreurMessageRG}
</p>
<div class="grid grid-cols-5 text-xs md:text-base bg-pct rounded py-2 ">
  <div>
    <button
      type="submit"
      name="s2"
      class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      on:click={showDashboard}
    >
      PCT</button
    >
  </div>
  <div>
    <button
      type="submit"
      name="s"
      class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      on:click={showExpenses}
    >
      Expenses
    </button>
  </div>
  <div>
    <button
      type="submit"
      name="s"
      class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      on:click={showCategories}
    >
      Cat.
    </button>
  </div>
  <div>
    <button
      type="submit"
      name="s"
      class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      on:click={showTypes}
    >
      Types
    </button>
  </div>
  <div>
    <button
      type="submit"
      name="s"
      class=" px-3 py-2 flex items-center uppercase font-bold leading-snug text-white hover:opacity-75"
      on:click={showRoadbook}
    >
      Roadbook
    </button>
  </div>
</div>

<div class={expensesVisible}>
  <div class="py-2 w-full">
    <div class="flex mb-2 text-gray-500 font-bold">
      <ExpensesForm
        {expenses}
        {categories}
        {sourceDB}
        on:showExpenses={showExpenses}
      />
    </div>
  </div>
</div>

<div class={dashboardVisible}>
  <div class="py-2 w-full text-pct font-bold ">
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
              src="https://www.orientsport.fr/oflash/img/{e.type}.png"
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
</div>

<div class={categoriesVisible}>
  <div class="py-2 w-full">
    <div class="flex mb-2 text-gray-500 font-bold">
      <CategoriesForm
        {categories}
        {categoryTypes}
        {sourceDB}
        on:showCategories={showCategories}
      />
    </div>
  </div>
</div>

<div class={typesVisible}>
  <div class="py-2 w-full">
    <div class="flex mb-2 text-gray-500 font-bold">
      <TypesForm {categoryTypes} {sourceDB} on:showTypes={showTypes} />
    </div>
  </div>
</div>

<div class={roadbookVisible}>
  <div class="py-2 w-full">
    <div class="flex mb-2 text-gray-500 font-bold">
      <RoadbookForm {roadbook} {sourceDB} on:showRoadbook={showRoadbook} />
    </div>
  </div>
</div>
