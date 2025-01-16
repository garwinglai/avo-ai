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
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (loading) setLoading(false);

      //* If no user, return to login page if not already.
      if (!currentUser) {
        setUser(null);
        if (segments[0] !== "auth") {
          router.replace("/auth/login");
        }
        return;
      }

      // * If user exists, nav to home page if on login or signup.
      setUser(currentUser);
      setUid(currentUser.uid);

      const isAuthRoute = segments[1] == "login" || segments[1] == "signup";

      if (segments[0] == "auth" && isAuthRoute) {
        router.replace("/(tabs)");
      }
    });
    return unsubscribe;
  }, [segments]);

  return (
    <AuthContext.Provider value={{ user, loading, uid }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
