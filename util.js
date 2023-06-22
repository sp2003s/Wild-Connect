const fs = require("fs").promises;
const path = require("path");

async function getJobs() {
    const jobs = await fs.readFile(path.join(__dirname, "data.json"))
    return JSON.parse(jobs);
}

module.exports.getJobs = getJobs;

module.exports.writeJob = async job => {
    const existingJobs = await getJobs();
    existingJobs.push(job);

    await fs.writeFile(
        path.join(__dirname, "data.json"),
        JSON.stringify(existingJobs),
        { encoding: "utf-8" }
    );
}

async function getUsers() {
    const user = await fs.readFile(path.join(__dirname, "users.json"))
    return JSON.parse(user);
}

module.exports.getUsers = getUsers;

module.exports.writeUser = async users => {
    const existingUsers = await getUsers();
    existingUsers.push(users);

    await fs.writeFile(
        path.join(__dirname, "users.json"),
        JSON.stringify(existingUsers),
        { encoding: "utf-8" }
    );
}
