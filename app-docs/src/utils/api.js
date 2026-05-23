const apiRequest = async (endpoint, options) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options.body || {}),
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch (_) {
        // ignore JSON parse errors
      }
      const message =
        errorBody?.message || `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export { apiRequest };
