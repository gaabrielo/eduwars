export interface HeroCellChangedEvent {
  x: number;
  y: number;
  previousX: number | null;
  previousY: number | null;
}

export interface GameEventMap {
  heroCellChanged: HeroCellChangedEvent;
}

type GameEventName = keyof GameEventMap;
export type GameEventListener<EventName extends GameEventName> = (
  payload: GameEventMap[EventName]
) => void;

type ListenerMap = {
  [EventName in GameEventName]?: Set<GameEventListener<EventName>>;
};

export class GameEventBus {
  private readonly listeners: ListenerMap = {};

  on<EventName extends GameEventName>(
    eventName: EventName,
    listener: GameEventListener<EventName>
  ): () => void {
    const existingListeners = this.listeners[eventName] as
      | Set<GameEventListener<EventName>>
      | undefined;
    const eventListeners =
      existingListeners ?? new Set<GameEventListener<EventName>>();

    if (!existingListeners) {
      this.listeners[eventName] = eventListeners as ListenerMap[EventName];
    }

    eventListeners.add(listener);

    return () => {
      eventListeners.delete(listener);
    };
  }

  emit<EventName extends GameEventName>(
    eventName: EventName,
    payload: GameEventMap[EventName]
  ): void {
    const eventListeners = this.listeners[eventName] as
      | Set<GameEventListener<EventName>>
      | undefined;

    eventListeners?.forEach((listener) => listener(payload));
  }

  clear(): void {
    (Object.keys(this.listeners) as GameEventName[]).forEach((eventName) => {
      this.listeners[eventName]?.clear();
    });
  }
}
