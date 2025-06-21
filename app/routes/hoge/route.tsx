import type { Route } from "./+types/hoge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const { env, cf, ctx } = context.cloudflare;
  const { results } = await env.DB.prepare("SELECT * FROM cities").all();
  return { results };
}

export default function Hoge({ loaderData }: Route.ComponentProps) {
  const { results } = loaderData;

  return (
    <>
      <h1>Hoge</h1>
      {results.map((result: any) => (
        <div key={result.city_code}>
          <h2>{result.name}</h2>
          <p>{result.prefecture}</p>
        </div>
      ))}
    </>
  );
}
