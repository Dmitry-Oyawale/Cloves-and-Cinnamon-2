import { hexclaveServerApp } from "@/hexclave/server";
import FilterList from "@/components/FilterList";
import { getPosts } from "@/app/post_actions"
// is a default export, so no curly braces

export default async function Home() {
  const user = await hexclaveServerApp.getUser();
  const posts = await getPosts();
  return (
    <main>
      <div>
        {user ? <section>
          <h2>Sign in to access the blog</h2>
        </section> : 
        <section>
          <FilterList />
        </section>
        }

      </div>
    </main>
  );
}
