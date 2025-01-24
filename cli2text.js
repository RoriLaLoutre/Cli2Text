import { readFile , writeFile , access , readdir} from "node:fs/promises";
import chalk, { Chalk } from "chalk";
import fs from "node:fs/promises";
import path from "node:path";
import { readdirSync } from "node:fs";

async function writeData(data){
    const outputPath = "./output.txt";
    await writeFile(outputPath, data);
}





// function displayTree(dir, indent = 0, ignoredFiles = []) {
//     const files = readdirSync(dir);
//     let str ="";
//     files.forEach(file => {
//         if (ignoredFiles.some(ignored => file.includes(ignored))) {
//             return; 
//         }

//         const fullPath = path.join(dir, file);
//         const isDirectory = statSync(fullPath).isDirectory();

//         str += ' '.repeat(indent) + (isDirectory ? '📁 ' : '📄 ') + file

//         if (isDirectory) {
//             displayTree(fullPath, indent + 2, ignoredFiles); // Appel récursif pour parcourir les sous-dossiers
//         }
//     });
// }

async function getData(listOfFiles , dir , exclude_list){
    // let finalData = `voici les fichiers affichés par la fonction : \n ${displayTree(dir , 0 , exclude_list)}\n`;
    let finalData = "";
    for (const file of listOfFiles){
        let content = await readFile(file, "utf-8");
        let data = "";
        data +="\n======================================================================================\n";
        data += `\nContenu du fichier : ${file}\n`;   
        data +="\n======================================================================================\n";
        data += content;
        data += 2*"\n";
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
