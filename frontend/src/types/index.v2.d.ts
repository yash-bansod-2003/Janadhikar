export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  name: string;
  supported_input_types: string;
  version: string;
  description: string;
  is_active: boolean;
  categories: string;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: number;
  input_type: "VH_VL" | "FULL_SEQ";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  name: string;
  input_payload: {
    vh_sequence: string;
    vl_sequence: string;
  }[];
  created_at: string;
  updated_at: string;
  predictionResults: PredictionResult[];
}

export interface PredictionResult {
  id: number;
  status: "COMPLETED" | "FAILED" | "IN_PROGRESS" | "PENDING";
  data: any | null;
  raw_output: unknown;
  error_message: string | null;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  model: Model;
}

export interface Message {
  id: number;
  role: "user" | "system";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface Ablang2SimplePredictionResult {
  pharmacology: number;
  stability: number;
}

export interface Ablang2HotspotResult {
  name: string;
  sequence_length: number;
  hotspots: {
    chain: "H" | "L";
    position: number;
    residue: string;
    score: number;
    suggestions: {
      residue: string;
      probability: number;
    }[];
  }[];
  vh_scores: {
    position: number;
    residue: string;
    score: number;
  }[];
  vl_scores: {
    position: number;
    residue: string;
    score: number;
  }[];
}

export interface Ablang2PredictionResult {
  predictions: Ablang2SimplePredictionResult[];
  hotspots: Ablang2HotspotResult[];
}

export interface Abodybuilder3PredictionResult {
  name: string;
  pdb: string;
  plddt_mean: number;
}

export interface BoltzPredictionResult {
  pharmacology: number;
}

export interface DeepImmunoPredictionResult {
  pharmacology: number;
}

// export interface DeepImmunoDetailedPredictionResult {
//   name: string;
//   sequence: string;
//   predictions: {
//     score: number;
//     token: number;
//     token_str: string;
//     sequence: string;
//   }[];
// }

export interface DeepspPredictionResult {
  manufacturing: number;
  aggregation: number;
}

export interface DeepstabpPredictionResult {
  aggregation: number;
}

export interface DeepViscosityExplanation {
  shap: {
    Feature: string;
    SHAP_value: number;
  }[];
  lime: {
    Feature: string;
    Weight: number;
  }[];
}

export interface DeepViscosityPredictionResult {
  predictions: {
    aggregation: number;
  }[];
  explanations: DeepViscosityExplanation[];
}

export interface NetsolpredictionResult {
  sid: string;
  fasta: string;
  predicted_usability_model_0: number;
  predicted_usability_model_1: number;
  predicted_usability_model_2: number;
  predicted_usability_model_3: number;
  predicted_usability_model_4: number;
  predicted_usability: number;
}

export interface Saprot35maf2PredictionResult {
  Name: string;
  MeanLogProbability: number;
  fitnessScore: number;
  PerResidueLogProbs: number[];
}

export interface TermoProtPredictionResult {
  Header: string;
  Probability: number;
  Class: null;
  Prediction: string;
}
