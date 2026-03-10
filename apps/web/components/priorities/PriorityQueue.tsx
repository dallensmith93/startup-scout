import type { PriorityItem as PriorityItemType } from "../../lib/priority-api";
import { PriorityCard } from "./PriorityCard";

export function PriorityQueue({ items }: { items: PriorityItemType[] }) {
  return <div className="grid">{items.map((item) => <PriorityCard key={item.applicationId} item={item} />)}</div>;
}
