import firestoreConnection from "./connection";
import schedule from "node-schedule";

export const _fetchDBCollection = async (
  collectionName: string,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .limit(limit)
    .get();
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const _inceptionCollection = async (
  collectionName: string,
  docRef: string,
  subCollection: string,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .doc(docRef)
    .collection(subCollection)
    .limit(limit)
    .get();
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const _inceptionCollectionAndSort = async (
  collectionName: string,
  docRef: string,
  subCollection: string,
  field: string,
  format: FirebaseFirestore.OrderByDirection,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .doc(docRef)
    .collection(subCollection)
    .orderBy(field, format)
    .limit(limit)
    .get();
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const _fetchDBCollectionAndSort = async (
  collectionName: string,
  field: string,
  format: FirebaseFirestore.OrderByDirection,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .orderBy(field, format)
    .limit(limit)
    .get();
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const _fetchDBCollectionWithDoc = async (
  collectionName: string,
  docRef: string
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .doc(docRef)
    .get();
  return snapshot.data();
};

export const _fetchDBCollectionAppliedFilter = async (
  collectionName: string,
  documentField: string,
  queryOperator: any,
  fieldValue: string,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .where(documentField, queryOperator, fieldValue)
    .limit(limit)
    .get();
  if (snapshot.empty) {
    console.log("[*] No documents matched the query.");
    return null;
  }
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

export const _fetchDBCollectionAppliedFilterAndSort = async (
  collectionName: string,
  documentField: string,
  queryOperator: any,
  fieldValue: string,
  limit: number = 0
) => {
  const snapshot = await firestoreConnection
    .collection(collectionName)
    .orderBy("date", "desc")
    .where(documentField, queryOperator, fieldValue)
    .limit(limit)
    .get();
  if (snapshot.empty) {
    console.log("[*] No documents matched the query.");
    return null;
  }

  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

const pickRandomSong = async (docref: FirebaseFirestore.DocumentReference) => {
  const songs = await _fetchDBCollection("songs");
  const { thumbnail, url, title, seconds } = songs[
    Math.floor(Math.random() * songs.length)
  ];
  docref.set({ thumbnail, url, title, seconds });
};

// -- SONG OF THE DAY --
schedule.scheduleJob("0 0 * * *", async () => {
  const docRef = firestoreConnection.collection("specials").doc("sotd");
  await pickRandomSong(docRef);
});

// -- SONG OF THE WEEK --
schedule.scheduleJob("0 0 * * 1", async () => {
  const docRef = firestoreConnection.collection("specials").doc("sotw");
  await pickRandomSong(docRef);
});

// -- SONG OF THE MONTH --
schedule.scheduleJob("0 0 1 * *", async () => {
  const docRef = firestoreConnection.collection("specials").doc("sotm");
  await pickRandomSong(docRef);
});
