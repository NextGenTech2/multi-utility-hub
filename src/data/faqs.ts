import { FAQItem } from "@/components/FAQAccordion";

export const CSV_TO_JSON_FAQS: FAQItem[] = [
  {
    question: "How do I convert a CSV file to JSON online?",
    answer: "To convert a CSV to JSON online using our free tool, simply paste your raw CSV data into the input textarea or drag and drop an Excel (.xlsx) or CSV file. The converter will automatically process your tabular data and generate a structured JSON array of objects in real-time. You can then copy or download the generated JSON file instantly."
  },
  {
    question: "Can I convert an Excel (.xlsx) file to JSON?",
    answer: "Yes, our advanced csv to json converter online fully supports Excel workbook formats (.xlsx). You can drag and drop your Excel file directly into the tool. It reads the spreadsheet entirely client-side, parses sheets, and translates rows and cells into a clean JSON array structure without uploading your files to any external server."
  },
  {
    question: "How does CSV to JSON column mapping work?",
    answer: "The converter utilizes the first row of your CSV data as the keys (headers) for the generated JSON objects. Each subsequent row is parsed into an individual JSON object where column values are mapped to their respective header keys. Empty rows are skipped, and data types (like numbers and booleans) are automatically inferred where possible."
  },
  {
    question: "Does the converter support CSV files with headers?",
    answer: "Yes. By default, the tool expects the first row to be headers containing column names. If your CSV doesn't have header rows, you can toggle the parsing settings to generate placeholder keys (e.g., 'column1', 'column2') so that your tabular dataset translates accurately into JSON format."
  },
  {
    question: "What is the maximum file size I can convert?",
    answer: "Since our tools process data 100% locally in your browser (client-side), there is no file upload size limit imposed by web hosting servers. It can handle large datasets exceeding 50,000+ rows efficiently. The conversion speed depends solely on your computer's processing power and memory capacity."
  }
];

export const PERCENTAGE_FAQS: FAQItem[] = [
  {
    question: "How do I calculate a percentage of a number?",
    answer: "To find the percent of a number manually, multiply the number by the percentage fraction (percentage divided by 100). For example, to calculate 20% of 150: (20 / 105) * 150 = 30. Alternatively, paste your numbers into our percentage calculator online to get the exact value instantly."
  },
  {
    question: "How do I calculate percentage increase or decrease?",
    answer: "To calculate percentage change: subtract the old value from the new value, divide the result by the absolute value of the old value, and then multiply by 100. <br /><br />Formula: <strong>((New Value - Old Value) / Old Value) * 100</strong>. <br /><br />If the result is positive, it represents an increase; if negative, it is a percentage decrease."
  },
  {
    question: "What is X% of Y — how do I work this out?",
    answer: "Finding what is X percent of Y translates to the algebraic expression: <strong>Value = (X / 100) * Y</strong>. For instance, to calculate 15% of $80, compute (15 / 100) * 80 = 12. Our percentage calculator handles this formula as well as reverse percentage calculations automatically."
  },
  {
    question: "How do I find what percentage one number is of another?",
    answer: "To find what percentage number X is of number Y, divide X by Y and multiply the quotient by 100. <br /><br />Formula: <strong>Percentage = (X / Y) * 100</strong>. <br /><br />For example, if you scored 45 out of 60 on a test, your percentage is (45 / 60) * 100 = 75%."
  },
  {
    question: "What is the formula for percentage calculations?",
    answer: "The core percentage formula is: <strong>Part / Whole = Percentage / 100</strong>. By rearranging this basic ratio, you can solve for any of the three variables: <br /><br />1. Find percentage: <strong>(Part / Whole) * 100</strong><br />2. Find part: <strong>(Percentage / 100) * Whole</strong><br />3. Find whole: <strong>Part / (Percentage / 100)</strong>"
  }
];

