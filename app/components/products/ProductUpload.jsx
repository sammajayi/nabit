import Image from "next/image";
import React, { useState, useRef } from "react";

export default function ProductUpload() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Art",
    images: [],
    document: null,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadStatus({ type: "", message: "" });

    try {
      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);

      imageFiles.forEach((file) => {
        submitData.append(`images`, file);
      });

      // Append document file if exists
      if (documentFile) {
        submitData.append("document", documentFile);
      }

      // Send to backend through API
      const response = await fetch(
        "https://coinbase-api.onrender.com/api/products",
        {
          method: "POST",
          body: submitData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({
          type: "success",
          message: "Product uploaded successfully!",
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "Art",
          images: [],
          document: null,
        });
        setImageFiles([]);
        setDocumentFile(null);

        // Clear file inputs
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (documentInputRef.current) documentInputRef.current.value = "";

        console.log("Upload successful:", result);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setUploadStatus({
          type: "error",
          message:
            errorData.message ||
            `Upload failed: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - imageFiles.length;
    const newFiles = files.slice(0, remainingSlots);

    if (newFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newPreviews],
      }));
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setFormData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setFormData((prev) => ({
      ...prev,
      document: null,
    }));
    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-white min-h-screen">
      <h1 className="text-2xl font-bold my-6 text-center text-black">
        What is up for grab?
      </h1>

      {/* Status Messages */}
      {uploadStatus.message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            uploadStatus.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {uploadStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={isLoading}
          >
            <option value="Art">Art</option>
            <option value="Tech">Tech</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (up to 5)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {imageFiles.length < 5 && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isLoading}
              >
                Add Images
              </button>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {imageFiles.length}/5 images uploaded
            </p>
          </div>

          {/* Image Previews */}
          {imageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                    width={80}
                    height={80}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* digital product(document) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Document (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {!documentFile ? (
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                disabled={isLoading}
              >
                Upload Document
              </button>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {documentFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                  disabled={isLoading}
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleDocumentUpload}
              className="hidden"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              PDF, DOC, DOCX, or TXT files
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
