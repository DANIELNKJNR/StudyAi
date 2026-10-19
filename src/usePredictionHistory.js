import { useState, useEffect, useCallback } from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

import { db, auth } from "./firebase";

export default function usePredictionHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // 1. Sign the visitor in anonymously.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          return;
        }

        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Anonymous sign-in failed:", err);

          setError(
            "Unable to connect to your account. Please refresh and try again."
          );

          setLoading(false);
        }
      }
    );

    return () => unsubscribeAuth();
  }, []);

  // 2. Load and listen for this user's saved predictions.
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const predictionsRef = collection(
      db,
      "users",
      user.uid,
      "predictions"
    );

    const predictionsQuery = query(
      predictionsRef,
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      predictionsQuery,
      (snapshot) => {
        const predictions = snapshot.docs.map((document) => ({
          ...document.data(),
          id: document.id,
        }));

        setItems(predictions);
        setLoading(false);
      },
      (err) => {
        console.error("Loading prediction history failed:", err);

        setError("Unable to load prediction history.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Save a new prediction to Firestore.
  const add = useCallback(async (entry) => {
    try {
      let currentUser = auth.currentUser;

      // Handle the unlikely case where a prediction is submitted
      // before anonymous authentication has finished.
      if (!currentUser) {
        const result = await signInAnonymously(auth);
        currentUser = result.user;
      }

      const predictionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "predictions"
      );

      const { id, ...predictionData } = entry;

      await addDoc(predictionsRef, {
        ...predictionData,
        createdAt: Date.now(),
      });

      setError(null);
    } catch (err) {
      console.error("Saving prediction failed:", err);

      setError(
        "Your prediction could not be saved. Please try again."
      );

      throw err;
    }
  }, []);

  // 4. Delete this user's saved prediction history.
  const clear = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("Unable to identify your session. Please refresh.");
      return;
    }

    try {
      setError(null);

      const predictionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "predictions"
      );

      const snapshot = await getDocs(predictionsRef);

      await Promise.all(
        snapshot.docs.map((prediction) =>
          deleteDoc(
            doc(
              db,
              "users",
              currentUser.uid,
              "predictions",
              prediction.id
            )
          )
        );
    } catch (err) {
      console.error("Clearing history failed:", err);

      setError("Unable to clear prediction history.");
      throw err;
    }
  }, []);

  return {
    items,
    loading,
    error,
    add,
    clear,
  };
}