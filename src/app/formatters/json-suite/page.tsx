"use client";

import { useState, useRef } from "react";
import { Copy, Trash2, Check, AlertCircle, FileCode2, Minimize, Sparkles, RefreshCcw, GitCompare, Columns, ArrowRight, Download, Code2, ArrowRightLeft, FileSpreadsheet } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { JSON_SUITE_FAQS } from "@/data/faqs";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";


interface ParseError {
  line: number | null;
  column: number | null;
  message: string;
}

interface JsonDifference {
  type: "value_mismatch" | "key_missing_right" | "key_missing_left" | "type_mismatch";
  path: string;
  leftVal: string;
  rightVal: string;
}

function extractRowsFromXML(xmlDoc: Document): Element[] {
  const root = xmlDoc.documentElement;
  if (!root) return [];
  const children = Array.from(root.children);
  if (children.length === 0) {
    return [root];
  }
  
  const tagCounts: Record<string, number> = {};
  children.forEach(child => {
    tagCounts[child.tagName] = (tagCounts[child.tagName] || 0) + 1;
  });
  
  let maxRepetitions = 0;
  let repeatingTag = "";
  for (const tag in tagCounts) {
    if (tagCounts[tag] > maxRepetitions) {
      maxRepetitions = tagCounts[tag];
      repeatingTag = tag;
    }
  }

  if (maxRepetitions > 1) {
    return children.filter(child => child.tagName === repeatingTag);
  }

  if (children.length === 1) {
    const singleChild = children[0];
    const grandkids = Array.from(singleChild.children);
    const grandkidCounts: Record<string, number> = {};
    grandkids.forEach(gk => {
      grandkidCounts[gk.tagName] = (grandkidCounts[gk.tagName] || 0) + 1;
    });
    
    let maxGkRepetitions = 0;
    let repeatingGkTag = "";
    for (const tag in grandkidCounts) {
      if (grandkidCounts[tag] > maxGkRepetitions) {
        maxGkRepetitions = grandkidCounts[tag];
        repeatingGkTag = tag;
      }
    }
    
    if (maxGkRepetitions > 1) {
      return grandkids.filter(gk => gk.tagName === repeatingGkTag);
    }
  }

  return [root];
}

function flattenXMLElement(
  element: Element,
  prefix = "",
  res: Record<string, string> = {}
): Record<string, string> {
  const attrs = element.attributes;
  if (attrs) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      const path = prefix ? `${prefix}.@${attr.name}` : `@${attr.name}`;
      res[path] = attr.value;
    }
  }

  const children = Array.from(element.children);
  if (children.length === 0) {
    const text = element.textContent?.trim() || "";
    if (text) {
      res[prefix] = text;
    }
  } else {
    const childTagCounts: Record<string, number> = {};
    children.forEach(child => {
      childTagCounts[child.tagName] = (childTagCounts[child.tagName] || 0) + 1;
    });

    const childTagIndexes: Record<string, number> = {};
    children.forEach(child => {
      const isRepeated = childTagCounts[child.tagName] > 1;
      let path = prefix ? `${prefix}.${child.tagName}` : child.tagName;
      if (isRepeated) {
        const index = childTagIndexes[child.tagName] || 0;
        path = `${path}.${index}`;
        childTagIndexes[child.tagName] = index + 1;
      }
      flattenXMLElement(child, path, res);
    });
  }
  return res;
}

