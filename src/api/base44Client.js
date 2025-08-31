import { createClient } from '@base44/sdk';

// Create a client with authentication required

debugger
export const base44 = createClient({
  appId: "68ad6201d7cb74c04342aa07", 
  requiresAuth: true, // Ensure authentication is required for all operations
  authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2xldnBAYmFzZTQ0LmNvbSIsImV4cCI6MTc1Njg5ODQ1MCwiaWF0IjoxNzU2MjkzNjUwfQ.ckwJJ7ckrw5sm2MHuRlwFu97ptfFpFGq1dUbSMMsERs"
});


// const a = async () => {
// console.log(await base44.auth.me())
// }

// a