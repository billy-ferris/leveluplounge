import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";
import { MaxWidthWrapper } from "~/components/max-width-wrapper";

const Home = async () => {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <MaxWidthWrapper>
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
        <h3 className="sm:text text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {hello ? hello.greeting : "Loading tRPC query..."}
        </h3>
        <p className="sm:text text-muted-foreground mt-6 text-2xl sm:text-2xl">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className={buttonVariants()}
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Home;
