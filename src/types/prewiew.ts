import { Team } from "./statistics";

export interface PreviewResponse {
  preview: {
    data: Preview;
  };
}

export interface Preview {
  prediction: string;
  league: {};
  teams: {
    home: Team;
    away: Team;
  };
  editorPredictionInfo: {};
  squadStructure: {};
}
