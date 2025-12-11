import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function generatePairs(names: string[]) {
  try {
    const response = await axios.post(`${API_URL}/pair`, { names });
    return response.data.pairs;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}
