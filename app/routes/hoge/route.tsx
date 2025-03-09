import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ context, params }) => {
  const { env, cf, ctx } = context.cloudflare;
  const { results } = await env.DB.prepare("SELECT * FROM cities").all();
  return { results };
};

export default function Prefecture() {
  const { results } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Hoge</h1>
      {results.map((result) => (
        <div key={result.city_code}>
          <h2>{result.name}</h2>
          <p>{result.prefecture}</p>
        </div>
      ))}
    </>
  )
}
