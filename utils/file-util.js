const fs = require('fs'); 
const pth = require('path');

const defaultPath = process.env.DEFAULT_FILE_PATH;

function openFile(path) {
    const filePath = pth.join(defaultPath, path);
    try {
        const file = fs.readFileSync(filePath, "utf-8");
        console.log(file);
        return file;
    } catch (err) {
        console.log(err);
    }
    return null;
}

function writeFile(path, contents) {
    // const dirPath = pth.join(defaultPath, path);
    try {
        const { dir, base } = pth.parse(path);
        const dirPath = pth.join(defaultPath, dir);

        // 경로 확인
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        

        // 새 파일인지 확인
        const filePath = pth.join(dirPath, base);
        if (fs.existsSync(filePath)) {
            appendCsv(filePath, contents);
        } else {
            createCsv(filePath, contents);
        }

        
    } catch (err) {
        console.log(err);
    }
}

function openFiles(path) {
    const filePath = pth.join(defaultPath, path);
    try {
        const entries = fs.readdirSync(filePath, { withFileTypes: true });
        const files = entries.map(entry => ({
            name: entry.name,
            isFile: entry.isFile(),
            isDirectory: entry.isDirectory()
        }));
        return files;
    } catch (err) {
        console.log("======== FILE ERROR ========");
        console.log(err);
    }
    return null;
}


/** csv 관련 함수 */
function createCsv(path, data) {
    const columns = ["date", "isWorkDay"];
    data = columns.join(",") + '\n' + data;
    fs.writeFileSync(path, data, encoding='utf-8');
}

function appendCsv(path, data) {
    fs.appendFileSync(path, data, encoding='utf-8');
}   

function parseCsv(rawdata) {
    const [cols, ...data] = rawdata.trimEnd().split("\n").map(line => line.replace("\r", ""));
    return { columns: cols, data };
}


module.exports = {
    openFile, writeFile, parseCsv, openFiles
}

// function main() {
//     const path = "C:/Tools/files/work-checker/202506/1.txt";

//     // 1. Read File
//     const rawdata = openFile(path);
//     if (!rawdata) {
//         throw new Error("비어있는 데이터");
//     }

//     const data = parseLine(rawdata);
//     console.log(data);


//     // // 2. Write File
//     const path2 = "C:/Tools/files/work-checker/202506/2.txt";
//     // // 2.1. 새 파일 생성 후 쓰기
//     try {
//         const cols = "date,isWorkDay\n";
//         const msg1 = "2025-06-09,1\n";
//         fs.writeFileSync(path2, cols + msg1);
//     } catch (err) {
//         console.log(err);
//     }

//     // 2.2. 기존 파일에 쓰기
//     try {
//         const msg2 = "2025-06-10,1";
//         fs.appendFileSync(path2, msg2);
//     } catch (err) {
//         console.log(err);
//     }


//     // 2.3. 폴더 확인, 생성 후 새로 쓰기
//     const path3 = "C:/Tools/files/work-checker/202507/1.txt";
//     const defaultPath = "C:/Tools/files/work-checker";
//     const plusPath = "202507";
//     const fileA = "1.txt";
    
//     try {
//         const isEx = fs.existsSync(pth.join(defaultPath, plusPath));
//         console.log("isEX ::: ", isEx);

//         if (!isEx) {
//             fs.mkdirSync(pth.join(defaultPath, plusPath));
//         }
//         const cols = "date,isWorkDay\n";
//         const msg1 = "2025-07-01,1\n";
//         fs.writeFileSync(pth.join(defaultPath, plusPath, fileA), cols + msg1);

//     } catch (err) {
//         console.log(err);
//     }
// }