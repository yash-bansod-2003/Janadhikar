import { Router, RequestHandler } from "express";
import DevelopmentProjectsController from "@/controllers/developmentProjects.controller";
import DevelopmentProjectsService from "@/services/developmentProjects.service";
import { AppDataSource } from "@/data-source";
import { DevelopmentProject } from "@/entities/developmentProject";
import authenticate from "@/middlewares/authenticate";
import authorization from "@/middlewares/authorization";
import logger from "@/lib/logger";
import { ROLES } from "@/lib/constants";
import {
  developmentProjectCreateValidator,
  developmentProjectUpdateValidator,
} from "@/validators/developmentProjects.validator";
import DepartmentsService from "@/services/departments.service";
import { Department } from "@/entities/department";
import VillagesService from "@/services/villages.service";
import { Village } from "@/entities/village";

const router = Router();
const developmentProjectsRepository =
  AppDataSource.getRepository(DevelopmentProject);
const developmentProjectsService = new DevelopmentProjectsService(
  developmentProjectsRepository,
);

const villagesRepository = AppDataSource.getRepository(Village);
const villagesService = new VillagesService(villagesRepository);

const departmentsRepository = AppDataSource.getRepository(Department);
const departmentsService = new DepartmentsService(departmentsRepository);

const developmentProjectsController = new DevelopmentProjectsController(
  developmentProjectsService,
  villagesService,
  departmentsService,
  logger,
);

router.post(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  developmentProjectCreateValidator,
  async (req, res, next) => {
    await developmentProjectsController.create(req, res, next);
  },
);

router.get(
  "/",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await developmentProjectsController.findAll(req, res, next);
  },
);

router.get(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]) as RequestHandler,
  async (req, res, next) => {
    await developmentProjectsController.findOne(req, res, next);
  },
);

router.put(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  developmentProjectUpdateValidator,
  async (req, res, next) => {
    await developmentProjectsController.update(req, res, next);
  },
);

router.delete(
  "/:id",
  authenticate,
  authorization([ROLES.ADMIN, ROLES.MANAGER]) as RequestHandler,
  async (req, res, next) => {
    await developmentProjectsController.delete(req, res, next);
  },
);

export default router;
