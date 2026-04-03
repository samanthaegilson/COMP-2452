import trainingData from './training.csv?raw';

function training() {
    const ALPHABET_CONVERT = 97;
    const LENGTH = 10;
    let numerator: number[][] = Array.from({ length: LENGTH }, () => Array(LENGTH).fill(0));
    let denominator: number[] = new Array(LENGTH);

    // Fill array with 0s
    for (let index = 0; index < denominator.length; index++) {
        denominator[index] = 0;
    }

    const lines = trainingData.split("\n"); // Consider each line seperately
    for (let line of lines) {
        let data = line.split(",");
        // Convert the letters to indices and increment transition
        for (let i = 1; i < data.length; i++) {
            let transition = data[i].charCodeAt(0) - ALPHABET_CONVERT;
            let start = data[i - 1].charCodeAt(0) - ALPHABET_CONVERT;

            denominator[start]++;
            numerator[start][transition]++;
        }
    }

    // Put data in a single matrix
    let percentages: number[][] = [];
    for (let row = 0; row < LENGTH; row++) {
        percentages[row] = [];
        for (let col = 0; col < LENGTH; col++) {
            percentages[row][col] = numerator[row][col] / denominator[row];
            console.log(percentages[row][col] + " ");
        }
        console.log("\n");
    }

}
training();