require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { discovery } = require('./discovery.js');
const app = express();
const port = process.env.SERVER_PORT;

let lastDoc = '';

app.get('/read', async (req, res) => {
  const documents = await discovery.listDocuments({
    projectId: process.env.PROJECT_ID,
    collectionId: process.env.COLLECTION_ID,
  });
  res.status(200).send(documents.result);
});

app.post('/create', async (req, res) => {
  const add = await discovery.addDocument({
    projectId: process.env.PROJECT_ID,
    collectionId: process.env.COLLECTION_ID,
    file: fs.createReadStream('./files/404.html'),
    filename: 'example-file-1',
    fileContentType: 'text/html',
  });

  if (add.result.document_id) {
    lastDoc = add.result.document_id;
    res.status(202).send(add.result);
  } else {
    res.status(404).send('Document error');
  }
});

app.patch('/update', async (req, res) => {
  if (lastDoc) {
    const update = await discovery.updateDocument({
      projectId: process.env.PROJECT_ID,
      collectionId: process.env.COLLECTION_ID,
      documentId: lastDoc,
      file: fs.createReadStream('./files/500.html'),
      filename: 'example-file-2',
      fileContentType: 'text/html',
    });

    res.status(201).send(update.result);
  } else {
    res.status(404).send('No uploaded document to update');
  }
});

app.delete('/delete', async (req, res) => {
  if (lastDoc) {
    const removed = await discovery.deleteDocument({
      projectId: process.env.PROJECT_ID,
      collectionId: process.env.COLLECTION_ID,
      documentId: lastDoc,
    });

    lastDoc = '';

    res.status(200).send(removed.result);
  } else {
    res.status(404).send('No uploaded document to delete');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
