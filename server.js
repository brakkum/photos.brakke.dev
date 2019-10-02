const express = require("express");
const cors = require("cors");
const server = express();
const fs = require("fs");
const port = 3001;

server.use(express.json());
server.use(cors());

server.post("/api/get-dir", (request, response) => {
    console.log(request.body)
    const dir = request.body.dir || "";
    const dir_path = `public/files/${dir}`;
    console.log(`got dir: ${dir} ${Date.now()}`);

    // get parent dir for navigation
    // split the dirs
    let dirs = dir_path.split("/").filter((dir, i) => {
        // remove first two (public, photos) and empty strings
        return ![0, 1].includes(i) && ![""].includes(dir);
    });
    // remove current dir (last) from dirs array
    dirs.pop();
    // recombine dirs
    let parent_dir = dirs.join("/");
    console.log(`dir_path: ${dir_path}`);
    console.log(`parent: ${parent_dir}`);

    if (fs.existsSync(dir_path) && fs.lstatSync(dir_path).isDirectory()) {
        // valid directory
        let directories = [];
        let files = [];
        fs.readdirSync(dir_path).forEach(file => {
            if (fs.lstatSync(`${dir_path}/${file}`).isDirectory()) {
                directories.push(file);
            } else {
                files.push(file);
            }
        });

        // remove bad files
        const bad_files = [".DS_Store"];
        files = files.filter(file => !bad_files.includes(file));

        // return response
        response.send({
            "success": true,
            directories,
            parent_dir,
            files
        });
    } else {
        // not a valid directory
        response.send({
            "success": false,
            parent_dir
        });
    }
});

server.get("/api/get-file", (request, response) => {
    const file = request.body.file || "";
    console.log(`got file: ${file}`);
});

server.listen(port, () => console.log(`running on ${port}`));
