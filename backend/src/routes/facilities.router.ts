import { Router, RequestHandler } from "express";
import FacilitiesController from "@/controllers/facilities.controller";
import FacilitiesService from "@/services/facilities.service";
import { AppDataSource } from "@/data-source";
import { Facility } from "@/entities/facility";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/lib/logger";
import { ROLES } from "@/lib/constants";
import {
  facilityCreateValidator,
  facilityUpdateValidator,
} from "@/validators/facilities.validator";
import VillagesService from "@/services/villages.service";
import { Village } from "@/entities/village";

const router = Router();
const facilitiesRepository = AppDataSource.getRepository(Facility);
const facilitiesService = new FacilitiesService(facilitiesRepository);

const villagesRepository = AppDataSource.getRepository(Village);
const villagesService = new VillagesService(villagesRepository);

const facilitiesController = new FacilitiesController(
  facilitiesService,
  villagesService,
  logger,
);

router.post(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  facilityCreateValidator,
  async (req, res, next) => {
    await facilitiesController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await facilitiesController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await facilitiesController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  facilityUpdateValidator,
  async (req, res, next) => {
    await facilitiesController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await facilitiesController.delete(req, res, next);
  },
);

export default router;
