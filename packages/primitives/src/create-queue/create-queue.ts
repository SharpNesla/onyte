import { type Accessor, createSignal } from 'solid-js';

export interface CreateQueueOptions<T> {
  initialValues?: T[];
  limit: number;
}

export interface CreateQueueReturnValue<T> {
  queue: Accessor<T[]>;
  state: Accessor<T[]>;
  add: (...items: T[]) => void;
  update: (fn: (state: T[]) => T[]) => void;
  cleanQueue: () => void;
}

export function createQueue<T>({
  initialValues = [],
  limit,
}: CreateQueueOptions<T>): CreateQueueReturnValue<T> {
  const [internal, setInternal] = createSignal({
    state: initialValues.slice(0, limit),
    queue: initialValues.slice(limit),
  });

  const add = (...items: T[]) =>
    setInternal((current) => {
      const results = [...current.state, ...current.queue, ...items];
      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const update = (fn: (state: T[]) => T[]) =>
    setInternal((current) => {
      const results = fn([...current.state, ...current.queue]);
      return {
        state: results.slice(0, limit),
        queue: results.slice(limit),
      };
    });

  const cleanQueue = () => setInternal((current) => ({ state: current.state, queue: [] }));

  return {
    state: () => internal().state,
    queue: () => internal().queue,
    add,
    update,
    cleanQueue,
  };
}
