import { useState, useEffect, useRef } from "react";
import { Product } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { StorageImage } from '@aws-amplify/ui-react-storage';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave?: (updatedProduct: Product) => void;
}

const EditProductModal = ({
  product,
  onClose,
  onSave,
}: EditProductModalProps) => {
  const { updateProductData, isSaving } = useDashboard();
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category || "");
  const [description, setDescription] = useState(product.description || "");
  const [image,] = useState(product.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [identityId, setIdentityId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSession();
  }, []);

  // Generate preview for selected file
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }

    // Create a preview URL for the selected file
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Clean up the URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const getSession = async () => {
    try {
      const session = await fetchAuthSession();
      setIdentityId(session?.identityId || "");
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    console.log(event.target.files?.[0]);
  };

  // Function to clear file selection
  const handleClearFile = () => {
    setFile(null);
    setFilePreview(null);
    // Reset the file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Check title
    if (!title.trim()) {
      errors.title = "Product title is required";
    }

    // Check price
    if (price <= 0) {
      errors.price = "Price must be greater than zero";
    }

    // Check category
    if (!category.trim()) {
      errors.category = "Category is required";
    }

    // Check if we have an image (either existing or new)
    if (!image && !file) {
      errors.image = "Product must have an image";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    // Reset errors
    setError("");
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors below before saving");
      return;
    }

    try {
      setIsSubmitting(true);

      let imagePath = image; // Default to current image path

      // If a new file is selected, upload it
      if (file) {
        try {
          const fileName = `${Date.now()}-${file.name}`;
          const uploadPath = `profile-pictures/${identityId}/${fileName}`;

          await uploadData({
            path: uploadPath,
            data: file,
          });

          imagePath = uploadPath; // Update the image path
          console.log('Uploaded file successfully to:', uploadPath);
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          setError("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      const updatedProduct: Product = {
        ...product,
        title,
        price,
        category,
        description,
        image: imagePath,
      };

      // Update product in database via context
      await updateProductData(updatedProduct);

      // Call the onSave callback if provided
      if (onSave) {
        onSave(updatedProduct);
      }

      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      setError(typeof error === "string" ? error : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Edit Product</h2>

        {error && (
          <div className="mb-3 md:mb-4 p-2 md:p-3 bg-red-100 text-red-700 rounded text-xs md:text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Product Title */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded text-xs md:text-sm ${fieldErrors.title ? 'border-red-500' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-xs">{fieldErrors.title}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={`w-full p-2 border rounded text-xs md:text-sm ${fieldErrors.price ? 'border-red-500' : ''}`}
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              required
            />
            {fieldErrors.price && (
              <p className="text-red-500 text-xs">{fieldErrors.price}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded text-xs md:text-sm ${fieldErrors.category ? 'border-red-500' : ''}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {fieldErrors.category && (
              <p className="text-red-500 text-xs">{fieldErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded text-xs md:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Image */}
          <div className="space-y-1">
            {/* Show new image preview OR current image */}
            {filePreview ? (
              <div>
                <span className="block text-xs md:text-sm text-gray-700 mb-1">New Image Preview</span>
                <div className="mb-2 flex justify-center bg-gray-100 p-2 rounded border border-gray-300">
                  <div className="w-24 h-24 md:w-32 md:h-32 relative">
                    <img
                      src={filePreview}
                      alt="New image preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                      disabled={isSubmitting || isSaving}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="block text-xs md:text-sm text-gray-700 mb-1">
                  Current Image <span className="text-red-500">*</span>
                </span>
                {image ? (
                  <div className={`mb-2 flex justify-center bg-gray-100 p-2 rounded border ${fieldErrors.image ? 'border-red-500' : 'border-gray-300'}`}>
                    <div className="w-24 h-24 md:w-32 md:h-32 relative">
                      <StorageImage
                        alt={title}
                        path={image}
                        className="w-full h-full object-cover rounded"
                        fallbackSrc="/assets/product-placeholder.png"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mb-2">No image set</div>
                )}
              </div>
            )}

            {fieldErrors.image && (
              <p className="text-red-500 text-xs">{fieldErrors.image}</p>
            )}

            <div className="mt-2">
              <span className="block text-xs md:text-sm text-gray-700 mb-1">Upload New Image</span>
              <label className="flex items-center gap-2">
                <div className="px-3 py-2 bg-emerald-300 text-black rounded hover:bg-emerald-400 cursor-pointer text-xs md:text-sm">
                  Choose File
                </div>
                <input
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  id="product-image-upload"
                  ref={fileInputRef}
                />
                <span className="text-xs text-gray-500 truncate">
                  {file ? file.name : "No file selected"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-3 md:mt-4">
          <button
            className="px-3 md:px-4 py-1 md:py-2 bg-gray-400 text-black rounded mr-2 hover:bg-gray-500 text-xs md:text-sm"
            onClick={onClose}
            disabled={isSubmitting || isSaving}
          >
            Cancel
          </button>
          <button
            className="px-3 md:px-4 py-1 md:py-2 bg-emerald-300 text-black rounded hover:bg-emerald-400 flex items-center text-xs md:text-sm"
            onClick={handleSave}
            disabled={isSubmitting || isSaving}
          >
            {(isSubmitting || isSaving) && (
              <svg
                className="animate-spin -ml-1 mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting || isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;