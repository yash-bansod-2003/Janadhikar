import { MODEL_NAMES } from "@/lib/constants";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  name: (typeof MODEL_NAMES)[keyof typeof MODEL_NAMES];
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
    full_sequence: string;
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
  name: string;
  sequence_length: number;
  mean_embedding: number[];
  sequence_likelihood_mean: number;
  sequence_likelihood_sum: number;
  confidence: number;
  pseudo_log_likelihood: number;
  perplexity: number;
  top_k_predictions: string[][];
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

export interface AntifoldPredictionResult {
  pdb_posins: number;
  pdb_chain: string;
  pdb_res: string;
  top_res: string;
  pdb_pos: number;
  perplexity: number;
  assumed_region: string;
  A: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
  I: number;
  K: number;
  L: number;
  M: number;
  N: number;
  P: number;
  Q: number;
  R: number;
  S: number;
  T: number;
  V: number;
  W: number;
  Y: number;
}

export interface BoltzPredictionResult {
  confidence_score: number;
  ptm: number;
  iptm: number;
  ligand_iptm: number;
  protein_iptm: number;
  complex_plddt: number;
  complex_iplddt: number;
  complex_pde: number;
  complex_ipde: number;
  chains_ptm: Record<number, number>;
  pair_chains_iptm: Record<number, Record<number, number>>;
  structure_file: string;
}

export interface DeepImmunoPredictionResult {
  peptide: string;
  hla: string;
  immunogenicity: number;
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
  Name: string;
  SAP_pos_CDRH1: number;
  SAP_pos_CDRH2: number;
  SAP_pos_CDRH3: number;
  SAP_pos_CDRL1: number;
  SAP_pos_CDRL2: number;
  SAP_pos_CDRL3: number;
  SAP_pos_CDR: number;
  SAP_pos_Hv: number;
  SAP_pos_Lv: number;
  SAP_pos_Fv: number;
  SCM_neg_CDRH1: number;
  SCM_neg_CDRH2: number;
  SCM_neg_CDRH3: number;
  SCM_neg_CDRL1: number;
  SCM_neg_CDRL2: number;
  SCM_neg_CDRL3: number;
  SCM_neg_CDR: number;
  SCM_neg_Hv: number;
  SCM_neg_Lv: number;
  SCM_neg_Fv: number;
  SCM_pos_CDRH1: number;
  SCM_pos_CDRH2: number;
  SCM_pos_CDRH3: number;
  SCM_pos_CDRL1: number;
  SCM_pos_CDRL2: number;
  SCM_pos_CDRL3: number;
  SCM_pos_CDR: number;
  SCM_pos_Hv: number;
  SCM_pos_Lv: number;
  SCM_pos_Fv: number;
}

export interface DeepstabpPredictionResult {
  Protein: string;
  Tm: number;
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
    Name: string;
    Prob_Mean: number;
    Prob_Std: number;
    DeepViscosity_classes: number;
  }[];
  explanations: DeepViscosityExplanation[];
}

export interface NetsolPredictionResult {
  sid: string;
  fasta: string;
  predicted_solubility_model_0: number;
  predicted_solubility_model_1: number;
  predicted_solubility_model_2: number;
  predicted_solubility_model_3: number;
  predicted_solubility_model_4: number;
  predicted_solubility: number;
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

export interface TemStaProPredictionResult {
    "protein_id": string,
    "position": string,
    "sequence": string,
    "length": number,
    "t40_binary": number,
    "t40_raw": number,
    "t45_binary": number,
    "t45_raw": number,
    "t50_binary": number,
    "t50_raw": number,
    "t55_binary": number,
    "t55_raw": number,
    "t60_binary": number,
    "t60_raw": number,
    "t65_binary": number,
    "t65_raw": number,
    "left_hand_label": string,
    "right_hand_label": string,
    "clash": string
  }
