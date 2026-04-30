async function runTests() {
  const baseUrl = 'http://127.0.0.1:8787/api';

  console.log("Fetching Categories...");
  const catRes = await fetch(`${baseUrl}/categories`);
  console.log(await catRes.json());

  console.log("\nFetching Products...");
  const prodRes = await fetch(`${baseUrl}/products`);
  console.log(await prodRes.json());

  console.log("\nDone!");
}

runTests();
