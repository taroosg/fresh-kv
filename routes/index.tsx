import { Handlers, PageProps } from "$fresh/server.ts";

interface Tweet {
  name: string;
  tweet: string;
}

const nTweets = async (kv: any, n: number) => {
  const iter = await kv.list({ prefix: ["tweets"] }, { limit: n });
  const tweets = [];
  for await (const res of iter) {
    tweets.unshift(res.value);
    // 削除用
    // await kv.delete(res.key);
  }
  return tweets;
};

export const handler: Handlers<Tweet[]> = {
  async GET(_, ctx) {
    // 取得処理
    const kv = await Deno.openKv();
    const tweets = await nTweets(kv, 100);
    return ctx.render(tweets);
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() ?? "";
    const tweet = formData.get("tweet")?.toString() ?? "";
    // 登録処理
    const kv = await Deno.openKv();
    await kv.set(["tweets", Date.now()], {
      tweet,
      name,
    });
    return new Response("", {
      status: 303,
      headers: { Location: "/" },
    });
  },
};

export default function Home({ data }: PageProps<Tweet[]>) {
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
          <h1 class="text-4xl font-bold">Twitter</h1>
          <p class="my-4">
            Try posting a tweet!
          </p>
          <form action="#" method="POST">
            <label for="name">
              <p>name</p>
              <input
                type="text"
                name="name"
                id="name"
                required
              />
            </label>
            <label for="tweet">
              <p>tweet</p>
              <input
                type="text"
                name="tweet"
                id="tweet"
                required
              />
            </label>
            <div>
              <button class="border border-black">tweet!</button>
            </div>
          </form>
          <table>
            <thead>
              <tr>
                <th>name</th>
                <th>tweet</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tweet: Tweet) => (
                <tr>
                  <td>{tweet.name}</td>
                  <td>{tweet.tweet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
