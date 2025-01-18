export const queries = {
  // Productos
  getAllProductsWithImages: ` 
  SELECT 
    P.*,
    CP.nombre AS nombre_cat,
    SP.nombre AS nombre_sub,
    COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
      ),
      JSON_ARRAY()
    ) AS imagenes
  FROM PRODUCTOS P
  LEFT JOIN IMAGENES I ON P.id = I.id_producto
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
  WHERE P.estado = 'A'
  GROUP BY P.id;
  `,
  getProductsBySubcategoryWithImages: `
  SELECT
    P.*,
    CP.nombre AS nombre_cat,
    SP.nombre AS nombre_sub,
    JSON_ARRAYAGG(
      JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
    ) AS imagenes
  FROM PRODUCTOS P
  LEFT JOIN IMAGENES I ON P.id   = I.id_producto
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
  WHERE P.id_subcategoria = ?
  && P.estado = 'A'
  GROUP BY P.id
`,
  getProductsByCategoryWithImages: `
  SELECT 
    P.*,
    CP.nombre AS nombre_cat,
    SP.nombre AS nombre_sub,
    JSON_ARRAYAGG(
      JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
    ) AS imagenes
  FROM PRODUCTOS P
  LEFT JOIN IMAGENES I ON P.id = I.id_producto
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
  WHERE P.id_categoria = ?
  && P.estado = 'A'
  GROUP BY P.id
`,
  getProductsBySearchWithImages: `
  SELECT 
    P.*,
    CP.nombre AS nombre_cat,
    SP.nombre AS nombre_sub,
    JSON_ARRAYAGG(
      JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
    ) AS imagenes
  FROM PRODUCTOS P
  LEFT JOIN IMAGENES I ON P.id = I.id_producto
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
  WHERE P.nombre LIKE ?
  && P.estado = 'A'
  GROUP BY P.id
`,

  getAllProductsAdmin: `SELECT P.*, CP.nombre as nombre_cat, SP.nombre as nombre_sub, COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
      ),
      JSON_ARRAY()
    ) AS imagenes FROM PRODUCTOS P   
LEFT JOIN IMAGENES I ON P.id = I.id_producto
 LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id 
 LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
 GROUP BY P.id`,
  getAllProducts: `
  SELECT P.*, CP.nombre as nombre_cat, SP.nombre as nombre_sub 
  FROM PRODUCTOS P 
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id 
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id 
  WHERE P.estado = 'A'
  `,
  getProductById: `SELECT 
    P.*,
    CP.nombre AS nombre_cat,
    SP.nombre AS nombre_sub,
    COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT('id', I.id, 'url', I.url, 'alt', I.alt)
      ),
      JSON_ARRAY()
    ) AS imagenes
  FROM PRODUCTOS P
  LEFT JOIN IMAGENES I ON P.id = I.id_producto
  LEFT JOIN CATEGORIA_PRODUCTO CP ON P.id_categoria = CP.id
  LEFT JOIN SUBCATEGORIA_PRODUCTO SP ON P.id_subcategoria = SP.id
  WHERE P.id = ? AND P.estado = 'A';
  `,
  getProductsByCategory: `
    SELECT P.*, C.nombre as nombre_categoria 
    FROM PRODUCTOS P 
    LEFT JOIN CATEGORIA_PRODUCTO C ON C.id = P.id_categoria 
    WHERE C.id = ? AND P.estado = 'A';`,
  getProductsBySubcategory: `SELECT P.*, S.nombre as nombre_subcategoria 
    FROM PRODUCTOS P 
    LEFT JOIN SUBCATEGORIA_PRODUCTO S ON S.id = P.id_subcategoria 
    WHERE S.id = ? AND P.estado = 'A';`,
  getProductsBySearch:
    "SELECT * FROM PRODUCTOS WHERE (nombre LIKE CONCAT('%', ?, '%') OR descripcion LIKE CONCAT('%', ?, '%')) AND estado = 'A';",
  createProduct: `
    INSERT INTO PRODUCTOS (nombre, descripcion, precio, id_categoria, marca, modelo, stock, codigo, codigo_barra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  updateProduct: `
    UPDATE PRODUCTOS
    SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, id_subcategoria = ?, codigo = ?, codigo_barra = ?, marca = ?, modelo = ?, stock = ?
    WHERE id = ?
    `,
  deleteProduct: "DELETE FROM PRODUCTOS WHERE id = ?",
  modifyStatus: "UPDATE PRODUCTOS SET estado = ? WHERE id = ?",
  getLastProduct: "SELECT * FROM PRODUCTOS ORDER BY id DESC LIMIT 1",

  // Categorias
  getCategoriesAndSubcategories:
    "SELECT C.id, C.nombre, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id_sub', S.id, 'nombre_sub', S.nombre)) FROM SUBCATEGORIA_PRODUCTO S WHERE S.id_categoria = C.id) AS subcategorias FROM CATEGORIA_PRODUCTO C;",
  getActiveCategoriasAndSubcategories: `SELECT 
    C.id,
    C.nombre,
    COALESCE(
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id_sub', S.id,
                    'nombre_sub', S.nombre
                )
            )
            FROM SUBCATEGORIA_PRODUCTO S
            WHERE S.id_categoria = C.id AND S.activo = 'A'
        ),
        JSON_ARRAY()
    ) AS subcategorias
    FROM 
      CATEGORIA_PRODUCTO C
    WHERE 
      C.activo = 'A';`,
  getAllCategories: "SELECT * FROM CATEGORIA_PRODUCTO",
  getCategoryById: "SELECT * FROM CATEGORIA_PRODUCTO WHERE id = ?",
  createCategory: "INSERT INTO CATEGORIA_PRODUCTO (nombre) VALUES (?)",
  updateCategory: "UPDATE CATEGORIA_PRODUCTO SET nombre = ? WHERE id = ?",
  deleteCategory: "DELETE FROM CATEGORIA_PRODUCTO WHERE id = ?",
  toggleCategoryStatus:
    "UPDATE CATEGORIA_PRODUCTO SET activo = ? WHERE id = ?;",

  // Subcategorias
  getAllSubcategories: "SELECT * FROM SUBCATEGORIA_PRODUCTO",
  getSubcategoryById: "SELECT * FROM SUBCATEGORIA_PRODUCTO WHERE id = ?",
  createSubcategory:
    "INSERT INTO SUBCATEGORIA_PRODUCTO (nombre, id_categoria) VALUES (?, ?)",
  updateSubcategory:
    "UPDATE SUBCATEGORIA_PRODUCTO SET nombre = ?, id_categoria = ? WHERE id = ?",
  deleteSubcategory: "DELETE FROM SUBCATEGORIA_PRODUCTO WHERE id = ?",
  toggleSubcategoryStatus:
    "UPDATE SUBCATEGORIA_PRODUCTO SET activo = ? WHERE id = ?;",

  // Users
  createUser:
    "INSERT INTO USUARIOS (email, contraseña, nombre, apellido, direccion, cuit, telefono, localidad, provincia) VALUES (@email, @contraseña, @nombre, @apellido, @direccion, @cuit, @telefono, @localidad, @provincia)",
  editUser:
    "UPDATE USUARIOS SET nombre = ?, email = ?, telefono = ?, direccion = ?, localidad = ?, provincia = ? WHERE id = ?",
  // Clients

  // Orders
  getAllOrders: "SELECT * FROM VistaPedidosAdmin",
  getOrdersByUser:
    "SELECT " +
    "P.id AS id, " +
    "P.fecha_creacion AS fecha, " +
    "P.precio_total AS total, " +
    "PP.id_producto AS producto_id, " +
    "PR.nombre AS producto_nombre, " +
    "PR.descripcion AS producto_descripcion, " +
    "PP.cantidad AS cantidad, " +
    "PP.precio AS precio, " +
    "(PP.cantidad * PP.precio) AS subtotal " +
    "FROM PEDIDOS P " +
    "JOIN PRODUCTOS_PEDIDOS PP ON P.id = PP.id_pedido " +
    "JOIN PRODUCTOS PR ON PP.id_producto = PR.id " +
    "WHERE P.id_usuario = ? " +
    "ORDER BY P.fecha_creacion DESC;",
  updateOrderStatus: "UPDATE PEDIDOS SET estado = ? WHERE id = ?",
  // Images
  createImage: "INSERT INTO IMAGENES (id_producto, url, alt) VALUES (?, ?, ?)",
  getImageById: "SELECT * FROM IMAGENES WHERE id = ?",
  deleteImage: "DELETE FROM IMAGENES WHERE id = ?",
};
