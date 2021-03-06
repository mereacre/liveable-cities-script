const csv = require("csvtojson");
const _ = require("lodash");
const fs = require('fs');

// Ensure the rigth amount of arguments
if (process.argv.length < 5) {
    console.log("Usage: node dictionary.js infile.csv outfile.json column")
    process.exit(1);
}

fs.open(process.argv[3], "w", (err, fd) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        fs.close(fd, (err) => {
            if(err) {
                console.log(err);
                process.exit(1);
            } else {
                const dictionary = {};
                csv({delimiter: ","})
                    .fromFile(process.argv[2])
                    .on('json', (entryCsv) => {
                        console.log(entryCsv);
                        const entry = _.omit(entryCsv, [process.argv[4]])
                        dictionary[entryCsv[process.argv[4]]] = entry;
                    })
                    .on("done", (error) => {
                        _.map(dictionary, (value, key) => {
                            fs.writeFileSync(process.argv[3], "\"" + key+ "\": "+JSON.stringify(value)+",\n", {flag: "a"}, (err) => {
                                if(err) {
                                    console.log(err);
                                    process.exit(1);
                                }
                            });
                        });
                        console.log("Done processing.");
                        console.log("Saving to output file: "+process.argv[3]);
                    });
            }
        });
    }
});