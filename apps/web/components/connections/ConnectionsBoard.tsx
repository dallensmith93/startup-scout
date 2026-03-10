import { ConnectionStageColumn } from "./ConnectionStageColumn";
import { getStageLabel, type Connection, type ConnectionStage } from "../../lib/network-api";

type ConnectionsBoardProps = {
  connections: Connection[];
  selectedId?: string;
  onSelect: (connection: Connection) => void;
};

const stageOrder: ConnectionStage[] = ["research", "warm", "active", "nurture"];

export function ConnectionsBoard({ connections, selectedId, onSelect }: ConnectionsBoardProps) {
  return (
    <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {stageOrder.map((stage) => (
        <ConnectionStageColumn
          key={stage}
          stage={stage}
          stageLabel={getStageLabel(stage)}
          items={connections.filter((contact) => contact.stage === stage)}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}
