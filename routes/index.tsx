import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export interface Tweet {
  name: string;
  tweet: string;
}

export const handler: Handlers<Tweet[]> = {
  async GET(_, ctx) {
    const tweets = [
      { name: "foo", tweet: "bar" },
      { name: "baz", tweet: "qux" },
    ];
    // 取得処理
    return ctx.render(tweets);
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() ?? "";
    const tweet = formData.get("tweet")?.toString() ?? "";

    // 登録処理
    const tweets = [
      { name: "foo", tweet: "bar" },
      { name: "baz", tweet: "qux" },
    ];
    // 取得処理

    return ctx.render(tweets);
  },
};

export default function Home({ data }: PageProps<Tweet[]>) {
  const count = useSignal(3);
  return (
    <>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
          <p class="my-4">
            Try updating this message in the
            <code class="mx-2">./routes/index.tsx</code> file, and refresh.
          </p>
          <Counter count={count} />
        </div>
      </div>

      <p>Twitter</p>

      <form action="#">
        <label for="name">
          <p>name</p>
          <input type="text" name="name" id="name" required />
        </label>
        <label for="tweet">
          <p>tweet</p>
          <input type="text" name="tweet" id="tweet" required />
        </label>
        <div>
          <button>tweet!</button>
        </div>
      </form>

      {data.map((tweet: Tweet) => (
        <div>
          <p>{tweet.name}</p>
          <p>{tweet.tweet}</p>
        </div>
      ))}
    </>
  );
}
