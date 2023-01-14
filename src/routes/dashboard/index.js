import { connectToDatabase } from "$lib/db";
import { ObjectId } from "mongodb";

export async function get(request) {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "Categories",
          localField: "category",
          foreignField: "category",
          as: "pivCat",
        },
      },
      {
        $unwind: {
          path: "$pivCat",
        },
      },
      {
        $project: {
          _id: 0,
          category: 1,
          month: 1,
          amount: 1,
          description: 1,
          type: "$pivCat.type",
        },
      },
    ];

    const dbConnection = await connectToDatabase();
    const db = dbConnection.db;
    const collection = db.collection("Expenses");
    const pivot = await collection.aggregate(pipeline).toArray();
    return {
      status: 200,
      body: {
        pivot,
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
/*
[

       {
        $group: {
          _id: {
            month: "$month",
          },
          totalAmount: {
            $sum: "$amount",
          },
        },
      },

]
*/
