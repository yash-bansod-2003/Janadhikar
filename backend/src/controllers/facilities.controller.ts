import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";
import z from "zod";
import FacilitiesService from "@/services/facilities.service";
import { ResponseWithMetadata } from "@/types/index";
import { Facility } from "@/types";
import { facilityQueryValidationSchema } from "@/validators/facilities.validator";
import { FACILITY_TYPES } from "@/lib/constants";
import VillagesService from "@/services/villages.service";

class FacilitiesController {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly villagesService: VillagesService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { villageId, ...rest } = req.body as Facility;
    try {
      if (!villageId) {
        throw createHttpError(400, "villageId is required");
      }
      const village = await this.villagesService.findOne({
        where: { id: villageId },
      });

      if (!village) {
        throw createHttpError(404, "Village not found");
      }
      this.logger.info("Creating facility");
      const facility = await this.facilitiesService.create({
        name: rest.name,
        description: rest.description,
        type: rest.type as FACILITY_TYPES,
        is_active: rest.is_active,
        village: { id: villageId },
      });
      this.logger.info(`Facility created with id: ${facility.id}`);
      const response: ResponseWithMetadata<Facility> = {
        data: facility as unknown as Facility,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      this.logger.error("Error creating facility", _error);
      next(createHttpError(500, "Error creating facility"));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query as unknown as z.infer<
      typeof facilityQueryValidationSchema
    >;
    const page = query.page ? Number(query.page) : 1;
    const per_page = query.per_page ? Number(query.per_page) : 10;
    const skip = (page - 1) * per_page;
    try {
      const queryBuilder = this.facilitiesService.getQueryBuilder("facility");
      if (query.search) {
        queryBuilder.where("LOWER(facility.name) LIKE LOWER(:search)", {
          search: `%${query.search}%`,
        });
      }
      const [facilities, total] = await queryBuilder
        .skip(skip)
        .take(per_page)
        .getManyAndCount();
      const response: ResponseWithMetadata<Facility[]> = {
        meta: { page, per_page, total },
        data: facilities as unknown as Facility[],
        success: true,
      };
      return res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(500, "Error fetching facilities"));
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const facility = await this.facilitiesService.findOne({
        where: { id: Number(req.params.id) },
        relations: { village: true },
      });
      if (!facility) {
        throw createHttpError(404, "Facility not found");
      }
      const response: ResponseWithMetadata<Facility> = {
        data: facility as unknown as Facility,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(404, "Facility not found"));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const facilityData = req.body as Partial<Facility>;
    try {
      await this.facilitiesService.update(
        { id: Number(req.params.id) },
        {
          name: facilityData.name,
          description: facilityData.description,
          type: facilityData.type as FACILITY_TYPES,
          is_active: facilityData.is_active,
        },
      );
      const updatedFacility = await this.facilitiesService.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!updatedFacility) {
        return next(createHttpError(500, "Internal server error"));
      }
      const response: ResponseWithMetadata<typeof updatedFacility> = {
        data: updatedFacility,
        success: true,
      };
      res.json(response);
    } catch (_error: unknown) {
      next(createHttpError(500, "Error updating facility"));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.facilitiesService.delete({
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
      next(createHttpError(500, "Error deleting facility"));
    }
  }
}

export default FacilitiesController;
