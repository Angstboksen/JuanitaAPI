import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const client = new MongoClient(process.env.MONGOURL!, {
  useUnifiedTopology: true,
});
client.close();
client.connect();

export const _fetchMongoCollection = async (
  collectionName: string,
  limit: number = 0
) => {
  const db = client.db("juanitamusic");
  return await db.collection(collectionName).find().limit(limit).toArray();
};

export const _fetchMongoCollectionLength = async (collectionName: string) => {
  const collection = await _fetchMongoCollection(collectionName);
  return collection.length;
};

export const _fetchMongoRandomDocument = async (collectionName: string) => {
  const db = client.db("juanitamusic");
  const data = await db
    .collection(collectionName)
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();
  return data[0];
};

export const _fetchMongoCollectionAndSortDate = async (
  collectionName: string,
  limit: number = 0
) => {
  const db = client.db("juanitamusic");
  const data = await db
    .collection(collectionName)
    .find()
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
  return data;
};

export const _fetchMongoSearchesOfRequestor = async (
  requestor: string,
  limit: number = 0
) => {
  const db = client.db("juanitamusic");
  const data = await db
    .collection("searches")
    .find({ "requestor.id": requestor })
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
  return data;
};