export const SWAGGER_FAQS: FAQItem[] = [
  {
    question: "What is the difference between Swagger UI and Swagger Editor?",
    answer: "Swagger UI is a rendering tool that translates static OpenAPI (Swagger) specifications into interactive API documentation. Swagger Editor is a dynamic designer that validates, edits, and lets you visualize OpenAPI JSON or YAML specs in real-time as you write them."
  },
  {
    question: "How do I use Swagger Editor online?",
    answer: "Paste your raw YAML or JSON OpenAPI spec directly into our Swagger viewer panel. The system will compile it client-side and display the interactive API endpoint docs instantly, complete with 'Try it out' features."
  },
  {
    question: "Is Swagger Editor free to use?",
    answer: "Yes, our online Swagger Editor & Previewer is 100% free. It operates completely inside your local browser without any subscription, registration, or file upload limits."
  },
  {
    question: "What is a good alternative to Swagger Editor?",
    answer: "Common API documentation alternatives include Redocly, Postman, Stoplight, and Apiary. However, our browser-native editor provides a fast, zero-install, privacy-secure sandbox environment."
  },
  {
    question: "Is this Swagger Editor local or cloud-based?",
    answer: "It is completely local. The YAML parsing, syntax validation, and visual rendering happen locally in your browser sandbox, keeping your internal endpoint specifications fully secure."
  }
];

export const JWT_FAQS: FAQItem[] = [
  {
    question: "What are the three main components of a JWT?",
    answer: "A JSON Web Token (JWT) comprises three parts separated by dots (.):<br />1. <strong>Header</strong>: Defines the token type and signing algorithm (e.g., HS256).<br />2. <strong>Payload</strong>: Stores the claims or user data.<br />3. <strong>Signature</strong>: Verifies that the sender is authentic and the token wasn't modified."
  },
  {
    question: "How is a JWT transmitted in an HTTP request?",
    answer: "A JWT is typically included in the HTTP headers using the authorization Bearer scheme:<br /><code>Authorization: Bearer &lt;token&gt;</code>."
  },
  {
    question: "Which algorithm is used to sign a JWT?",
    answer: "JWTs commonly use symmetric signing algorithms like <strong>HS256</strong> (HMAC using SHA-256 with a single shared secret) or asymmetric ones like <strong>RS256</strong> (RSA private/public key pairs)."
  },
  {
    question: "What is the difference between JWT and OAuth?",
    answer: "JWT is a standardized, self-contained token format for encoding claims. OAuth is an authorization framework that uses tokens (which could be formatted as JWTs) to delegate API permissions."
  },
  {
    question: "Can I decode a JWT without the secret key?",
    answer: "Yes. The Header and Payload are Base64URL-encoded, not encrypted. You can decode and read their contents using our tool without the secret key. However, verifying that the token is valid requires the signature key."
  },
  {
    question: "How do I generate a secure JWT secret key?",
    answer: "You can generate cryptographically strong symmetric keys instantly using the Key Generator module. A secure key should consist of random hex or base64 characters."
  },
  {
    question: "What length should a JWT secret key be?",
    answer: "For HMAC-SHA256 (HS256), the key must be at least 256 bits (32 bytes) long. Using shorter keys makes the token vulnerable to brute-force offline signature guessing attacks."
  }
];

export const JSON_SUITE_FAQS: FAQItem[] = [
  {
    question: "How do I format and beautify JSON online?",
    answer: "Paste your raw or minified JSON string into our suite, choose your spacing format, and the beautifier will format it with proper indentation, line breaks, and coloring in real-time."
  },
  {
    question: "What is the difference between {} (object) and [] (array) in JSON?",
    answer: "Curly braces <code>{}</code> define a JSON Object (an unordered collection of key-value pairs). Square brackets <code>[]</code> define a JSON Array (an ordered list of values)."
  },
  {
    question: "Can I edit JSON directly in the formatter?",
    answer: "Yes. Our JSON suite acts as a fully editable code workspace, letting you fix linting errors, change values, and structural paths on the fly."
  },
  {
    question: "Does the JSON formatter work with large files?",
    answer: "Yes. Because the parser runs locally in your browser using optimized JavaScript execution, it can process large data payloads exceeding 10MB without page crashes or server timeouts."
  },
  {
    question: "How do I check if JSON is valid online?",
    answer: "Paste the text. The validator automatically scans the syntax, checking for correct brackets, colons, quotes, and commas, highlighting syntax errors with descriptive line-number alerts."
  },
  {
    question: "What makes a JSON structure valid?",
    answer: "Keys and string values must be wrapped in double quotes. Trailing commas, single quotes, and unescaped control characters are invalid and will cause validation errors."
  },
  {
    question: "Does the JSON Difference Checker highlight structural changes?",
    answer: "Use our built-in JSON Diff tab. Paste the original JSON in the first editor and the modified JSON in the second. The comparison engine highlights structural variations, modifications, and removed nodes."
  },
  {
    question: "Can I compare JSON objects with different key orders?",
    answer: "Yes. Our diff checker provides an option to normalize and auto-sort object keys before execution, ensuring that differences in key ordering do not trigger false diff reports."
  },
  {
    question: "How do I convert XML to JSON online?",
    answer: "Paste your XML markup in the converter tab. The client-side parser recursively traverses elements, attributes, and text nodes to construct a clean structured JSON document in milliseconds."
  }
];

