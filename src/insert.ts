import { Integer, Session } from "neo4j-driver";

function toNumber(value: number | Integer | undefined): number {
  if (typeof value === "number") return value;
  if (value && typeof value.toNumber === "function") return value.toNumber();
  throw new Error("Unable to convert value to number");
}

export async function insertStudent(
  session: Session,
  firstName: string,
  lastName: string,
  grade: number,
  email: string
): Promise<number> {
  const id = await session.executeWrite(async (tx) => {
    const result = await tx.run(
      `MERGE (counter:Counter {name: "student"})
       ON CREATE SET counter.value = 0
       SET counter.value = counter.value + 1
       WITH counter.value AS id
       CREATE (s:Student {
         id: id,
         first_name: $firstName,
         last_name: $lastName,
         grade: $grade,
         email: $email
       })
       RETURN id`,
      { firstName, lastName, grade, email }
    );

    const value = result.records[0]?.get("id") as number | Integer | undefined;
    return toNumber(value);
  });

  return id;
}
