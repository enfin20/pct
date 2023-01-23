import Dexie from "dexie";

export const IDB = new Dexie("pct23");

IDB.version(1).stores({
  Types: "type",
  Categories: "category, type",
  Expenses: "++id, amount, description, category, month",
  Roadbook:
    "day, difficulty, night, landscape, weather, detail, start, end, summary, mood",
  VersionDate: "++id, date",
});

export async function getIDBDate() {
  // récupération de la version IndexedDB

  let vIDB = await IDB.VersionDate.toArray();
  try {
    return vIDB[0].date;
    //   return "20230112";
  } catch {
    return initIDBDate();
  }
}

async function initIDBDate() {
  // insertion de la première version IndexedDB
  try {
    const id = await IDB.VersionDate.add({
      date: "20230101",
    });
  } catch (error) {
    erreurMessageRG = "initIDBDate : " + error.message;
  }
  return "20230101";
}

export async function getIDBTypes() {
  const categoryTypes = await IDB.Types.toArray();
  for (var i = 0; i < categoryTypes.length; i++) {
    categoryTypes[i].key = categoryTypes[i].type;
  }
  return await categoryTypes;
}

export async function getIDBCategories() {
  const categories = await IDB.Categories.toArray();
  for (var i = 0; i < categories.length; i++) {
    categories[i].key = categories[i].category;
  }
  return await categories;
}

export async function getIDBExpenses() {
  const expenses = await IDB.Expenses.toArray();
  for (var i = 0; i < expenses.length; i++) {
    expenses[i].key = expenses[i].id;
  }
  return await expenses;
}

export async function getIDBRoadbook() {
  const roadbook = await IDB.Roadbook.toArray();
  for (var i = 0; i < roadbook.length; i++) {
    roadbook[i].key = roadbook[i].day;
  }
  return await roadbook;
}

export async function UpdateIDBversionDate(versionDate) {
  let res = "";
  IDB.VersionDate.clear();
  try {
    res = await IDB.VersionDate.add({
      date: versionDate,
    });
  } catch (error) {
    res = "synchData (versionDate) : " + error.message;
  }
  return res;
}
