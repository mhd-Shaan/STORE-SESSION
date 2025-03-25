import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function Storefake() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of products per page

  useEffect(() => {
    showProducts();
  }, []);

  const showProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/store/showproducts", {
        withCredentials: true,
      });
      setProducts(res.data.productdetails);
    } catch (error) {
      console.log(error);
    }
  };

  // Apply search and filter
  const filteredProducts = products
    .filter((product) => product.productName.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => {
      if (statusFilter === "block") return product.isBlock;
      if (statusFilter === "unblocked") return !product.isBlock;
      return true; // Show all if no filter
    });

  // Paginate the results
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border-[#2c2c2c] text-black"
        />
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-blue-600 text-white w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="block">Blocked</SelectItem>
            <SelectItem value="unblocked">Unblocked</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-blue-600 hover:bg-blue-800">Add New +</Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table className="w-full border border-gray-300">
          <TableHeader className="bg-blue-600 text-white">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-300">
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.images?.[0] || "https://via.placeholder.com/50"} />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{user.productName}</div>
                  </TableCell>
                  <TableCell>{user.productId}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        !user.isBlock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {!user.isBlock ? "Active" : "Blocked"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <MoreVertical className="cursor-pointer text-gray-400 hover:text-black transition" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4 text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">{`Page ${page} of ${totalPages}`}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft />
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              className={`px-4 py-1 ${page === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
