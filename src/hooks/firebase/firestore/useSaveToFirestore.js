// src/hooks/useSaveToFirestore.js
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";

const useSaveToFirestore = () => {
  const [isSavingToFirestore, setIsSavingToFirestore] = useState(false);
  const [errorSavingToFirestore, setErrorSavingToFirestore] = useState(null);

  const saveToFirestore = async (collectionName, data) => {
    setIsSavingToFirestore(true);
    setErrorSavingToFirestore(null);

    try {
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

  return { saveToFirestore, isSavingToFirestore, errorSavingToFirestore };
};

export default useSaveToFirestore;
