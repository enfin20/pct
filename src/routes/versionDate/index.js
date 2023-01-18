import { connectToDatabase } from "$lib/db";
import { ObjectId } from "mongodb";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("VersionDate");
    let version = await collection.find().toArray();
    version[0].date = "20230112";
    return {
      status: 200,
      body: {
        version,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}

export async function post(request) {
  // intégration d'une nouvelle date
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("VersionDate");
    const version = JSON.parse(request.body);

    let t = await collection.insertOne(version);

    return {
      status: 200,
      body: {
        message: "Success",
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}

export async function put(request) {
  try {
    const version = JSON.parse(request.body);
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("VersionDate");

    await collection.updateOne(
      { _id: ObjectId(version._id) },
      {
        $set: {
          date: version.date,
        },
      }
    );

    return {
      status: 200,
      body: {
        message: "Success",
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}

export async function del(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("VersionDate");
    await collection.deleteMany();

    return {
      status: 200,
      body: {
        message: "Success",
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        erreur: err.message,
      },
    };
  }
}
