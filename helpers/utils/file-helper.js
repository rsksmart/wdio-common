const fs = require('fs');
const path = require('path');

class FilesHelper {
    /**
     * Returns the content of a given JSON file
     *
     * @param {string} json - JSON file path
     * @returns {Object[]} - JSON file content
     */
    static  getJsonContent(json) {
        const fileContent = fs.readFileSync(json);
        if (fileContent.length === 0) {
            console.warn(`WARNING! Empty file found: ${json}`);
        }
        return JSON.parse(fileContent);
    }

    /**
     * Adds/Edits a given JSON file by <key, value>
     *
     * @param {string} json - JSON file to be modified
     * @param {string} key - JSON parameter to be added or modified
     * @param {string} value - new value for the key parameter
     */
    static editJsonByKey(json, key, value) {
        try {
            let file = FilesHelper.getJsonContent(json);
            file[key] = value;
            fs.writeFileSync(json, JSON.stringify(file));
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Creates backup directory if it doesn't exist or empties it if it does exist
     *
     * @param {string} directory - path to backup directory
     * @param {boolean} cleanup - wether to empty the directory or not
     */
    static prepareBackupDirectory(directory, cleanup) {
        if (fs.existsSync(directory)) {
            if (cleanup) {
                console.log(`Cleaning existing backup directory: ${directory}`);
                fs.readdirSync(directory).forEach(file => fs.unlinkSync(path.join(directory, file)));
            }            
        } else {
            console.log((`Creating backup directory: ${directory}`));
            fs.mkdirSync(directory);
        }
    }

    /**
     * Returns al list of 'extension' file absolute paths from given directory.
     * List will be sorted by creation time
     *
     * @param {string} directory - directory to check
     * @param {string} extension - file extension to consider (i.e.: 'json', 'feature', 'js'...)
     * @returns {string[]} - array of file path sorted by file creation time
     */
    static getFiles(directory, extension) {
        return fs.readdirSync(directory)
            .filter(file => path.parse(file).ext === `.${extension}`)
            .map(file => path.join(directory, file))
            .sort((a, b) => fs.statSync(a).ctimeMs - fs.statSync(b).ctimeMs);
    }

    /**
     * Creates empty json file if it doesn't exist on a given directory
     *
     * @param {string} fileName - json file name
     * @param {string} path - path to json file
     * @returns {string} - file path
     */
    static createJsonFile(fileName, filePath = 'test/resources/files') {
        const file = path.join(filePath, `${fileName}.json`);
        try {
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
                fs.writeFileSync(file, JSON.stringify({}));             
            } else {
                if (!fs.existsSync(file))
                    fs.writeFileSync(file, JSON.stringify({}));
            }
        } catch (error) {
            throw new Error(error);
        }
        return file;
    }
}

module.exports = FilesHelper;