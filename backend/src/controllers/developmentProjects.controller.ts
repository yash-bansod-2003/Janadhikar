import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";
import z from "zod";
import DevelopmentProjectsService from "@/services/developmentProjects.service";
import { ResponseWithMetadata } from "@/types/index";
import { DevelopmentProject } from "@/types";
import { developmentProjectQueryValidationSchema } from "@/validators/developmentProjects.validator";
import VillagesService from "@/services/villages.service";
import DepartmentsService from "@/services/departments.service";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";

class DevelopmentProjectsController {
  constructor(
    private readonly developmentProjectsService: DevelopmentProjectsService,
    private readonly villagesService: VillagesService,
    private readonly departmentsService: DepartmentsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { villageId, departmentId, ...projectData } =
      req.body as DevelopmentProject;
    try {
      const village = await this.villagesService.findOne({
        where: { id: villageId },
      });
      if (!village) {
        throw createHttpError(404, "Village not found");
      }
      const department = await this.departmentsService.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw createHttpError(404, "Department not found");
      }
      this.logger.info("Creating development project");
      const project = await this.developmentProjectsService.create({
        actual_completion_date: projectData?.actual_completion_date,
        allocated_budget: projectData?.allocated_budget,
        approval_date: projectData?.approval_date,
        name: projectData?.name,
        category: projectData?.category as PROJECT_CATEGORIES,
        description: projectData?.description,
        progress_percentage: projectData?.progress_percentage,
        spent_budget: projectData?.spent_budget,
        start_date: projectData?.start_date,
        expected_completion_date: projectData?.expected_completion_date,
        status: projectData?.status as PROJECT_STATUSES,
        village: { id: villageId },
        department: { id: departmentId },
      });
      this.logger.info(`Development project created with id: ${project.id}`);
      const response: ResponseWithMetadata<DevelopmentProject> = {
        data: project as unknown as DevelopmentProject,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      this.logger.error("Error creating development project");
      next(createHttpError(500, "Error creating development project"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query as unknown as z.infer<
      typeof developmentProjectQueryValidationSchema
    >;
    const page = query.page ? Number(query.page) : 1;
    const per_page = query.per_page ? Number(query.per_page) : 10;
    const skip = (page - 1) * per_page;
    try {
      const queryBuilder =
        this.developmentProjectsService.getQueryBuilder("project");
      if (query.search) {
        queryBuilder.where("LOWER(project.name) LIKE LOWER(:search)", {
          search: `%${query.search}%`,
        });
      }
      const [projects, total] = await queryBuilder
        .skip(skip)
        .take(per_page)
        .getManyAndCount();
      const response: ResponseWithMetadata<DevelopmentProject[]> = {
        meta: { page, per_page, total },
        data: projects as unknown as DevelopmentProject[],
        success: true,
      };
      return res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(500, "Error fetching development projects"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await this.developmentProjectsService.findOne({
        where: { id: Number(req.params.id) },
        relations: {
          village: true,
          department: true,
          updates: true,
          images: true,
          documents: true,
        },
      });
      if (!project) {
        throw createHttpError(404, "Development project not found");
      }
      const response: ResponseWithMetadata<DevelopmentProject> = {
        data: project as unknown as DevelopmentProject,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(404, "Development project not found"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const projectData = req.body as Partial<DevelopmentProject>;
    try {
      await this.developmentProjectsService.update(
        { id: Number(req.params.id) },
        {
          actual_completion_date: projectData?.actual_completion_date,
          allocated_budget: projectData?.allocated_budget,
          approval_date: projectData?.approval_date,
          name: projectData?.name,
          category: projectData?.category as PROJECT_CATEGORIES,
          description: projectData?.description,
          progress_percentage: projectData?.progress_percentage,
          spent_budget: projectData?.spent_budget,
          start_date: projectData?.start_date,
          expected_completion_date: projectData?.expected_completion_date,
          status: projectData?.status as PROJECT_STATUSES,
        },
      );
      const updatedProject = await this.developmentProjectsService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!updatedProject) {
        return next(createHttpError(500, "Internal server error"));
      }
      const response: ResponseWithMetadata<typeof updatedProject> = {
        data: updatedProject,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(500, "Error updating development project"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.developmentProjectsService.delete({
        id: Number(req.params.id),
      });
      const response: ResponseWithMetadata<{
        affected: number | null | undefined;
      }> = {
        data: { affected: result.affected },
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(500, "Error deleting development project"));
    }
  }
}

export default DevelopmentProjectsController;
