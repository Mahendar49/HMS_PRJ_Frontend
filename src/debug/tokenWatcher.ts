// Debug utility to watch token changes
let lastKnownToken: string | null = null;

export function startTokenWatcher() {
  setInterval(() => {
    const currentToken = localStorage.getItem("authToken");
    if (currentToken !== lastKnownToken) {
      console.log("🔍 TOKEN CHANGED!");
      console.log("  Previous:", lastKnownToken ? "exists" : "null");
      console.log("  Current:", currentToken ? "exists" : "null");
      console.log("  Change time:", new Date().toISOString());
      console.trace("Token change detected from:");
      lastKnownToken = currentToken;
    }
  }, 1000); // Check every second
  
  console.log("🔍 Token watcher started - will report any token changes");
}

export function getCurrentTokenStatus() {
  const token = localStorage.getItem("authToken");
  console.log("🔍 Current token status:", token ? "exists" : "null");
  return token;
}