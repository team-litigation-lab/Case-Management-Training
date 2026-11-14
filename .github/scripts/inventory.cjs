// @check node — The code inventory (docs/INVENTORY.md) is in step with the files: run node build/inventory.cjs after adding, removing or renaming one
require('child_process').execFileSync(process.execPath, [require('path').join(__dirname, '../../build/inventory.cjs'), '--check'], { stdio: 'inherit' });
