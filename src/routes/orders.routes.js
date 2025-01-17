import { Router } from "express";
import {
  getOrdersByUserId,
  createOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/orders.controllers.js";

const router = Router();

// router.get("/orders", createOrder);

// router.get("/orders/:id", getOrderById);

router.get("/pedidos", getOrders);

router.get("/pedidos/:id", getOrdersByUserId);

router.post("/pedidos", createOrders);

router.put("/pedidos/estado/:id", updateOrderStatus);

// router.put("/orders/:id", updateOrder);

// router.delete("/orders/:id", deleteOrder);

export default router;
