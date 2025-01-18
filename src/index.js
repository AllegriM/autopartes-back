import app from "./app.js";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import subcategoriesRoutes from "./routes/subcategories.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", subcategoriesRoutes);
app.use("/api", orderRoutes);
app.use("/api", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Ha ocurrido un error inesperado.",
    details: err.details || null,
    code: err.code || "INTERNAL_ERROR",
  });
});

app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
