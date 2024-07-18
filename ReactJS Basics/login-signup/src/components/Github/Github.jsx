import React from "react";
import { useLoaderData } from "react-router-dom";

function Github() {
  const data = useLoaderData();

  return (
    <div className="p-4 m-4 text-3xl text-center text-white bg-gray-600">
      Name : {data.login}
      <br />
      Github followers: {data.followers}
      <img src={data.avatar_url} width={300} alt="" />
    </div>
  );
}

export default Github;

export const githubInfoLoader = async () => {
  const response = await fetch("https://api.github.com/users/samishakoor");

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub info");
  }
  return response.json();
};
