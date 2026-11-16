import { create } from 'zustand';
import { cleanChoice, DECISIONS, type Choice, type DecisionId } from './decisions';

/* 회의에서 고른 값. 테마를 만드는 App 과 고르는 판(MeetingPanel), 카탈로그가 함께 읽는다.
   이 브라우저(localStorage)와 주소 뒤 값(#type=b&size=15 ...)에 남긴다.
   주소에 값이 있으면 주소가 먼저다(다른 사람이 보낸 주소를 그대로 보여 주기 위해) */

const KEY = 'travi-ds-meeting';

function fromHash(): Choice | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const raw: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(hash)) raw[key] = value;
  const choice = cleanChoice(raw);
  return Object.keys(choice).length > 0 ? choice : null;
}

function fromStorage(): Choice | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? 'null');
    return saved && typeof saved === 'object' ? cleanChoice(saved) : null;
  } catch {
    return null;
  }
}

function save(choice: Choice) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* 저장이 막힌 브라우저에서는 주소에만 남긴다 */
  }
  const parts = DECISIONS.filter((decision) => choice[decision.id]).map((decision) => `${decision.id}=${encodeURIComponent(choice[decision.id] as string)}`);
  const url = window.location.pathname + window.location.search + (parts.length > 0 ? `#${parts.join('&')}` : '');
  window.history.replaceState(null, '', url);
}

type MeetingState = {
  choice: Choice;
  pick: (id: DecisionId, value: string) => void;
  clear: (id: DecisionId) => void;
  reset: () => void;
};

export const useMeeting = create<MeetingState>((set, get) => ({
  choice: fromHash() ?? fromStorage() ?? {},
  pick: (id, value) => {
    const choice = cleanChoice({ ...get().choice, [id]: value });
    save(choice);
    set({ choice });
  },
  clear: (id) => {
    const choice = { ...get().choice };
    delete choice[id];
    save(choice);
    set({ choice });
  },
  reset: () => {
    save({});
    set({ choice: {} });
  },
}));

/* 다른 사람이 보낸 주소를 이미 열린 탭에 붙여 넣었을 때도 따라가게 한다 */
window.addEventListener('hashchange', () => {
  const choice = fromHash();
  if (choice) {
    save(choice);
    useMeeting.setState({ choice });
  }
});
