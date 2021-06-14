import { Reducer } from "redux";
import { IWorkflowState, WorkflowTypes, AnalysisStep } from "./types";

function getInitialSteps() {
  const steps: AnalysisStep[] = [];
  steps[0] = {
    id: 1,
    title: "Check if the plugins are registered",
    status: "wait",
    error: "",
  };

  steps[1] = {
    id: 2,
    title: "Create a Feed",
    status: "wait",
    error: "",
  };

  steps[2] = {
    id: 3,
    title: "Schedule jobs ",
    status: "wait",
    error: "",
  };

  steps[3] = {
    id: 4,
    title: "Setup the Feed Tree",
    status: "wait",
    error: "",
  };
  return steps;
}

export const initialState: IWorkflowState = {
  localfilePayload: {
    files: [],
    error: "",
    loading: false,
  },

  steps: getInitialSteps(),
  isAnalysisRunning: false,
  totalFileCount: 0,
  optionState: {
    isOpen: false,
    toggleTemplateText: "Choose a Workflow",
    selectedOption: "",
  },
  checkFeedDetails: undefined,
};

const reducer: Reducer<IWorkflowState> = (state = initialState, action) => {
  switch (action.type) {
    case WorkflowTypes.SET_LOCAL_FILE: {
      return {
        ...state,
        localfilePayload: {
          ...state.localfilePayload,
          files: action.payload,
        },
      };
    }

    case WorkflowTypes.SET_OPTION_STATE: {
      return {
        ...state,
        optionState: action.payload,
      };
    }

    case WorkflowTypes.SUBMIT_ANALYSIS: {
      return {
        ...state,
        isAnalysisRunning: true,
      };
    }

    case WorkflowTypes.SET_ANALYSIS_STEP: {
      const cloneSteps = [...state.steps];
      const index = cloneSteps.findIndex(
        (step) => step.id === action.payload.id
      );
      cloneSteps[index] = action.payload;

      if (index == 4) {
        return {
          ...state,
          steps: cloneSteps,
          isAnalysisRunning: !state.isAnalysisRunning,
        };
      } else
        return {
          ...state,
          steps: cloneSteps,
        };
    }

    case WorkflowTypes.SET_FEED_DETAILS: {
      console.log("SET FEED DETAILS", action.payload);
      return {
        ...state,
        checkFeedDetails: action.payload,
      };
    }

    case WorkflowTypes.RESET_WORKFLOW_STEP: {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
};

export { reducer as workflowsReducer };