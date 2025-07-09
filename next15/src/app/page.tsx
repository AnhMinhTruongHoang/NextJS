"use client";
import { useFormState } from "react-dom";
import { handleLogin } from "./users/action";
import SubmitButton from "./users/submit.button";
import { useEffect } from "react";
import { message } from "antd";

export default function Home() {
  const [state, formAction] = useFormState(handleLogin, {});

  useEffect(() => {
    if (state?.data?.access_token) {
      message.success("success");
    } else {
      message.error(state?.message);
    }
  }, [state]);

  return (
    <div>
      <h2>HTML Forms</h2>
      <form action={formAction}>
        <label htmlFor="username">Username:</label>
        <br />
        <input type="text" name="username" id="username" required />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input type="password" name="password" id="password" required />
        <br />
        <br />
        <SubmitButton />
        <div>
          {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
        </div>
      </form>
    </div>
  );
}
