'use strict';
const fs = require('fs');

module.exports = (req, res) => {
    let dir = __dirname + '/../../uploads/images/';
    let itemNames = fs.readdirSync(dir);
    let objQuery = req.query;

    let acceptTypes = [];
    if(objQuery.type == 'image') {
        acceptTypes = ['jpg', 'png', 'gif', 'jpeg'];
    }
    let result = [];
    for(let i=0; i< itemNames.length; i++) {
        let itemName = itemNames[i];
        let itemInfo = fs.statSync(dir + '/' + itemName);

        let itemType = '';
        if(itemInfo.isDirectory()) {
            itemType = 'folder';
        }
        if(itemInfo.isFile()) {
            itemType = 'file';

            let indexFileType = 0;
            for (let j = 0; j < itemName.length; j++) {
                if (itemName[j] === ".") indexFileType = j;
            }
            let fileType = itemName.substr(indexFileType + 1);
            if(objQuery.type) {
                if(acceptTypes.indexOf(fileType.toLowerCase()) === -1){
                    continue;
                }
            }
        }

        result.push({
            name: itemName,
            type: itemType,
            url: 'images/' + itemName,
            size: itemInfo.size
        });
    }
    res.json(result);
};