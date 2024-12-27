import logo from "../assets/kredi-logo.png";
import { Link } from "react-router-dom";

// Типизация для элементов навигации
interface NavigationItem {
  name: string;
  link: string;
  logo: string;
}

// Утилита для условного присвоения классов
function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const Header: React.FC = () => {
  // Список элементов навигации с типизацией
  const navigation: NavigationItem[] = [
    {
      name: "Топ",
      link: "/top",
      logo: "https://img.icons8.com/?size=100&id=9ShNnttFUTZA&format=png&color=000000",
    },
    {
      name: "Футбол",
      link: "/football",
      logo: "https://img.icons8.com/?size=100&id=9820&format=png&color=209BFF",
    },
    {
      name: "Хокей",
      link: "/hockey",
      logo: "https://img.icons8.com/?size=100&id=aM8RTSMfO2Hc&format=png&color=000000",
    },
    {
      name: "Баскетбол",
      link: "/basketball",
      logo: "https://img.icons8.com/?size=100&id=3503&format=png&color=FF7300",
    },
  ];

  return (
    <>
      {/* Десктопная версия меню */}
      <div className="hidden sm:block bg-gray-800">
        <div className=" px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <img className="h-12 w-auto" src={logo} alt="Your Company" />
              </div>
              <div className="flex space-x-4 px-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                    )}
                  >
                    <img className="w-5 mr-2" src={item.logo} alt="logo" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-md px-3 py-2 text-sm font-medium flex items-center hover:bg-gray-700 hover:text-white text-gray-300 flex">
              <Link to="/login" className="flex">
                <img
                  className="w-5 mr-2"
                  src="https://img.icons8.com/?size=100&id=1CE0gYy8a1e6&format=png&color=000000"
                  alt="logo"
                />
                <span>Вход</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная версия меню */}
      <div className="block sm:hidden fixed bottom-0 inset-x-0 bg-gray-800">
        <div className="flex justify-around items-center py-2 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="flex flex-col items-center text-gray-300 hover:text-white"
            >
              <img className="w-6 h-6" src={item.logo} alt="logo" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <Link
            to="/login"
            className="lex flex-col items-center text-gray-300 hover:text-white"
          >
            <img
              className="w-6 h-6"
              src="https://img.icons8.com/?size=100&id=1CE0gYy8a1e6&format=png&color=000000"
              alt="logo"
            />
            <span className="text-xs mt-1">Вход</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
