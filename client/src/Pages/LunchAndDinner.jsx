import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function LunchAndDinner() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-yellow-600 mb-6">{t("LunchAndDinner", { defaultValue: "Lunch & Dinner" })}</h1>
      <p className="text-lg text-gray-700 mb-4">{t("ChooseYourFavoriteMenu", { defaultValue: "Choose Your Favorite Menu" })}</p>
      <p className="text-gray-600">{t("NoMenuDataYet", { defaultValue: "Menu data is not set up yet." })}</p>
      <Link to="/menus" className="inline-block mt-6 px-4 py-2 bg-yellow-600 text-black font-bold rounded-lg">
        {t("BackToMenu", { defaultValue: "Back to Menu" })}
      </Link>
    </div>
  );
}

export default LunchAndDinner;
