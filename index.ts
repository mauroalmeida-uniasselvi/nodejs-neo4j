import neo4j from "neo4j-driver";
import { insertStudent } from "./src/insert.ts";
import { selectStudentById, selectAllStudents } from "./src/select.ts";
import { updateStudentName } from "./src/update.ts";
import { deleteStudent } from "./src/delete.ts";

const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
const user = process.env.NEO4J_USER || "neo4j";
const password = process.env.NEO4J_PASSWORD || "uniasselvi";
const database = process.env.NEO4J_DATABASE || undefined;

async function main() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session({ database });

  try {
    console.log("Connected to Neo4j");

    const studentId = await insertStudent(session, "John", "Doe", 10, "john@example.com");
    console.log("Student created with ID:", studentId);

    const student = await selectStudentById(session, studentId);
    console.log("Student read:", student);

    await updateStudentName(session, studentId, "Jane");
    console.log("Student updated");

    const updatedStudent = await selectStudentById(session, studentId);
    console.log("Updated student:", updatedStudent);

    const allStudents = await selectAllStudents(session);
    console.log("All students:", allStudents);

    await deleteStudent(session, studentId);
    console.log("Student deleted");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await session.close();
    await driver.close();
    console.log("Connection closed");
  }
}

main();
