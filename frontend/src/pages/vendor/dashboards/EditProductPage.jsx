import { useEffect, useMemo, useState } from "react";
import { X, Plus, Save, ChevronDown, ImagePlus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axios";
import Loader from "../../../components/Loader";

const unitOptions = [
  "kg",
  "gram",
  "litre",
  "ml",
  "piece",
  "pack",
  "dozen",
  "bundle",
];

const emptyVariant = {
  label: "",
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
};

const getProductFromResponse = (data) => {
  if (data?.product) return data.product;
  if (data?.data) return data.data;
  return data;
};

const getCategoriesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    brand: "",
    category: "",
    subCategory: "",
    sku: "",
    mfgDate: "",
    life: "",
    type: "",
    unit: "kg",
    tags: "",
    isFeatured: false,
    isAvailable: true,
    packaging: "",
    ingredients: "",
    warnings: "",
    suggestedUse: "",
  });

  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const parentCategories = useMemo(
    () => categories.filter((category) => !category?.parent),
    [categories],
  );

  const subCategoryOptions = useMemo(
    () =>
      categories.filter((category) => category?.parent?._id === form.category),
    [categories, form.category],
  );

  const newImagePreviews = useMemo(
    () => newImages.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newImages],
  );

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setCategoryLoading(true);
        setError("");

        const [productRes, categoryRes] = await Promise.all([
          API.get(`/product/${id}`),
          API.get("/category"),
        ]);

        const product = getProductFromResponse(productRes.data);
        const allCategories = getCategoriesFromResponse(categoryRes.data);

        setCategories(allCategories);

        setForm({
          title: product?.title || "",
          description: product?.description || "",
          brand: product?.brand || "",
          category: product?.category?._id || "",
          subCategory: product?.subCategory?._id || "",
          sku: product?.sku || "",
          mfgDate: formatDateForInput(product?.mfgDate),
          life: product?.life ?? "",
          type: product?.type || "",
          unit: product?.unit || "kg",
          tags: (product?.tags || []).join(", "),
          isFeatured: Boolean(product?.isFeatured),
          isAvailable: product?.isAvailable ?? true,
          packaging: product?.additionalInfo?.packaging || "",
          ingredients: product?.additionalInfo?.ingredients || "",
          warnings: product?.additionalInfo?.warnings || "",
          suggestedUse: product?.additionalInfo?.suggestedUse || "",
        });

        setVariants(
          product?.variants?.length
            ? product.variants.map((variant) => ({
                label: variant?.label || "",
                price: variant?.price ?? "",
                discountPrice: variant?.discountPrice ?? "",
                stock: variant?.stock ?? "",
                sku: variant?.sku || "",
              }))
            : [{ ...emptyVariant }],
        );

        setExistingImages(product?.images || []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load product details.",
        );
      } finally {
        setLoading(false);
        setCategoryLoading(false);
      }
    };

    loadPageData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      if (name === "category") {
        return {
          ...prev,
          category: value,
          subCategory: "",
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExistingImageDelete = (imageUrl) => {
    setImagesToDelete((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((img) => img !== imageUrl)
        : [...prev, imageUrl],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedVariants = variants.map((variant) => ({
      label: variant.label.trim(),
      price: Number(variant.price),
      discountPrice:
        variant.discountPrice === ""
          ? undefined
          : Number(variant.discountPrice),
      stock: variant.stock === "" ? 0 : Number(variant.stock),
      sku: variant.sku.trim(),
    }));

    const hasInvalidVariant = cleanedVariants.some(
      (variant) => !variant.label || Number.isNaN(variant.price),
    );

    if (hasInvalidVariant) {
      setError("Please fill all required variant fields correctly.");
      return;
    }

    const labels = cleanedVariants.map((variant) =>
      variant.label.toLowerCase(),
    );
    if (labels.length !== new Set(labels).size) {
      setError("Duplicate variant labels are not allowed.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("brand", form.brand);
      payload.append("category", form.category);
      if (form.subCategory) payload.append("subCategory", form.subCategory);
      payload.append("sku", form.sku);
      payload.append("mfgDate", form.mfgDate);
      payload.append("life", form.life);
      payload.append("type", form.type);
      payload.append("unit", form.unit);
      payload.append("variants", JSON.stringify(cleanedVariants));
      payload.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      );
      payload.append(
        "additionalInfo",
        JSON.stringify({
          packaging: form.packaging,
          ingredients: form.ingredients,
          warnings: form.warnings,
          suggestedUse: form.suggestedUse,
        }),
      );
      payload.append("isFeatured", String(form.isFeatured));
      payload.append("isAvailable", String(form.isAvailable));

      if (imagesToDelete.length) {
        payload.append("imagesToDelete", imagesToDelete.join(","));
      }

      payload.append("replaceImages", String(replaceImages));

      newImages.forEach((image) => {
        payload.append("images", image);
      });

      await API.put(`/product/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/vendor/products");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Product update failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-sm text-gray-500">
        <Loader
          title="Loading product details"
          subtitle="Preparing product information for editing..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Edit Product</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Update product details and save changes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/vendor/products")}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-product-form"
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4" />{" "}
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                Basic Details
              </h3>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Product title"
                  className="sm:col-span-2 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Description"
                  className="sm:col-span-2 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 resize-none"
                />
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Type"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="SKU"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />

                <div className="relative">
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 appearance-none"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <input
                  type="number"
                  name="life"
                  value={form.life}
                  onChange={handleChange}
                  placeholder="Shelf life"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="date"
                  name="mfgDate"
                  value={form.mfgDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-base">Variants</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-800">
                        Variant {index + 1}
                      </p>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={variant.label}
                        onChange={(e) =>
                          handleVariantChange(index, "label", e.target.value)
                        }
                        placeholder="Variant label"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                      />
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        placeholder="Variant SKU"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                      />
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                        placeholder="Price"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                      />
                      <input
                        type="number"
                        value={variant.discountPrice}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "discountPrice",
                            e.target.value,
                          )
                        }
                        placeholder="Discount price"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                      />
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        placeholder="Stock"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                Category & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={categoryLoading}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 appearance-none disabled:opacity-60"
                  >
                    <option value="">
                      {categoryLoading
                        ? "Loading categories..."
                        : "Select category"}
                    </option>
                    {parentCategories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handleChange}
                    disabled={!form.category || !subCategoryOptions.length}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 appearance-none disabled:opacity-60"
                  >
                    <option value="">Select sub category</option>
                    {subCategoryOptions.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="organic, premium, bestseller"
                  className="sm:col-span-2 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                Additional Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="packaging"
                  value={form.packaging}
                  onChange={handleChange}
                  placeholder="Packaging"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="text"
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Ingredients"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="text"
                  name="warnings"
                  value={form.warnings}
                  onChange={handleChange}
                  placeholder="Warnings"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
                <input
                  type="text"
                  name="suggestedUse"
                  value={form.suggestedUse}
                  onChange={handleChange}
                  placeholder="Suggested use"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span className="text-sm font-semibold text-green-800">
                    Feature this product on the homepage
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Product is available for customers
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                Product Images
              </h3>

              {!!existingImages.length && (
                <div className="space-y-3 mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Existing Images
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {existingImages.map((image, index) => {
                      const marked = imagesToDelete.includes(image);

                      return (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Existing ${index + 1}`}
                            className={`w-full h-28 object-cover rounded-xl border ${marked ? "border-red-300 opacity-50" : "border-gray-200"}`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleExistingImageDelete(image)}
                            className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-semibold rounded-lg ${marked ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}
                          >
                            {marked ? "Undo" : "Remove"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleNewImageChange}
                />
                <div className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all min-h-[180px] border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50">
                  <div className="py-8 text-center px-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <ImagePlus className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      Upload new images
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5 images
                    </p>
                  </div>
                </div>
              </label>

              {!!newImagePreviews.length && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {newImagePreviews.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`New ${index + 1}`}
                        className="w-full h-28 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={replaceImages}
                  onChange={(e) => setReplaceImages(e.target.checked)}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Replace all old images with new uploads
                </span>
              </label>
            </div>

            <div className="bg-green-600 rounded-2xl p-5 text-white">
              <p className="font-bold mb-1">Ready to update?</p>
              <p className="text-xs text-green-100 mb-4">
                Save your changes and sync the latest product data.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm disabled:opacity-70"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
