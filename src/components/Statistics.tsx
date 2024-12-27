import React from "react";
import { useParams } from "react-router-dom";
import { LastMatches } from "./LastMatches";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { useState, useEffect } from "react";
import apiService from "../services/api";
import { ErrorModal } from "./ErrorModal";
import { Loading } from "./Loading";
import { AvrrageStatistics } from "../types/aveageStatistics";
import { setAverageStatistics } from "../store/slices/statistics";

export const Statistics: React.FC = () => {
  const { link } = useParams<{ link: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<AvrrageStatistics | null>(null);

  const dispatch: AppDispatch = useDispatch();

  const lastMatchesData = useSelector(
    (state: RootState) => state.statistics.statistics.matches
  );

  console.log(link);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getStatisticsAverage({ link });
        const statsData = response.averageStatistics.data;

        setStatistics(statsData);
        dispatch(setAverageStatistics(statsData));

        console.log(statsData);
      } catch (error) {
        ErrorModal(`Failed to fetch matches: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [link, dispatch]);
  return (
    <div className="mt-10 px-2 md:px-44">
      {isLoading ? (
        <Loading />
      ) : (
        <LastMatches lastMatchesData={lastMatchesData} />
      )}
    </div>
  );
};
