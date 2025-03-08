import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  text: string;
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  return {
    text: "Hello, world!",
  };
};

export default function Prefecture() {
  const { text } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Hoge</h1>
      <p>{text}</p>
    </>
  )
}
