// src/hooks/useSaveToFirestore.js
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

const useSaveToFirestore = () => {
  const [isSavingToFirestore, setIsSavingToFirestore] = useState(false);
  const [errorSavingToFirestore, setErrorSavingToFirestore] = useState(null);

  const saveToFirestore = async (collectionName, data) => {
    console.log("saving to firestore", collectionName);

    setIsSavingToFirestore(true);
    setErrorSavingToFirestore(null);

    try {
      console.log("start");
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Return the ID of the newly created document
    } catch (err) {
      console.error("Error adding document: ", err);
      setErrorSavingToFirestore(err.message);
      throw err;
    } finally {
      console.log("hey");
      setIsSavingToFirestore(false);
    }
  };

  return { saveToFirestore, isSavingToFirestore, errorSavingToFirestore };
};

export default useSaveToFirestore;
