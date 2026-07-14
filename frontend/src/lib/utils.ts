import type {
  Ablang2PredictionResult,
  Abodybuilder3PredictionResult,
  BoltzPredictionResult,
  DeepspPredictionResult,
  DeepstabpPredictionResult,
  DeepViscosityPredictionResult,
  PredictionResult,
  Saprot35maf2PredictionResult,
  DeepImmunoPredictionResult,
  TermoProtPredictionResult,
  NetsolPredictionResult,
  TemStaProPredictionResult,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MODEL_NAMES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getFirstRawOutput = <T>(rawOutput: unknown): T | null => {
  if (Array.isArray(rawOutput)) {
    return (rawOutput[0] as T | undefined) ?? null;
  }

  if (rawOutput && typeof rawOutput === "object") {
    return rawOutput as T;
  }

  return null;
};

export const calculateScore = (predictionResult: PredictionResult): number => {
  const model = predictionResult.model;

  if (model.name === MODEL_NAMES.ABLANG2) {
    const rawOutput = getFirstRawOutput<Ablang2PredictionResult>(
      predictionResult.raw_output,
    );

    if (!rawOutput) {
      return 0;
    }

    return (((rawOutput.predictions[0]?.confidence || 0) + 2) / 2) * 100;
  }

  if (model.name === MODEL_NAMES.DEEPVISCOSITY) {
    const rawOutput = getFirstRawOutput<DeepViscosityPredictionResult>(
      predictionResult.raw_output,
    );

    if (!rawOutput) {
      return 0;
    }
    return (1 - rawOutput.predictions[0]?.Prob_Mean) * 100;
  }

  if (model.name === MODEL_NAMES.SAPROT) {
    const rawOutput = getFirstRawOutput<Saprot35maf2PredictionResult>(
      predictionResult.raw_output,
    );

    if (!rawOutput) {
      return 0;
    }
    return rawOutput.fitnessScore;
  }

  if (model.name === MODEL_NAMES.DEEPSTABP) {
    const rawOutput = getFirstRawOutput<DeepstabpPredictionResult>(
      predictionResult.raw_output,
    );

    if (!rawOutput) {
      return 0;
    }
    return rawOutput.Tm;
  }

  if (model.name === MODEL_NAMES.ABODYBUILDER3) {
    const rawOutput = getFirstRawOutput<Abodybuilder3PredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return rawOutput.plddt_mean;
  }

  if (model.name === MODEL_NAMES.DEEPSP) {
    const rawOutput = getFirstRawOutput<DeepspPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }

    return (
      (100 -
        rawOutput.SAP_pos_CDRH3 * 2 +
        (100 - (rawOutput.SAP_pos_Fv - 50) / 3)) /
      2
    );
  }

  if (model.name === MODEL_NAMES.BOLTZ) {
    const rawOutput = getFirstRawOutput<BoltzPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return rawOutput.complex_plddt * 100;
  }

  if (model.name === MODEL_NAMES.DEEPIMMUNO) {
    const rawOutput = getFirstRawOutput<DeepImmunoPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return rawOutput.immunogenicity * 100;
  }

  if (model.name === MODEL_NAMES.THERMOPROT) {
    const rawOutput = getFirstRawOutput<TermoProtPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return rawOutput.Probability * 100;
  }

  if (model.name === MODEL_NAMES.NETSOLP_1_0) {
    const rawOutput = getFirstRawOutput<NetsolPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return rawOutput.predicted_solubility * 100;
  }

   if (model.name === MODEL_NAMES.TEMSTAPRO) {
    const rawOutput = getFirstRawOutput<TemStaProPredictionResult>(
      predictionResult.raw_output,
    );
    if (!rawOutput) {
      return 0;
    }
    return ((rawOutput.t40_raw + rawOutput.t45_raw + rawOutput.t50_raw + rawOutput.t55_raw + rawOutput.t60_raw + rawOutput.t65_raw) / 6) * 1000;
  }

  return 50;
};
