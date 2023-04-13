# Project: Node.js Image Processing CLI Tool
This Node.js command line tool processes images within a specified input folder and generates an output CSV file containing the results. It is designed to work with JPEG, JPG, and PNG images.
## Prerequisites
Before running the project, make sure you have [Node.js](https://nodejs.org/) installed.
## Installation
1. Clone the repository:
```
git clone https://github.com/jakep36/parse-receipts-gpt.git
```
2. Navigate to the project folder:
```
cd your-repo-name
```
3. Install the necessary dependencies:
```
npm install
```
4. Create a `.env` file in the root directory of the project, and add the following environment variables:
```
INPUT_FOLDER=<path_to_your_input_folder>
OUTPUT_FILE=<optional_path_to_your_output_csv_file>
OPEN_API_KEY=<your open api key>
```
Replace `<path_to_your_input_folder>` with the path to the folder containing the images you want to process. Optionally, you can also specify a custom path for the output CSV file.
## Usage
To run the CLI tool, execute the following command:
```
node parse-receipts-chatgpt.js
```
The tool will process the images in the specified input folder and generate a CSV file containing the results. By default, the CSV file will be saved in the project root directory with the name `output.csv`. If you specified a custom path for the output file in the `.env` file, the CSV will be saved at that location.
## Functionality
The main functionality of the tool is contained within the `processFolder()` function. This function takes a folder path as input, and processes all images within that folder and its subfolders. It returns an array of results.
For each image, the `processReceiptImage()` function is called to process the image. You should implement this function to perform the desired image processing and return a result object. The result objects are then aggregated and saved to the output CSV file.
