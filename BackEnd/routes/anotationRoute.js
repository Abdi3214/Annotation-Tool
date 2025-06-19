// ====== routes/anotationRoute.js (Back‑End) ======
const express = require('express');

const mongoose = require('mongoose');
const Annotation = require('../models/annotationModel');
const router = express.Router();
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

router.get("/export", async (req, res) => {
  try {
    const { format = "csv" } = req.query;
    const annotations = await Annotation.find();

    if (!annotations || annotations.length === 0) {
      return res.status(400).json({ message: "No data to export" });
    }

    if (format === "csv") {
      const fields = [
        'Annotator_ID', 'Comment', 'Src_Text', 'Target_Text',
        'Score', 'Omission', 'Addition', 'Mistranslation', 'Untranslation','Src_Issue', 'Target_Issue'
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(annotations);

      res.header("Content-Type", "text/csv");
      res.attachment("annotations.csv");
      return res.send(csv);
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Annotations");

      worksheet.columns = [
        { header: 'Annotator_ID', key: 'Annotator_ID', width: 15 },
        { header: 'Comment', key: 'Comment', width: 30 },
        { header: 'Src_Text', key: 'Src_Text', width: 100 },
        { header: 'Target_Text', key: 'Target_Text', width: 100 },
        { header: 'Score', key: 'Score', width: 10 },
        { header: 'Omission', key: 'Omission', width: 10 },
        { header: 'Addition', key: 'Addition', width: 10 },
        { header: 'Mistranslation', key: 'Mistranslation', width: 10 },
        { header: 'Untranslation', key: 'Untranslation', width: 10 },
        { header: 'Src_Issue', key: 'Src_Issue', width: 100 },
        { header: 'Target_Issue', key: 'Target_Issue', width: 100 },
      ];

      worksheet.addRows(annotations.map(a => a.toObject()));

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=annotations.xlsx");

      await workbook.xlsx.write(res);
      return res.end();
    }

    if (format === "json") {
      res.header("Content-Type", "application/json");
      res.attachment("annotations.json");
      return res.send(JSON.stringify(annotations, null, 2));
    }

    res.status(400).json({ message: "Unsupported format" });
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ message: "Failed to export data" });
  }
});


// Get all annotations
router.get('/rebortAnnotation', async (req, res) => {
  try {
    const annotations = await Annotation.find();
    res.status(200).json(annotations);
  } catch (err) {
    console.error('GET /rebortAnnotation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new annotation
// routes/anotationRoute.js

router.post('/rebortAnnotation', async (req, res) => {
    try {
      // Uniqueness on Annotator_ID + Src_Text
      const existing = await Annotation.findOne({
        Annotator_ID: req.body.Annotator_ID,
        Src_Text: req.body.Src_Text
      });
  
      if (existing) {
        return res.status(409).json({ message: 'Annotation already exists for this text and annotator' });
      }
  
      const annotation = new Annotation(req.body);
      await annotation.save();
      res.status(201).json(annotation);
    } catch (err) {
      console.error('POST /rebortAnnotation error:', err);
      res.status(500).json({ message: err.message });
    }
  });
  
// Update an annotation by ID
router.put('/rebortAnnotation/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid annotation ID format' });
  }

  try {
    const annotation = await Annotation.findByIdAndUpdate(id, req.body, { new: true });
    if (!annotation) return res.status(404).json({ message: 'Annotation not found' });
    res.status(200).json(annotation);
  } catch (err) {
    console.error('PUT /rebortAnnotation/:id error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete an annotation by ID
router.delete('/rebortAnnotationDelete/:id', async (req, res) => {
  try {
    const deleted = await Annotation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Annotation not found' });
    res.status(200).json(deleted);
  } catch (err) {
    console.error('DELETE /rebortAnnotation/:id error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE all annotations
router.delete('/deleteAll', async (req, res) => {
  try {
    await Annotation.deleteMany({});
    res.status(200).json({ message: 'All annotations deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
