import { readFile , writeFile , access , readdir} from "node:fs/promises";
import chalk, { Chalk } from "chalk";
import fs from "node:fs/promises";
import path from "node:path";
import { readdirSync } from "node:fs";

async function writeData(data){
    const outputPath = "./output.txt";
    await writeFile(outputPath, data);
}


async function getData(listOfFiles , dir , exclude_list){
    let finalData = "";
    for (const file of listOfFiles){
        let data = await readFile(file, "utf-8");
        data +="\n======================================================================================\n";
        finalData += data;
    }
    return finalData;
}


async function getRecursiveFile(dirPath , list, exclude_list) {
    const files = await readdir(dirPath , {withFileTypes: true});
    for (const file of files){
        if (!exclude_list.includes(file.name)){
            const truepath = path.join(dirPath, file.name);
            if (file.isDirectory()){
                await getRecursiveFile(truepath, list ,exclude_list);
            }
            else if(file.isFile()){
                list.push(truepath);
            }
        }
    }
    return(list);
}


(async () => {
    const dirPath = "./";
    const IGNORE = [
        "node_modules",
        ".git",
        "package.json",
        "package-lock.json",
        "output.txt",
        "README.md"
      ];
    try {
        const files = await getRecursiveFile(dirPath,[] , IGNORE);
        const data = await getData(files , dirPath , IGNORE);
        await writeData(data);
        console.log(chalk.cyan(data));
        console.log(chalk.green("=========Le fichier a été créé avec succès=========\n"));
    } catch (error) {
        console.log(chalk.red("Dommage Une erreur est survenue", error));
    }

})();
