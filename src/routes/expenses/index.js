import { connectToDatabase } from "$lib/db";
import { Double, ObjectId } from "mongodb";

export async function get(request) {
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");
    const expenses = await collection.find().sort({ _id: -1 }).toArray();

    return {
      status: 200,
      body: {
        expenses,
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
  // intégration d'une nouvelle expense
  try {
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");
    const expenses = JSON.parse(request.body);

    expenses.amount = Double(expenses.amount);
    let t = await collection.insertOne(expenses);
    console.log("insert " + expenses._id);
    return {
      status: 200,
      body: {
        message: expenses._id,
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
    const expense = JSON.parse(request.body);
    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");

    await collection.updateOne(
      { _id: ObjectId(expense._id) },
      {
        $set: {
          month: expense.month,
          amount: Double(expense.amount),
          description: expense.description,
          category: expense.category,
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
    const collection = db.collection("Expenses");
    const expense = JSON.parse(request.body);

    if (expense._id != 0) {
      await collection.deleteOne({ _id: ObjectId(expense._id) });
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
