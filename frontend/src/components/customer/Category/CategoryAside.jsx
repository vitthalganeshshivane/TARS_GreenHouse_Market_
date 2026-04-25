import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router";
import axios from "axios";
import { Minus } from "lucide-react";

export default function CategoryAside({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("hiiting api");
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/category/tree",
        );
        console.log("Category aside:", data.categories);
        setCategories(data.categories);
      } catch (error) {
        console.log("Category fetch error", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    onSelectCategory(slug);
  };

  return (
    <aside className="w-full bg-white  p-4 rounded-xl border-1 border-gray-200">
      <h2 className="text-xl text-black-80 font-semibold mb-4 border-b pb-2">
        Categories
      </h2>

      {categories.map((cat) => (
        <div key={cat._id}>
          <div
            className="flex justify-between items-center mb-4 cursor-pointer py-2  px-3  border  border-gray-200 rounded-md hover:border-green-500 "
            onClick={() => {
              cat.children.length > 0
                ? setOpen(open === cat._id ? null : cat?._id)
                : handleCategoryClick(cat.slug);
            }}
          >
            <span>
              {cat.emoji || "📦"} {cat.name}
            </span>

            {cat.children.length > 0 && (
              <span>
                {open === cat._id ? (
                  <Minus className="text-green-500" size={15} strokeWidth={3} />
                ) : (
                  <div className="flex items-center justify-center h-5 w-5 bg-green-400 rounded-full text-sm">
                    {cat?.totalSubcategories}
                  </div>
                )}
              </span>
            )}
          </div>

          {open === cat._id && (
            <div className="ml-4 -mt-2 mb-2">
              {cat.children.map((sub) => {
                // console.log("SUB:", sub);
                return (
                  <div
                    key={sub._id}
                    onClick={() => handleCategoryClick(sub.slug)}
                    className="py-1 text-sm cursor-pointer hover:text-green-500 border-1 border-gray-200  py-2  px-3 rounded-sm mb-2"
                  >
                    {sub.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
