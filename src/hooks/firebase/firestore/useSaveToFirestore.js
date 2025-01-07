// src/hooks/useSaveToFirestore.js
import { useState } from "react";
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

const useSaveToFirestore = () => {
  const [isSavingToFirestore, setIsSavingToFirestore] = useState(false);
  const [errorSavingToFirestore, setErrorSavingToFirestore] = useState(false);

  const saveToFirestoreCollection = async (collectionName, data) => {
    setIsSavingToFirestore(true);
    setErrorSavingToFirestore(false);

    try {
      // Add a timestamp to the data
      data.created = Timestamp.now();
      data.updated = "";
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Return the ID of the newly created document
    } catch (err) {
      console.error("Error adding document: ", err);
      setErrorSavingToFirestore(err.message);
      throw err;
    } finally {
      setIsSavingToFirestore(false);
    }
  };

  const saveToFirestoreDoc = async (collectionName, docId, data) => {
    console.log(collectionName, docId);
    setIsSavingToFirestore(true);
    setErrorSavingToFirestore(false);

    try {
      data.created = Timestamp.now();
      data.updated = "";
      const docRef = await setDoc(doc(db, collectionName, docId), data);

      return docId; // Return the ID of the newly created document
    } catch (err) {
      console.error("Error adding document: ", err);
      setErrorSavingToFirestore(err.message);
      throw err;
    } finally {
      setIsSavingToFirestore(false);
    }
  };

  return {
    saveToFirestoreCollection,
    isSavingToFirestore,
    errorSavingToFirestore,
    saveToFirestoreDoc,
  };
};

export default useSaveToFirestore;
