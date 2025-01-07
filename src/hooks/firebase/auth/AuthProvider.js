// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebaseConfig";
import { useRouter, useSegments } from "expo-router";

// Create a context
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (loading) setLoading(false);

      if (currentUser) {
        setUser(currentUser);
        console.log(segments[0]);
        if (segments[0] == "auth") {
          router.replace("/(tabs)");
        }
      } else {
        setUser(null);
        if (segments[0] !== "auth") {
          router.replace("/auth/login");
        }
      }
    });
    return unsubscribe;
  }, [segments]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
