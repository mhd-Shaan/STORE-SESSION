import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const vehicleTypes = ["2-Wheeler", "4-Wheeler", "Commercial Vehicle"];

const vehicleBrandsByType = {
  "2-Wheeler": ["Hero", "Honda", "Yamaha", "Bajaj", "TVS", "Suzuki", "Royal Enfield"],
  "4-Wheeler": ["Maruti Suzuki", "Tata", "Mahindra", "Hyundai", "Kia", "Toyota", "Honda"],
  "Commercial Vehicle": ["Ashok Leyland", "BharatBenz", "Eicher", "Mahindra Trucks", "Tata Motors"]
};

const vehicleModelsByBrand = {
  "Hero": ["Splendor", "HF Deluxe", "Passion Pro", "Xpulse"],
  "Honda": ["Activa", "Shine", "Unicorn", "Hornet"],
  "Yamaha": ["FZ", "R15", "MT-15", "Fascino"],
  "Bajaj": ["Pulsar", "Dominar", "Avenger", "Platina"],
  "Maruti Suzuki": ["Swift", "Baleno", "Alto", "Wagon R"],
  "Tata": ["Nexon", "Harrier", "Safari", "Tiago"],
  "Ashok Leyland": ["Dost", "Boss", "Captain", "Ecomet"],
  "Tata Motors": ["Ace", "Ultra", "Prima", "LPT"]
};

const AddingProducts = () => {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState({
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    partType: "",
    spareBrand: "",
    productId: "",
    productName: "",
    description: "",
    price: "",
    stockQuantity: "",
    images: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "vehicleType") {
      setProduct((prev) => ({
        ...prev,
        vehicleBrand: "",
        vehicleModel: "",
      }));
    }

    if (name === "vehicleBrand") {
      setProduct((prev) => ({
        ...prev,
        vehicleModel: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + product.images.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }
  
    const imagePreviews = files.map((file) => {
      return {
        file: file,
        preview: URL.createObjectURL(file),
      };
    });
  
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...imagePreviews], // Store both file and preview URL
    }));
  };
  

  const removeImage = (index) => {
    setProduct((prev) => {
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[index].preview); // Free memory
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        if (key === "images") {
          product.images.forEach((img) => formData.append("images", img.file)); // Send actual files
        } else {
          formData.append(key, product[key]);
        }
      });
  
      await axios.post("http://localhost:5000/store/addproduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("Product added successfully!");
      navigate("/product-managment");
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("Failed to add product.");
    }
  };
  

  return (
    <Card className="p-4 w-full max-w-lg mx-auto shadow-lg rounded-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>

        {/* Step 1: Vehicle Details */}
        {step === 1 && (
          <form className="space-y-4">
            <select
              name="vehicleType"
              value={product.vehicleType}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {product.vehicleType && (
              <select
                name="vehicleBrand"
                value={product.vehicleBrand}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Vehicle Brand</option>
                {vehicleBrandsByType[product.vehicleType]?.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            )}

            {product.vehicleBrand && vehicleModelsByBrand[product.vehicleBrand] && (
              <select
                name="vehicleModel"
                value={product.vehicleModel}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Vehicle Model</option>
                {vehicleModelsByBrand[product.vehicleBrand]?.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}

            <Input name="partType" value={product.partType} placeholder="Part Type" onChange={handleChange} required />
            <Input name="spareBrand" value={product.spareBrand} placeholder="Spare Brand" onChange={handleChange} required />

            <Button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white">
              Next
            </Button>
          </form>
        )}

        {/* Step 2: Product Details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="productName" value={product.productName} placeholder="Product Name" onChange={handleChange} required />
            <Textarea name="description" value={product.description} placeholder="Description" onChange={handleChange} required />
            <Input name="productId" value={product.productId} placeholder="Product ID" onChange={handleChange} required />
            <Input name="price" type="number" value={product.price} placeholder="Price" onChange={handleChange} required />
            <Input name="stockQuantity" type="number" value={product.stockQuantity} placeholder="Stock Quantity" onChange={handleChange} required />

            {/* Image Upload & Preview */}
            <label className="block text-gray-700">Upload Images (Max: 5)</label>
            <Input type="file" multiple onChange={handleImageChange} className="cursor-pointer" />
            
            <div className="flex gap-2 mt-2">
  {product.images.map((image, index) => (
    <div key={index} className="relative">
      <img src={image.preview} alt="preview" className="w-16 h-16 rounded object-cover" />
      <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2">X</button>
    </div>
  ))}
</div>


            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} className="bg-gray-500 text-white">Back</Button>
              <Button type="submit" className="bg-green-600 text-white">Submit</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddingProducts;
