import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",       
  host: "localhost",
  database: "storagedb",
  password: "aed4Ekia@po", 
  port: 5432,             
});

export default pool;
