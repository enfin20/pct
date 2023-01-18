import { connectToDatabase } from "$lib/db";
import { ObjectId } from "mongodb";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");
    const categoryTypes = await collection.find().sort({ type: 1 }).toArray();

    return {
      status: 200,
      body: {
        categoryTypes,
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
  // intégration d'une nouvelle category
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");
    const categoryTypes = JSON.parse(request.body);

    let t = await collection.insertOne(categoryTypes);

    return {
      status: 200,
      body: {
        message: categoryTypes._id,
      },
    };
  } catch (err) {
    console.info("err:", err);
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
    const category = JSON.parse(request.body);
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Types");

    await collection.updateOne(
      { _id: ObjectId(category._id) },
      {
        $set: {
          category: category.category,
          type: category.type,
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
    const collection = db.collection("Types");
    const category = JSON.parse(request.body);
    if (category._id != 0) {
      await collection.deleteOne({ _id: ObjectId(category._id) });
    } else {
      await collection.deleteMany();
    }

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
