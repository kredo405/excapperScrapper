import ball from "../assets/ball.png";

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30">
      <div className="text-center flex justify-center flex-col items-center">
        <img className="animate-bounce w-24" src={ball} alt="Загрузка" />
        <span className="block font-mono text-2xl font-semibold text-white mt-4">
          Загрузка
        </span>
      </div>
    </div>
  );
};
