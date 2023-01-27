<script>
  import { sourceDB, updatedDB, currentDB } from "$lib/stores/versions.js";
  import { onMount } from "svelte";
  import { IDB, getIDBRoadbook } from "$lib/IDB.js";

  let roadbook = [];
  var buttonLabel = "Add";
  var edit_Day = Object();
  edit_Day.key = "";
  edit_Day.day = "";
  edit_Day.start = "";
  edit_Day.end = "";
  edit_Day.weather = -1;
  edit_Day.difficulty = -1;
  edit_Day.night = -1;
  edit_Day.landscape = -1;
  edit_Day.mood = -1;
  edit_Day.detail = "";
  edit_Day.summary = "";

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
  let nightIcon = ["Star", "Bivouac", "Camp", "Hotel", "Free"];
  let imgNewNightActivate = ["_in", "_in", "_in", "_in", "_in"];
  let difficultyIcon = ["ZeroDay", "Star", "Star", "Star"];
  let imgNewDifficultyActivate = ["_in", "_in", "_in", "_in"];
  let starsIcon = ["Star", "Star", "Star"];
  let imgNewLandscapeActivate = ["_in", "_in", "_in"];
  let moodIcon = ["Sad", "Neutral", "Happy"];
  let imgNewMoodActivate = ["_in", "_in", "_in"];
  // _in rgb(200,225,200)

  onMount(async (promise) => {
    let res = [];
    //initialisation du tableau en fonction de la source
    if ($sourceDB === "IDB") {
      roadbook = await getIDBRoadbook();
    }
    if ($sourceDB === "MDB") {
      res = await fetch("/MDB/roadbook");
      const roa = await res.json();
      roadbook = await roa.roadbook;
    }

    // Mise à jour de l'autre base
    if ($updatedDB === "IDB") {
      let IDB_key = "";
      IDB.Roadbook.clear();
      for (var i = 0; i < roadbook.length; i++) {
        IDB_key = await IDB.Roadbook.add({
          day: roadbook[i].day,
          difficulty: roadbook[i].difficulty,
          night: roadbook[i].night,
          landscape: roadbook[i].landscape,
          mood: roadbook[i].mood,
          weather: roadbook[i].weather,
          detail: roadbook[i].detail,
          summary: roadbook[i].summary,
          start: roadbook[i].start,
          end: roadbook[i].end,
        });
      }
    }
    if ($updatedDB === "MDB") {
      var obj = new Object();
      obj.key = "ALL"; // pour supprimer tous les éléments
      let res = await fetch("/MDB/roadbook", {
        method: "DELETE",
        body: JSON.stringify(obj),
      });
      let new_id = "";
      for (var i = 0; i < roadbook.length; i++) {
        obj = new Object();
        obj.day = roadbook[i].day;
        obj.difficulty = roadbook[i].difficulty;
        obj.night = roadbook[i].night;
        obj.landscape = roadbook[i].landscape;
        obj.mood = roadbook[i].mood;
        obj.weather = roadbook[i].weather;
        obj.detail = roadbook[i].detail;
        obj.summary = roadbook[i].summary;
        obj.start = roadbook[i].start;
        obj.end = roadbook[i].end;
        res = await fetch("/MDB/roadbook", {
          method: "POST",
          body: JSON.stringify(obj),
        });
        new_id = await res.json();
        roadbook[i].key = roadbook[i].day;
      }
    }
  });

  function updateIcons() {
    //mise à jour des icones
    for (var i = 0; i < weatherIcon.length; i++) {
      if (edit_Day.weather === i) {
        imgNewWeatherActivate[i] = "";
      } else {
        imgNewWeatherActivate[i] = "_in";
      }
    }

    for (var i = 0; i < difficultyIcon.length; i++) {
      if (edit_Day.difficulty === 0) {
        // zero day
        imgNewDifficultyActivate[0] = "";
        imgNewDifficultyActivate[i] = "_in";
      } else if (edit_Day.difficulty >= i) {
        imgNewDifficultyActivate[0] = "_in";
        imgNewDifficultyActivate[i] = "";
      } else {
        imgNewDifficultyActivate[i] = "_in";
      }
    }
    for (var i = 0; i < nightIcon.length; i++) {
      if (edit_Day.night === i) {
        imgNewNightActivate[i] = "";
      } else {
        imgNewNightActivate[i] = "_in";
      }
    }

    for (var i = 0; i < starsIcon.length; i++) {
      if (edit_Day.landscape >= i) {
        imgNewLandscapeActivate[i] = "";
      } else {
        imgNewLandscapeActivate[i] = "_in";
      }
    }

    for (var i = 0; i < moodIcon.length; i++) {
      if (edit_Day.mood === i) {
        imgNewMoodActivate[i] = "";
      } else {
        imgNewMoodActivate[i] = "_in";
      }
    }
  }

  function cleanForm() {
    edit_Day.key = "";
    buttonLabel = "Add";
    edit_Day.day = "";
    edit_Day.start = "";
    edit_Day.end = "";
    edit_Day.weather = -1;
    edit_Day.difficulty = -1;
    edit_Day.night = -1;
    edit_Day.landscape = -1;
    edit_Day.mood = -1;
    edit_Day.detail = "";
    edit_Day.summary = "";

    buttonLabel = "Add";
    updateIcons();
  }

  export async function editDay(day) {
    if ($currentDB === "IDB") {
      edit_Day = await IDB.Roadbook.where({ day: day }).first();
    }
    if ($currentDB === "MDB") {
      let res = await fetch("/MDB/roadbook/day?day=" + day);
      const rday = await res.json();
      edit_Day = await rday.r_day;
      edit_Day.key = edit_Day.day;
    }

    edit_Day.key = edit_Day.day;
    edit_Day.day = [
      edit_Day.day.substring(0, 4),
      edit_Day.day.substring(4, 6),
      edit_Day.day.substring(6, 8),
    ].join("-");

    buttonLabel = "Update";

    //mise à jour des icones
    updateIcons();
  }

  export async function insertRoadbook() {
    let new_id = "";
    var res = new Object();
    edit_Day.day = edit_Day.day
      .substring(0, 4)
      .concat(edit_Day.day.substring(5, 7))
      .concat(edit_Day.day.substring(8, 10));
    edit_Day.weather = Number(edit_Day.weather);
    edit_Day.difficulty = Number(edit_Day.difficulty);
    edit_Day.night = Number(edit_Day.night);
    edit_Day.landscape = Number(edit_Day.landscape);
    edit_Day.mood = Number(edit_Day.mood);

    if (edit_Day.key === "") {
      // Insert new day
      if ($currentDB === "IDB") {
        new_id = await IDB.Roadbook.add({
          day: edit_Day.day,
          weather: Number(edit_Day.weather),
          difficulty: Number(edit_Day.difficulty),
          night: Number(edit_Day.night),
          landscape: Number(edit_Day.landscape),
          mood: Number(edit_Day.mood),
          detail: edit_Day.detail,
          summary: edit_Day.summary,
          start: edit_Day.start,
          end: edit_Day.end,
        });
        edit_Day.key = edit_Day.day;
      }
      if ($currentDB === "MDB") {
        res = await fetch("/MDB/roadbook", {
          method: "POST",
          body: JSON.stringify(edit_Day),
        });
        new_id = await res.json();
        edit_Day.key = edit_Day.day;
      }

      // remise à jour du tableau
      roadbook.unshift({
        day: edit_Day.day,
        start: edit_Day.start,
        end: edit_Day.end,
        key: edit_Day.day,
        weather: edit_Day.weather,
        difficulty: edit_Day.difficulty,
        night: edit_Day.night,
        landscape: edit_Day.landscape,
        mood: edit_Day.mood,
        detail: edit_Day.detail,
        summary: edit_Day.summary,
      });
      roadbook = roadbook;
    } else {
      // update day
      if ($currentDB === "IDB") {
        IDB.Roadbook.update(edit_Day.day, {
          weather: Number(edit_Day.weather),
          difficulty: Number(edit_Day.difficulty),
          night: Number(edit_Day.night),
          landscape: Number(edit_Day.landscape),
          mood: Number(edit_Day.mood),
          detail: edit_Day.detail,
          summary: edit_Day.summary,
          start: edit_Day.start,
          end: edit_Day.end,
        });
      }
      if ($currentDB === "MDB") {
        res = await fetch("/MDB/roadbook", {
          method: "PUT",
          body: JSON.stringify(edit_Day),
        });
      }
      //mise à jour du tableau
      for (var i = 0; i < roadbook.length; i++) {
        if (roadbook[i].day === edit_Day.day) {
          roadbook[i].weather = Number(edit_Day.weather);
          roadbook[i].difficulty = Number(edit_Day.difficulty);
          roadbook[i].night = Number(edit_Day.night);
          roadbook[i].landscape = Number(edit_Day.landscape);
          roadbook[i].mood = Number(edit_Day.mood);
          roadbook[i].detail = edit_Day.detail;
          roadbook[i].summary = edit_Day.summary;
          roadbook[i].start = edit_Day.start;
          roadbook[i].end = edit_Day.end;
        }
      }
    }
    cleanForm();
  }
