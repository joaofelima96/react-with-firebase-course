import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //método para criar usuários com email e senha
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Usuário logado");
    } catch (error) {
      console.error(error);
    }
  };

  //método para criar usuários com contas do google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Usuário logado");
    } catch (error) {
      console.error(error);
    }
  };

  //método de logout (padrão para qualquer tipo de login)
  const logout = async () => {
    try {
      await signOut(auth);
      alert("Usuário deslogado");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign in</button>

      <button onClick={signInWithGoogle}>Sign in with google</button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};
