import { Member } from "@/types";
import { useReducer, useCallback } from "react";

type ModalView = "select" | "stats" | "present" | "absent";

type ModalState = {
  view: ModalView;
  allMembers: Member[];
  presentMembers: string[];
  absentMembers: string[];
  removedMembers: string[];
  isLoading: boolean;
  hasChanges: boolean;
  searchQuery: string;
  currentPage: number;
};

type ModalAction =
  | { type: "SET_VIEW"; view: ModalView }
  | { type: "SET_MEMBERS"; members: Member[] }
  | { type: "TOGGLE_MEMBER"; memberId: string }
  | { type: "MARK_PRESENT"; memberIds: string[] }
  | { type: "REMOVE_MEMBER"; memberId: string }
  | { type: "UNDO_REMOVE" }
  | { type: "MOVE_TO_PRESENT"; memberIds: string[] }
  | { type: "INITIALIZE_ATTENDANCE"; memberIds: string[] }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "RESET" };

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };

    case "SET_MEMBERS":
      const allMemberIds = action.members.map((m) => m.id);
      return {
        ...state,
        allMembers: action.members,
        absentMembers: allMemberIds,
      };

    case "TOGGLE_MEMBER":
      const isPresent = state.presentMembers.includes(action.memberId);
      return {
        ...state,
        presentMembers: isPresent
          ? state.presentMembers.filter((id) => id !== action.memberId)
          : [...state.presentMembers, action.memberId],
        absentMembers: isPresent
          ? [...state.absentMembers, action.memberId]
          : state.absentMembers.filter((id) => id !== action.memberId),
        hasChanges: false,
      };

    case "MARK_PRESENT":
      return {
        ...state,
        presentMembers: action.memberIds,
        absentMembers: state.allMembers
          .map((m) => m.id)
          .filter((id) => !action.memberIds.includes(id)),
        view: "stats",
        hasChanges: true,
      };

    case "REMOVE_MEMBER":
      return {
        ...state,
        presentMembers: state.presentMembers.filter(
          (id) => id !== action.memberId,
        ),
        absentMembers: [...state.absentMembers, action.memberId],
        removedMembers: [...state.removedMembers, action.memberId],
        hasChanges: true,
      };

    case "UNDO_REMOVE":
      const lastRemoved = state.removedMembers[state.removedMembers.length - 1];
      if (!lastRemoved) return state;

      return {
        ...state,
        presentMembers: [...state.presentMembers, lastRemoved],
        absentMembers: state.absentMembers.filter((id) => id !== lastRemoved),
        removedMembers: state.removedMembers.slice(0, -1),
      };

    case "MOVE_TO_PRESENT":
      const nextPresentMembers = Array.from(
        new Set([...state.presentMembers, ...action.memberIds]),
      );
      return {
        ...state,
        presentMembers: nextPresentMembers,
        absentMembers: state.absentMembers.filter(
          (id) => !action.memberIds.includes(id),
        ),
        view: "stats",
        hasChanges: true,
      };

    case "INITIALIZE_ATTENDANCE":
      return {
        ...state,
        presentMembers: action.memberIds,
        absentMembers: state.allMembers
          .map((m) => m.id)
          .filter((id) => !action.memberIds.includes(id)),
        hasChanges: true,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.query, currentPage: 1 };

    case "SET_PAGE":
      return { ...state, currentPage: action.page };

    case "RESET":
      return {
        view: "select",
        allMembers: [],
        presentMembers: [],
        absentMembers: [],
        removedMembers: [],
        isLoading: false,
        hasChanges: false,
        searchQuery: "",
        currentPage: 1,
      };

    default:
      return state;
  }
}

const initialState: ModalState = {
  view: "select",
  allMembers: [],
  presentMembers: [],
  absentMembers: [],
  removedMembers: [],
  isLoading: false,
  hasChanges: false,
  searchQuery: "",
  currentPage: 1,
};

export function useAttendanceModal() {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const setView = useCallback((view: ModalView) => {
    dispatch({ type: "SET_VIEW", view });
  }, []);

  const setMembers = useCallback((members: Member[]) => {
    dispatch({ type: "SET_MEMBERS", members });
  }, []);

  const toggleMember = useCallback((memberId: string) => {
    dispatch({ type: "TOGGLE_MEMBER", memberId });
  }, []);

  const markPresent = useCallback((memberIds: string[]) => {
    dispatch({ type: "MARK_PRESENT", memberIds });
  }, []);

  const removeMember = useCallback((memberId: string) => {
    dispatch({ type: "REMOVE_MEMBER", memberId });
  }, []);

  const undoRemove = useCallback(() => {
    dispatch({ type: "UNDO_REMOVE" });
  }, []);

  const moveToPresent = useCallback((memberIds: string[]) => {
    dispatch({ type: "MOVE_TO_PRESENT", memberIds });
  }, []);

  const initializeAttendance = useCallback((memberIds: string[]) => {
    dispatch({ type: "INITIALIZE_ATTENDANCE", memberIds });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", isLoading });
  }, []);

  const setSearch = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", query });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", page });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const getPresentMembers = useCallback(() => {
    return state.allMembers.filter((m) => state.presentMembers.includes(m.id));
  }, [state.allMembers, state.presentMembers]);

  const getAbsentMembers = useCallback(() => {
    return state.allMembers.filter((m) => state.absentMembers.includes(m.id));
  }, [state.allMembers, state.absentMembers]);

  const getFilteredMembers = useCallback(() => {
    if (!state.searchQuery) return state.allMembers;

    return state.allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(state.searchQuery.toLowerCase()),
    );
  }, [state.allMembers, state.searchQuery]);

  return {
    state,
    setView,
    setMembers,
    toggleMember,
    markPresent,
    removeMember,
    undoRemove,
    moveToPresent,
    initializeAttendance,
    setLoading,
    setSearch,
    setPage,
    reset,
    getPresentMembers,
    getAbsentMembers,
    getFilteredMembers,
  };
}
