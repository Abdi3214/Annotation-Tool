const mongoose = require('mongoose')

const annotationSchema = mongoose.Schema(
  {
    Annotator_ID: { type: Number, required: true },
    // Annotator_Email: { type: String, required: true },
    // Annotation_ID: { type: String, required: true },
    Comment: { type: String,  },
    Src_Text: { type: String, required: true },
    Target_Text: { type: String, required: true },
    Score: { type: Number, required: true },
    Omission: { type: Number, default: 0  },
    Addition: { type: Number, default: 0  },
    Mistranslation: { type: Number, default: 0  },
    Untranslation: { type: Number, default: 0  },
    Src_Issue: { type: String, required: true },
    Target_Issue: { type: String, required: true },
  },
  { timestamps: true, versionKey: false } // This removes __v
)

const annotation = mongoose.model('Annotation', annotationSchema)

module.exports = annotation