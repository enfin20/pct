<script>
  import {
    MM_YYYY,
    date_YYYYMM,
    date_DD_MM,
    MM,
    YYYYMM,
    date_YYYYMMDD,
  } from "$lib/date_functions";
  export let edit_Day;

  let r_id = edit_Day._id;
  let r_day = edit_Day.day;
  let r_start = edit_Day.start;
  let r_end = edit_Day.end;
  let r_weather = edit_Day.weather;
  let r_difficulty = edit_Day.difficulty;
  let r_night = edit_Day.night;
  let r_landscape = edit_Day.landscape;
  let r_detail = edit_Day.detail;
  let weatherIcon = [
    "Snow",
    "Rain",
    "Fog",
    "Wind",
    "Thunder",
    "Cloud",
    "SemiSun",
    "Sun",
  ];
  let nightIcon = ["Bivouac", "Camp", "Hotel", "Free"];
  let imgNewWeatherActivate = [
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
    "_in",
  ];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let starsIcon = ["Star", "Star", "Star"];
  let imgNewDifficultyActivate = ["_in", "_in", "_in", "_in"];
  let imgNewNightActivate = ["_in", "_in", "_in", "_in"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in"];
  // _in rgb(200,225,200)

  console.log("edit_day.day  dd " + edit_Day.day);

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function showDay() {
    //mise à jour des icones
    for (var i = 0; i < weatherIcon.length; i++) {
      if (r_weather === i) {
        imgNewWeatherActivate[i] = "";
      } else {
        imgNewWeatherActivate[i] = "_in";
      }
    }

    for (var i = 0; i < difficultyIcon.length; i++) {
      if (r_difficulty === 0) {
        // zero day
        imgNewDifficultyActivate[0] = "";
        imgNewDifficultyActivate[i] = "_in";
      } else if (r_difficulty >= i) {
        imgNewDifficultyActivate[0] = "_in";
        imgNewDifficultyActivate[i] = "";
      } else {
        imgNewDifficultyActivate[i] = "_in";
      }
    }
    for (var i = 0; i < nightIcon.length; i++) {
      if (r_night === i) {
        imgNewNightActivate[i] = "";
      } else {
        imgNewNightActivate[i] = "_in";
      }
    }

    for (var i = 0; i < starsIcon.length; i++) {
      if (r_landscape >= i) {
        imgNewLandscapeActivate[i] = "";
      } else {
        imgNewLandscapeActivate[i] = "_in";
      }
    }

    dispatch("showDay");
  }

  export async function updateRoadbook(
    r_id,
    day,
    weather,
    difficulty,
    night,
    landscape,
    detail
  ) {
    console.log("desc " + detail);
    var obj = new Object();
    obj._id = r_id;
    obj.day = day;
    obj.weather = Number(weather);
    obj.difficulty = Number(difficulty);
    obj.night = Number(night);
    obj.landscape = Number(landscape);
    obj.detail = detail;

    const res = await fetch("/roadbook", {
      method: "PUT",
      body: JSON.stringify(obj),
    });
    showDay();
  }

  export async function deleteRoadbook(r_id) {
    var obj = new Object();
    obj._id = r_id;

    const res = await fetch("/roadbook", {
      method: "DELETE",
      body: JSON.stringify(obj),
    });
    showDay();
  }

  export async function insertRoadbook(
    day,
    start,
    end,
    weather,
    difficulty,
    night,
    landscape,
    detail
  ) {
    var obj = new Object();

    obj.day = date_YYYYMMDD(day);
    obj.start = start;
    obj.end = end;
    obj.weather = Number(weather);
    obj.difficulty = Number(difficulty);
    obj.night = Number(night);
    obj.landscape = Number(landscape);
    obj.detail = detail;

    const res = await fetch("/roadbook", {
      method: "POST",
      body: JSON.stringify(obj),
    });
    r_day = "";
    r_weather = "";
    r_difficulty = "";
    r_night = "";
    r_landscape = "";
    r_detail = "";

    showDay();
  }
</script>

<div class="py-2 grid gap-1">
  <form class="w-full max-w-lg">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Date
        </label>
        <input
          type="date"
          bind:value={r_day}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Start
        </label>
        <input
          type="text"
          bind:value={r_start}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Start
        </label>
        <input
          type="text"
          bind:value={r_start}
          class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Weather
        </label>
        {#each weatherIcon as wi, i}
          <input
            type="radio"
            bind:group={r_weather}
            name="r_weather"
            value={i}
            id="r_weather{i}"
            class="peer hidden"
            on:change={showDay}
          />
          <label
            for="r_weather{i}"
            class="select-none cursor-pointer  py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out  "
          >
            <img
              src="https://www.orientsport.fr/oflash/img/{wi}{imgNewWeatherActivate[
                i
              ]}.png"
              alt=""
              class="w-[35px] inline"
            /></label
          >
        {/each}
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Difficulty
        </label>
        {#each difficultyIcon as di, i}
          <input
            type="radio"
            bind:group={r_difficulty}
            name="r_difficulty"
            value={i}
            id="r_difficulty{i}"
            class="peer hidden"
            on:change={showDay}
          />
          <label
            for="r_difficulty{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="https://www.orientsport.fr/oflash/img/{di}{imgNewDifficultyActivate[
                i
              ]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Night
        </label>
        {#each nightIcon as ni, i}
          <input
            type="radio"
            bind:group={r_night}
            name="r_night"
            value={i}
            id="r_night{i}"
            class="peer hidden"
            on:change={showDay}
          />
          <label
            for="r_night{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="https://www.orientsport.fr/oflash/img/{ni}{imgNewNightActivate[
                i
              ]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Landscape
        </label>
        {#each starsIcon as si, i}
          <input
            type="radio"
            bind:group={r_landscape}
            name="r_landscape"
            value={i}
            id="r_landscape{i}"
            class="peer hidden"
            on:change={showDay}
          />
          <label
            for="r_landscape{i}"
            class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
          >
            <img
              src="https://www.orientsport.fr/oflash/img/{si}{imgNewLandscapeActivate[
                i
              ]}.png"
              alt=""
              class="w-[40px] inline"
            /></label
          >
        {/each}
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          Details
        </label>
        <textarea
          bind:value={r_detail}
          class=" w-full appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full px-3 mb-6 md:mb-0">
        <button
          class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          on:click={insertRoadbook(
            r_day,
            r_start,
            r_end,
            r_weather,
            r_difficulty,
            r_night,
            r_landscape,
            r_detail
          )}
          >Add
        </button>
      </div>
    </div>
  </form>
</div>
