import Dexie from "dexie";

export const IDB = new Dexie("pct");

IDB.version(1).stores({
  Types: "type",
  Categories: "category, type",
  Expenses: "_id, amount, description, category, month",
  Roadbook: "day, difficulty, night, landscape, weather, detail, start, end",
  VersionDate: "++id, date",
});

export async function getIDBDate() {
  // récupération de la version IndexedDB

  let vIDB = await IDB.VersionDate.toArray();
  try {
    //return vIDB[0].date;
    return "20230112";
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
  return await IDB.Types.toArray();
}

export async function getIDBCategories() {
  return await IDB.Categories.toArray();
}

export async function getIDBExpenses() {
  return await IDB.Expenses.toArray();
}

export async function getIDBRoadbook() {
  return await IDB.Roadbook.toArray();
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