export const DOC_CONVERTER_FAQS: FAQItem[] = [
  {
    question: "How to convert Word to PDF without losing formatting?",
    answer: "Our browser-native DOCX to PDF converter scans the text styles and fonts of your document, rendering them into a vector PDF layer. This maintains clean text alignments without style distortion."
  },
  {
    question: "Why can't I convert my Word file to PDF?",
    answer: "Ensure your file is in the modern Microsoft Word <code>.docx</code> format. Legacy <code>.doc</code> files cannot be parsed by client-side web engines."
  },
  {
    question: "How to convert Word to PDF quickly online for free?",
    answer: "Drag and drop your document into the conversion canvas, click Convert, and your PDF downloads instantly. The engine runs entirely locally, meaning no files are uploaded to any server."
  },
  {
    question: "What is the difference between a JPG and a PDF?",
    answer: "JPG is a compressed raster image format based on pixels. PDF is a document format that preserves vector data, fonts, text searchability, and formatting across multiple pages."
  },
  {
    question: "How to convert PDF to Word step by step?",
    answer: "Switch to the 'PDF to Word' tab, upload your PDF document, and our script will extract the structural text content, packaging it into a downloadable Word <code>.docx</code> file."
  },
  {
    question: "Does the PDF to Word converter work on scanned PDFs?",
    answer: "Yes, the tool applies a client-side OCR layer to extract readable text characters from scanned image-only PDFs, rendering them into editable paragraphs."
  },
  {
    question: "What is the maximum file size for the PDF to Word converter?",
    answer: "We support files up to 25MB. Since processing happens client-side, execution speed depends on your local computer's processor and memory."
  }
];

export const YOUTUBE_FAQS: FAQItem[] = [
  {
    question: "How do I convert a YouTube video to MP3 for free?",
    answer: "Paste a YouTube URL in our extractor. The client-side tool resolves stream details, extracts metadata, fetches video ID anchors, and lists direct download assets and thumbnails."
  },
  {
    question: "Is downloading YouTube videos legal?",
    answer: "Downloading videos directly violates YouTube's Terms of Service. You should only extract assets and download thumbnails/audio for content that you own or have obtained legal authorization for."
  },
  {
    question: "What audio quality will the downloaded MP3 be?",
    answer: "The extractor retrieves direct CDN assets. The audio streams are served at their original encoding quality, typically up to 256kbps or 320kbps depending on the upload source."
  },
  {
    question: "Can I download a YouTube playlist as MP3?",
    answer: "Our client extractor processes individual video URLs. You can paste URLs sequentially to extract their metadata and thumbnails."
  }
];

export const CASE_CONVERTER_FAQS: FAQItem[] = [
  {
    question: "How do I convert text to uppercase or lowercase online?",
    answer: "Paste your text into the input field, click the UPPERCASE or lowercase button, and the changer will process and copy the adjusted text in one click."
  },
  {
    question: "What is the difference between title case and sentence case?",
    answer: "Title Case capitalizes the first letter of every significant word. Sentence case capitalizes only the first letter of the first word in each sentence."
  },
  {
    question: "Can I convert text to camelCase or snake_case?",
    answer: "Yes. Our case converter tool is designed with developers in mind. You can convert any phrase into camelCase, snake_case, PascalCase, kebab-case, or constant_case."
  },
  {
    question: "Does the case converter work for non-English text?",
    answer: "Yes. Our Javascript text engine handles international Unicode characters, ensuring capitalization rules work for accented and non-English scripts."
  }
];

