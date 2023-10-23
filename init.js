const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function run(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if(error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

(async () => {
    console.log("Installing dependencies...");
    await run("npm install");
    console.log("Dependencies installed!");
    const pg = require('pg');
    let token = await ask("Enter your bot token: ");
    while (true) {
        let dbUser = await ask("Enter your database user: ");
        let dbPassword = await ask("Enter your database password: ");
        let dbName = await ask("Enter your database name: ");
        let dbHost = await ask("Enter your database host: ");
        let dbPort = await ask("Enter your database port: ");
        //try to connect to database
        let client = new pg.Client({
            connectionString: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
        });
        try {
            await client.connect();
            await client.end();
            break;
        } catch (e) {
            console.log("Error connecting to database: " + e.message);
        }
    }
    fs.mkdirSync(".idea/runConfigurations");
    fs.writeFileSync(".idea/runConfigurations/start.xml", `<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="start" type="js.build_tools.npm" nameIsGenerated="true">
    <package-json value="$PROJECT_DIR$/package.json" />
    <command value="run" />
    <scripts>
      <script value="start" />
    </scripts>
    <node-interpreter value="project" />
    <envs>
      <env name="DATABASE_URL" value="postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}" />
      <env name="TOKEN" value="${token}" />
    </envs>
    <method v="2" />
  </configuration>
</component>`);
    rl.close();
})();