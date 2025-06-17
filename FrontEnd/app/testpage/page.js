"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Annotation = () => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("annotationIndex");
      return saved !== null ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sourceSelections, setSourceSelections] = useState([]);
  const [targetSelections, setTargetSelections] = useState([]);
  const [targetCategory, setTargetCategory] = useState("Addition");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMistranslation, setCurrentMistranslation] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const sliderRef = useRef(null);

  // default rating (used for SSR and initial CSR)
  const [rating, setRating] = useState(50);
  // track hydration
  const [mounted, setMounted] = useState(false);

  const progress = Math.round(((currentIndex + 1) / items.length) * 100);
  // toggle to show tagged output container
  const [showTagged, setShowTagged] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/data/annotation");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const mapped = data.map((post) => ({
          id: post.id,
          sourceText: post.english,
          targetText: post.somali,
        }));
        setItems(mapped);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);
  // localStorage.setItem('totalAnnotations', items.length);
  // only write to localStorage once items have been fetched/updated
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("totalAnnotations", items.length.toString());
    }
  }, [items]);
  // 2) Reset selections whenever currentIndex changes
  useEffect(() => {
    setSourceSelections([]);
    setTargetSelections([]);
  }, [currentIndex]);

  // 3) on mount, load stored rating and mark mounted
  useEffect(() => {
    const saved = localStorage.getItem("meaningRating");
    if (saved !== null) {
      setRating(parseInt(saved, 10));
    }
    setMounted(true);
  }, []);

  // 4) Save rating to localStorage when it changes (after hydration)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("meaningRating", rating.toString());
    }
  }, [rating, mounted]);

  // 5) Persist currentIndex to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("annotationIndex", currentIndex.toString());
    }
  }, [currentIndex]);
  // ─── EARLY RETURNS ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-md skeleton mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md skeleton mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md skeleton mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md skeleton"></div>
        </div>
      </div>
    );
  }
  if (error) return <p>Error loading items: {error.message}</p>;
  if (!items.length) return <p>No items to annotate.</p>;

  const { id, sourceText, targetText } = items[currentIndex];
  const countAnnotations = () => {
    const counts = {
      Omission: sourceSelections.filter(
        (s) => !s.category || s.category === "Omission"
      ).length,
      Addition: targetSelections.filter((s) => s.category === "Addition")
        .length,
      Untranslation: targetSelections.filter(
        (s) => s.category === "Untranslation"
      ).length,
      Mistranslation: targetSelections.filter(
        (s) => s.category === "Mistranslation"
      ).length,
    };
    return counts;
  };
  const getTaggedText = (txt, sels) => {
    if (!sels.length) return txt;
  
    // 1. Annotate each selection with its start index
    const withIndex = sels.map(s => ({
      ...s,
      start: txt.indexOf(s.text),
      tag: { Addition: 'a', Untranslation: 'u', Mistranslation: 'm', Omission: 'o' }[s.category || 'Omission']
    }))
    // 2. Sort by start
    .filter(s => s.start !== -1)
    .sort((a, b) => a.start - b.start);
  
    // 3. Walk through the text, injecting tags
    let out = '', idx = 0;
    withIndex.forEach(s => {
      out += txt.slice(idx, s.start)
           + `<${s.tag}>${s.text}</${s.tag}>`;
      idx = s.start + s.text.length;
    });
    out += txt.slice(idx);
    return out;
  };
  
  const handleChange = (e) => setRating(parseInt(e.target.value, 10));
  const clearSelections = () => {
    setSourceSelections([]);
    setTargetSelections([]);
  };
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Selection logic (unchanged) …
  const handleSelection = (setSelections, text, category = null) => {
    const selection = window.getSelection();
    const selectionText = selection.toString().trim();
  
    if (selectionText && text.includes(selectionText)) {
      setSelections((prev) => {
        const sameTextDiffCategory = prev.find(
          (s) => s.text === selectionText && s.category !== category
        );
        const sameTextSameCategory = prev.find(
          (s) => s.text === selectionText && s.category === category
        );
  
        // If selected already with the same category, deselect it
        if (sameTextSameCategory) {
          return prev.filter(
            (s) => !(s.text === selectionText && s.category === category)
          );
        }
  
        // Remove previous conflicting annotation for same text
        let filtered = prev.filter((s) => s.text !== selectionText);
  
        const newSelection = { text: selectionText };
        if (category) newSelection.category = category;
  
        if (category === "Mistranslation") {
          setCurrentMistranslation(newSelection);
          setIsModalOpen(true);
        }
  
        return [...filtered, newSelection];
      });
    }
  
    selection.removeAllRanges();
  };
  
  const handleSourceSelection = () => {
    const selection = window.getSelection();
    const selectionText = selection.toString().trim();
    if (selectionText && sourceText.includes(selectionText)) {
      const newSelection = {
        text: selectionText,
        category: "Mistranslation",
        linkedTargetText: currentMistranslation.text,
      };
      setSourceSelections((prev) => [...prev, newSelection]);
      setIsModalOpen(false);
      setCurrentMistranslation(null);
    }
    selection.removeAllRanges();
  };

  const handleSave = async () => {
    if (submitting) return;
    setSubmitting(true);
    const counts = countAnnotations();

    const payload = {
      Annotator_ID: currentIndex,
      Comment: comment,
      Src_Text: sourceText,
      Target_Text: targetText,
      Score: rating,
      Omission: counts.Omission,
      Addition: counts.Addition,
      Mistranslation: counts.Mistranslation,
      Untranslation: counts.Untranslation,
      Src_Issue: getTaggedText(sourceText, sourceSelections),
      Target_Issue: getTaggedText(targetText, targetSelections),
    };
    try {
      const res = await fetch(
        "http://localhost:5000/api/annotation/rebortAnnotation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 409) {
          alert(
            "An annotation already exists for this input. Please modify the content or user."
          );
        } else {
          console.error(
            `Save failed: ${res.status} ${res.statusText} - ${text}`
          );
          alert("Failed to save annotation. Please try again.");
        }
        return;
      }
      const result = await res.json();
      console.log("Saved annotation:", result);
      alert("Annotation saved successfully.");
      clearSelections();
      if (currentIndex < items.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
      setComment("");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const getClassAndTooltip = (sel) => {
    if (!sel.category)
      return { colorClass: "text-blue-500", tooltipText: "Omission" };
    switch (sel.category) {
      case "Addition":
        return { colorClass: "text-red-500", tooltipText: "Addition" };
      case "Untranslation":
        return { colorClass: "text-yellow-500", tooltipText: "Untranslation" };
      case "Mistranslation":
        return { colorClass: "text-green-500", tooltipText: "Mistranslation" };
      default:
        return { colorClass: "text-gray-500", tooltipText: sel.category };
    }
  };
  const renderText = (text, selections) => {
    if (!selections.length) return text;
  
    // 1. Map & sort
    const sorted = selections
      .map(sel => ({
        ...sel,
        start: text.indexOf(sel.text),
        ...getClassAndTooltip(sel)
      }))
      .filter(s => s.start !== -1)
      .sort((a, b) => a.start - b.start);
  
    // 2. Build your pieces
    const parts = [];
    let lastIndex = 0;
    sorted.forEach((s, i) => {
      if (s.start > lastIndex) {
        parts.push(<span key={`n-${i}`}>{text.slice(lastIndex, s.start)}</span>);
      }
      parts.push(
        <span
          key={`h-${i}`}
          className={`${s.colorClass} font-semibold tooltip tooltip-open tooltip-top`}
          data-tip={s.tooltipText}
        >
          {s.text}
        </span>
      );
      lastIndex = s.start + s.text.length;
    });
    if (lastIndex < text.length) {
      parts.push(<span key="last">{text.slice(lastIndex)}</span>);
    }
    return parts;
  };
  
  const renderTaggedText = (txt, sels) => {
    if (!sels.length) return txt;
    let out = "",
      idx = 0;
    const tagMap = {
      Addition: "a",
      Untranslation: "u",
      Mistranslation: "m",
      Omission: "o",
    };
    sels.forEach((s) => {
      const i = txt.indexOf(s.text, idx);
      if (i === -1) return;
      out +=
        txt.slice(idx, i) +
        `<${tagMap[s.category || "Omission"]}>${s.text}</${
          tagMap[s.category || "Omission"]
        }>`;
      idx = i + s.text.length;
    });
    out += txt.slice(idx);
    return <span className="font-mono whitespace-pre-wrap">{out}</span>;
  };

  return (
    <>
      <div className="w-full container rounded mx-auto flex dark:bg-[#0a0a0a]">
        <div className="flex-1 flex flex-col space-y-5">
          {/* Header */}
          <div className="border-b border-gray-200 h-16 flex items-center justify-between px-3">
            <div className="flex items-center space-x-2">
              <p>
                Text ID: <span>{currentIndex + 1}</span>
              </p>
              <progress
                className="progress progress-info w-56"
                value={progress}
                max="100"
              />
            </div>
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div className="text-center text-3xl font-semibold p-2">
            Does the lower text adequately express the meaning of the upper
            text?
          </div>

          {/* Source & Target */}
          <div className="p-3">
            <div className="border border-gray-200 rounded-sm shadow-sm p-2 space-y-8">
              <p
                onMouseUp={() =>
                  handleSelection(setSourceSelections, sourceText)
                }
              >
                <span className="text-2xl font-semibold">Source Text:</span>{" "}
                <span>{renderText(sourceText, sourceSelections)}</span>
              </p>

              <select
                id="category"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="border rounded p-1"
              >
                <option value="Addition">Addition</option>
                <option value="Untranslation">Untranslation</option>
                <option value="Mistranslation">Mistranslation</option>
              </select>

              <p
                onMouseUp={() =>
                  handleSelection(
                    setTargetSelections,
                    targetText,
                    targetCategory
                  )
                }
              >
                <span className="text-2xl font-semibold">Target Text:</span>{" "}
                <span>{renderText(targetText, targetSelections)}</span>
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={clearSelections}
                className="btn btn-primary text-white"
              >
                Clear All
              </button>
            </div>
          </div>
          {/* Mistranslation Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="bg-white p-6 rounded shadow-lg max-w-xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-semibold mb-4">
                  Select Mistranslation text from Source Text
                </h2>
                <div
                  className="border p-4 rounded select-text"
                  onMouseUp={handleSourceSelection}
                >
                  {renderText(sourceText, sourceSelections)}
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Meaning Slider */}
          <div className="p-6 container mx-auto">
            <div className="flex space-x-4 font-semibold mb-1 px-1">
              <span>strongly disagree</span>
              <div className="relative w-full">
                <input
                  ref={sliderRef}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={rating}
                  onChange={handleChange}
                  className="range range-primary w-full h-6"
                />
                <div className="absolute left-0 right-0 top-6 flex justify-between text-xs text-gray-300 px-1">
                  <span
                    className="tooltip tooltip-open tooltip-bottom"
                    data-tip="Nonsense/No meaning preserved"
                  />
                  <span
                    className="tooltip tooltip-open tooltip-bottom"
                    data-tip="Some meaning preserved"
                  />
                  <span
                    className="tooltip tooltip-open tooltip-bottom"
                    data-tip="Most meaning preserved"
                  />
                  <span
                    className="tooltip tooltip-open tooltip-bottom"
                    data-tip="Perfect meaning"
                  />
                </div>
              </div>
              <span>strongly agree</span>
            </div>
            <p className="text-sm mt-4">Selected value: {rating}</p>
          </div>

          {/* Comments & Submit */}
          <textarea
            onChange={(e) => {
              setComment(e.target.value);
            }}
            className="border border-gray-200 focus:ouline-1 focus:outline-gray-500 shadow rounded p-2 mx-3 mb-3"
            placeholder="Please write any comment about the highlighted errors or annotation"
          />
          {/* MQM Guidelines */}
          <div className="border-t border-b mx-3">
            <button
              onClick={() => toggleSection("mqm")}
              className="w-full flex items-center justify-between py-3"
            >
              <span className="text-lg font-medium flex items-center">
                MQM Guidelines{" "}
                <ChevronDown
                  className={`${openSection === "mqm" ? "rotate-180" : ""}`}
                  size={20}
                />
              </span>
            </button>
            {openSection === "mqm" && (
              <div className="px-4 pb-4 space-y-3">
                <p className="font-semibold text-center">Source text</p>
                <p>
                  <strong>Omission:</strong> The highlighted span in the
                  translation corresponds to information that{" "}
                  <strong>does not exist </strong>in the translated text.
                </p>
                <p>
                  <strong>Mistranslation:</strong> The highlighted span in the
                  source<strong> does not have the exact same meaning</strong>{" "}
                  as the highlighted span in the translation segmen
                </p>
                <p className="font-semibold text-center">Target text</p>
                <p>
                  <strong>Addition:</strong> The highlighted span corresponds to
                  information that<strong> does not exist</strong> in the other
                  segment.
                </p>
                <p>
                  <strong>Mistranslation:</strong> The highlighted span in the
                  source<strong> does not have the exact same meaning</strong>{" "}
                  as the highlighted span in the translation segmen
                </p>
                <p>
                  <strong>Untranslated:</strong> The highlighted span in the
                  translation is a <strong>copy</strong> of the highlighted span
                  in the source segment.
                </p>
              </div>
            )}
          </div>

          {/* DA Guidelines */}
          <div className="border-t border-b m-3">
            <button
              onClick={() => toggleSection("da")}
              className="w-full flex items-center justify-between py-3"
            >
              <span className="text-lg font-medium flex items-center">
                DA Guidelines{" "}
                <ChevronDown
                  className={`${openSection === "da" ? "rotate-180" : ""}`}
                  size={20}
                />
              </span>
            </button>
            {openSection === "da" && (
              <div className="px-4 pb-4 space-y-3">
                <p>
                  <strong>Nonsense/No meaning preserved:</strong> Nearly all
                  information is lost between the translation and source.
                </p>
                <p>
                  <strong>Some meaning preserved:</strong> The translation
                  preserves some of the meaning of the source but misses
                  significant parts.
                </p>
                <p>
                  <strong>Most meaning preserved:</strong> The translation
                  preserves some of the meaning of the source but misses
                  significant parts.
                </p>
                <p>
                  <strong>Perfect meaning:</strong> The translation preserves
                  some of the meaning of the source but misses significant
                  parts.
                </p>
              </div>
            )}
          </div>

          <p className="mb-6 text-center">
            Texts left to be annotated: {items.length - currentIndex}
          </p>
        </div>
      </div>
    </>
  );
};

export default Annotation;