export const TEXT_DIFF_FAQS: FAQItem[] = [
  {
    question: "Can I use this as a diff checker tool to compare text?",
    answer: "Yes, you can. Paste the original text in the first pane and the modified text in the second. The engine compares them character-by-character, highlighting additions in green and deletions in red."
  },
  {
    question: "Is the text difference checker free to use?",
    answer: "Yes, our comparison tool is 100% free. Because it executes entirely in your browser, your private data is never sent to any server."
  },
  {
    question: "Can I compare large documents or code snippets?",
    answer: "Yes. Our diff algorithm is highly optimized. It can process long paragraphs, source code files, and config sheets with sub-millisecond diff analysis."
  },
  {
    question: "Does the tool highlight added, removed, and changed lines separately?",
    answer: "Yes. It highlights added lines, deleted lines, and pinpoints exact character changes within modified lines for quick diff tracking."
  }
];

export const REGEX_FAQS: FAQItem[] = [
  {
    question: "How do I test a regex pattern online?",
    answer: "Input your regular expression pattern, specify flags (e.g., global, case-insensitive), and type in test strings. The validator highlights matching substrings in real-time."
  },
  {
    question: "How to validate an email address with regex?",
    answer: "You can load our preset Email validation regex template. It conforms to RFC standards to verify domains, subdomains, and characters."
  },
  {
    question: "What does a regex validator actually do?",
    answer: "It compiles your regex string and runs it against your input sample, returning information on match counts, groups, index offsets, and capture details."
  },
  {
    question: "Which regex flavors does the tester support?",
    answer: "It utilizes the JS V8 engine regular expression parser natively. This supports assertions, capture groups, lookaheads, lookbehinds, and basic Unicode flags."
  }
];

export const UNIX_EPOCH_FAQS: FAQItem[] = [
  {
    question: "How do I convert an epoch timestamp to a readable date?",
    answer: "Input the epoch number (seconds or milliseconds). The tool will output the local timezone conversion, UTC representation, and relative calendar time."
  },
  {
    question: "What is epoch/Unix time?",
    answer: "Unix time is the total number of seconds elapsed since the Unix Epoch (January 1, 1970, UTC), excluding leap seconds. It is the default coordinate system for timestamping database logs."
  },
  {
    question: "How to convert UTC to epoch timestamp?",
    answer: "Enter your target date and time. Our epoch converter UTC tool will calculate the exact integer timestamp in seconds."
  },
  {
    question: "Why does epoch time start at January 1, 1970?",
    answer: "In early OS development, Unix systems selected this date coordinate as the zero point (epoch reference) to simplify arithmetic representation of date calendars."
  }
];

export const JSON_TO_CSV_FAQS: FAQItem[] = [
  {
    question: "How do I convert JSON to CSV online?",
    answer: "Paste your JSON array into the input. The client-side parser flattens keys and generates a clean tabular layout that you can copy or download as a <code>.csv</code> file."
  },
  {
    question: "Can I convert nested JSON objects to CSV?",
    answer: "Yes. The converter recursively flattens deep nested objects, concatenating parent and child keys using dot delimiters (e.g., <code>user.address.zip</code>)."
  },
  {
    question: "How does the JSON to CSV converter handle arrays?",
    answer: "Nested arrays are automatically stringified as inline JSON strings or expanded into rows, depending on your parsing settings."
  }
];

export const UNIT_CONVERTER_FAQS: FAQItem[] = [
  {
    question: "What units can I convert using this tool?",
    answer: "You can convert between length (meters, feet, miles), mass/weight (kilograms, pounds, ounces), temperature (Celsius, Fahrenheit), and data storage size (Megabytes, Gigabytes, Terabytes)."
  },
  {
    question: "Is this unit converter online tool free?",
    answer: "Yes, it is 100% free and performs all calculations instantly client-side without any advertising delays or registration requirements."
  }
];

export const HASH_GENERATOR_FAQS: FAQItem[] = [
  {
    question: "What hash types can I generate online?",
    answer: "You can generate standard cryptographic hashes, including MD5, SHA-1, SHA-256, SHA-512, and secure Bcrypt password hashes."
  },
  {
    question: "What makes Bcrypt generation different from other hashes?",
    answer: "Bcrypt is a salted key derivation function designed specifically to slow down brute-force password cracking. It runs in a background Web Worker in our tool to keep your browser UI responsive."
  },
  {
    question: "Are these hash generators secure to use online?",
    answer: "Yes. Hashing executes completely locally in your browser. The raw text strings and passwords never traverse the network, keeping your credentials secure."
  }
];
