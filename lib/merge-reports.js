/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const FilesHelper = require('../helpers/utils/file-helper.js');

/**
 * Reads given file and merges the contents into the final report
 * WARNING! mergedReport is modified in place
 *
 * @param {Object[]} mergedReport - array of feature reports representing the final merged report
 * @param {string} file - path to json file
 * @param {string} backupDirectory - directory where json file is going to be stored as backup
 */
function mergeFile(mergedReport, file, backupDirectory) {
	console.log(`Processing file: ${file}`);
	const fileContent = fs.readFileSync(file);
	if (fileContent.length === 0) {
		console.warn(`WARNING! Empty file found: ${file}`);
	} else {
		const report = JSON.parse(fileContent);
		mergedReport.push(...report);
	}
	console.log(`Moving parsed ${file} to backup directory`);
	fs.renameSync(file, path.join(backupDirectory, path.basename(file)));
}

/**
 * Processes given report JSON files and merges them into a single report with results of last runs for each example
 * @param {string[]} jsonFiles - array of file paths
 * @param {string} backupDirectory - directory where json files are going to be stored as backup
 * @returns {Object[]} - cucumber result JSON (always an array of feature objects)
 */
function mergeFiles(jsonFiles, backupDirectory) {
	const mergedReport = [];
	jsonFiles.forEach(file => mergeFile(mergedReport, file, backupDirectory));
	return mergedReport;
}

/**
 * Stringifies given report array and writes it to the output file
 *
 * @param {string} outputFile - output file path
 * @param {Object[]} report - cucumber result JSON (it always is an array of feature objects
 */
function writeMergedReport(outputFile, report) {
	console.log(`Writing merged report to ${outputFile}`);
	fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
	console.log(`Wrote merged report to ${outputFile}`);
}

/**
 * Merges json report files (from a given directory) into a single json file 
 * @param {string} reportsDirectory - directory containing cucumber json report files
 * @returns {string} outputFile -  file containing the merged reports
 */

function mergeJsonReports(reportsDirectory) {
	const backupDirectory = `${reportsDirectory}_bkp`;
	const outputFile = path.join(reportsDirectory, `merged_output_report_${Date.now()}.json`);

	FilesHelper.prepareBackupDirectory(backupDirectory);
	const jsonFiles = FilesHelper.getFiles(reportsDirectory, 'json');
	const mergedReport = mergeFiles(jsonFiles, backupDirectory);
	writeMergedReport(outputFile, mergedReport);
	return outputFile;
}

module.exports.mergeJsonReports =  mergeJsonReports;