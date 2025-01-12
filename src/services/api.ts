import axios, { AxiosInstance } from "axios";
import { MatchesResponse } from "../types/matches";
import { StatisticsResponse } from "../types/statistics";
import { PreviewResponse } from "../types/prewiew";
import { PopularBetsResponse } from "../types/popularBets";
import { predictionsResponse } from "../types/predictions";
import { AvrrageStatisticsResponse } from "../types/aveageStatistics";
import { LastMatchesResponse } from "../types/matches";
import { OddsResponse } from "../types/odds";
class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  // Статус upcoming - не начались
  // Статус ended - Закончились

  // Метод для получения списка матчей
  async getMatchesPrematch(params: {
    limit: number;
    dateFrom: string;
    dateTo: string;
    status: "upcoming" | "ended";
    sport: string;
  }): Promise<MatchesResponse> {
    try {
      const response = await this.client.get<MatchesResponse>(
        "stavkatv/matches/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getLastMatches(params: {
    sport: string | undefined;
    slug: string;
    offset: number;
  }): Promise<LastMatchesResponse> {
    try {
      const response = await this.client.get<LastMatchesResponse>(
        "stavkatv/last-matches/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getStatistics(params: {
    link: string | undefined;
  }): Promise<StatisticsResponse> {
    try {
      const response = await this.client.get<StatisticsResponse>(
        "stavkatv/statistics/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getPreview(params: {
    link: string | undefined;
  }): Promise<PreviewResponse> {
    try {
      const response = await this.client.get<PreviewResponse>(
        "stavkatv/preview/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getBestPredicts(params: {
    link: string | undefined;
  }): Promise<PopularBetsResponse> {
    try {
      const response = await this.client.get<PopularBetsResponse>(
        "stavkatv/popular-bets/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getPredictions(params: {
    link: string | undefined;
    limit: number;
    offset: number;
  }): Promise<predictionsResponse> {
    try {
      const response = await this.client.get<predictionsResponse>(
        "stavkatv/predictions/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getStatisticsAverage(params: {
    link: string | undefined;
  }): Promise<AvrrageStatisticsResponse> {
    try {
      const response = await this.client.get<AvrrageStatisticsResponse>(
        "stavkatv/average-statistics/",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }

  async getOdds(params: { link: string | undefined }): Promise<OddsResponse> {
    try {
      const response = await this.client.get<OddsResponse>("stavkatv/odds/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error; // Пробрасываем ошибку для обработки в try...catch
    }
  }
}
// Создание экземпляра класса
const apiService = new ApiService("https://kredo-bet-api.vercel.app/");

export default apiService;
