import { hexclaveServerApp } from "@/hexclave/server"

export default async function Home() {
  const user = await hexclaveServerApp.getUser();
  return (
    <div>
      
    </div>
  );
}
