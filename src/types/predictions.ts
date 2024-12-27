export interface predictionsResponse {
  predictions: {
    data: {
      predictions: Predict[];
    };
    meta: {
      total: number;
      offset: number;
    };
  };
}

export interface Predictor {
  predictorId: string;
  firstName: string;
  lastName: string;
  slug: string;
}

export interface Predict {
  type: string;
  outcome: string;
  comment: string;
  rate: number;
  predictor: Predictor;
}
