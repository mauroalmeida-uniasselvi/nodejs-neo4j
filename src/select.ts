import { Integer, Node, Session } from "neo4j-driver";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  grade: number;
  email: string;
}

function toNumber(value: number | Integer | undefined): number {
  if (typeof value === "number") return value;
  if (value && typeof value.toNumber === "function") return value.toNumber();
  throw new Error("Unable to convert value to number");
}

function mapStudent(node: Node): Student {
  const props = node.properties as Record<string, unknown>;
  return {
    id: toNumber(props.id as number | Integer | undefined),
    first_name: String(props.first_name),
    last_name: String(props.last_name),
    grade: toNumber(props.grade as number | Integer | undefined),
    email: String(props.email),
  };
}

export async function selectStudentById(session: Session, id: number): Promise<Student | null> {
  const result = await session.executeRead((tx) =>
    tx.run("MATCH (s:Student {id: $id}) RETURN s LIMIT 1", { id })
  );

  const record = result.records[0];
  if (!record) return null;

  const node = record.get("s") as Node;
  return mapStudent(node);
}

export async function selectAllStudents(session: Session): Promise<Student[]> {
  const result = await session.executeRead((tx) => tx.run("MATCH (s:Student) RETURN s ORDER BY s.id"));
  return result.records.map((record) => {
    const node = record.get("s") as Node;
    return mapStudent(node);
  });
}
