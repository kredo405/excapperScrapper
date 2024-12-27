import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams, Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setCurrentLink } from "../store/slices/linkSlice";
import {
  setLeagueTable,
  setMatches,
  setOutcomes,
  setTeams,
} from "../store/slices/statistics";
import { ErrorModal } from "../components/ErrorModal";
import { Loading } from "../components/Loading";
import apiService from "../services/api";
import { Statistics } from "../types/statistics";
import { Team } from "../types/statistics";

const Match: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const currentLink = useSelector((state: RootState) => state.link.currentLink);

  // Фетч данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getStatistics({ link });
        const statsData = response.statistics.data;

        setStatistics(statsData);
        dispatch(setLeagueTable(statsData.leagueTable));
        dispatch(setMatches(statsData.matches));
        dispatch(setTeams(statsData.teams));
        dispatch(setOutcomes(statsData.topOutcomes));
      } catch (error) {
        ErrorModal(`Failed to fetch matches: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [link, dispatch]);

  // Обновление текущей ссылки
  useEffect(() => {
    const path = location.pathname.split("/").pop() || "";
    dispatch(setCurrentLink(path));
  }, [location, dispatch]);

  // Рендер логотипов
  const renderTeamLogo = (team: Team) => (
    <div className="flex items-center justify-center flex-col">
      <img
        className="w-32 h-32"
        src={`https://cdn.stavka.tv${team.logo}`}
        alt={`${team.shortName} logo`}
      />
      <div className="flex items-center gap-2">
        <img
          className="w-3 h-3"
          src={`https://cdn.stavka.tv${team.country.logo}`}
          alt={`${team.shortName} flag`}
        />
        <span className="font-semibold text-slate-200 text-lg">
          {team.shortName}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-10">
          {/* Рендер команд */}
          <div className="flex items-center justify-evenly">
            {statistics && renderTeamLogo(statistics.teams.home)}
            <img
              src="https://img.icons8.com/?size=100&id=MFUoiKPaq30B&format=png&color=756646"
              alt="versus"
            />
            {statistics && renderTeamLogo(statistics.teams.away)}
          </div>

          {/* Навигация */}
          <div className="mt-10 w-full">
            <nav className="flex items-center justify-center">
              <ul className="flex items-center gap-4">
                {["", "statistics", "predictions"].map((path) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`font-semibold px-5 py-3 rounded-lg ${
                        currentLink === path
                          ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                          : "bg-slate-600 text-slate-100 hover:bg-slate-500"
                      }`}
                    >
                      {path === ""
                        ? "Обзор"
                        : path === "statistics"
                        ? "Статистика"
                        : "Прогнозы"}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default Match;
