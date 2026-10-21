import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { KEYS, read, write } from "../lib/storage";
import { hashPassword } from "../lib/pnr";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(KEYS.session, null));

  const signup = useCallback(async ({ username, password, name, email }) => {
    const clean = username.trim();
    if (clean.length < 3) throw new Error("Username must be at least 3 characters.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");

    const users = read(KEYS.users, []);
    const exists = users.some((entry) => entry.username.toLowerCase() === clean.toLowerCase());
    if (exists) throw new Error("That username is already taken. Try logging in.");

    const passwordHash = await hashPassword(clean, password);
    const record = {
      username: clean,
      name: name?.trim() || clean,
      email: email?.trim() || "",
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.users, [...users, record]);

    const session = {
      username: clean,
      name: name?.trim() || clean,
      email: email?.trim() || "",
      signedInAt: new Date().toISOString(),
    };
    write(KEYS.session, session);
    setUser(session);
    return session;
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const clean = username.trim();
    const users = read(KEYS.users, []);
    const record = users.find((entry) => entry.username.toLowerCase() === clean.toLowerCase());
    if (!record) throw new Error("No account found with that username. Create one first.");

    const passwordHash = await hashPassword(record.username, password);
    if (passwordHash !== record.passwordHash) throw new Error("Incorrect password. Please try again.");

    const session = {
      username: record.username,
      name: record.name || record.username,
      email: record.email || "",
      signedInAt: new Date().toISOString(),
    };
    write(KEYS.session, session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    write(KEYS.session, null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
