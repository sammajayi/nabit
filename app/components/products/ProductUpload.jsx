import React, { useRef } from 'react';

const ProductUpload = () => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        {/* <button className="text-3xl font-light text-gray-700">&times;</button> */}
        <h1 className="text-xl font-extrabold text-center justify-center mx-auto flex-1 -ml-8 text-black">New Product</h1>
        <span className="w-8" /> 
      </div>

      <form className="flex flex-col gap-4 flex-1">
        <input
          className="bg-[#e9eef4] rounded-2xl px-4 py-4 text-lg placeholder-gray-400 text-black outline-none"
          placeholder="Product Name"
        />
        <textarea
          className="bg-[#e9eef4] rounded-2xl px-4 py-4 text-lg placeholder-gray-400 text-black outline-none min-h-[100px] resize-none"
          placeholder="Description"
        />
        <input
          type="number"
          className="bg-[#e9eef4] rounded-2xl px-4 py-4 text-lg placeholder-gray-400 text-black outline-none"
          placeholder="Price"
        />
        <select
          className="bg-[#e9eef4] rounded-2xl px-4 py-4 text-lg text-black outline-none appearance-none"
          defaultValue=""
        >
          <option value="" disabled>Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>

        {/* Images Section */}
        <div className="mt-2">
          <h2 className="font-bold text-lg mb-2 text-black">Images</h2>
          <div className="border-2 border-dashed border-[#d3dae6] rounded-2xl p-6 flex flex-col items-center justify-center bg-white">
            <p className="font-bold text-xl mb-1 text-black">Add Images</p>
            <p className="text-gray-500 mb-4 text-center">Upload up to 5 images to showcase your product</p>
            <button
              type="button"
              className="bg-[#e9eef4] px-8 py-2 rounded-xl font-bold text-lg text-black"
              onClick={handleUploadClick}
            >
              Upload
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>

        {/* Create Product Button */}
        <button
          type="submit"
          className="w-full bg-[#379eff] text-white text-xl font-bold rounded-2xl py-4 mt-8 mb-2"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductUpload;
