import { Session } from "neo4j-driver";

export async function updateStudent(
  session: Session,
  id: number,
  firstName: string,
  lastName: string,
  grade: number,
  email: string
): Promise<void> {
  await session.executeWrite((tx) =>
    tx.run(
      `MATCH (s:Student {id: $id})
       SET s.first_name = $firstName,
           s.last_name = $lastName,
           s.grade = $grade,
           s.email = $email`,
      { id, firstName, lastName, grade, email }
    )
  );
}

export async function updateStudentName(session: Session, id: number, firstName: string): Promise<void> {
  await session.executeWrite((tx) =>
    tx.run("MATCH (s:Student {id: $id}) SET s.first_name = $firstName", { id, firstName })
  );
}

export async function updateStudentEmail(session: Session, id: number, email: string): Promise<void> {
  await session.executeWrite((tx) =>
    tx.run("MATCH (s:Student {id: $id}) SET s.email = $email", { id, email })
  );
}
