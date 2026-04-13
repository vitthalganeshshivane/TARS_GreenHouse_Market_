import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  X,
  ImagePlus,
} from "lucide-react";
import Pagination from "../../../components/Vendor/dashboard/Pagination";
import API from "../../../api/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

const itemsPerPage = 8;

const getCategoriesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

function CategoryFormModal({
  open,
  mode,
  form,
  previewImage,
  parentOptions,
  submitting,
  error,
  onClose,
  onChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-xl max-h-[90vh] overflow-y-auto my-auto scrollbar-hide">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {mode === "edit" ? "Edit Category" : "Add Category"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "edit"
                ? "Update category details and save changes"
                : "Create a new category for your store"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Fruits"
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Emoji
              </label>
              <input
                type="text"
                name="emoji"
                value={form.emoji}
                onChange={onChange}
                placeholder="e.g. 🍎"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Parent Category
              </label>
              <select
                name="parent"
                value={form.parent}
                onChange={onChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              >
                <option value="">No parent (Main category)</option>
                {parentOptions.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                placeholder="Short description about this category..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category Image
              </label>

              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
                <div className="border-2 border-dashed rounded-2xl min-h-[160px] border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Category preview"
                      className="w-full h-44 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-center px-4 py-8">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <ImagePlus className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        If image is missing, emoji will be shown
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {previewImage && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {submitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromQuery = queryParams.get("search") || "";
  const [search, setSearch] = useState(searchFromQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    emoji: "",
    description: "",
    parent: "",
    imageFile: null,
    existingImage: "",
    removeImage: false,
  });

  useEffect(() => {
    setSearch(searchFromQuery);
    setCurrentPage(1);
  }, [searchFromQuery]);

  const previewImage = useMemo(() => {
    if (form.removeImage) return "";
    if (form.imageFile) return URL.createObjectURL(form.imageFile);
    return form.existingImage || "";
  }, [form.imageFile, form.existingImage, form.removeImage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setPageError("");
      const res = await API.get("/category");
      setCategories(getCategoriesFromResponse(res.data));
    } catch (err) {
      setPageError(
        err?.response?.data?.message || "Failed to fetch categories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const mainCategories = useMemo(
    () => categories.filter((category) => !category?.parent),
    [categories],
  );

  const subCategories = useMemo(
    () => categories.filter((category) => category?.parent),
    [categories],
  );

  const childMap = useMemo(() => {
    const map = {};
    categories.forEach((category) => {
      const parentId = category?.parent?._id;
      if (!parentId) return;
      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(category);
    });
    return map;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();
    return categories.filter((category) => {
      const parentName = category?.parent?.name || "";
      const text =
        `${category?.name || ""} ${category?.description || ""} ${parentName}`.toLowerCase();
      return text.includes(query);
    });
  }, [categories, search]);

  const paginated = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage),
  );

  const parentOptions = useMemo(() => {
    return mainCategories.filter((category) => category._id !== form.id);
  }, [mainCategories, form.id]);

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      emoji: "",
      description: "",
      parent: "",
      imageFile: null,
      existingImage: "",
      removeImage: false,
    });
    setFormError("");
  };

  const openAddModal = () => {
    resetForm();
    setModalMode("add");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setForm({
      id: category._id,
      name: category?.name || "",
      emoji: category?.emoji || "",
      description: category?.description || "",
      parent: category?.parent?._id || "",
      imageFile: null,
      existingImage: category?.image || "",
      removeImage: false,
    });
    setFormError("");
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      removeImage: false,
    }));
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      existingImage: "",
      removeImage: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("emoji", form.emoji.trim());
      payload.append("description", form.description.trim());
      if (form.parent) payload.append("parent", form.parent);
      if (form.imageFile) payload.append("image", form.imageFile);
      payload.append("removeImage", String(form.removeImage));

      if (modalMode === "edit") {
        await API.put(`/category/${form.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/category", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchCategories();
      handleModalClose();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          `Failed to ${modalMode === "edit" ? "update" : "create"} category.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      setDeletingId(deleteTarget._id);
      await API.delete(`/category/${deleteTarget._id}`);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      setPageError(
        err?.response?.data?.message || "Failed to delete category.",
      );
    } finally {
      setDeletingId("");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">
            All Categories ({filteredCategories.length})
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>
          </div>
        </div>

        {pageError && (
          <div className="px-5 pt-4">
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {pageError}
            </div>
          </div>
        )}

        <div className="p-5">
          {loading ? (
            <div className="text-sm text-gray-500 py-10 text-center">
              Loading categories...
            </div>
          ) : paginated.length ? (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-800">
                    Main Categories (
                    {
                      mainCategories.filter((category) =>
                        `${category?.name || ""} ${category?.description || ""}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      ).length
                    }
                    )
                  </h4>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {paginated
                    .filter((category) => !category?.parent)
                    .map((category) => {
                      const children = childMap[category._id] || [];

                      return (
                        <div
                          key={category._id}
                          className="relative bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-4 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {category?.image ? (
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-3xl">
                                  {category?.emoji || "📁"}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-1 bg-white rounded-lg hover:bg-green-50 transition-colors"
                                onClick={() => openEditModal(category)}
                              >
                                <Pencil className="w-3.5 h-3.5 text-green-600" />
                              </button>
                              <button
                                className="p-1 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                onClick={() => setDeleteTarget(category)}
                                disabled={deletingId === category._id}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-bold text-gray-800">
                            {category.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5 min-h-[32px]">
                            {category.description || "No description added yet"}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border text-green-700 bg-white border-green-100">
                              Main Category
                            </span>

                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                          </div>

                          {children.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-green-100">
                              <p className="text-[11px] font-semibold text-gray-500 mb-2">
                                Subcategories ({children.length})
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {children.slice(0, 3).map((child) => (
                                  <span
                                    key={child._id}
                                    className="px-2 py-1 bg-white border border-green-100 text-[11px] font-semibold text-green-700 rounded-lg"
                                  >
                                    {child.name}
                                  </span>
                                ))}
                                {children.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-[11px] font-semibold text-gray-600 rounded-lg">
                                    +{children.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-800">
                    Subcategories (
                    {
                      subCategories.filter((category) =>
                        `${category?.name || ""} ${category?.description || ""} ${category?.parent?.name || ""}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      ).length
                    }
                    )
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {paginated
                    .filter((category) => category?.parent)
                    .map((category) => (
                      <div
                        key={category._id}
                        className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {category?.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-3xl">
                                {category?.emoji || "📁"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 bg-white rounded-lg hover:bg-green-50 transition-colors"
                              onClick={() => openEditModal(category)}
                            >
                              <Pencil className="w-3.5 h-3.5 text-green-600" />
                            </button>
                            <button
                              className="p-1 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                              onClick={() => setDeleteTarget(category)}
                              disabled={deletingId === category._id}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm font-bold text-gray-800">
                          {category.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5 min-h-[32px]">
                          {category.description || "No description added yet"}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border text-gray-600 bg-white border-gray-200">
                            Parent: {category.parent?.name || "-"}
                          </span>

                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-10 text-center">
              No categories found.
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <Pagination
            current={currentPage}
            total={Math.max(totalPages, 1)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <CategoryFormModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        previewImage={previewImage}
        parentOptions={parentOptions}
        submitting={submitting}
        error={formError}
        onClose={handleModalClose}
        onChange={handleFormChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteTarget?.name}
              </span>
              ? If this category is linked to products, the backend will block
              deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
