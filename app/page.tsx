"use client";
import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Link from "next/link";

export default function IndexPage(): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          console.log(res.data, "kjbug");
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };
  return (
    <ul className="card-list">
      <li>
        <Link
          href="/donate-with-embedded-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Donate with embedded Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          href="/donate-with-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Donate with hosted Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          href="/donate-with-elements"
          className="card elements-style-background"
        >
          <h2 className="bottom">Donate with Elements</h2>
          <img src="/elements-card-payment.svg" />
        </Link>
      </li>
      <div>
        <h2>React Google Login</h2>
        <br />
        <br />
        {profile ? (
          <div>
            <img src={profile.picture} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile?.name}</p>
            <p>Email Address: {profile?.email}</p>
            <br />
            <br />
            <button onClick={logOut}>Log out</button>
          </div>
        ) : (
          <button onClick={() => login()}>Sign in with Google 🚀 </button>
        )}
      </div>
    </ul>
  );
}
