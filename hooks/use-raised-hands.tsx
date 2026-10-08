"use client";

import { useToast } from "@/components/ui/use-toast";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Custom-event type used to raise and lower hands. */
export const HAND_EVENT = "talkie.hand";

export interface RaisedHand {
  userId: string;
  name: string;
}

interface RaisedHandsValue {
  /** Raised hands, oldest first. */
  hands: RaisedHand[];
  isRaised: (userId: string) => boolean;
  /** Whether the local user's hand is up. */
  isMyHandRaised: boolean;
  raise: () => Promise<void>;
  /** Lower a hand: your own by default, or someone else's (host only). */
  lower: (userId?: string) => Promise<void>;
}

const RaisedHandsContext = createContext<RaisedHandsValue | null>(null);

interface HandEventLike {
  custom?: { type?: unknown; raised?: unknown; target?: unknown };
  user: { id: string; name?: string };
}

/**
 * Turns a custom event into a hand change, or null if it isn't one or isn't
 * allowed. Events can be crafted, so this enforces what the UI only hides:
 * people raise and lower their own hands; the host may also lower others'.
 * Stream sets `user` server-side, so the sender can't be forged.
 */
export const interpretHandEvent = (event: HandEventLike, hostId: string | undefined) => {
  const data = event.custom;
  if (data?.type !== HAND_EVENT) return null;

  const raised = data.raised === true;
  const sender = event.user.id;
  const userId = typeof data.target === "string" ? data.target : sender;
  const allowed = userId === sender || (!raised && sender === hostId);
  if (!allowed) return null;

  return { userId, name: event.user.name || sender, raised };
};

/**
 * Stream has no persistent raise-hand, so hands are synced with custom
 * events. New joiners don't receive past events, so anyone with a hand up
 * re-announces it when someone joins.
 */
type Call = NonNullable<ReturnType<typeof useCall>>;

/** The ordered list of raised hands, with idempotent add/remove. */
const useHandList = () => {
  const [hands, setHands] = useState<RaisedHand[]>([]);
  const add = useCallback((hand: RaisedHand) => {
    setHands((prev) => (prev.some((h) => h.userId === hand.userId) ? prev : [...prev, hand]));
  }, []);
  const remove = useCallback((userId: string) => {
    setHands((prev) => prev.filter((h) => h.userId !== userId));
  }, []);
  return { hands, add, remove };
};

interface HandSyncOptions {
  call: Call | undefined;
  localUserId: string | undefined;
  myHandRaised: boolean;
  add: (hand: RaisedHand) => void;
  remove: (userId: string) => void;
}

/** Applies other people's hand events, and re-announces ours for late joiners. */
const useHandSync = ({ call, localUserId, myHandRaised, add, remove }: HandSyncOptions) => {
  const { toast } = useToast();
  // Read inside event handlers without resubscribing on every change.
  const myHandRaisedRef = useRef(myHandRaised);
  useEffect(() => {
    myHandRaisedRef.current = myHandRaised;
  }, [myHandRaised]);

  useEffect(() => {
    if (!call) return;

    const offCustom = call.on("custom", (event) => {
      const change = interpretHandEvent(event, call.state.createdBy?.id);
      if (!change) return;
      if (!change.raised) return remove(change.userId);
      add({ userId: change.userId, name: change.name });
      if (change.userId !== localUserId) {
        toast({ title: `${change.name} raised their hand` });
      }
    });
    const offJoined = call.on("call.session_participant_joined", () => {
      if (!myHandRaisedRef.current) return;
      call.sendCustomEvent({ type: HAND_EVENT, raised: true }).catch(() => {});
    });
    const offLeft = call.on("call.session_participant_left", (event) => {
      remove(event.participant.user.id);
    });

    return () => {
      offCustom();
      offJoined();
      offLeft();
    };
  }, [call, localUserId, add, remove, toast]);
};

/** Raising and lowering, applied locally right away and sent to everyone. */
const useHandActions = (
  call: Call | undefined,
  localUserId: string | undefined,
  { add, remove }: Pick<HandSyncOptions, "add" | "remove">
) => {
  const raise = useCallback(async () => {
    if (!call || !localUserId) return;
    add({ userId: localUserId, name: "You" });
    await call.sendCustomEvent({ type: HAND_EVENT, raised: true });
  }, [call, localUserId, add]);

  const lower = useCallback(
    async (userId?: string) => {
      if (!call || !localUserId) return;
      const target = userId ?? localUserId;
      remove(target);
      const forSomeoneElse = target !== localUserId;
      await call.sendCustomEvent({ type: HAND_EVENT, raised: false, ...(forSomeoneElse && { target }) });
    },
    [call, localUserId, remove]
  );

  return { raise, lower };
};

export const RaisedHandsProvider = ({ children }: { children: React.ReactNode }) => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localUserId = useLocalParticipant()?.userId;
  const { hands, add, remove } = useHandList();
  const myHandRaised = !!localUserId && hands.some((h) => h.userId === localUserId);

  useHandSync({ call, localUserId, myHandRaised, add, remove });
  const { raise, lower } = useHandActions(call, localUserId, { add, remove });

  const value = useMemo<RaisedHandsValue>(
    () => ({
      hands,
      isRaised: (userId) => hands.some((h) => h.userId === userId),
      isMyHandRaised: myHandRaised,
      raise,
      lower,
    }),
    [hands, myHandRaised, raise, lower]
  );

  return <RaisedHandsContext.Provider value={value}>{children}</RaisedHandsContext.Provider>;
};

export const useRaisedHands = () => {
  const value = useContext(RaisedHandsContext);
  if (!value) throw new Error("useRaisedHands must be used inside <RaisedHandsProvider>");
  return value;
};