</script>

<div class="py-2 grid gap-1">
  <div class="grid grid-cols-1 place-content-center w-full">
    <form class="w-full " on:submit|preventDefault={insertRoadbook}>
      <div class=" w-full  flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Date
          </label>
          <input
            type="date"
            bind:value={edit_Day.day}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            on:click={updateIcons}
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
            bind:value={edit_Day.start}
            class=" appearance-none block w-full bg-gray-100 text-gray-600 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            End
          </label>
          <input
            type="text"
            bind:value={edit_Day.end}
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
              bind:group={edit_Day.weather}
              name="r_weather"
              value={i}
              id="r_weather{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_weather{i}"
              class="select-none cursor-pointer  py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out  "
            >
              <img
                src="/images/{wi}{imgNewWeatherActivate[i]}.png"
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
              bind:group={edit_Day.difficulty}
              name="r_difficulty"
              value={i}
              id="r_difficulty{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_difficulty{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{di}{imgNewDifficultyActivate[i]}.png"
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
              bind:group={edit_Day.night}
              name="r_night"
              value={i}
              id="r_night{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_night{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{ni}{imgNewNightActivate[i]}.png"
                alt=""
                class="w-[40px] inline"
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
            Landscape
          </label>
          {#each starsIcon as si, i}
            <input
              type="radio"
              bind:group={edit_Day.landscape}
              name="r_landscape"
              value={i}
              id="r_landscape{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_landscape{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{si}{imgNewLandscapeActivate[i]}.png"
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
            Mood
          </label>
          {#each moodIcon as mi, i}
            <input
              type="radio"
              bind:group={edit_Day.mood}
              name="mood"
              value={i}
              id="r_mood{i}"
              class="peer hidden"
              on:change={updateIcons}
            />
            <label
              for="r_mood{i}"
              class="select-none cursor-pointer py-1 px-1 font-bold text-slate-400 transition-colors duration-200 ease-in-out "
            >
              <img
                src="/images/{mi}{imgNewMoodActivate[i]}.png"
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
            Summary
          </label>
          <textarea
            bind:value={edit_Day.summary}
            class=" w-full appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
            rows="5"
          />
        </div>
        <div class="w-full px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="grid-first-name"
          >
            Details
          </label>
          <textarea
            bind:value={edit_Day.detail}
            class=" w-full appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none"
            rows="20"
          />
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <button
            class="bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click={cleanForm}
          >
            Clear
          </button>
        </div>
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <button
            class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </form>
  </div>
  <div class="overflow-x-auto">
    <table id="rdb" class="w-full text-sm text-gray-500 bg-white">
      <tbody class="">
        {#each roadbook as r}
          <tr
            class="align-middle text-center border-collapse border-t-[1px] border-slate-200"
          >
            <td class="text-left align-middle py-1 px-1 ">
              {r.day.substring(6, 8).concat("/").concat(r.day.substring(4, 6))}
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              <img
                src="/images/{moodIcon[r.mood]}.png"
                alt=""
                class="w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              <img
                src="/images/{weatherIcon[r.weather]}.png"
                alt=""
                class="w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              {#each difficultyIcon as di, i}
                {#if i === 0}
                  {#if r.difficulty === 0}
                    <img
                      src="/images/{difficultyIcon[i]}.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {:else}
                    <img
                      src="/images/{difficultyIcon[i]}_in.png"
                      alt=""
                      class="w-[20px] md:w-[30px] inline"
                    />
                  {/if}
                {:else if r.difficulty >= i}
                  <img
                    src="/images/{difficultyIcon[i]}.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {:else}
                  <img
                    src="/images/{difficultyIcon[i]}_in.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {/if}
              {/each}
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              <img
                src="/images/{nightIcon[r.night]}.png"
                alt=""
                class="w-[30px] inline"
              />
            </td>
            <td class="text-left align-middle py-1 px-1 ">
              {#each starsIcon as si, i}
                {#if r.landscape >= i}
                  <img
                    src="/images/{starsIcon[0]}.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {:else}
                  <img
                    src="/images/{starsIcon[0]}_in.png"
                    alt=""
                    class="w-[20px] md:w-[30px] inline"
                  />
                {/if}
              {/each}
            </td>
            <td class="align-middle py-1 px-1 ">
              <button
                class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                id={r.key}
                on:click={editDay(r.key)}>Edit</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
