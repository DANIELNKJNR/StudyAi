import { useState, useCallback } from "react";

// In-memory for now. When you add Firebase, keep this return shape:
// { items, loading, error, add, clear } and swap the internals
// (onSnapshot for reading, addDoc for add, etc).
export default function usePredictionHistory() {
  const [items, setItems] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const add = useCallback((entry) => setItems((p) => [entry, ...p].slice(0, 20)), []);
  const clear = useCallback(() => setItems([]), []);
  return { items, loading, error, add, clear };
}
