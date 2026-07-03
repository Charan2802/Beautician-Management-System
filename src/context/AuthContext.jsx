import {
  createContext,
  useState,
  useEffect,
} from "react";

import api from "../api/axios";

export const AuthContext =
  createContext(null);

export default function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    const name =
      localStorage.getItem("name");

    const id =
      localStorage.getItem("id");

    if (token) {
      setUser({
        _id: id,
        name,
        role,
      });
    }

    setLoading(false);
  }, []);

  const login = async (
    email,
    password
  ) => {
    try {
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      console.log(
        "API RESPONSE:",
        response.data
      );

      const loggedUser = {
        _id:
          response.data.id,
        name:
          response.data.name,
        role:
          response.data.role,
      };

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "id",
        response.data.id
      );

      localStorage.setItem(
        "name",
        response.data.name
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      setUser(loggedUser);

      return loggedUser;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}