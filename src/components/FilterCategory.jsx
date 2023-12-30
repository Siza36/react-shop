import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/axiosConfig";
import { TbCategoryPlus } from "react-icons/tb";
import { ThreeDots } from "react-loader-spinner";

function FilterCategory({ query: { query, setQuery } }) {
  const [catList, setCatList] = useState([]);
  const [selectedCat, setSelectedCat] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getCategories = async () => {
      const list = await api.get("/categories");
      if (list.length) {
        sessionStorage.setItem("categories", JSON.stringify(list));
        setCatList(list);
      }
    };
    if (sessionStorage.getItem("categories")) {
      setCatList(JSON.parse(sessionStorage.getItem("categories")));
    } else {
      getCategories();
    }

    if (searchParams.get("category")) {
      setQuery({ ...query, category: searchParams.get("category") });
    }
  }, []);

  const categoryHandler = (e) => {
    const catId = e.target.id;

    setSelectedCat(catId);

    if (query.search === "") {
      setSearchParams({ category: catId });
      setQuery({ category: catId });
    } else {
      setQuery({ ...query, category: catId });
      setSearchParams({ ...query, category: catId });
    }
    if (catId == 0) {
      searchParams.delete("category");
      setSearchParams(searchParams);
    }
  };

  return (
    <div className=" ml-7 h-max text-xl font-medium dark:bg-grayshade-500 border border-grayshade-300 rounded-xl w-2/12 pb-0 py-5">
      <p className="ml-2 flex items-center">
        {" "}
        <TbCategoryPlus className="mr-2 text-purpleshade-400" /> Categories :{" "}
      </p>
      {!catList.length ? (
        <ThreeDots
          visible={true}
          height="30"
          width="30"
          color="#703BF7"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass="w-full flex justify-center my-4 mx-auto"
        />
      ) : (
        <ul className="font-extralight text-lg ">
          <li
            className={`py-1 cursor-pointer px-2 bg-gradient-to-r from-grayshade-400 to-transparent my-3 ${
              selectedCat == 0 && "border-l-2 border-purpleshade-400"
            }`}
            onClick={categoryHandler}
            id="0"
          >
            All
          </li>
          {catList.map(({ id, name }) => (
            <li
              className={`py-1 cursor-pointer px-2 bg-gradient-to-r from-grayshade-400 to-transparent my-3 ${
                selectedCat == id && "border-l-2 border-purpleshade-400"
              }`}
              onClick={categoryHandler}
              key={id}
              id={id}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterCategory;