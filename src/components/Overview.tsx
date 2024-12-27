import React from "react";
import apiService from "../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { ErrorModal } from "./ErrorModal";
import { Preview } from "../types/prewiew";
import HtmlRenderer from "./HtmlRenderer";

export const Overview: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [preview, setPreview] = useState<Preview>();

  console.log(link);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const preview = await apiService.getPreview({
          link: link,
        });
        console.log(preview);
        setPreview(preview.preview.data);
        setIsLoading(false);
      } catch (error) {
        ErrorModal(`Failed to fetch matches: ${error}`);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-3 py-2 mx-2 md:px-[10%] md:mx-[15%] my-10 text-slate-900 font-mono bg-slate-400 rounded-2xl bg-opacity-80 pb-10">
          {preview?.prediction ? (
            <HtmlRenderer htmlString={preview?.prediction} />
          ) : (
            <div className="text-center">Нет информации</div>
          )}
        </div>
      )}
    </>
  );
};