function escapeCSVValue(val: string): string {
  if (/[",\r\n]/.test(val)) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function formatXMLNode(node: Node, depth = 0): string {
  const indent = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const txt = node.nodeValue?.trim() || "";
    return txt;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tagName = el.tagName;

    let attrs = "";
    if (el.attributes && el.attributes.length > 0) {
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attrs += ` ${attr.name}="${escapeXmlAttr(attr.value)}"`;
      }
    }

    const childNodes = Array.from(el.childNodes);
    const validChildren = childNodes.filter(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        return (child.nodeValue?.trim() || "").length > 0;
      }
      return child.nodeType === Node.ELEMENT_NODE;
    });

    if (validChildren.length === 0) {
      return `${indent}<${tagName}${attrs} />`;
    }

    const isSingleTextChild = validChildren.length === 1 && validChildren[0].nodeType === Node.TEXT_NODE;

    if (isSingleTextChild) {
      const textVal = validChildren[0].nodeValue?.trim() || "";
      return `${indent}<${tagName}${attrs}>${escapeXmlText(textVal)}</${tagName}>`;
    }

    let childrenStr = "";
    validChildren.forEach(child => {
      const formattedChild = formatXMLNode(child, depth + 1);
      if (formattedChild.trim()) {
        childrenStr += "\n" + formattedChild;
      }
    });

    return `${indent}<${tagName}${attrs}>${childrenStr}\n${indent}</${tagName}>`;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indent}<!--${node.nodeValue}-->`;
  }
  
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `${indent}<![CDATA[${node.nodeValue}]]>`;
  }

  return "";
}

function minifyXMLNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || "";
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tagName = el.tagName;

    let attrs = "";
    if (el.attributes && el.attributes.length > 0) {
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attrs += ` ${attr.name}="${escapeXmlAttr(attr.value)}"`;
      }
    }

    const childNodes = Array.from(el.childNodes);
    const validChildren = childNodes.filter(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        return (child.nodeValue?.trim() || "").length > 0;
      }
      return child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.CDATA_SECTION_NODE;
    });

    if (validChildren.length === 0) {
      return `<${tagName}${attrs} />`;
    }

    let childrenStr = "";
    validChildren.forEach(child => {
      childrenStr += minifyXMLNode(child);
    });

    return `<${tagName}${attrs}>${childrenStr}</${tagName}>`;
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `<![CDATA[${node.nodeValue}]]>`;
  }

  return "";
}

function escapeXmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeXmlText(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonToXml(val: any, tagName = "root", depth = 0): string {
  const indent = "  ".repeat(depth);
  
  // Clean tag name to be valid XML
  const cleanTagName = /^[a-zA-Z_]/.test(tagName) ? tagName : `_${tagName}`;

  if (val === null || val === undefined) {
    return `${indent}<${cleanTagName} />`;
  }

  if (typeof val !== "object") {
    // Primitive types (string, number, boolean)
    const escaped = escapeXmlText(String(val));
    return `${indent}<${cleanTagName}>${escaped}</${cleanTagName}>`;
  }

  if (Array.isArray(val)) {
    // If it's a top-level array, wrap it in a parent root and name elements item
    if (depth === 0) {
      let xml = `${indent}<${cleanTagName}>`;
      val.forEach(item => {
        xml += "\n" + jsonToXml(item, "item", depth + 1);
      });
      xml += `\n${indent}</${cleanTagName}>`;
      return xml;
    } else {
      // Inline arrays: each element gets its own tag with the parent's key name
      // e.g. "tags": ["core", "api"] -> <tags>core</tags><tags>api</tags>
      return val.map(item => jsonToXml(item, tagName, depth)).join("\n");
    }
  }

  // Objects
  let childrenStr = "";
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      const childVal = val[key];
      const childXml = jsonToXml(childVal, key, depth + 1);
      if (childXml.trim()) {
        childrenStr += "\n" + childXml;
      }
    }
  }

  if (!childrenStr) {
    return `${indent}<${cleanTagName} />`;
  }

  return `${indent}<${cleanTagName}>${childrenStr}\n${indent}</${cleanTagName}>`;
}

export default function JsonSuitePage() {
  const [activeTab, setActiveTab] = useState<"json" | "json-to-xml" | "xml" | "compare">("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<ParseError | null>(null);
  const [copied, setCopied] = useState(false);
  const [lintSuccess, setLintSuccess] = useState<boolean | null>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // JSON Compare States
  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);
  const [diffs, setDiffs] = useState<JsonDifference[]>([]);
  const [compared, setCompared] = useState(false);
  const [leftNodes, setLeftNodes] = useState(0);
  const [rightNodes, setRightNodes] = useState(0);

  // Refs for synchronized scrolling and auto-scroll to results
  const leftTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const rightTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  const handleLeftScroll = () => {
    if (isSyncingRef.current) return;
    if (leftTextAreaRef.current && rightTextAreaRef.current) {
      isSyncingRef.current = true;
      rightTextAreaRef.current.scrollTop = leftTextAreaRef.current.scrollTop;
      rightTextAreaRef.current.scrollLeft = leftTextAreaRef.current.scrollLeft;
      window.requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }
  };

  const handleRightScroll = () => {
    if (isSyncingRef.current) return;
    if (leftTextAreaRef.current && rightTextAreaRef.current) {
      isSyncingRef.current = true;
      leftTextAreaRef.current.scrollTop = rightTextAreaRef.current.scrollTop;
      leftTextAreaRef.current.scrollLeft = rightTextAreaRef.current.scrollLeft;
      window.requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setLintSuccess(null);

    setLeftInput("");
    setRightInput("");
    setLeftError(null);
    setRightError(null);
    setDiffs([]);
    setCompared(false);
    setLeftNodes(0);
    setRightNodes(0);
  };

  const sanitizeJsonString = (str: string) => {
    return str
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // double curly quotes
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'"); // single curly quotes
  };

  const updateCursorPosition = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const val = target.value;
    const selectionStart = target.selectionStart;
    
    const textBeforeCursor = val.substring(0, selectionStart);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    setCursorPos({ line, col });
  };

  // 1. Formatter Logic
  const handleFormat = () => {
    setError(null);
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const sanitized = sanitizeJsonString(input);
      const parsed = JSON.parse(sanitized);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (e: any) {
      const err = parseJSONError(e, input);
      setError(err);
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError(null);
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const sanitized = sanitizeJsonString(input);
      const parsed = JSON.parse(sanitized);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e: any) {
      const err = parseJSONError(e, input);
      setError(err);
      setOutput("");
    }
  };

  const handleValidate = () => {
    setError(null);
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const sanitized = sanitizeJsonString(input);
      JSON.parse(sanitized);
      setLintSuccess(true);
    } catch (e: any) {
      const err = parseJSONError(e, input);
      setError(err);
      setLintSuccess(false);
    }
  };

  const handleJSONToXML = () => {
    setError(null);
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const sanitized = sanitizeJsonString(input);
      const parsed = JSON.parse(sanitized);
      const xml = jsonToXml(parsed);
      setOutput(xml);
    } catch (e: any) {
      const err = parseJSONError(e, input);
      setError(err);
      setOutput("");
    }
  };

  // 2. XML to JSON Logic
  const handleXMLToJSON = () => {
    // Clear all previous states instantly on click
    setError(null);
    setOutput("");
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      
      const parseErrors = xmlDoc.getElementsByTagName("parsererror");
      if (parseErrors.length > 0) {
        throw new Error(parseErrors[0].textContent || "XML syntax parse breakdown");
      }

      const parseNode = (node: Node): any => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue?.trim();
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const obj: any = {};

          if (element.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              obj["@attributes"][attr.name] = attr.value;
            }
          }

          let hasChildren = false;
          const childNodes = Array.from(element.childNodes);

          for (const child of childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
              hasChildren = true;
              const name = child.nodeName;
              const val = parseNode(child);

              if (obj[name] === undefined) {
                obj[name] = val;
              } else {
                if (!Array.isArray(obj[name])) {
                  obj[name] = [obj[name]];
                }
                obj[name].push(val);
              }
            } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
              const val = child.nodeValue.trim();
              if (element.attributes.length === 0 && childNodes.filter(c => c.nodeType === Node.ELEMENT_NODE).length === 0) {
                return val;
              } else {
                obj["#text"] = val;
              }
            }
          }
          return obj;
        }
        return null;
      };

      const resultObj = parseNode(xmlDoc.documentElement);
      const rootName = xmlDoc.documentElement.nodeName;
      const finalJson = { [rootName]: resultObj };
      setOutput(JSON.stringify(finalJson, null, 2));
    } catch (e: any) {
      setError({
        line: null,
        column: null,
        message: e.message || "Failed to convert XML to JSON"
      });
      setOutput("");
    }
  };

  const handleXMLToCSV = () => {
    // Clear all previous states instantly on click
    setError(null);
    setOutput("");
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      
      const parseErrors = xmlDoc.getElementsByTagName("parsererror");
      if (parseErrors.length > 0) {
        throw new Error(parseErrors[0].textContent || "XML syntax parse failure");
      }

      // Extract rows from DOM
      const rowElements = extractRowsFromXML(xmlDoc);
      const flattenedRows: Record<string, string>[] = [];
      const headerSet = new Set<string>();

      rowElements.forEach((el) => {
        const flattened = flattenXMLElement(el);
        flattenedRows.push(flattened);
        Object.keys(flattened).forEach((k) => headerSet.add(k));
      });

      if (headerSet.size === 0) {
        throw new Error("No data fields could be extracted from the XML elements.");
      }

      const headers = Array.from(headerSet);
      const csvRows = [headers.join(",")];

      flattenedRows.forEach((row) => {
        const rowValues = headers.map((header) => {
          const val = row[header] || "";
          return escapeCSVValue(val);
        });
        csvRows.push(rowValues.join(","));
      });

      setOutput(csvRows.join("\n"));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to convert XML to Excel (CSV)";
      setError({
        line: null,
        column: null,
        message
      });
      setOutput("");
    }
  };

  const handleFormatXML = () => {
    setError(null);
    setOutput("");
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      
      const parseErrors = xmlDoc.getElementsByTagName("parsererror");
      if (parseErrors.length > 0) {
        throw new Error(parseErrors[0].textContent || "XML syntax parse failure");
      }

      const formatted = formatXMLNode(xmlDoc.documentElement);
      setOutput(formatted.trim());
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to format XML";
      setError({
        line: null,
        column: null,
        message
      });
      setOutput("");
    }
  };

  const handleMinifyXML = () => {
    setError(null);
    setOutput("");
    setLintSuccess(null);
    if (!input.trim()) return;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      
      const parseErrors = xmlDoc.getElementsByTagName("parsererror");
      if (parseErrors.length > 0) {
        throw new Error(parseErrors[0].textContent || "XML syntax parse failure");
      }

      const minified = minifyXMLNode(xmlDoc.documentElement);
      setOutput(minified);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to minify XML";
      setError({
        line: null,
        column: null,
        message
      });
      setOutput("");
    }
  };

  const handleDownloadFile = () => {
    if (!output) return;
    const trimmed = output.trim();
    const isJson = trimmed.startsWith("{") || trimmed.startsWith("[");
    const isXml = trimmed.startsWith("<");
    let mimeType = "text/plain";
    let extension = "txt";

    if (isJson) {
      mimeType = "application/json";
      extension = "json";
    } else if (isXml) {
      mimeType = "application/xml";
      extension = "xml";
    } else if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      mimeType = "text/csv";
      extension = "csv";
    }
    const filename = `converted_${Date.now()}.${extension}`;

    const blob = new Blob([output], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. JSON Compare & Diff Logic
  const sortJSON = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      // If elements are objects, check if they have a clear matching key like 'id' or 'name'
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        const matchKey = ['id', 'uuid', 'key', 'name'].find(k => k in obj[0]);
        if (matchKey) {
          // Sort the array elements by their primary identifier value
          return obj
            .map(sortJSON)
            .sort((a, b) => String(a[matchKey]).localeCompare(String(b[matchKey])));
        }
      }
      return obj.map(sortJSON);
    }
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: any = {};
    for (const key of sortedKeys) {
      sortedObj[key] = sortJSON(obj[key]);
    }
    return sortedObj;
  };

  const countNodes = (obj: any): number => {
    if (obj === null || typeof obj !== "object") {
      return 1;
    }
    let count = 1; // Object or array node
    if (Array.isArray(obj)) {
      for (const item of obj) {
        count += countNodes(item);
      }
    } else {
      for (const key in obj) {
        count += countNodes(obj[key]);
      }
    }
    return count;
  };

  const diffObjects = (left: any, right: any, path = "root", diffsAccumulator: JsonDifference[] = []): JsonDifference[] => {
    if (left === right) return diffsAccumulator;

    const leftType = left === null ? "null" : Array.isArray(left) ? "array" : typeof left;
    const rightType = right === null ? "null" : Array.isArray(right) ? "array" : typeof right;

    if (leftType !== rightType) {
      diffsAccumulator.push({
        type: "type_mismatch",
        path,
        leftVal: `${leftType} (${JSON.stringify(left)})`,
        rightVal: `${rightType} (${JSON.stringify(right)})`
      });
      return diffsAccumulator;
    }

    if (leftType === "array") {
      const maxLen = Math.max(left.length, right.length);
      for (let i = 0; i < maxLen; i++) {
        const currentPath = `${path}[${i}]`;
        if (i >= left.length) {
          diffsAccumulator.push({
            type: "key_missing_left",
            path: currentPath,
            leftVal: "undefined",
            rightVal: JSON.stringify(right[i])
          });
        } else if (i >= right.length) {
          diffsAccumulator.push({
            type: "key_missing_right",
            path: currentPath,
            leftVal: JSON.stringify(left[i]),
            rightVal: "undefined"
          });
        } else {
          diffObjects(left[i], right[i], currentPath, diffsAccumulator);
        }
      }
      return diffsAccumulator;
    }

    if (leftType === "object") {
      const leftKeys = Object.keys(left);
      const rightKeys = Object.keys(right);
      const allKeys = Array.from(new Set([...leftKeys, ...rightKeys]));

      for (const key of allKeys) {
        const currentPath = `${path}.${key}`;
        const hasLeft = leftKeys.includes(key);
        const hasRight = rightKeys.includes(key);

        if (hasLeft && !hasRight) {
          diffsAccumulator.push({
            type: "key_missing_right",
            path: currentPath,
            leftVal: JSON.stringify(left[key]),
            rightVal: "undefined"
          });
        } else if (!hasLeft && hasRight) {
          diffsAccumulator.push({
            type: "key_missing_left",
            path: currentPath,
            leftVal: "undefined",
            rightVal: JSON.stringify(right[key])
          });
        } else {
          diffObjects(left[key], right[key], currentPath, diffsAccumulator);
        }
      }
      return diffsAccumulator;
    }

    diffsAccumulator.push({
      type: "value_mismatch",
      path,
      leftVal: JSON.stringify(left),
      rightVal: JSON.stringify(right)
    });
    return diffsAccumulator;
  };

  const handleCompare = (shouldSort: boolean) => {
    setLeftError(null);
    setRightError(null);
    setDiffs([]);
    setCompared(false);

    let parsedLeft: any;
    let parsedRight: any;
    let hasErr = false;

    if (!leftInput.trim()) {
      setLeftError("Left JSON input is empty.");
      hasErr = true;
    } else {
      try {
        const sanitized = sanitizeJsonString(leftInput);
        parsedLeft = JSON.parse(sanitized);
      } catch (e: any) {
        setLeftError("Invalid JSON syntax: " + e.message);
        hasErr = true;
      }
    }

    if (!rightInput.trim()) {
      setRightError("Right JSON input is empty.");
      hasErr = true;
    } else {
      try {
        const sanitized = sanitizeJsonString(rightInput);
        parsedRight = JSON.parse(sanitized);
      } catch (e: any) {
        setRightError("Invalid JSON syntax: " + e.message);
        hasErr = true;
      }
    }

    if (hasErr) return;

    // Node Counting
    const leftCount = countNodes(parsedLeft);
    const rightCount = countNodes(parsedRight);
    setLeftNodes(leftCount);
    setRightNodes(rightCount);

    // Dynamic recursive sorting if chosen
    const finalLeft = shouldSort ? sortJSON(parsedLeft) : parsedLeft;
    const finalRight = shouldSort ? sortJSON(parsedRight) : parsedRight;

    // Auto-formatting the inputs in the editors
    const formattedLeft = JSON.stringify(finalLeft, null, 2);
    const formattedRight = JSON.stringify(finalRight, null, 2);
    setLeftInput(formattedLeft);
    setRightInput(formattedRight);

    // Diff loop
    const results = diffObjects(finalLeft, finalRight);
    setDiffs(results);
    setCompared(true);

    // Smooth scroll down to diagnostics results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseJSONError = (err: Error, raw: string): ParseError => {
    const msg = err.message;
    const match = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+char\s+(\d+)/i);
    
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = raw.slice(0, pos).split("\n");
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      return {
        line,
        column,
        message: msg.replace(/at position \d+/i, "").trim()
      };
    }
    return {
      line: null,
      column: null,
      message: msg
    };
  };

  const highlightJSON = (jsonStr: string) => {
    if (!jsonStr) return "";
    const escaped = jsonStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-500 dark:text-amber-400";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-sky-400 dark:text-sky-350 font-medium";
          } else {
            cls = "text-emerald-500 dark:text-emerald-400";
          }
        } else if (/true|false/.test(match)) {
          cls = "text-indigo-400 dark:text-indigo-350 font-semibold";
        } else if (/null/.test(match)) {
          cls = "text-pink-500 dark:text-pink-400 font-semibold";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  const getErrorPreview = () => {
    if (!error || error.line === null) return null;
    const lines = input.split("\n");
    const errLine = error.line - 1;
    const start = Math.max(0, errLine - 2);
    const end = Math.min(lines.length, errLine + 3);
    
    return lines.slice(start, end).map((content, idx) => {
      const lineNum = start + idx + 1;
      const isError = lineNum === error.line;
      return {
        lineNum,
        content,
        isError
      };
    });
  };

  const highlightXML = (xmlStr: string) => {
    if (!xmlStr) return "";
    let formatted = xmlStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight comments
    formatted = formatted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-zinc-500">$1</span>');

    // Highlight tags and attributes
    formatted = formatted.replace(/(&lt;\/?)([\w:-]+)(.*?)(\/?&gt;)/g, (match, open, tagName, rest, close) => {
      let highlightedRest = rest;
      if (rest) {
        highlightedRest = rest.replace(/([\w:-]+)=("[^"]*"|'[^']*')/g, (m: string, attrName: string, attrVal: string) => {
          return `<span class="text-pink-400 dark:text-pink-400">${attrName}</span>=<span class="text-emerald-400 dark:text-emerald-400">${attrVal}</span>`;
        });
      }
      return `${open}<span class="text-sky-400 dark:text-sky-400">${tagName}</span>${highlightedRest}${close}`;
    });

    return formatted;
  };

  return (
    <>
      <SoftwareApplicationSchema 
        name="JSON & XML Formatter, Validator, Diff Suite"
        description="A complete developer workstation to format, validate, parse XML, and diff-compare JSON structures."
        url="https://apextoolhub.com/formatters/json-suite"
        applicationCategory="DeveloperApplication"
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Data Format Workstation
          </h1>
          <p className="text-sm text-muted">
            A consolidated, 100% client-side toolset to pretty-print, validate, and transform data payloads. This json formatter online, json validator checker, and json difference checker operates securely in your browser.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="JSON & XML Formatter, Validator, Diff Suite | ApexToolHub" 
            text="Beautify, validate, parse, and diff JSON or XML online free. 100% Client-side." 
          />
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b border-border gap-4 overflow-x-auto scrollbar-none select-none">
        <button
          onClick={() => {
            setActiveTab("json");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "json" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="json-tab"
        >
          JSON Formatter
        </button>
        <button
          onClick={() => {
            setActiveTab("json-to-xml");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "json-to-xml" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="json-to-xml-tab"
        >
          JSON to XML
        </button>
        <button
          onClick={() => {
            setActiveTab("xml");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "xml" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="xml-tab"
        >
          XML to JSON
        </button>
        <button
          onClick={() => {
            setActiveTab("compare");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "compare" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="compare-tab"
        >
          JSON Diff Engine
        </button>
      </div>

      {/* Workspace Display */}
      {activeTab !== "compare" ? (
        /* Formatter and XML Converter Grid (Side-by-Side 2 Pane) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
          {/* Left Pane - Input */}
          <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <FileCode2 className="h-4 w-4 text-zinc-500" />
                {activeTab === "json" || activeTab === "json-to-xml" ? "Raw JSON Input" : "Raw XML Input"}
              </span>
              <button
                onClick={handleClear}
                className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px] flex items-center"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Input
              </button>
            </div>
            <div className="flex-1 relative flex flex-col">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  updateCursorPosition(e);
                }}
                onClick={updateCursorPosition}
                onKeyUp={updateCursorPosition}
                placeholder={
                  activeTab === "json" || activeTab === "json-to-xml"
                    ? 'Paste raw JSON here...\ne.g. {"name":"ApexToolHub","features":["format","validate"]}'
                    : "Paste XML elements here...\ne.g. <project><name>ApexToolHub</name><version>1.0</version></project>"
                }
                className="w-full flex-1 min-h-[350px] md:min-h-[450px] p-4 pb-8 bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none text-sm placeholder-zinc-500 dark:placeholder-zinc-650"
                spellCheck="false"
                translate="no"
                data-testid="raw-input-textarea"
              />
              <div className="absolute bottom-0 right-0 text-xs font-mono text-zinc-500 dark:text-zinc-400 select-none text-right pr-2 py-1 pointer-events-none">
                Ln {cursorPos.line}, Col {cursorPos.col}
              </div>
            </div>
            
            {/* Syntax Error Warning Badge */}
            {activeTab === "xml" && error && (
              <div className="border-t border-border bg-background/50 px-4 py-3 select-none">
                <div className="flex items-start gap-2.5 p-3 rounded border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/35 text-amber-800 dark:text-amber-300 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold">Invalid XML Syntax:</span>{" "}
                    <span className="font-mono opacity-90">{error.message}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Buttons */}
            <div className="border-t border-border bg-background/50 px-4 py-3 flex flex-wrap items-center gap-3">
              {activeTab === "json" && (
                <>
                  <button
                    onClick={handleFormat}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5 text-foreground"
                    data-testid="format-json-btn"
                  >
                    <Sparkles className="h-4 w-4" />
                    Format JSON
                  </button>
                  <button
                    onClick={handleMinify}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                    data-testid="minify-json-btn"
                  >
                    <Minimize className="h-4 w-4" />
                    Minify JSON
                  </button>
                  <button
                    onClick={handleValidate}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                    data-testid="validate-json-btn"
                  >
                    Validate Lint
                  </button>
                </>
              )}
              {activeTab === "json-to-xml" && (
                <button
                  onClick={handleJSONToXML}
                  className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5 text-foreground"
                  data-testid="convert-to-xml-btn"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Convert to XML
                </button>
              )}
              {activeTab === "xml" && (
                <>
                  <button
                    onClick={handleFormatXML}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <Code2 className="h-4 w-4" />
                    Format &amp; Validate XML
                  </button>
                  <button
                    onClick={handleMinifyXML}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <Minimize className="h-4 w-4" />
                    Minify XML
                  </button>
                  <button
                    onClick={handleXMLToJSON}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Convert to JSON
                  </button>
                  <button
                    onClick={handleXMLToCSV}
                    className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Convert to Excel (CSV)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Pane - Output */}
          <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {output ? (
                  output.trim().startsWith("<") 
                    ? "XML Output" 
                    : (!output.trim().startsWith("{") && !output.trim().startsWith("[")) 
                      ? "Excel (CSV) Output" 
                      : "JSON Output"
                ) : "JSON Output"}
              </span>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px] flex items-center"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                  {output && (
                    <button
                      onClick={handleDownloadFile}
                      className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px] flex items-center"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download File
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 p-4 overflow-auto min-h-[350px] md:min-h-[450px] [color-scheme:light] dark:[color-scheme:dark]">
              {activeTab !== "xml" && error ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 p-3.5 rounded border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/35 text-red-800 dark:text-red-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold tracking-tight">Parser Failure</p>
                      <p className="mt-1 opacity-90">{error.message}</p>
                      {error.line !== null && (
                        <p className="mt-1 text-xs opacity-75 font-mono">
                          Error detected at Line {error.line}, Column {error.column}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Error Lines Context */}
                  {getErrorPreview() && (
                    <div className="rounded border border-zinc-800 bg-black/60 p-3 overflow-x-auto">
                      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Error Context:
                      </p>
                      <div className="font-mono text-xs space-y-1" translate="no">
                        {getErrorPreview()?.map((line) => (
                          <div
                            key={line.lineNum}
                            className={`flex gap-3 px-2 py-0.5 rounded ${
                              line.isError ? "bg-red-500/10 text-red-200 border-l-2 border-red-500" : "text-zinc-400"
                            }`}
                          >
                            <span className="w-6 text-right select-none text-zinc-600">{line.lineNum}</span>
                            <span className="whitespace-pre">{line.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : lintSuccess === true ? (
                <div className="flex items-start gap-2.5 p-4 rounded border border-emerald-500/20 bg-emerald-950/20 text-emerald-400">
                  <Check className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold tracking-tight">Valid JSON Syntax</p>
                    <p className="mt-1 opacity-90">The payload parsed successfully. Zero syntax lint errors detected.</p>
                  </div>
                </div>
              ) : output ? (
                output.trim().startsWith("<") ? (
                  <pre
                    className="font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre text-zinc-300"
                    translate="no"
                    dangerouslySetInnerHTML={{ __html: highlightXML(output) }}
                  />
                ) : (!output.trim().startsWith("{") && !output.trim().startsWith("[")) ? (
                  <pre
                    className="font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre text-zinc-900 dark:text-zinc-100 select-text select-all"
                    translate="no"
                  >
                    {output}
                  </pre>
                ) : (
                  <pre
                    className="font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre text-zinc-300"
                    translate="no"
                    dangerouslySetInnerHTML={{ __html: highlightJSON(output) }}
                  />
                )
              ) : (
                <div className="h-full flex items-center justify-center text-center text-zinc-500 dark:text-zinc-600 p-8">
                  <p className="text-sm">
                    Outputs or conversion results will render here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* JSON Compare & Diff Layout */
        <div className="space-y-6">
          {/* Comparison Textareas (Desktop: Side-By-Side, Mobile: Stacked) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Box - Original */}
            <div className="flex flex-col">
              <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 select-none">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Columns className="h-4 w-4 text-zinc-550" />
                    Original JSON <span className="hidden lg:inline">(Left)</span><span className="lg:hidden">(Top)</span>
                  </span>
                </div>
                <div className="flex-1 min-h-[220px]">
                  <textarea
                    ref={leftTextAreaRef}
                    value={leftInput}
                    onChange={(e) => setLeftInput(e.target.value)}
                    onScroll={handleLeftScroll}
                    placeholder='Paste original JSON here...\ne.g. {"name": "Alice", "role": "admin"}'
                    className="w-full h-full min-h-[220px] p-4 bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-y text-sm placeholder-zinc-500 dark:placeholder-zinc-650"
                    spellCheck="false"
                    translate="no"
                    data-testid="compare-left-textarea"
                  />
                </div>
              </div>
              {leftError && (
                <div className="mt-2 p-3 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/35 rounded-md flex items-start gap-1.5 animate-in fade-in duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{leftError}</span>
                </div>
              )}
            </div>

            {/* Right Box - Modified */}
            <div className="flex flex-col">
              <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 select-none">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Columns className="h-4 w-4 text-zinc-555" />
                    Modified JSON <span className="hidden lg:inline">(Right)</span><span className="lg:hidden">(Bottom)</span>
                  </span>
                </div>
                <div className="flex-1 min-h-[220px]">
                  <textarea
                    ref={rightTextAreaRef}
                    value={rightInput}
                    onChange={(e) => setRightInput(e.target.value)}
                    onScroll={handleRightScroll}
                    placeholder='Paste modified JSON here...\ne.g. {"name": "Bob", "role": "user"}'
                    className="w-full h-full min-h-[220px] p-4 bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-y text-sm placeholder-zinc-500 dark:placeholder-zinc-655"
                    spellCheck="false"
                    translate="no"
                    data-testid="compare-right-textarea"
                  />
                </div>
              </div>
              {rightError && (
                <div className="mt-2 p-3 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/35 rounded-md flex items-start gap-1.5 animate-in fade-in duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{rightError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 select-none">
            <button
              onClick={() => handleCompare(false)}
              className="px-5 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5 text-foreground"
              data-testid="compare-json-btn"
            >
              <GitCompare className="h-4 w-4" />
              Compare JSON
            </button>
            <button
              onClick={() => handleCompare(true)}
              className="px-5 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5"
              title="Sorts JSON keys recursively before running comparisons to isolate semantic changes"
            >
              Sort &amp; Compare
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[38px] text-red-500 border-red-500/10"
              data-testid="compare-clear-btn"
            >
              Clear All
            </button>
          </div>

          {/* Diagnostic Outputs */}
          {compared && (
            <div ref={resultsRef} className="space-y-6">
              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node count telemetry */}
                <div className="border border-border bg-card rounded-lg p-4 space-y-2.5 shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">Node count telemetry</span>
                  <div className="flex justify-between items-center text-sm font-mono" translate="no">
                    <div>
                      <p className="text-xs text-muted">Left JSON Nodes</p>
                      <p className="text-lg font-bold text-foreground mt-0.5 tabular-nums">{leftNodes}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600" />
                    <div className="text-right">
                      <p className="text-xs text-muted">Right JSON Nodes</p>
                      <p className="text-lg font-bold text-foreground mt-0.5 tabular-nums">{rightNodes}</p>
                    </div>
                  </div>
                  <div className="border-t border-border/60 pt-2 text-xs">
                    {leftNodes === rightNodes ? (
                      <p className="text-muted">Node counts match. Structurally aligned.</p>
                    ) : (
                      <p className="text-amber-500 font-medium">
                        Node count divergence: {leftNodes > rightNodes ? "Left" : "Right"} has{" "}
                        <span className="font-bold tabular-nums" translate="no">
                          {Math.abs(leftNodes - rightNodes)}
                        </span>{" "}
                        more element node(s) than the counterpart.
                      </p>
                    )}
                  </div>
                </div>

                {/* Final verdict status card */}
                <div className="border border-border bg-card rounded-lg p-4 flex flex-col justify-between shadow-sm">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">Diagnostic Verdict</span>
                  <div className="py-1">
                    {diffs.length === 0 ? (
                      <div className="text-emerald-500 flex items-center gap-2">
                        <Check className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">JSON Payloads are Identical</span>
                      </div>
                    ) : (
                      <div className="text-amber-500 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">
                          Divergence Detected ({diffs.length} mismatch{diffs.length > 1 ? "es" : ""})
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {diffs.length === 0
                      ? "Zero differences found in keys, values, or structural layout types."
                      : "Review the path variance diagnostics report below to pinpoint keys."}
                  </p>
                </div>
              </div>

              {/* Detailed Path Diagnostics Table */}
              <div className="border border-border bg-card rounded-lg overflow-hidden shadow-sm">
                <div className="border-b border-border bg-background px-4 py-2.5 select-none">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Path Variance Diagnostic Report
                  </span>
                </div>
                <div className="overflow-x-auto">
                  {diffs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted select-none">
                      No difference items to report. Both inputs match perfectly.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs divide-y divide-border" translate="no">
                      <thead className="bg-background text-muted select-none">
                        <tr>
                          <th className="px-4 py-2 font-semibold">JSON Pathway</th>
                          <th className="px-4 py-2 font-semibold">Variance Type</th>
                          <th className="px-4 py-2 font-semibold">Left Value (Original)</th>
                          <th className="px-4 py-2 font-semibold">Right Value (Modified)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-mono text-zinc-300">
                        {diffs.map((d, idx) => {
                          let typeBadge = "";
                          let typeCls = "";
                          
                          switch (d.type) {
                            case "value_mismatch":
                              typeBadge = "Value Mismatch";
                              typeCls = "bg-amber-500/10 text-amber-400 border border-amber-500/10";
                              break;
                            case "type_mismatch":
                              typeBadge = "Type Mismatch";
                              typeCls = "bg-red-500/10 text-red-400 border border-red-500/10 font-bold";
                              break;
                            case "key_missing_right":
                              typeBadge = "Missing in Right";
                              typeCls = "bg-rose-500/10 text-rose-400 border border-rose-500/10";
                              break;
                            case "key_missing_left":
                              typeBadge = "Missing in Left";
                              typeCls = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10";
                              break;
                          }

                          return (
                            <tr key={idx} className="hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-3 font-semibold break-all text-sky-400 select-all">{d.path}</td>
                              <td className="px-4 py-3 select-none">
                                <span className={`px-2 py-0.5 rounded text-[10px] whitespace-nowrap inline-block ${typeCls}`}>
                                  {typeBadge}
                                </span>
                              </td>
                              <td className="px-4 py-3 break-all select-all text-zinc-400">{d.leftVal}</td>
                              <td className="px-4 py-3 break-all select-all text-zinc-400">{d.rightVal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informational SEO Content Section */}
      <section className="border-t border-border/60 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">How to Use the JSON &amp; XML Suite</h2>
          <p>
            To format and validate your files, simply paste your raw, unformatted JSON text or XML markup code into the editor input area. The real-time parser automatically analyzes the syntax nodes client-side to verify structural compliance and outputs a pretty-printed version with custom indents.
          </p>
          <p>
            If you are comparing two datasets, switch to the <strong>JSON Diff Engine</strong> tab. Paste the original version in the left editor pane and your modified version in the right editor pane. The checker compares the key-value structures recursively and generates a color-coded diagnostic table highlighting deleted, modified, or added elements.
          </p>
          <p>
            For XML inputs, the converter maps tags, attributes, and inner texts into structured JSON arrays in milliseconds. You can download the compiled results or copy the clipboard strings directly with a single click.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Privacy-First Data Parsing</h2>
          <p>
            Traditional online beautifiers upload your proprietary configurations and API responses to remote cloud hosts, presenting security vulnerabilities. ApexToolHub operates 100% locally in your web browser sandbox using modern JavaScript execution.
          </p>
          <p>
            Because no data packets traverse the web interface, your credentials, bearer tokens, or client details remain fully secure and protected against interception, making this workstation suitable for enterprise software engineering teams.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={JSON_SUITE_FAQS} idPrefix="json-suite-faq" />
      </div>
    </div>
    </>
  );
}
