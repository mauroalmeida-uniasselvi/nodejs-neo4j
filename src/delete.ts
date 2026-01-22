import { Session } from "neo4j-driver";

export async function deleteStudent(session: Session, id: number): Promise<void> {
  await session.executeWrite((tx) => tx.run("MATCH (s:Student {id: $id}) DETACH DELETE s", { id }));
}

export async function deleteAllStudent(session: Session): Promise<void> {
  await session.executeWrite((tx) => tx.run("MATCH (s:Student) DETACH DELETE s"));
}
