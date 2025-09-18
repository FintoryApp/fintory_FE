import axios from "axios";

const API_BASE = "https://fintory.xyz"; // 실제 API 엔드포인트

export interface OverseasStockCodeResponse {
  code: string;
}

export async function getOverseasStockCodes() {
  const res = await axios.get(`${API_BASE}/api/child/stock/overseas/rankings/market-cap`);
  return res.data.data;}
