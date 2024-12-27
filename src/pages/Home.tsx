import React from "react";
import Header from "../components/Header";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Empty } from "antd";
import { ErrorModal } from "../components/ErrorModal";
import { Loading } from "../components/Loading";
import { League } from "../types/matches";
import { getCurrentDate, getNextDate } from "../utils/date";
import { MatchItem } from "../components/MatchItem";
import { LeagueItem } from "../components/LeagueItem";
import apiService from "../services/api";

const Home: React.FC = () => {
  const { sport } = useParams<{ sport: string }>();

  const [arrMatches, setArrayMatches] = useState<League[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getMatchesPrematch({
          limit: 150,
          dateFrom: getCurrentDate(),
          dateTo: getNextDate(),
          sport: getSportQuery(sport),
        });
        console.log(response.matches.data);
        setArrayMatches(response.matches.data ?? []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        ErrorModal(`Failed to fetch matches: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [sport]);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return arrMatches;
    const query = searchQuery.toLowerCase();
    return arrMatches.filter((league) =>
      league.country.name.toLowerCase().includes(query)
    );
  }, [arrMatches, searchQuery]);

  const elements =
    filteredMatches.length > 0
      ? filteredMatches.map((el, i) => {
          const matchElementsFiltered = el.matches.filter(
            (match) =>
              (match.predictionStats.total >= 45 &&
                match.sportSlug === "soccer") ||
              (match.predictionStats.total >= 45 &&
                match.sportSlug === "basketball") ||
              (match.predictionStats.total >= 45 &&
                match.sportSlug === "ice-hockey")
          );

          if (matchElementsFiltered.length === 0) {
            return null;
          } else {
            const matchElements = matchElementsFiltered.map((item, idx) => (
              <MatchItem match={item} idx={idx} key={idx} />
            ));

            return (
              <LeagueItem league={el} matchElements={matchElements} key={i} />
            );
          }
        })
      : [];

  const filteredElements = (Array.isArray(elements) ? elements : []).filter(
    (el) => el !== null
  );

  return (
    <div className="h-full">
      <Header />
      <div>
        <div className="container mx-auto lg:px-44 pt-10 pb-10">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="mb-10 px-3">
                <form>
                  <input
                    className="rounded-lg w-full md:w-5/12 px-3 py-2"
                    placeholder="Введите название страны"
                    type="search"
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              {filteredElements.length > 0 ? (
                filteredElements
              ) : (
                <>
                  <div className="flex justify-center items-center">
                    <Empty
                      description={
                        <span className="text-slate-100">
                          На данный момент нет матчей
                        </span>
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для преобразования параметров
const getSportQuery = (sport: string | undefined): string => {
  switch (sport) {
    case "football":
      return "sport=soccer";
    case "basketball":
      return "sport=basketball";
    case "tenis":
      return "sport=tennis";
    case "hockey":
      return "sport=ice-hockey";
    default:
      return "onlyTopLeagues=true";
  }
};

export default Home;
