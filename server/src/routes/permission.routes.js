import express from "express";
import { getAllPermission } from "../controllers/permission.controller.js";
const permissionRouter = express.Router();
permissionRouter.get("/", getAllPermission)


export default permissionRouter