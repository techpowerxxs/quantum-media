// Placeholder auth0 client for demo - replace with your real Auth0 client logic

export const auth0Client = {
  getUser: async () => {
    // Simulate user retrieval - replace with real auth check
    return new Promise((resolve) =>
      setTimeout(() => resolve({ email: "echo@artist.com", name: "DJ Echo" }), 500)
    );
  },
  loginWithRedirect: () => {
    alert("Redirect to login...");
  },
};