import fs from 'node:fs';
import readline from 'node:readline';

/**
 * Trains the Markov chain with training.csv and writes output to model.csv
 */
async function training() {
    const ALPHABET_CONVERT = 97;
    const LENGTH = 10;
    let numerator: number[][] = Array.from({ length: LENGTH }, () => Array(LENGTH).fill(0));
    let denominator: number[] = new Array(LENGTH);

    // Fill array with 0s
    for (let index = 0; index < denominator.length; index++) {
        denominator[index] = 0;
    }

    const fileStream = fs.createReadStream('./training/training.csv');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // Recognizes all instances of CR LF as a single line break
    });

    for await (const line of rl) {
        // Process each line (e.g., split by comma)
        const data = line.split(',');
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
        }
    }

    const model = percentages.map(row => row.join(',')).join('\n');

    fs.writeFileSync('./training/model.csv', model);
}
training();