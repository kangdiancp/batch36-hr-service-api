//1. import & setup environment
import Fastify from "fastify";
import * as dotenv from "dotenv"; //read file .env di root project, lalu inject isinya ke process.env


//2. Ekseskusi di awal, agar semua variabl environment sudah available sebelum kode lain berjalan
dotenv.config(); 

//3. Create object instance fastify
const app = Fastify({
    logger: true, //pino bawaan fastify di aktifkan, semua log request, error akan otomatis tampil di console with json format.
});


//4. Health Check : untuk cek apakah service masih running, biasanya dipake di container orchestrator
app.get("/health", async () => {
    return { status: "OK", timestamp: new Date() };
});

//5. Config Server
const start = async () => {
    try {
        // using port 3002, karena 3001 untuk auth-service-api        
        const port = Number(process.env.PORT) || 3002; 
        const host = process.env.HOST || "0.0.0.0";

        await app.listen({ port, host });
        console.log(`HR Service running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

//6. Running Start Server
start();