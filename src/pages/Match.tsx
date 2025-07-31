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
    <div className="flex flex-col items-center mx-3 w-24 md:w-32 transition-all duration-300 hover:scale-105">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-full p-2 shadow-lg border border-slate-700">
        <img
          className="w-14 h-14 md:w-20 md:h-20 object-contain"
          src={`https://cdn.stavka.tv${team.logo}`}
          alt={`${team.shortName} logo`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-logo.png';
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <img
          className="w-4 h-4 object-contain"
          src={`https://cdn.stavka.tv${team.country.logo}`}
          alt={`${team.country.name} flag`}
        />
        <span className="font-bold text-slate-100 text-sm md:text-base truncate max-w-[100px]">
          {team.shortName}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loading />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Заголовок матча */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="text-slate-400 text-sm mb-4">ПРЕДСТОЯЩИЙ МАТЧ</div>
              
              <div className="flex items-center justify-between w-full max-w-md">
                {statistics && renderTeamLogo(statistics.teams.home)}
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl md:text-4xl font-bold text-slate-300 mb-1">
                    VS
                  </div>
                </div>
                
                {statistics && renderTeamLogo(statistics.teams.away)}
              </div>
            </div>
          </div>

          {/* Навигация */}
          <div className="mt-8">
            <nav className="flex justify-center">
              <ul className="flex bg-slate-700/50 backdrop-blur rounded-xl p-1 border border-slate-600/50 shadow-md">
                {["", "statistics", "predictions"].map((path) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`
                        font-medium px-5 py-3 rounded-lg text-sm md:text-base transition-all duration-200
                        ${
                          currentLink === path
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/20 shadow-lg"
                            : "text-slate-300 hover:bg-slate-600/50"
                        }
                      `}
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
            
            <div className="mt-6 bg-slate-800/30 backdrop-blur rounded-2xl p-4 md:p-6 border border-slate-700/50 shadow-lg">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;