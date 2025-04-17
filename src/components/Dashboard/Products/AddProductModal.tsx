import { useEffect, useState, useRef } from "react";
import { Product } from "../types";
import { useDashboard } from "../DashboardContext/useDashboard";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";

interface AddProductModalProps {
  onClose: () => void;
  onSave?: (newProduct: Product) => void;
}

const AddProductModal = ({ onClose, onSave }: AddProductModalProps) => {
  const { addProduct, isSaving } = useDashboard();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [identityId, setIdentityId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user session on component mount
  useEffect(() => {
    getSession();
  }, []);

  // Create a preview URL when a file is selected
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);

    // Clean up the URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Get user session to access identityId for S3 path
  const getSession = async () => {
    try {
      const session = await fetchAuthSession();
      setIdentityId(session?.identityId || "");
    } catch (error) {
      console.error("Error fetching session:", error);
      setUploadError("Failed to authenticate for file upload");
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    // Validate file type
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setUploadError("");
  };

  // Reset file and preview
  const handleClearFile = () => {
    setFile(null);
    setFilePreview(null);
    // Reset the file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload the file to S3
  const uploadFile = async (): Promise<string> => {
    if (!file || !identityId) {
      return "";
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Generate a unique filename
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `profile-pictures/${identityId}/${fileName}`;

      // Upload the file
      await uploadData({
        path: filePath,
        data: file,
      });

      console.log('File uploaded successfully at path:', filePath);

      // Return the image URL (the S3 path)
      return filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Failed to upload image. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    if (!title.trim()) {
      setError("Product title is required");
      return false;
    }

    if (price === "" || price < 0) {
      setError("Valid price is required");
      return false;
    }

    if (!category.trim()) {
      setError("Category is required");
      return false;
    }

    // Validate image is selected
    if (!file) {
      setError("Product image is required");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSave = async () => {
    // Reset errors
    setError("");
    setUploadError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image if a file is selected
      let imageUrl = "";
      if (file) {
        try {
          imageUrl = await uploadFile();
        } catch (error) {
          // Upload error is already handled in uploadFile()
          setIsSubmitting(false);
          return;
        }
      }

      // Create product data object
      const newProductData = {
        title,
        price: Number(price),
        category,
        description: description.trim(),
        image: imageUrl,
      };

      // Add product to database via context
      const productId = await addProduct(newProductData);
      console.log("Product created with ID:", productId);

      // Create full product object with the returned ID
      const newProduct: Product = {
        id: productId,
        ...newProductData,
      };

      // Call the onSave callback if provided
      if (onSave) {
        onSave(newProduct);
      }

      onClose(); // Close modal
    } catch (error) {
      console.error("Error saving product:", error);
      setError(typeof error === "string" ? error : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if the form is in a busy state
  const isBusy = isSubmitting || isSaving || isUploading;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-semibold">Add New Product</h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 md:mb-4 p-2 md:p-3 bg-red-100 text-red-700 rounded text-xs md:text-sm">
            {error}
          </div>
        )}

        <form className="space-y-3">
          {/* Product Title */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-xs md:text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isBusy}
              required
              placeholder="Enter product title"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded text-xs md:text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-300"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              step="0.01"
              min="0"
              disabled={isBusy}
              required
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-xs md:text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isBusy}
              required
              placeholder="e.g. Dairy, Produce, Bakery"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded text-xs md:text-sm focus:ring-1 focus:ring-emerald-300 focus:border-emerald-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isBusy}
              placeholder="Enter product description (optional)"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="block text-xs md:text-sm text-gray-700 font-medium">
              Product Image <span className="text-red-500">*</span>
            </label>

            <div className="border rounded p-2 bg-gray-50">
              <input
                className="text-xs md:text-sm file:mr-4 file:py-1 file:px-3 file:rounded
                           file:border-0 file:text-sm file:font-semibold
                           file:bg-emerald-50 file:text-emerald-700
                           hover:file:bg-emerald-100"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isBusy}
                required
                ref={fileInputRef}
              />

              {uploadError && (
                <p className="text-red-500 text-xs mt-1">{uploadError}</p>
              )}


              {filePreview && (
                <div className="mt-2 flex justify-center">
                  <div className="relative">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-32 object-contain rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                      disabled={isBusy}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 md:px-4 py-1 md:py-2 bg-gray-400 text-black rounded hover:bg-gray-500 text-xs md:text-sm transition"
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 md:px-4 py-1 md:py-2 bg-emerald-300 text-black rounded hover:bg-emerald-400 flex items-center text-xs md:text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isBusy}
            >
              {isBusy && (
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
              {isUploading ? "Uploading..." : isSubmitting || isSaving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;